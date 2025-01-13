from app.state import State
from template.crear_prompts import CrearPrompt
from template.crear_respuesta import CrearRespuesta


def decidir(state: State):
    state["question"] = input("Tu: ")
    question = state["question"]
    crear_prompt = CrearPrompt()
    prompt = crear_prompt.generar_prompt(
        nombre_prompt="decidir", prompt_humano=question
    )
    response = CrearRespuesta()
    result = response.generar_respuesta(prompt)
    print(result)
    state["about"] = str(result)
    return state
