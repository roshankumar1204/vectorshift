import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      label="Merge"
      selected={selected}
      inputHandles={[
        { id: `${id}-a`, label: 'a' },
        { id: `${id}-b`, label: 'b' },
        { id: `${id}-c`, label: 'c' },
      ]}
      outputHandles={[{ id: `${id}-merged`, label: 'merged' }]}
    >
      <div className="node-field">
        <label>Strategy</label>
        <select defaultValue="concat">
          <option value="concat">Concatenate</option>
          <option value="json">JSON array</option>
          <option value="newline">Newline join</option>
        </select>
      </div>
    </BaseNode>
  );
};