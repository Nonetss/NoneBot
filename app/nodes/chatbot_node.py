from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate

from app.state import State
from model.llama import llm

prompt = PromptTemplate(
    template="{question}",
    input_variables=["question"],
)

chat = prompt | llm


def chatbot(state: State):
    question = state["question"]
    response = chat.invoke({"question": question})
    print(response)
    state["question"] = input(f"Tu: ")
    return state
