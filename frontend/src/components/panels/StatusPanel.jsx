import { Panel } from 'reactflow';
import { CheckCircle2 } from 'lucide-react';

export const StatusPanel = () => {
  return (
    <Panel position="bottom-left">
      <div className="
        flex items-center gap-2
        px-3 py-1.5 rounded-full
        bg-muted border border-border
        text-xs text-muted-foreground
        mb-1 ml-10
      ">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
        Saved
      </div>

        <div className="
          px-3 py-1.5 rounded-full
          bg-muted border border-border
          text-[10px] text-muted-foreground
          text-center ml-10
        ">
          ⚡ Backend on free tier — first response may take ~30s to wake up
        </div>
    </Panel>
  );
};