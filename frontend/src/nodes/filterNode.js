import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data, selected }) => {
  const [condition, setCondition] = useState(data?.condition || '');

  return (
    <BaseNode
      id={id}
      label="Filter"
      selected={selected}
      inputHandles={[{ id: `${id}-input`, label: 'input' }]}
      outputHandles={[
        { id: `${id}-pass`, label: 'pass' },
        { id: `${id}-fail`, label: 'fail' },
      ]}
    >
      <div className="node-field">
        <label>Condition</label>
        <input
          type="text"
          placeholder="e.g. value > 10"
          value={condition}
          onChange={e => setCondition(e.target.value)}
        />
      </div>
    </BaseNode>
  );
};