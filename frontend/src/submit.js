import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [modal, setModal] = useState(null);  // null = hidden, object = show
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      setModal(data);

    } catch (err) {
      setModal({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Submit bar ── */}
      <div className="submit-bar">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Analyzing...' : 'Submit Pipeline'}
        </button>
      </div>

      {/* ── Modal overlay ── */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            {modal.error ? (
              // ── Error state ──
              <>
                <div className="modal-header">
                  <span className="modal-icon" style={{ background: 'rgba(244,114,182,0.15)', color: '#f472b6' }}>✕</span>
                  <span className="modal-title">Connection Error</span>
                </div>
                <p className="modal-error-msg">{modal.message}</p>
                <p className="modal-error-msg" style={{ opacity: 0.5, fontSize: '11px' }}>
                  Make sure the backend is running on port 8000
                </p>
              </>
            ) : (
              // ── Success state ──
              <>
                <div className="modal-header">
                  <span className="modal-icon" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>✓</span>
                  <span className="modal-title">Pipeline Analysis</span>
                </div>

                {/* Stats grid */}
                <div className="modal-stats">
                  <div className="modal-stat">
                    <span className="modal-stat-value">{modal.num_nodes}</span>
                    <span className="modal-stat-label">Nodes</span>
                  </div>
                  <div className="modal-stat">
                    <span className="modal-stat-value">{modal.num_edges}</span>
                    <span className="modal-stat-label">Edges</span>
                  </div>
                  <div className="modal-stat">
                    <span
                      className="modal-stat-value"
                      style={{ color: modal.is_dag ? '#34d399' : '#f472b6' }}
                    >
                      {modal.is_dag ? 'Yes' : 'No'}
                    </span>
                    <span className="modal-stat-label">Is DAG</span>
                  </div>
                </div>

                {/* DAG explanation */}
                <div
                  className="modal-dag-info"
                  style={{
                    borderColor: modal.is_dag
                      ? 'rgba(52,211,153,0.2)'
                      : 'rgba(244,114,182,0.2)',
                    background: modal.is_dag
                      ? 'rgba(52,211,153,0.05)'
                      : 'rgba(244,114,182,0.05)',
                  }}
                >
                  <span style={{ color: modal.is_dag ? '#34d399' : '#f472b6', fontSize: '11px' }}>
                    {modal.is_dag
                      ? '✓ Pipeline is a valid DAG — no cycles detected. Safe to execute.'
                      : '✕ Pipeline contains a cycle — execution order cannot be determined.'}
                  </span>
                </div>
              </>
            )}

            <button className="modal-close" onClick={() => setModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};