# executor/nodes/__init__.py

from .input       import InputExecutor
from .output      import OutputExecutor
from .text        import TextExecutor
from .llm         import LLMExecutor

# maps ReactFlow node type → executor class
NODE_EXECUTOR_MAP = {
    "customInput":  InputExecutor,
    "customOutput": OutputExecutor,
    "text":         TextExecutor,
    "llm":          LLMExecutor,
}

def get_executor(node: dict):
    """
    Returns the correct executor instance for a given node.
    Falls back to None if node type is not supported.
    """
    executor_class = NODE_EXECUTOR_MAP.get(node["type"])
    if not executor_class:
        return None
    return executor_class(node)