import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const ConditionalNode = ({ id, data, selected }) => {
  const [expr, setExpr] = useState(data?.expr || '');

  return (
    <BaseNode
      id={id}
      label="Conditional"
      selected={selected}
      inputHandles={[{ id: `${id}-input`, label: 'input' }]}
      outputHandles={[
        { id: `${id}-true`,  label: 'true'  },
        { id: `${id}-false`, label: 'false' },
      ]}
    >
      <div className="node-field">
        <label>Expression</label>
        <input
          type="text"
          placeholder="e.g. input === 'yes'"
          value={expr}
          onChange={e => setExpr(e.target.value)}
        />
      </div>
    </BaseNode>
  );
};