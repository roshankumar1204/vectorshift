import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      label="LLM"
      selected={selected}
      inputHandles={[
        { id: `${id}-system`, label: 'system' },
        { id: `${id}-prompt`, label: 'prompt' },
      ]}
      outputHandles={[
        { id: `${id}-response`, label: 'response' }
      ]}
    >
      <div className="node-field">
        <label>Model</label>
        <select defaultValue="gpt-4o">
          <option value="gpt-4o">GPT-4o</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="claude-3">Claude 3</option>
        </select>
      </div>
    </BaseNode>
  );
};