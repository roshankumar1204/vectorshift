export const createAIChatFlow = () => {
  const inputId = "customInput-1";
  const llmId = "llm-1";
  const outputId = "customOutput-1";

  return {
    nodes: [
      {
        id: inputId,
        type: "customInput",
        position: { x: 100, y: 250 },
        data: {
          id: inputId,
          nodeType: "customInput",
        },
      },

      {
        id: llmId,
        type: "llm",
        position: { x: 450, y: 250 },
        data: {
          id: llmId,
          nodeType: "llm",
        },
      },

      {
        id: outputId,
        type: "customOutput",
        position: { x: 800, y: 250 },
        data: {
          id: outputId,
          nodeType: "customOutput",
        },
      },
    ],

    edges: [
      {
        id: `${inputId}-${llmId}`,
        source: inputId,
        target: llmId,
        type: "deletable",
      },

      {
        id: `${llmId}-${outputId}`,
        source: llmId,
        target: outputId,
        type: "deletable",
      },
    ],
  };
};