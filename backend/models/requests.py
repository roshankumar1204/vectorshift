# models/requests.py

from pydantic import BaseModel
from typing  import List, Dict, Any


class Pipeline(BaseModel):
    """existing — parse only"""
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


class PipelineRunRequest(BaseModel):
    """new — full execution"""
    nodes:        List[Dict[str, Any]]
    edges:        List[Dict[str, Any]]
    input_values: Dict[str, str] = {}
    # input_values = { "customInput-1": "John Doe", "customInput-2": "AI trends" }