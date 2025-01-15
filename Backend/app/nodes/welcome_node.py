from app.state import State


def welcome(state: State):
    # Solo pedir el nombre si no está definido
    user_name = input(
        "¡Hola! Soy NoneBot, tu asistente personal. ¿Cómo te llamas?\nTu nombre: "
    )
    state["user_name"] = user_name
    print(f"¡Encantado de conocerte, {state['user_name']}! ¿En qué puedo ayudarte hoy?")

    return state
