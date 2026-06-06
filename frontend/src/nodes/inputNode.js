import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <BaseNode
      id={id}
      label="Input"
      outputHandles={[{ id: `${id}-value` }]}
    >
          <div className="node-field">

      <label>Name  </label>
        <input type="text" value={currName} onChange={e => setCurrName(e.target.value)} />
     
        </div>
            <div className="node-field">

      <label>Type  </label>
        <select value={inputType} onChange={e => setInputType(e.target.value)}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
     
      </div>
    </BaseNode>
  );
};