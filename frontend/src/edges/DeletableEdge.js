import {
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
} from 'reactflow';

export const DeletableEdge = ({
  id,
  sourceX, sourceY,
  targetX, targetY,
  sourcePosition, targetPosition,
  style = {},
  selected,
}) => {
  const { setEdges } = useReactFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  const onDelete = (e) => {
    e.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const edgeColor = selected ? '#a78bfa' : '#6c63ff';

  return (
    <>
      {/* wide invisible stroke for easier hover */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />

      {/* actual visible edge with arrowhead */}
      <path
        d={edgePath}
        fill="none"
        stroke={edgeColor}
        strokeWidth={1.5}
        markerEnd={`url(#arrow-${id})`}
      />

      {/* inline SVG marker per edge so color matches */}
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke={edgeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      <EdgeLabelRenderer>
        <div
          style={{
            position:  'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          className="nodrag nopan"
        >
          <button
            onClick={onDelete}
            style={{
              width:          '18px',
              height:         '18px',
              borderRadius:   '50%',
              background:     'hsl(222 20% 16%)',
              border:         '1px solid hsl(222 15% 30%)',
              color:          'hsl(220 10% 55%)',
              fontSize:       '9px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              cursor:         'pointer',
              transition:     'all 0.15s',
              lineHeight:     1,
              padding:        0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'hsl(0 72% 51%)';
              e.currentTarget.style.borderColor = 'hsl(0 72% 51%)';
              e.currentTarget.style.color       = '#fff';
              e.currentTarget.style.transform   = 'scale(1.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = 'hsl(222 20% 16%)';
              e.currentTarget.style.borderColor = 'hsl(222 15% 30%)';
              e.currentTarget.style.color       = 'hsl(220 10% 55%)';
              e.currentTarget.style.transform   = 'scale(1)';
            }}
            title="Delete edge"
          >
            ✕
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};