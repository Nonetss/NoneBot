from app.state import State


def presentacion(state: State):
    user_name = state.get("user_name", "desconocido")
    state["question"] = input(
        f"¡Encantado de conocerte, {user_name}! ¿En qué puedo ayudarte hoy?"
    )
    return state
