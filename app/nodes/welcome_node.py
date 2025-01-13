from app.state import State


def welcome(state: State):
    state["response"] = "¡Hola! Soy NoneBot, tu asistente personal. ¿Cómo te llamas?"
    print(state["response"])
    state["user_name"] = input("Tu nombre: ")
    return state
