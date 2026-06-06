import { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  Controls, Background, BackgroundVariant, MiniMap,
} from 'reactflow';
import { useStore }          from './store';
import { shallow }           from 'zustand/shallow';
import { InputNode }         from './nodes/inputNode';
import { LLMNode }           from './nodes/llmNode';
import { OutputNode }        from './nodes/outputNode';
import { TextNode }          from './nodes/textNode';
import { FilterNode }        from './nodes/filterNode';
import { TransformNode }     from './nodes/transformNode';
import { MergeNode }         from './nodes/mergeNode';
import { ConditionalNode }   from './nodes/conditionalNode';
import { APICallNode }       from './nodes/apiCallNode';
import { DeletableEdge }     from './edges/DeletableEdge';
import { useSubmit }         from './submit';
import { cn }                from './lib/utils';
import { EmptyState }        from './components/EmptyState';
import { SubmitPanel }       from './components/panels/SubmitPanel';
import { AnimationPanel }    from './components/panels/AnimationPanel';
import { StatusPanel }       from './components/panels/StatusPanel';
import { ClearModal }        from './components/modals/ClearModal';

import 'reactflow/dist/style.css';

const gridSize   = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  filter:       FilterNode,
  transform:    TransformNode,
  merge:        MergeNode,
  conditional:  ConditionalNode,
  apiCall:      APICallNode,
};

const edgeTypes = { deletable: DeletableEdge };

const NODE_COLORS = {
  customInput:  'hsl(199 89% 65%)',
  llm:          'hsl(258 89% 74%)',
  customOutput: 'hsl(158 64% 52%)',
  text:         'hsl(25 95% 65%)',
  filter:       'hsl(330 80% 68%)',
  transform:    'hsl(45 96% 56%)',
  merge:        'hsl(258 89% 74%)',
  conditional:  'hsl(330 80% 68%)',
  apiCall:      'hsl(199 89% 65%)',
};

const selector = (state) => ({
  nodes:            state.nodes,
  edges:            state.edges,
  getNodeID:        state.getNodeID,
  addNode:          state.addNode,
  onNodesChange:    state.onNodesChange,
  onEdgesChange:    state.onEdgesChange,
  onConnect:        state.onConnect,
  edgeAnimation:    state.edgeAnimation,
  setEdgeAnimation: state.setEdgeAnimation,
  clearPipeline:    state.clearPipeline,
  exportPipeline:   state.exportPipeline,
  importPipeline:   state.importPipeline,
});

export const PipelineUI = () => {
  const reactFlowWrapper  = useRef(null);
  const fileInputRef      = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [fullscreen,        setFullscreen]        = useState(false);
  const [showClearModal,    setShowClearModal]    = useState(false);
  const [showDemoDrawer,    setShowDemoDrawer]    = useState(false);

  const {
    nodes, edges,
    getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    edgeAnimation, setEdgeAnimation,
    clearPipeline, exportPipeline, importPipeline,
  } = useStore(selector, shallow);

  const isEmpty = nodes.length === 0;
  const { loading, handleSubmit } = useSubmit();

  const getInitNodeData = (nodeID, type) => ({ id: nodeID, nodeType: type });

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const { nodeType: type } = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );
      if (!type) return;
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: getInitNodeData(nodeID, type) });
    }
  }, [reactFlowInstance, getNodeID, addNode]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleExport = () => {
    const data = exportPipeline();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'pipeline.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        importPipeline(JSON.parse(e.target.result));
      } catch {
        alert('Invalid pipeline file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div
      ref={reactFlowWrapper}
      className={cn(
        'flex-1 overflow-hidden',
        fullscreen && 'fixed inset-0 z-40'
      )}
    >
      {/* hidden file input for import */}
      <input
        type="file"
        accept=".json"
        ref={fileInputRef}
        onChange={handleImport}
        style={{ display: 'none' }}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        deleteKeyCode='Delete'
        multiSelectionKeyCode='Shift'
      >
        {isEmpty && <EmptyState />}

        <Background
          variant={BackgroundVariant.Cross}
          color="#2a2a45"
          gap={24}
          size={2}
        />
        <Controls />
        <MiniMap
          nodeColor={(node) => NODE_COLORS[node.type] || '#4a4a6a'}
          nodeStrokeWidth={0}
          maskColor="rgba(10, 10, 20, 0.75)"
          style={{
            background:   'hsl(222 20% 9%)',
            border:       '1px solid hsl(222 15% 20%)',
            borderRadius: '10px',
          }}
        />

        <SubmitPanel
          loading={loading}
          handleSubmit={handleSubmit}
          onClearClick={() => setShowClearModal(true)}
        />

        <AnimationPanel
          edgeAnimation={edgeAnimation}
          setEdgeAnimation={setEdgeAnimation}
          fullscreen={fullscreen}
          setFullscreen={setFullscreen}
          showDemoDrawer={showDemoDrawer}
          setShowDemoDrawer={setShowDemoDrawer}
          handleExport={handleExport}
          fileInputRef={fileInputRef}
        />

        <StatusPanel />

      </ReactFlow>

      <ClearModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearPipeline}
      />

    </div>
  );
};