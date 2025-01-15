def exit(state):
    if state["question"] == "exit":
        return True  # Devuelve directamente un valor hashable
    else:
        return False
