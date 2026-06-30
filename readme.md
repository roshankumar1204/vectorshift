
---


# VectorShift Pipeline Builder

An open-source visual AI pipeline editor — drag, connect, and execute AI workflows without writing infrastructure code. Built as a demonstration of how modern AI orchestration tools work under the hood.

**Live Demo:** `https://vectorshift-tau.vercel.app`


---

## What is this?

Most AI applications today are just chains — an input flows through a series of transformations, hits a language model, and produces an output. VectorShift Pipeline Builder makes that chain visual and interactive.

You drag nodes onto a canvas, connect them with edges, and the backend executes the pipeline in topological order — respecting dependencies, substituting variables, and calling your chosen AI provider with your own API key. No vendor lock-in, no hidden calls, no stored keys.

Think of it as a lightweight open-source alternative to the visual layer of tools like n8n, Flowise, or LangFlow — built specifically to demonstrate how AI pipeline orchestration works at the component level.

---

## How it works

```
User drags nodes onto canvas
         ↓
Connects them with edges
         ↓
Clicks Run → fills in input values
         ↓
Frontend sends { nodes, edges, input_values } to FastAPI
         ↓
Backend topologically sorts nodes (Kahn's algorithm)
         ↓
Executes each node in order — substituting variables,
calling LLM providers, passing outputs downstream
         ↓
Returns results to frontend
         ↓
Results modal shows output per output node
```

---

## Tech Stack

**Frontend**
- React 18 + ReactFlow 11
- Tailwind CSS + shadcn/ui
- Zustand with persistence middleware
- Lucide React icons

**Backend**
- FastAPI + Uvicorn
- Google Gemini / OpenAI / Groq (user-provided keys)
- Pydantic for request validation
- python-dotenv

---

## Features

**Canvas**
- 9 draggable node types — Input, Output, LLM, Text, Filter, Transform, Merge, Conditional, API Call
- Smooth edge connections with arrow markers and ✕ delete button on hover
- Edge animation modes — static, always animated, animate on submit
- Fullscreen canvas mode
- Pipeline auto-saves to localStorage via Zustand persist
- Export / Import pipelines as JSON
- Empty state with onboarding hint

**Node System**
- Single `BaseNode` abstraction — all 9 nodes built on one component
- Dynamic Text node — auto-resizes as you type, detects `{{variables}}` and creates input handles live
- LLM node supports 3 providers — Google Gemini, OpenAI, Groq — user pastes their own API key
- Model selection per provider

**Execution Engine**
- Real pipeline execution — not just validation
- Topological sort ensures correct execution order
- Variable substitution in Text node templates
- Multi-provider LLM calls with user API keys
- Input values modal collects runtime values before execution
- Results modal shows per-output-node responses

**Validation**
- DAG check via DFS cycle detection (3-state node tracking)
- Returns node count, edge count, and DAG status

**Demo Runner**
- One-click AI Chat Flow template
- Gemini-powered prompt execution
- Sequential node execution animation using topological order

---

## Project Structure

```
vectorshift/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── ui/
│       │   │   ├── button.jsx
│       │   │   └── badge.jsx
│       │   ├── panels/
│       │   │   ├── SubmitPanel.jsx
│       │   │   ├── AnimationPanel.jsx
│       │   │   └── StatusPanel.jsx
│       │   ├── modals/
│       │   │   └── ClearModal.jsx
│       │   ├── EmptyState.jsx
│       │   └── DemoDrawer.jsx
│       ├── edges/
│       │   └── DeletableEdge.js
│       ├── nodes/
│       │   ├── BaseNode.js
│       │   ├── inputNode.js
│       │   ├── outputNode.js
│       │   ├── llmNode.js
│       │   ├── textNode.js
│       │   ├── filterNode.js
│       │   ├── transformNode.js
│       │   ├── mergeNode.js
│       │   ├── conditionalNode.js
│       │   └── apiCallNode.js
│       ├── templates/
│       │   └── pipelineTemplates.js
│       ├── lib/
│       │   └── utils.js
│       ├── App.js
│       ├── toolbar.js
│       ├── draggableNode.js
│       ├── ui.js
│       ├── submit.js
│       └── store.js
└── backend/
    ├── main.py
    ├── executor/
    │   ├── pipeline.py
    │   └── nodes/
    │       ├── base.py
    │       ├── input.py
    │       ├── output.py
    │       ├── text.py
    │       └── llm.py
    ├── models/
    │   └── requests.py
    ├── utils/
    │   └── graph.py
    └── requirements.txt
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- API key from Gemini, OpenAI, or Groq (free tiers available for all three)

### Frontend

```bash
cd frontend
npm install
npm start
```

Runs on `http://localhost:3000`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Runs on `http://localhost:8000`

