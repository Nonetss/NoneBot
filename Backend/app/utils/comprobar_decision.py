def check_decision(state):
    """
    Compara el estado de la conversación con una lista específica.

    Args:
        state (dict): Estado de la conversación

    Returns:
        bool: Verdadero si el estado coincide, falso en caso contrario
    """
    estados_permitidos = ["nonebot", "antonio", "codigo", "otro"]
    about = state.get("about", "")
    return about in estados_permitidos
