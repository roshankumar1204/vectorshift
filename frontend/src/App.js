import { PipelineToolbar } from './toolbar';
import { PipelineUI }      from './ui';
import { PipelineModal }   from './submit';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <PipelineToolbar />
      <PipelineUI />
      <PipelineModal />
    </div>
  );
}

export default App;