Create `/frontend/.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/pipelines/parse` | Validate structure — node/edge count + DAG check |
| POST | `/pipelines/run` | Execute pipeline — returns output node values |
| POST | `/demo/run` | Run a single Gemini prompt (demo runner) |

### `/pipelines/run` request
```json
{
  "nodes": [...],
  "edges": [...],
  "input_values": {
    "customInput-1": "ram mohan",
    "customInput-2": "AI trends"
  }
}
```

### `/pipelines/run` response
```json
{
  "status": "success",
  "outputs": [
    {
      "id": "customOutput-1",
      "name": "email_result",
      "type": "Text",
      "value": "Dear Ram Mohan, ..."
    }
  ]
}
```

---

## Node Types

| Node | Inputs | Outputs | Description |
|---|---|---|---|
| Input | — | value | Pipeline entry — name + type, value provided at runtime |
| Output | value | — | Pipeline sink — collects final result |
| LLM | system, prompt | response | Calls Gemini / OpenAI / Groq with user's own API key |
| Text | dynamic `{{vars}}` | output | Template engine — variables become input handles |
| Filter | input | pass, fail | Condition → two output branches |
| Transform | input | output | Map function field |
| Merge | a, b, c | merged | Combine multiple inputs |
| Conditional | input | true, false | Expression → two branches |
| API Call | body | response | HTTP request — method + URL |

---

## Execution Engine

The backend execution engine lives in `executor/pipeline.py`. It:

1. **Topologically sorts** nodes using Kahn's algorithm — guarantees execution order respects dependencies
2. **Seeds runtime values** — user-provided input values injected before execution starts
3. **Routes handles** — each edge maps `sourceHandle → targetHandle`, values flow through this map
4. **Executes each node** in order — each node type has its own executor class inheriting from `BaseExecutor`
5. **Collects outputs** — all Output nodes return their final values

Each node executor follows the same interface:
```python
class BaseExecutor:
    def execute(self, inputs: dict) -> dict:
        # inputs  = { handleId: value } from upstream
        # returns = { handleId: value } for downstream
```

---

## LLM Providers

The LLM node accepts user-provided API keys — no keys are stored server-side. Supported providers:

| Provider | Models | Get Key |
|---|---|---|
| Google Gemini | gemini-1.5-flash, gemini-1.5-pro, gemini-2.0-flash | aistudio.google.com |
| OpenAI | gpt-4o, gpt-4o-mini, gpt-3.5-turbo | platform.openai.com |
| Groq | llama3-8b, llama3-70b, mixtral-8x7b | console.groq.com |

---

## DAG Validation

The `/pipelines/parse` endpoint runs DFS cycle detection with 3-state node tracking before any execution:

```
0 = unvisited
1 = currently in DFS path
2 = fully explored
```

If any node is reached while already in the current path — cycle detected, `is_dag: false`. Runs from every node to handle disconnected graphs.

---

## Deployment

**Frontend → Vercel**
- Connect GitHub repo, set root to `frontend`
- Add `REACT_APP_BACKEND_URL` in environment variables

**Backend → Render**
- Connect GitHub repo, set root to `backend`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- No API keys needed server-side — users provide their own

> ⚡ Backend runs on Render free tier — first request after inactivity may take ~30 seconds to wake up.

---

## Assessment Coverage

| Part | Feature | Status |
|---|---|---|
| Part 1 | Node abstraction via BaseNode | ✅ |
| Part 1 | 5 new node types | ✅ |
| Part 2 | Unified dark theme with Tailwind | ✅ |
| Part 3 | Text node auto-resize | ✅ |
| Part 3 | `{{variable}}` handle injection | ✅ |
| Part 4 | Frontend → backend POST | ✅ |
| Part 4 | DAG detection | ✅ |
| Part 4 | Result alert/modal | ✅ |

## Beyond the Assessment

| Feature | Description |
|---|---|
| Real pipeline execution | `/pipelines/run` executes nodes in topological order |
| Multi-provider LLM | Gemini, OpenAI, Groq — user's own API key |
| Variable substitution | Text node templates resolve at runtime |
| Execution animation | Nodes highlight sequentially during run |
| Pipeline persistence | Auto-saves to localStorage |
| Export / Import | Save and load pipelines as JSON |
| Edge deletion | Hover any edge for ✕ delete button |
| Fullscreen mode | Canvas expands to full viewport |
| Demo runner | One-click AI Chat Flow template |