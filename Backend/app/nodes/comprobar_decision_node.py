from app.state import State
from template.crear_prompts import CrearPrompt
from template.crear_respuesta import CrearRespuesta


def comprobar_decision(state: State):
    about = state["about"]
    estados_permitidos = ["nonebot", "antonio", "codigo", "otro"]
    if about in estados_permitidos:
        return state
    else:
        crear_prompt = CrearPrompt()
        prompt = crear_prompt.generar_prompt(
            nombre_prompt="decidir", prompt_humano=about
        )
        response = CrearRespuesta()
        result = response.generar_respuesta(prompt)
        print(result)
        state["about"] = str(result)
        return state
