import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import {
  CheckCircle2,
  XCircle,
  GitBranch,
  Boxes,
  ArrowRightLeft,
  AlertTriangle,
} from 'lucide-react';

const selector = (state) => ({
  nodes:      state.nodes,
  edges:      state.edges,
  flashEdges: state.flashEdges,
});

export const useSubmit = () => {
  const { nodes, edges, flashEdges } = useStore(selector, shallow);


  const modal = useStore(state => state.modal);
const setModal = useStore(state => state.setModal);

const loading = useStore(state => state.loading);
const setLoading = useStore(state => state.setLoading);

  const handleSubmit = async () => {
    setLoading(true);
    flashEdges(); // trigger onsubmit animation
    try {
      const res = await fetch('http://localhost:8000/pipelines/parse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      //console.log("Response:", data);

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

export const PipelineModal = () => {
  const { modal, setModal } = useSubmit();
  // console.log("Modal:", modal);
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
            {/* Error header */}
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
            {/* Success header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Pipeline Analysis</p>
                <p className="text-xs text-muted-foreground">Parsed successfully</p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <Boxes className="w-4 h-4 text-[hsl(var(--node-llm))]" />
                <span className="text-2xl font-semibold text-foreground">
                  {modal.num_nodes}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Nodes
                </span>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-[hsl(var(--node-input))]" />
                <span className="text-2xl font-semibold text-foreground">
                  {modal.num_edges}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Edges
                </span>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 flex flex-col items-center gap-2">
                <GitBranch className="w-4 h-4 text-[hsl(var(--node-output))]" />
                <span className={cn(
                  'text-2xl font-semibold',
                  modal.is_dag
                    ? 'text-[hsl(var(--node-output))]'
                    : 'text-[hsl(var(--node-filter))]'
                )}>
                  {modal.is_dag ? 'Yes' : 'No'}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Is DAG
                </span>
              </div>
            </div>

            {/* DAG detail */}
            <div className={cn(
              'rounded-lg border p-3 flex items-start gap-2',
              modal.is_dag
                ? 'border-[hsl(var(--node-output)/0.3)] bg-[hsl(var(--node-output)/0.05)]'
                : 'border-[hsl(var(--node-filter)/0.3)] bg-[hsl(var(--node-filter)/0.05)]'
            )}>
              {modal.is_dag
                ? <CheckCircle2 className="w-4 h-4 text-[hsl(var(--node-output))] mt-0.5 flex-shrink-0" />
                : <AlertTriangle className="w-4 h-4 text-[hsl(var(--node-filter))] mt-0.5 flex-shrink-0" />
              }
              <p className={cn(
                'text-xs leading-relaxed',
                modal.is_dag
                  ? 'text-[hsl(var(--node-output))]'
                  : 'text-[hsl(var(--node-filter))]'
              )}>
                {modal.is_dag
                  ? 'Valid DAG — no cycles detected. Pipeline is safe to execute in topological order.'
                  : 'Cycle detected — execution order cannot be determined. Remove the cycle to proceed.'}
              </p>
            </div>
          </>
        )}

        <Button variant="outline" className="w-full" onClick={() => setModal(null)}>
          Close
        </Button>
      </div>
    </div>
  );
};