from app.state import State
from template.crear_prompts import CrearPrompt
from template.crear_respuesta import CrearRespuesta


def chatbot(state: State):
    question = state["question"]
    crear_prompt = CrearPrompt()
    prompt = crear_prompt.generar_prompt(
        nombre_prompt="requestDoc", prompt_humano=question
    )
    response = CrearRespuesta()
    result = response.generar_respuesta(prompt)
    print(result)
    state["question"] = ""
    return state
