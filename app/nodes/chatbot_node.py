from app.state import State
from template.crear_prompts import CrearPrompt
from template.crear_respuesta import CrearRespuesta


def chatbot(state: State):
    question = state["question"]
    user_name = state["user_name"]
    about = state["about"]
    crear_prompt = CrearPrompt()
    response = CrearRespuesta()
    if about == "otro":
        prompt = crear_prompt.generar_prompt(
            nombre_prompt="requestDoc",
            prompt_humano=question,
            variables={"user_name": user_name},
        )
        result = response.generar_respuesta(prompt)
        print(result)
        state["question"] = ""
        return state
    else:
        doc = state["doc"]
        prompt = crear_prompt.generar_prompt(
            nombre_prompt="requestDoc",
            prompt_humano=question,
            prompt_document=doc,
            variables={"user_name": user_name},
        )
        result = response.generar_respuesta(prompt)
        print(result)
        state["question"] = ""
        state["doc"] = [""]
        state["about"] = ""
        return state
