from app.state import State
from template.crear_prompts import CrearPrompt
from template.crear_respuesta import CrearRespuesta


def chatbot(state: State):
    question = state["question"]
    about = state["about"]
    doc = state["doc"]
    crear_prompt = CrearPrompt()
    response = CrearRespuesta()
    if about == "otro":
        prompt = crear_prompt.generar_prompt(
            nombre_prompt="requestDoc", prompt_humano=question
        )
        result = response.generar_respuesta(prompt)
        print(result)
        state["question"] = ""
        return state
    else:
        prompt = crear_prompt.generar_prompt(
            nombre_prompt="requestDoc",
            prompt_humano=question,
            prompt_document=doc,
        )
        result = response.generar_respuesta(prompt)
        print(result)
        state["question"] = ""
        state["doc"] = [""]
        state["about"] = ""
        return state
