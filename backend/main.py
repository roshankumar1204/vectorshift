from dotenv import load_dotenv
load_dotenv()  # must be first

import os
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")

class Pipeline(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

class DemoRequest(BaseModel):
    prompt: str

def is_dag(nodes, edges):
    graph = {node["id"]: [] for node in nodes}
    for edge in edges:
        src = edge["source"]
        tgt = edge["target"]
        if src in graph:
            graph[src].append(tgt)

    state = {node["id"]: 0 for node in nodes}

    def dfs(node_id):
        if state[node_id] == 1: return False
        if state[node_id] == 2: return True
        state[node_id] = 1
        for neighbour in graph.get(node_id, []):
            if not dfs(neighbour):
                return False
        state[node_id] = 2
        return True

    for node in nodes:
        if state[node["id"]] == 0:
            if not dfs(node["id"]):
                return False
    return True

@app.get("/")
def read_root():
    return {"Ping": "Pong"}

@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag":    is_dag(pipeline.nodes, pipeline.edges),
    }

@app.post("/demo/run")
def run_demo(data: DemoRequest):
    try:
        response = model.generate_content(data.prompt)
        return {"response": response.text}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}