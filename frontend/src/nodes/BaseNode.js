import { Handle, Position } from 'reactflow';
import { cn } from '../lib/utils';
import { Badge } from '../components/ui/badge';

const TYPE_CONFIG = {
  Input:       { hsl: 'var(--node-input)',       badge: 'source',    abbr: 'IN'  },
  Output:      { hsl: 'var(--node-output)',      badge: 'sink',      abbr: 'OUT' },
  LLM:         { hsl: 'var(--node-llm)',         badge: 'model',     abbr: 'AI'  },
  Text:        { hsl: 'var(--node-text)',        badge: 'template',  abbr: 'TXT' },
  Filter:      { hsl: 'var(--node-filter)',      badge: 'logic',     abbr: 'FLT' },
  Transform:   { hsl: 'var(--node-transform)',   badge: 'transform', abbr: 'TRF' },
  Merge:       { hsl: 'var(--node-merge)',       badge: 'merge',     abbr: 'MRG' },
  Conditional: { hsl: 'var(--node-conditional)', badge: 'branch',    abbr: 'IF'  },
  APICall:     { hsl: 'var(--node-apicall)',     badge: 'http',      abbr: 'API' },
};

export const BaseNode = ({
  id, label,
  inputHandles = [], outputHandles = [],
  children, selected, minWidth,
  data,
}) => {
  const config    = TYPE_CONFIG[label] || { hsl: 'var(--muted-foreground)', badge: 'node', abbr: '??' };
  const executing = data?.executing || false;

  return (
    <div
      className={cn(
        'relative bg-muted border rounded-xl min-w-[200px] font-sans transition-all duration-150',
        selected   && 'border-primary shadow-[0_0_0_2px_hsl(var(--primary)/0.2)]',
        executing  && 'node-executing',
        !selected && !executing && 'border-border hover:border-border/80'
      )}
      style={minWidth ? { minWidth: `${minWidth}px` } : {}}
    >
      {/* executing pulse ring */}
      {executing && (
        <div
          className="node-executing-ring"
          style={{ borderColor: `hsl(${config.hsl})` }}
        />
      )}

      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-xl border-b border-border"
        style={{ background: `hsl(${config.hsl} / 0.08)` }}
      >
        <div
          className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 transition-all duration-150',
            executing && 'node-icon-pulse'
          )}
          style={{ background: `hsl(${config.hsl})` }}
        >
          {config.abbr}
        </div>
        <span className="text-xs font-medium text-foreground flex-1">{label}</span>
        <Badge
          style={{
            background: `hsl(${config.hsl} / 0.12)`,
            color:      `hsl(${config.hsl})`,
          }}
        >
          {config.badge}
        </Badge>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 flex flex-col gap-2">
        {children}
      </div>

      {/* Input handles */}
      {inputHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{
            top:        `${(index + 1) * (100 / (inputHandles.length + 1))}%`,
            background: `hsl(${config.hsl})`,
          }}
        />
      ))}

      {/* Output handles */}
      {outputHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{
            top:        `${(index + 1) * (100 / (outputHandles.length + 1))}%`,
            background: `hsl(${config.hsl})`,
          }}
        />
      ))}
    </div>
  );
};