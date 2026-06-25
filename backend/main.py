# main.py — full updated file

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from utils.graph        import is_dag
from models.requests    import Pipeline, PipelineRunRequest
from executor.pipeline  import execute_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return { "Ping": "Pong" }


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag":    is_dag(pipeline.nodes, pipeline.edges),
    }


@app.post("/pipelines/run")
async def run_pipeline(request: PipelineRunRequest):
    # validate DAG first
    if not is_dag(request.nodes, request.edges):
        raise HTTPException(
            status_code=400,
            detail="Pipeline contains a cycle — cannot execute."
        )

    # check all nodes are supported
    supported = {"customInput", "customOutput", "text", "llm"}
    for node in request.nodes:
        if node["type"] not in supported:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported node type: {node['type']}"
            )

    try:
        outputs = execute_pipeline(
            request.nodes,
            request.edges,
            request.input_values,
        )
        return {
            "status":  "success",
            "outputs": outputs,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# keep existing demo endpoint
@app.post("/demo/run")
async def run_demo(data: dict):
    prompt = data.get("prompt", "")
    try:
        import google.generativeai as genai
        import os
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model    = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        return { "response": response.text }
    except Exception as e:
        return { "response": f"Error: {str(e)}" }