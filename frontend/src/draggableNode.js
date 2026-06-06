const DOT_COLORS = {
  customInput:   'bg-[hsl(var(--node-input))]',
  llm:           'bg-[hsl(var(--node-llm))]',
  customOutput:  'bg-[hsl(var(--node-output))]',
  text:          'bg-[hsl(var(--node-text))]',
  filter:        'bg-[hsl(var(--node-filter))]',
  transform:     'bg-[hsl(var(--node-transform))]',
  merge:         'bg-[hsl(var(--node-merge))]',
  conditional:   'bg-[hsl(var(--node-conditional))]',
  apiCall:       'bg-[hsl(var(--node-apicall))]',
};

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="
        flex items-center gap-2
        px-3 py-1.5
        rounded-md
        border border-border
        bg-transparent
        text-muted-foreground text-xs
        cursor-grab
        hover:bg-accent hover:text-accent-foreground
        transition-colors duration-150
        select-none
      "
      onDragStart={(e) => onDragStart(e, type)}
      draggable
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLORS[type] || 'bg-muted-foreground'}`} />
      <span>{label}</span>
    </div>
  );
};