import { X, Play, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useStore } from "../store";

export const DemoDrawer = ({ isOpen, onClose }) => {
  const selectedTemplate       = useStore(state => state.selectedTemplate);
  const setSelectedTemplate    = useStore(state => state.setSelectedTemplate);
  const createTemplatePipeline = useStore(state => state.createTemplatePipeline);
  const executeAnimation       = useStore(state => state.executeAnimation);
  const nodes                  = useStore(state => state.nodes);

  const [prompt,          setPrompt]          = useState("");
  const [response,        setResponse]        = useState("");
  const [loading,         setLoading]         = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);

  if (!isOpen) return null;

  // ── template select — ask if canvas has nodes ──
  const handleTemplateSelect = () => {
    if (selectedTemplate === "ai-chat") {
      setSelectedTemplate(null);
      return;
    }
    if (nodes.length > 0) {
      setShowReplaceModal(true); // ask before replacing
    } else {
      setSelectedTemplate("ai-chat");
      createTemplatePipeline();
    }
  };

  const confirmReplace = () => {
    setSelectedTemplate("ai-chat");
    createTemplatePipeline();
    setShowReplaceModal(false);
  };

  const handleRun = async () => {
    if (!prompt.trim()) {
      setResponse("Please enter a prompt.");
      return;
    }
    setLoading(true);
    setResponse("");

    // trigger pipeline animation immediately
    executeAnimation();

    try {
      const res = await fetch("http://localhost:8000/demo/run", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch {
      setResponse("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="
        absolute right-0 top-0
        h-screen w-[440px]
        bg-muted border-l border-border
        shadow-2xl flex flex-col
        overflow-hidden
      ">

        {/* Header */}
        <div className="
          flex items-center justify-between
          px-6 py-4
          border-b border-border
          bg-background/40
        ">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Run Demo</h2>
              <p className="text-xs text-muted-foreground">Test pipeline with AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-accent transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Template section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Template
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <button
              onClick={handleTemplateSelect}
              className={`
                w-full rounded-xl border p-4 text-left
                transition-all duration-150 group
                ${selectedTemplate === "ai-chat"
                  ? "border-primary bg-primary/8"
                  : "border-border bg-background hover:border-primary/40 hover:bg-accent/50"}
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0
                    ${selectedTemplate === "ai-chat" ? "bg-primary/15" : "bg-accent"}
                  `}>
                    ⚡
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">AI Chat Flow</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Input → LLM → Output
                    </p>
                  </div>
                </div>
                {selectedTemplate === "ai-chat" ? (
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-border flex-shrink-0 mt-0.5" />
                )}
              </div>
            </button>
          </div>

          {/* Prompt section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Prompt
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask something..."
              className="
                w-full h-28 resize-none rounded-xl
                border border-border bg-background
                p-3 text-sm text-foreground
                placeholder:text-muted-foreground
                outline-none focus:border-primary
                transition-colors
              "
            />
          </div>

          {/* Warning if no template */}
          {!selectedTemplate && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <span className="text-amber-400 text-xs">
                Select a template to enable demo execution.
              </span>
            </div>
          )}

          {/* Run button */}
          <button
            onClick={handleRun}
            disabled={loading || !selectedTemplate}
            className="
              h-11 rounded-xl
              bg-primary text-white
              text-sm font-medium
              flex items-center justify-center gap-2
              hover:opacity-90 active:scale-[0.98]
              transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
              shadow-lg shadow-primary/20
            "
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Demo
              </>
            )}
          </button>

          {/* Response section */}
          <div className="flex flex-col flex-1 min-h-[160px]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Response
              </span>
              <div className="flex-1 h-px bg-border" />
              {response && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--node-output))]" />
              )}
            </div>

            <div className="
              flex-1 rounded-xl border border-border
              bg-background p-4 text-sm
              overflow-auto min-h-[140px]
            ">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-3 h-3 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <span className="text-xs">Waiting for response...</span>
                </div>
              ) : response ? (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {response}
                </p>
              ) : (
                <span className="text-muted-foreground text-xs">
                  Waiting for execution...
                </span>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Replace confirmation modal ── */}
      {showReplaceModal && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-xl border border-border bg-muted p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-foreground">Replace Pipeline?</h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Your current canvas has nodes. Loading this template will replace everything.
              This cannot be undone.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setShowReplaceModal(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-accent transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmReplace}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm hover:opacity-90 transition-all"
              >
                Replace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};