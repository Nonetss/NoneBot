from typing import TypedDict


class State(TypedDict):
    user_name: str
    response: str
    about: str
    question: str
    pasos: int
    doc: list[str]
