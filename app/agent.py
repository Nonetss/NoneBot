from langgraph.graph import END, START, StateGraph

# Importar nodos y estado
from app.nodes.chatbot_node import chatbot
from app.nodes.presentacion_node import presentacion
from app.nodes.welcome_node import welcome
from app.state import State

# Inicializar el grafo con el estado definido
builder = StateGraph(State)

# Agregar nodos al grafo
builder.add_node("welcome", welcome)
builder.add_node("presentacion", presentacion)
builder.add_node("chatbot", chatbot)


# Función corregida para control de flujo


def seguimos(state):
    if state.get("question") == "exit":
        return True  # Devuelve directamente un valor hashable
    else:
        return False


# Definir edges del flujo
builder.add_edge(START, "welcome")
builder.add_edge("welcome", "presentacion")
builder.add_edge("presentacion", "chatbot")

# Condición corregida usando booleanos
builder.add_conditional_edges("chatbot", seguimos, {True: END, False: "chatbot"})

# Compilar el grafo
graph = builder.compile()

# Estado inicial
initial_state = {"question": ""}
while True:
    initial_state = graph.invoke(initial_state)
    if initial_state["question"].lower() == "exit":
        print("¡Hasta luego!")
        break
