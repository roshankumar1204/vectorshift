import { Panel } from 'reactflow';
import { cn } from '../../lib/utils';

export const SubmitPanel = ({ loading, handleSubmit, onClearClick }) => {
  return (
    <Panel position="bottom-center">
      <div className="flex items-center gap-3 mb-4">

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={cn(
            'flex items-center gap-2 px-8 py-2.5 rounded-full',
            'bg-primary text-white text-sm font-medium',
            'shadow-lg shadow-primary/20',
            'hover:opacity-90 active:scale-95',
            'transition-all duration-150',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {loading ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Analyzing...
            </>
          ) : (
            'Submit Pipeline'
          )}
        </button>

        <button
          onClick={onClearClick}
          className="
            px-6 py-2.5 rounded-full
            border border-border
            bg-muted text-foreground
            text-sm font-medium
            hover:bg-accent
            transition-all duration-150
          "
        >
          Clear
        </button>

      </div>
    </Panel>
  );
};