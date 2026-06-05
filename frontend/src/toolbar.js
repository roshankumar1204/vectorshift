import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div className="toolbar">
      <span className="toolbar-logo">VectorShift</span>
      <div className="toolbar-divider" />
      <div className="toolbar-nodes">
  <DraggableNode type='customInput'  label='Input' />
  <DraggableNode type='llm'          label='LLM' />
  <DraggableNode type='customOutput' label='Output' />
  <DraggableNode type='text'         label='Text' />
  <DraggableNode type='filter'       label='Filter' />
  <DraggableNode type='transform'    label='Transform' />
  <DraggableNode type='merge'        label='Merge' />
  <DraggableNode type='conditional'  label='Conditional' />
  <DraggableNode type='apiCall'      label='API Call' />
</div>
    </div>
  );
};