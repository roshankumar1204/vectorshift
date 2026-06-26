import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { PipelineModal, RunInputModal, RunResultModal } from './submit';

function App() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {!fullscreen && <PipelineToolbar />}
      <PipelineUI fullscreen={fullscreen} setFullscreen={setFullscreen} />
      <PipelineModal />
      <RunInputModal />
      <RunResultModal />
    </div>
  );
}

export default App;