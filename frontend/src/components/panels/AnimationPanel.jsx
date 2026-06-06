import { Panel } from 'reactflow';
import { cn } from '../../lib/utils';
import {
  Maximize2, Minimize2,
  Zap, ZapOff, MousePointerClick, Play,
} from 'lucide-react';
import { DemoDrawer } from '../DemoDrawer';

const ANIM_OPTIONS = [
  { value: 'static',   icon: ZapOff,           title: 'Static edges'      },
  { value: 'animated', icon: Zap,               title: 'Animated edges'    },
  { value: 'onsubmit', icon: MousePointerClick, title: 'Animate on submit' },
];

export const AnimationPanel = ({
  edgeAnimation,
  setEdgeAnimation,
  fullscreen,
  setFullscreen,
  showDemoDrawer,
  setShowDemoDrawer,
  handleExport,
  fileInputRef,
}) => {
  return (
    <>
      <Panel position="top-right">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-muted border border-border mr-2 mt-2">

          {/* Animation toggles */}
          {ANIM_OPTIONS.map(({ value, icon: Icon, title }) => (
            <button
              key={value}
              onClick={() => setEdgeAnimation(value)}
              title={title}
              className={cn(
                'w-7 h-7 rounded-md flex items-center justify-center',
                'text-muted-foreground transition-all duration-150',
                edgeAnimation === value
                  ? 'bg-primary/20 text-primary'
                  : 'hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}

          <div className="w-px h-4 bg-border mx-1" />

          {/* Demo button */}
          <button
            onClick={() => setShowDemoDrawer(true)}
            title="Run Demo"
            className="
              w-7 h-7 rounded-md
              flex items-center justify-center
              text-muted-foreground
              hover:bg-accent hover:text-foreground
              transition-all duration-150
            "
          >
            <Play className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-border mx-1" />

          {/* Fullscreen toggle */}
          <button
            onClick={() => setFullscreen(f => !f)}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="
              w-7 h-7 rounded-md
              flex items-center justify-center
              text-muted-foreground
              hover:bg-accent hover:text-foreground
              transition-all duration-150
            "
          >
            {fullscreen
              ? <Minimize2 className="w-3.5 h-3.5" />
              : <Maximize2 className="w-3.5 h-3.5" />
            }
          </button>

        </div>
      </Panel>

      {/* Demo Drawer lives here — tied to this panel */}
      <DemoDrawer
        isOpen={showDemoDrawer}
        onClose={() => setShowDemoDrawer(false)}
      />

      {/* Export/Import — bottom-right, hidden when demo drawer open */}
      {!showDemoDrawer && (
        <Panel position="bottom-right">
          <div
            className="flex gap-2 mb-1"
            style={{ transform: 'translateX(-220px)' }}
          >
            <button
              onClick={handleExport}
              className="
                px-4 py-2 rounded-lg
                bg-muted border border-border
                text-sm hover:bg-accent transition-all
              "
            >
              Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="
                px-4 py-2 rounded-lg
                bg-muted border border-border
                text-sm hover:bg-accent transition-all
              "
            >
              Import
            </button>
          </div>
        </Panel>
      )}
    </>
  );
};