import { DraggableNode } from './draggableNode';
import logo from "./assets/logo.png";
import { useStore } from './store';


export const PipelineToolbar = () => {

  const pipelineName = useStore(state => state.pipelineName);
const setPipelineName = useStore(state => state.setPipelineName);

  

  

  return (
    <div className="flex items-center gap-2 px-5 h-14 bg-muted border-b border-border flex-shrink-0">

      {/* Logo Section */}
      <div className="flex items-center gap-3 mr-4">
        <img
          src={logo}
          alt="VectorShift"
          className="h-12 w-auto object-contain"
        />
         <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          VectorShift
        </span>
       
      </div>

      <div className="w-px h-5 bg-border mx-1" />

<div className="flex flex-col mr-4">
  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
    Pipeline
  </span>


  <input
    value={pipelineName}
    onChange={(e) => setPipelineName(e.target.value)}
    placeholder="Untitled Pipeline"
    className="
      bg-transparent
      text-sm
      text-foreground
      outline-none
      border-none
      p-0
      min-w-[180px]
    "
  />
</div>

<div className="flex items-center gap-2 mr-4">



  <span className="text-xs text-muted-foreground">
    AI Chat Flow
  </span>

</div>

<div className="w-px h-5 bg-border mx-1" />

      {/* Toolbar Buttons */}
      <div className="flex items-center flex-wrap gap-2">
        <DraggableNode type='customInput' label='Input' />
        <DraggableNode type='llm' label='LLM' />
        <DraggableNode type='customOutput' label='Output' />
        <DraggableNode type='text' label='Text' />
        <DraggableNode type='filter' label='Filter' />
        <DraggableNode type='transform' label='Transform' />
        <DraggableNode type='merge' label='Merge' />
        <DraggableNode type='conditional' label='Conditional' />
        <DraggableNode type='apiCall' label='API Call' />
      </div>

    </div>
  );
};