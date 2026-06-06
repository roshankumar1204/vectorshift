export const ClearModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-96 rounded-xl border border-border bg-muted p-6 shadow-2xl">

        <h3 className="text-lg font-semibold text-foreground">
          Clear Pipeline
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          This will remove all nodes and edges from the canvas.
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-border hover:bg-accent transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:opacity-90 transition-all"
          >
            Clear
          </button>
        </div>

      </div>
    </div>
  );
};