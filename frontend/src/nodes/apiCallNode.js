import { useState } from 'react';
import { BaseNode } from './BaseNode';

export const APICallNode = ({ id, data, selected }) => {
  const [url, setUrl]       = useState(data?.url    || '');
  const [method, setMethod] = useState(data?.method || 'GET');

  return (
    <BaseNode
      id={id}
      label="APICall"
      selected={selected}
      inputHandles={[{ id: `${id}-body`,     label: 'body'     }]}
      outputHandles={[{ id: `${id}-response`, label: 'response' }]}
    >
      <div className="node-field">
        <label>Method</label>
        <select value={method} onChange={e => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="node-field">
        <label>URL</label>
        <input
          type="text"
          placeholder="https://api.example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
      </div>
    </BaseNode>
  );
};