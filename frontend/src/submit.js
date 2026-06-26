import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import {
  CheckCircle2, XCircle, GitBranch,
  Boxes, ArrowRightLeft, AlertTriangle,
  Play, Loader2,
} from 'lucide-react';

// ── existing submit selector ──────────────────────
const submitSelector = (state) => ({
  nodes:      state.nodes,
  edges:      state.edges,
  flashEdges: state.flashEdges,
});

export const useSubmit = () => {
  const { nodes, edges, flashEdges } = useStore(submitSelector, shallow);
  const modal      = useStore(state => state.modal);
  const setModal   = useStore(state => state.setModal);
  const loading    = useStore(state => state.loading);
  const setLoading = useStore(state => state.setLoading);

  const handleSubmit = async () => {
    setLoading(true);
    flashEdges();
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pipelines/parse`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Server error');
      setModal(data);
    } catch (err) {
      setModal({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return { modal, setModal, loading, handleSubmit };
};

// ── new run hook ──────────────────────────────────
const runSelector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const useRun = () => {
  const { nodes, edges }        = useStore(runSelector, shallow);
  const executeAnimation        = useStore(state => state.executeAnimation);
  const runModal                = useStore(state => state.runModal);
  const setRunModal             = useStore(state => state.setRunModal);
  const runLoading              = useStore(state => state.runLoading);
  const setRunLoading           = useStore(state => state.setRunLoading);
  const showInputModal          = useStore(state => state.showInputModal);
  const setShowInputModal       = useStore(state => state.setShowInputModal);

  const inputNodes = nodes.filter(n => n.type === 'customInput');

  const handleRun = () => {
    if (inputNodes.length === 0) {
      executeRun({});
    } else {
      setShowInputModal(true);
    }
  };

  const executeRun = async (inputValues) => {
    setShowInputModal(false);
    setRunLoading(true);
    executeAnimation();

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/pipelines/run`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges, input_values: inputValues }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Execution failed');
      setRunModal({ success: true, outputs: data.outputs });
    } catch (err) {
      setRunModal({ success: false, error: err.message });
    } finally {
      setRunLoading(false);
    }
  };

  return {
    runModal, setRunModal,
    runLoading,
    showInputModal, setShowInputModal,
    inputNodes,
    handleRun,
    executeRun,
  };
};

// ── existing PipelineModal (unchanged) ───────────
export const PipelineModal = () => {
  const { modal, setModal } = useSubmit();
  if (!modal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setModal(null)}
    >
      <div
        className="bg-muted border border-border rounded-xl p-6 w-96 flex flex-col gap-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {modal.error ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Connection Failed</p>
                <p className="text-xs text-muted-foreground">Could not reach backend</p>
              </div>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-xs text-red-400">{modal.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Make sure backend is running on port 8000
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Pipeline Analysis</p>
                <p className="text-xs text-muted-foreground">Parsed successfully</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <Boxes className="w-4 h-4 text-[hsl(var(--node-llm))]" />
                <span className="text-2xl font-semibold text-foreground">{modal.num_nodes}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Nodes</span>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[hsl(var(--node-input))]" />
                <span className="text-2xl font-semibold text-foreground">{modal.num_edges}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Edges</span>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <GitBranch className="w-4 h-4 text-[hsl(var(--node-output))]" />
                <span className={cn('text-2xl font-semibold', modal.is_dag ? 'text-[hsl(var(--node-output))]' : 'text-[hsl(var(--node-filter))]')}>
                  {modal.is_dag ? 'Yes' : 'No'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Is DAG</span>
              </div>
            </div>
            <div className={cn('rounded-lg border p-3 flex items-start gap-2', modal.is_dag ? 'border-[hsl(var(--node-output)/0.3)] bg-[hsl(var(--node-output)/0.05)]' : 'border-[hsl(var(--node-filter)/0.3)] bg-[hsl(var(--node-filter)/0.05)]')}>
              {modal.is_dag
                ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--node-output))] mt-0.5 flex-shrink-0" />
                : <AlertTriangle className="w-4 h-4 text-[hsl(var(--node-filter))] mt-0.5 flex-shrink-0" />
              }
              <p className={cn('text-xs leading-relaxed', modal.is_dag ? 'text-[hsl(var(--node-output))]' : 'text-[hsl(var(--node-filter))]')}>
                {modal.is_dag
                  ? 'Valid DAG — no cycles detected. Pipeline is safe to execute in topological order.'
                  : 'Cycle detected — execution order cannot be determined. Remove the cycle to proceed.'}
              </p>
            </div>
          </>
        )}
        <Button variant="outline" className="w-full" onClick={() => setModal(null)}>Close</Button>
      </div>
    </div>
  );
};

