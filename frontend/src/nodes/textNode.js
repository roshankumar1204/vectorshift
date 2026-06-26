import { useState, useRef, useLayoutEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TextNode = ({ id, data, selected }) => {
  const updateNodeField = useStore(state => state.updateNodeField);

  const [currText, setCurrText] = useState(data?.text || '');
  const [variables, setVariables] = useState(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const found = [];
    let match;
    while ((match = regex.exec(data?.text || '')) !== null) {
      if (!found.includes(match[1])) found.push(match[1]);
    }
    return found;
  });
  const [nodeSize, setNodeSize] = useState({ width: 320, height: 120 });

  const textareaRef = useRef(null);
  const measureRef  = useRef(null);

  const extractVariables = (text) => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const found = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!found.includes(match[1])) found.push(match[1]);
    }
    return found;
  };

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    const measure  = measureRef.current;
    if (!textarea || !measure) return;

    const MIN_WIDTH = 220;
    const MAX_WIDTH = 640;

    textarea.style.height = 'auto';

    const longestLine = currText
      .split('\n')
      .reduce((a, b) => (b.length > a.length ? b : a), '');
    measure.textContent = longestLine || 'x';

    const newWidth = Math.max(MIN_WIDTH, Math.min(measure.offsetWidth + 80, MAX_WIDTH));

    if (newWidth >= MAX_WIDTH) {
      textarea.style.whiteSpace = 'pre-wrap';
      textarea.style.wordBreak  = 'break-word';
    } else {
      textarea.style.whiteSpace = 'pre';
      textarea.style.wordBreak  = 'normal';
    }

    const textHeight  = textarea.scrollHeight;
    textarea.style.height = `${textHeight}px`;

    const pillRows    = variables.length > 0 ? Math.ceil(variables.length / 4) : 0;
    const pillsHeight = pillRows * 28;

    setNodeSize({ width: newWidth, height: textHeight + pillsHeight + 90 });

  }, [currText, variables]);

  const handleTextChange = (e) => {
    const val = e.target.value;
    setCurrText(val);
    setVariables(extractVariables(val));
    updateNodeField(id, 'text', val); // ← syncs to store
  };

  return (
    <BaseNode
      id={id}
      label="Text"
      selected={selected}
      minWidth={nodeSize.width}
      outputHandles={[{ id: `${id}-output` }]}
    >
      <span
        ref={measureRef}
        style={{
          position:      'absolute',
          visibility:    'hidden',
          whiteSpace:    'pre',
          pointerEvents: 'none',
          fontSize:      '12px',
          fontFamily:    'inherit',
        }}
      />

      <div style={{ width: `${nodeSize.width}px` }}>
        <div className="node-field">
          <label>Text</label>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            rows={1}
            style={{
              width:      '100%',
              minHeight:  '40px',
              resize:     'none',
              overflow:   'hidden',
              boxSizing:  'border-box',
              fontSize:   '12px',
              lineHeight: '1.5',
              padding:    '6px 8px',
            }}
          />
        </div>

        {variables.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {variables.map(v => (
              <span
                key={v}
                style={{
                  fontSize:     '10px',
                  padding:      '2px 7px',
                  borderRadius: '20px',
                  background:   'rgba(251,146,60,0.15)',
                  color:        '#fb923c',
                }}
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </div>

      {variables.map((variable, index) => (
        <Handle
          key={variable}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{
            top:        `${((index + 1) * 100) / (variables.length + 1)}%`,
            background: '#fb923c',
          }}
        />
      ))}
    </BaseNode>
  );
};