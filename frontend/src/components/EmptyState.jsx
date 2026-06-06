import { Panel } from 'reactflow';
import logo from '../assets/logo.png';

export const EmptyState = () => {
  return (
    <Panel position="center">
      <div
        className="
          mt-24
          flex flex-col items-center
          gap-4
          px-10 py-8
          rounded-2xl
          border border-border
          bg-muted/40
          backdrop-blur-sm
        "
      >
        <img
          src={logo}
          alt="VectorShift"
          className="h-12 w-auto opacity-80"
        />

        <h2 className="text-xl font-semibold">
          Start Building
        </h2>

        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Drag Input, LLM, Output and other nodes from the toolbar
          to create your AI workflow.
        </p>
      </div>
    </Panel>
  );
};