from langgraph.graph import END, START, StateGraph

# Importar nodos y estado
from app.nodes.cargar_embeding_node import cargar_embeding
from app.nodes.chatbot_node import chatbot
from app.nodes.comprobar_decision_node import comprobar_decision
from app.nodes.decidir_node import decidir
from app.nodes.welcome_node import welcome
from app.state import State
from app.utils.comprobar_decision import check_decision
from app.utils.exit import exit

# Inicializar el grafo con el estado definido
builder = StateGraph(State)

# Agregar nodos al grafo
builder.add_node("welcome", welcome)
builder.add_node("decidir", decidir)
builder.add_node("comprobar_decision", comprobar_decision)
builder.add_node("cargar_embeding", cargar_embeding)
builder.add_node("chatbot", chatbot)


# Definir edges del flujo
builder.add_edge(START, "welcome")
builder.add_edge("welcome", "decidir")

# Condicional simplificado
builder.add_conditional_edges("decidir", exit, {True: END, False: "comprobar_decision"})

builder.add_conditional_edges(
    "comprobar_decision",
    check_decision,
    {True: "cargar_embeding", False: "comprobar_decision"},
)
builder.add_edge("cargar_embeding", "chatbot")

builder.add_edge("chatbot", "decidir")

# Compilar el grafo
graph = builder.compile()


# Estado inicial
initial_state = {"pasos": 0}

initial_state = graph.invoke(initial_state)
