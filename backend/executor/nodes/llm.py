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
        model    = self.get_data("model",    "gemini-2.5-flash")
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

        try:
            if system:
                m = genai.GenerativeModel(
                    model,
                    system_instruction=system
                )
            else:
                m = genai.GenerativeModel(model)

            res = m.generate_content(prompt)
    
            # handle different response formats
            if hasattr(res, 'text') and res.text:
                return res.text
    
            # fallback — try candidates
            if hasattr(res, 'candidates') and res.candidates:
                return res.candidates[0].content.parts[0].text

            return "Error: Could not extract response text."

        except Exception as e:
            raise Exception(f"Gemini error: {str(e)}")

    def _call_groq(self, key: str, model: str, system: str, prompt: str) -> str:
        from groq import Groq
        client   = Groq(api_key=key)
        messages = []
        if system:
            messages.append({ "role": "system", "content": system })
        messages.append(    { "role": "user",   "content": prompt })
        res = client.chat.completions.create(model=model, messages=messages)
        return res.choices[0].message.content
    
    def execute(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        provider = self.get_data("provider", "gemini")
        model    = self.get_data("model",    "gemini-1.5-flash")
        api_key  = self.get_data("apiKey",   "")

        system  = inputs.get(self.output_key("system"),  "")
        prompt  = inputs.get(self.output_key("prompt"),  "")

        print(f"Provider: {provider}, Model: {model}")
        print(f"API key present: {bool(api_key)}")
        print(f"Prompt: {prompt[:50] if prompt else 'EMPTY'}")

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

            print(f"Response received: {str(response)[:100] if response else 'NONE'}")

        # guard against None response
            if response is None:
                return { self.output_key("response"): "Error: Empty response from provider." }

        except Exception as e:
            print(f"LLM Error: {str(e)}")
            return { self.output_key("response"): f"Error: {str(e)}" }

        return { self.output_key("response"): response }