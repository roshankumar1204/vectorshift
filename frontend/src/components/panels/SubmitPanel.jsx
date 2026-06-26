import { Panel } from 'reactflow';
import { cn } from '../../lib/utils';
import { Play } from 'lucide-react';

export const SubmitPanel = ({ loading, handleSubmit, onClearClick, onRunClick, runLoading }) => {
  return (
    <Panel position="bottom-center">
      <div className="flex items-center gap-3 mb-4">

        {/* Run button */}
        <button
          onClick={onRunClick}
          disabled={runLoading}
          className={cn(
            'flex items-center gap-2 px-6 py-2.5 rounded-full',
            'bg-[hsl(var(--node-output))] text-white text-sm font-medium',
            'shadow-lg shadow-[hsl(var(--node-output)/0.2)]',
            'hover:opacity-90 active:scale-95',
            'transition-all duration-150',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {runLoading ? (
            <>
              <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run
            </>
          )}
        </button>

        {/* Submit button */}
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
            'Submit'
          )}
        </button>

        {/* Clear button */}
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