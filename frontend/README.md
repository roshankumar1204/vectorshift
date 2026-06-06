# VectorShift Pipeline Builder

A full-stack AI pipeline builder built with React, ReactFlow, FastAPI, and Tailwind CSS. Drag, connect, and execute AI workflow nodes on an interactive canvas.

**Live Demo:** `https://vectorshift-tau.vercel.app`
**Backend API:** `https://vectorshift-hl0x.onrender.com`

---

## Tech Stack

**Frontend**
- React 18 + ReactFlow 11
- Tailwind CSS + shadcn/ui components
- Zustand (state + persistence)
- Lucide React icons

**Backend**
- FastAPI + Uvicorn
- Google Gemini 1.5 Flash
- Pydantic + python-dotenv

---

## Features

- **9 Node Types** — Input, Output, LLM, Text, Filter, Transform, Merge, Conditional, API Call
- **BaseNode abstraction** — all nodes built on a single reusable component
- **Dynamic Text Node** — auto-resizes as you type, detects `{{variables}}` and creates input handles automatically
- **Edge management** — click ✕ on any edge to delete it, animated/static/on-submit modes
- **Pipeline validation** — submit to backend checks node/edge count and detects cycles (DAG check)
- **Demo runner** — runs prompts through Gemini AI with sequential node execution animation
- **Import / Export** — save and load pipelines as JSON
- **Fullscreen mode** — expand canvas to full viewport
- **Persistent state** — pipeline auto-saves to localStorage via Zustand persist

---

## Project Structure

```
vectorshift/
├── frontend/
│   ├── public/
│   │   └── index.html
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
│       ├── store.js
│       └── index.css
└── backend/
    ├── main.py
    ├── requirements.txt
    └── .env
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Google Gemini API key

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

Create a `.env` file in `/backend`:
```
GEMINI_API_KEY=your_key_here
```

### Environment Variables

Create a `.env` file in `/frontend`:
```
REACT_APP_BACKEND_URL=http://localhost:8000
```

For production set this to your deployed backend URL in Vercel dashboard.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/pipelines/parse` | Validate pipeline — returns node/edge count + DAG check |
| POST | `/demo/run` | Run a prompt through Gemini AI |

### `/pipelines/parse` request body
```json
{
  "nodes": [...],
  "edges": [...]
}
```

### `/pipelines/parse` response
```json
{
  "num_nodes": 3,
  "num_edges": 2,
  "is_dag": true
}
```

---

## Node Types

| Node | Handles | Description |
|---|---|---|
| Input | 1 output | Pipeline entry point — name + type |
| Output | 1 input | Pipeline sink — name + type |
| LLM | 2 inputs, 1 output | Language model — system, prompt → response |
| Text | dynamic inputs, 1 output | Template — `{{variable}}` creates handles |
| Filter | 1 input, 2 outputs | Condition → pass / fail branches |
| Transform | 1 input, 1 output | Map function field |
| Merge | 3 inputs, 1 output | Combine multiple inputs — concat / JSON / newline |
| Conditional | 1 input, 2 outputs | Expression → true / false branches |
| API Call | 1 input, 1 output | HTTP request — method + URL |

---

## DAG Validation

The backend uses **DFS cycle detection** with 3-state node tracking:
- `0` = unvisited
- `1` = currently in path
- `2` = fully explored

If any node is visited while already in the current path, a cycle is detected and `is_dag` returns `false`. The check runs from every node to handle disconnected graphs.

---

## Deployment

**Frontend → Vercel**
- Connect GitHub repo
- Set root directory to `frontend`
- Add `REACT_APP_BACKEND_URL` environment variable

**Backend → Render**
- Connect GitHub repo
- Set root directory to `backend`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add `GEMINI_API_KEY` environment variable

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