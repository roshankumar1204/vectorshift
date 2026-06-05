import { Handle, Position } from 'reactflow';

const TYPE_CONFIG = {
  Input:       { color: '#5b9cf6', badge: 'source',    accentClass: 'node-accent-blue',   abbr: 'IN'  },
  Output:      { color: '#34d399', badge: 'sink',      accentClass: 'node-accent-green',  abbr: 'OUT' },
  LLM:         { color: '#a78bfa', badge: 'model',     accentClass: 'node-accent-purple', abbr: 'AI'  },
  Text:        { color: '#fb923c', badge: 'template',  accentClass: 'node-accent-orange', abbr: 'TXT' },
  Filter:      { color: '#f472b6', badge: 'logic',     accentClass: 'node-accent-pink',   abbr: 'FLT' },
  Transform:   { color: '#facc15', badge: 'transform', accentClass: 'node-accent-yellow', abbr: 'TRF' },
  Merge:       { color: '#a78bfa', badge: 'merge',     accentClass: 'node-accent-purple', abbr: 'MRG' },
  Conditional: { color: '#f472b6', badge: 'branch',    accentClass: 'node-accent-pink',   abbr: 'IF'  },
  APICall:     { color: '#5b9cf6', badge: 'http',      accentClass: 'node-accent-blue',   abbr: 'API' },
};

export const BaseNode = ({ id, label, inputHandles = [], outputHandles = [], children, selected }) => {
  const config = TYPE_CONFIG[label] || { color: '#888', badge: 'node', accentClass: '', abbr: '??' };

  return (
    <div className={`base-node ${selected ? 'selected' : ''}`}>

      {/* Header */}
      <div className={`node-header ${config.accentClass}`}>
        <div
          className="node-header-icon"
          style={{ background: config.color }}
        >
          {config.abbr}
        </div>
        <span className="node-header-title">{label}</span>
        <span
          className="node-header-badge"
          style={{
            background: `${config.color}22`,
            color: config.color,
          }}
        >
          {config.badge}
        </span>
      </div>

      {/* Body */}
      <div className="node-body">
        {children}
      </div>

      {/* Input handles — left side, NO wrapping div */}
      {inputHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{
            top: `${(index + 1) * (100 / (inputHandles.length + 1))}%`,
            background: config.color,
          }}
        />
      ))}

      {/* Output handles — right side, NO wrapping div */}
      {outputHandles.map((handle, index) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{
            top: `${(index + 1) * (100 / (outputHandles.length + 1))}%`,
            background: config.color,
          }}
        />
      ))}

    </div>
  );
};