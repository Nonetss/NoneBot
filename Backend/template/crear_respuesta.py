from langchain_core.output_parsers import JsonOutputParser

from model.llama import llm
from template.utils.normaliza_text import normalizar_texto


class CrearRespuesta:
    """
    Clase para generar respuestas a partir de un prompt usando LLM.
    Utiliza JsonOutputParser para asegurar la salida en formato JSON.
    """

    def __init__(self):
        self.json_parser = JsonOutputParser()

    def generar_respuesta(self, prompt):
        """
        - prompt: Tupla con el prompt generado y el flag de formateo.
        """
        try:
            # ✅ Desempaquetar claramente el prompt y el flag de formateo
            prompt_text, formateado = prompt

            # ✅ Invocar el modelo con el prompt generado
            respuesta_raw = llm.invoke(prompt_text)

            # ✅ Si se solicita formatear, normalizar cada valor de texto del JSON
            if formateado:
                respuesta_raw = normalizar_texto(respuesta_raw)

            # ✅ Devolver el resultado en formato JSON
            return respuesta_raw

        except Exception as e:
            print(f"❌ Error general al procesar la respuesta: {e}")
            return {"error": str(e)}
