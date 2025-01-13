from typing import TypedDict


class State(TypedDict):
    user_name: str
    response: str
    done: bool
    question: str
    pasos: int
