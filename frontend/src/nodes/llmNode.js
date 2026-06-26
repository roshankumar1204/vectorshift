import { useState } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

const PROVIDERS = {
  gemini: {
    label: 'Google Gemini',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.5-flash'],
  },
  openai: {
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'],
  },
  groq: {
    label: 'Groq',
    models: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'],
  },
};

export const LLMNode = ({ id, data, selected }) => {
  const updateNodeField = useStore(state => state.updateNodeField);

  const [provider, setProvider] = useState(data?.provider || 'gemini');
  const [model,    setModel]    = useState(data?.model    || 'gemini-1.5-flash');
  const [apiKey,   setApiKey]   = useState(data?.apiKey   || '');
  const [showKey,  setShowKey]  = useState(false);

  const handleProviderChange = (e) => {
    const p = e.target.value;
    setProvider(p);
    const firstModel = PROVIDERS[p].models[0];
    setModel(firstModel);
    updateNodeField(id, 'provider', p);
    updateNodeField(id, 'model', firstModel);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    updateNodeField(id, 'model', e.target.value);
  };

  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
    updateNodeField(id, 'apiKey', e.target.value);
  };

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
      {/* Provider */}
      <div className="node-field">
        <label>Provider</label>
        <select value={provider} onChange={handleProviderChange}>
          {Object.entries(PROVIDERS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </div>

      {/* Model */}
      <div className="node-field">
        <label>Model</label>
        <select value={model} onChange={handleModelChange}>
          {PROVIDERS[provider].models.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* API Key */}
      <div className="node-field">
        <label>API Key</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={handleApiKeyChange}
            placeholder="paste your api key..."
            style={{ paddingRight: '32px' }}
          />
          <button
            onClick={() => setShowKey(s => !s)}
            style={{
              position:   'absolute',
              right:      '6px',
              top:        '50%',
              transform:  'translateY(-50%)',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              fontSize:   '10px',
              color:      'hsl(var(--muted-foreground))',
              padding:    0,
            }}
          >
            {showKey ? 'hide' : 'show'}
          </button>
        </div>
      </div>
    </BaseNode>
  );
};