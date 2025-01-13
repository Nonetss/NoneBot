from app.state import State
from data.embeddings.usarDoc import buscar_embeding
from template.crear_prompts import CrearPrompt
from template.crear_respuesta import CrearRespuesta


def cargar_embeding(state: State):
    question = state["question"]
    about = state["about"]
    if about == "otro":
        return
    else:
        result = buscar_embeding(query=question, collection_name=about)
        state["doc"] = [doc.page_content for doc in result["results"]]
        print(state["doc"])
        return state
