import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const TransformNode = ({ id, data, selected }) => {
  const [mapFn, setMapFn] = useState(data?.mapFn || '');

  return (
    <BaseNode
      id={id}
      label="Transform"
      selected={selected}
      inputHandles={[{ id: `${id}-input`, label: 'input' }]}
      outputHandles={[{ id: `${id}-output`, label: 'output' }]}
    >
      <div className="node-field">
        <label>Map function</label>
        <input
          type="text"
          placeholder="e.g. x => x.trim()"
          value={mapFn}
          onChange={e => setMapFn(e.target.value)}
        />
      </div>
    </BaseNode>
  );
};