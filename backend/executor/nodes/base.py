# executor/nodes/base.py

from typing import Dict, Any
from abc import ABC, abstractmethod


class BaseExecutor(ABC):
    """
    Base class for all node executors.
    Every node type inherits from this and implements execute().
    """

    def __init__(self, node: Dict[str, Any]):
        self.id   = node["id"]
        self.type = node["type"]
        self.data = node.get("data", {})

    @abstractmethod
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        """
        inputs  — dict of { handleId: value } from upstream nodes
        returns — dict of { handleId: value } passed to downstream nodes
        """
        raise NotImplementedError

    def get_data(self, key: str, default: Any = "") -> Any:
        """
        Safe getter for node data fields
        """
        return self.data.get(key, default)

    def output_key(self, handle: str) -> str:
        """
        Generates consistent output key format
        e.g. node id = 'llm-1', handle = 'response'
        returns 'llm-1-response'
        """
        return f"{self.id}-{handle}"

    def __repr__(self):
        return f"<{self.__class__.__name__} id={self.id} type={self.type}>"