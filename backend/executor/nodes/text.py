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

        print(f"Text inputs: {list(inputs.keys())}")
        print(f"Text before: {text}")

        for handle_id, value in inputs.items():
            # handle format is "text-1-variableName"
            # strip node id prefix to get variable name
            prefix = f"{self.id}-"
            if handle_id.startswith(prefix):
                var_name = handle_id[len(prefix):]
                text = text.replace(f"{{{{{var_name}}}}}", str(value))
                print(f"Replaced {{{{ {var_name} }}}} with {value}")
    
        print(f"Text after: {text}")

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