# executor/nodes/llm.py

from typing import Dict, Any
from .base import BaseExecutor


class LLMExecutor(BaseExecutor):
    """
    LLM node — calls AI provider with system + prompt.
    Supports OpenAI, Gemini, Groq.
    User provides their own API key per request.
    """

    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        provider = self.get_data("provider", "gemini")
        model    = self.get_data("model",    "gemini-1.5-flash")
        api_key  = self.get_data("apiKey",   "")

        system  = inputs.get(self.output_key("system"),  "")
        prompt  = inputs.get(self.output_key("prompt"),  "")

        if not api_key:
            return { self.output_key("response"): "Error: No API key provided." }

        if not prompt:
            return { self.output_key("response"): "Error: No prompt connected." }

        try:
            if provider == "openai":
                response = self._call_openai(api_key, model, system, prompt)
            elif provider == "gemini":
                response = self._call_gemini(api_key, model, system, prompt)
            elif provider == "groq":
                response = self._call_groq(api_key, model, system, prompt)
            else:
                response = f"Error: Unknown provider '{provider}'"

        except Exception as e:
            response = f"Error: {str(e)}"

        return { self.output_key("response"): response }

    # ── providers ──────────────────────────────────────

    def _call_openai(self, key: str, model: str, system: str, prompt: str) -> str:
        from openai import OpenAI
        client   = OpenAI(api_key=key)
        messages = []
        if system:
            messages.append({ "role": "system",  "content": system })
        messages.append(    { "role": "user",    "content": prompt })
        res = client.chat.completions.create(model=model, messages=messages)
        return res.choices[0].message.content

    def _call_gemini(self, key: str, model: str, system: str, prompt: str) -> str:
        import google.generativeai as genai
        genai.configure(api_key=key)
        m   = genai.GenerativeModel(
            model,
            system_instruction=system if system else None
        )
        res = m.generate_content(prompt)
        return res.text

    def _call_groq(self, key: str, model: str, system: str, prompt: str) -> str:
        from groq import Groq
        client   = Groq(api_key=key)
        messages = []
        if system:
            messages.append({ "role": "system", "content": system })
        messages.append(    { "role": "user",   "content": prompt })
        res = client.chat.completions.create(model=model, messages=messages)
        return res.choices[0].message.content