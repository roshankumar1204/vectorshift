# executor/nodes/output.py

from typing import Dict, Any
from .base import BaseExecutor


class OutputExecutor(BaseExecutor):
    """
    Output node — sink of the pipeline.
    Collects the final value and labels it with the output name.
    """

    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        # value comes from whatever node is connected to this input
        value = inputs.get(self.output_key("value"), "")

        return {
            "name":  self.get_data("outputName", self.id),
            "type":  self.get_data("outputType", "Text"),
            "value": value,
        }