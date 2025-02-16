import os

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Cargar variables de entorno
load_dotenv()

# Configurar la API de Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a ["http://localhost:3000"] si solo usas React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelo de datos para la petición
class ChatRequest(BaseModel):
    prompt: str


@app.post("/ask-gemini")
async def ask_gemini(request: ChatRequest):
    try:
        model = genai.GenerativeModel(
            "gemini-1.5-flash"
        )  # Cambia el modelo si es necesario
        response = model.generate_content(request.prompt)

        return {"response": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Punto de entrada para correr el servidor
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