// ── Input values modal ────────────────────────────
export const RunInputModal = () => {
  const { showInputModal, setShowInputModal, inputNodes, executeRun } = useRun();
  const [values, setValues] = useState({});

  if (!showInputModal) return null;

  const handleRun = () => executeRun(values);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setShowInputModal(false)}
    >
      <div
        className="bg-muted border border-border rounded-xl p-6 w-96 flex flex-col gap-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Play className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Run Pipeline</p>
            <p className="text-xs text-muted-foreground">
              {inputNodes.length} input{inputNodes.length !== 1 ? 's' : ''} required
            </p>
          </div>
        </div>

        {/* Input fields */}
        <div className="flex flex-col gap-3">
          {inputNodes.map(node => {
            // use inputName from data, fallback to cleaned id
            const label = node.data?.inputName
              || node.id.replace('customInput-', 'input_');

            return (
              <div key={node.id} className="node-field">
                <label>{label}</label>
                <input
                  type="text"
                  placeholder={`Enter value for ${label}...`}
                  value={values[node.id] || ''}
                  onChange={e => setValues(v => ({
                    ...v,
                    [node.id]: e.target.value
                  }))}
                  autoFocus={inputNodes.indexOf(node) === 0}
                />
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowInputModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 flex items-center gap-2"
            onClick={handleRun}
          >
            <Play className="w-3.5 h-3.5" />
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Run results modal ─────────────────────────────
export const RunResultModal = () => {
  const { runModal, setRunModal, runLoading } = useRun();

  if (runLoading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-muted border border-border rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Executing pipeline...</p>
      </div>
    </div>
  );

  if (!runModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* NO onClick on overlay — prevents accidental close */}
      <div className="bg-muted border border-border rounded-xl p-6 w-[480px] flex flex-col gap-5 shadow-2xl max-h-[80vh] overflow-y-auto">

        {!runModal.success ? (
          <>
            {/* Error header with X */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Execution Failed</p>
                  <p className="text-xs text-muted-foreground">Pipeline could not complete</p>
                </div>
              </div>
              {/* X close button */}
              <button
                onClick={() => setRunModal(null)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-xs text-red-400">{runModal.error}</p>
            </div>
          </>
        ) : (
          <>
            {/* Success header with X */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--node-output)/0.1)] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--node-output))]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Pipeline Executed</p>
                  <p className="text-xs text-muted-foreground">
                    {runModal.outputs?.length} output{runModal.outputs?.length !== 1 ? 's' : ''} returned
                  </p>
                </div>
              </div>
              {/* X close button */}
              <button
                onClick={() => setRunModal(null)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Output results */}
            <div className="flex flex-col gap-3">
              {runModal.outputs?.map((output, i) => (
                <div
                  key={i}
                  className="bg-background rounded-xl border border-border p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      {output.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--node-output)/0.1)] text-[hsl(var(--node-output))]">
                      {output.type}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {output.value || (
                      <span className="text-muted-foreground italic">empty</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <Button variant="outline" className="w-full" onClick={() => setRunModal(null)}>
          Close
        </Button>
      </div>
    </div>
  );
};