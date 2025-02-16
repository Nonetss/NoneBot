export async function askGemini(prompt) {
  try {
    const response = await fetch("http://127.0.0.1:8000/ask-gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error en askGemini:", error);
    throw error;
  }
}
