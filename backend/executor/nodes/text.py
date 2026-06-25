# executor/nodes/text.py

import re
from typing import Dict, Any
from .base import BaseExecutor


class TextExecutor(BaseExecutor):
    """
    Text node — template engine.
    Replaces {{variables}} with values from connected input handles.
    """

    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        text = self.get_data("text", "")

        # inputs keys are the full handle IDs e.g. "textNode-1-varName"
        # we need just the variable name part
        for handle_id, value in inputs.items():
            # extract variable name from handle ID
            # handle format: nodeId-variableName
            var_name = self._extract_var_name(handle_id)
            if var_name:
                text = text.replace(f"{{{{{var_name}}}}}", str(value))

        return {
            self.output_key("output"): text
        }

    def _extract_var_name(self, handle_id: str) -> str:
        """
        handle_id format: 'textNode-1-variableName'
        extracts:         'variableName'
        """
        # strip nodeId prefix — everything after the second dash segment
        parts = handle_id.split(f"{self.id}-")
        if len(parts) > 1:
            return parts[1]
        return ""