import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';
import { createAIChatFlow } from "./templates/pipelineTemplates";

export const useStore = create(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      nodeIDs: {},
      edgeAnimation: 'static',
      modal: null,
      loading: false,
      pipelineName: "Untitled Pipeline",
      selectedTemplate: null,

      setModal:        (modal)   => set({ modal }),
      setLoading:      (loading) => set({ loading }),
      setPipelineName: (name)    => set({ pipelineName: name }),
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),

      clearPipeline: () => set({ nodes: [], edges: [], nodeIDs: {} }),

      exportPipeline: () => ({
        pipelineName: get().pipelineName,
        nodes:        get().nodes,
        edges:        get().edges,
        nodeIDs:      get().nodeIDs,
      }),

      importPipeline: (data) => set({
        pipelineName: data.pipelineName || "Untitled Pipeline",
        nodes:        data.nodes   || [],
        edges:        data.edges   || [],
        nodeIDs:      data.nodeIDs || {},
      }),

      createTemplatePipeline: () => {
        const template = createAIChatFlow();
        set({
          nodes:   template.nodes,
          edges:   template.edges,
          nodeIDs: { customInput: 1, llm: 1, customOutput: 1 },
        });
      },

      setEdgeAnimation: (mode) => {
        set({ edgeAnimation: mode });
        set({
          edges: get().edges.map(edge => ({
            ...edge,
            animated: mode === 'animated',
          }))
        });
      },

      getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) newIDs[type] = 0;
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}-${newIDs[type]}`;
      },

      addNode: (node) => set({ nodes: [...get().nodes, node] }),

      onNodesChange: (changes) => set({
        nodes: applyNodeChanges(changes, get().nodes),
      }),

      onEdgesChange: (changes) => set({
        edges: applyEdgeChanges(changes, get().edges),
      }),

      onConnect: (connection) => {
        const animated = get().edgeAnimation === 'animated';
        set({
          edges: addEdge({
            ...connection,
            type: 'deletable',
            animated,
            style: { stroke: 'hsl(248 90% 66%)', strokeWidth: 1.5 },
            markerEnd: {
              type:   MarkerType.Arrow,
              height: '20px',
              width:  '20px',
              color:  'hsl(248 90% 66%)',
            },
          }, get().edges),
        });
      },

      updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              node.data = { ...node.data, [fieldName]: fieldValue };
            }
            return node;
          }),
        });
      },

      flashEdges: () => {
        if (get().edgeAnimation !== 'onsubmit') return;
        set({ edges: get().edges.map(e => ({ ...e, animated: true })) });
        setTimeout(() => {
          set({ edges: get().edges.map(e => ({ ...e, animated: false })) });
        }, 2500);
      },

      // ── NEW: sequential node highlight animation ──
      executeAnimation: () => {
        const { nodes, edges } = get();
        if (nodes.length === 0) return;

        // ── build adjacency + in-degree for topo sort ──
        const inDegree  = {};
        const adjList   = {};

        nodes.forEach(n => {
          inDegree[n.id] = 0;
          adjList[n.id]  = [];
        });

        edges.forEach(e => {
          if (adjList[e.source] !== undefined) {
            adjList[e.source].push(e.target);
            inDegree[e.target] = (inDegree[e.target] || 0) + 1;
          }
        });

        // ── Kahn's algorithm — topological order ──
        const queue = nodes
          .filter(n => inDegree[n.id] === 0)
          .map(n => n.id);
        const order = [];

        while (queue.length > 0) {
          const curr = queue.shift();
          order.push(curr);
          (adjList[curr] || []).forEach(neighbour => {
            inDegree[neighbour]--;
            if (inDegree[neighbour] === 0) queue.push(neighbour);
          });
        }

        // fallback — if cycle exists just use original order
        const execOrder = order.length === nodes.length
          ? order
          : nodes.map(n => n.id);

        // ── flash edges first ──
        set({ edges: get().edges.map(e => ({ ...e, animated: true })) });

        // ── highlight each node sequentially ──
        execOrder.forEach((nodeId, i) => {
          setTimeout(() => {
            // set executing
            set({
              nodes: get().nodes.map(n => ({
                ...n,
                data: { ...n.data, executing: n.id === nodeId },
              }))
            });

            // clear after 600ms
            setTimeout(() => {
              set({
                nodes: get().nodes.map(n => ({
                  ...n,
                  data: { ...n.data, executing: false },
                }))
              });
            }, 600);

          }, i * 700); // 700ms between each node
        });

        // ── reset edges after full animation ──
        const totalDuration = execOrder.length * 700 + 800;
        setTimeout(() => {
          const mode = get().edgeAnimation;
          set({
            edges: get().edges.map(e => ({
              ...e,
              animated: mode === 'animated',
            }))
          });
        }, totalDuration);
      },

    }),
    { name: "vectorshift-pipeline" }
  )
);