# executor/nodes/input.py

from typing import Dict, Any
from .base import BaseExecutor


class InputExecutor(BaseExecutor):
    """
    Input node — entry point of the pipeline.
    Returns the runtime value provided by the user.
    """

    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        # runtime_value is injected by the execution engine
        # from user-provided values before execution starts
        value = inputs.get("runtime_value", "")

        return {
            self.output_key("value"): value
        }