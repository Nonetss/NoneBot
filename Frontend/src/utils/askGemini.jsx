const URL_API = import.meta.env.VITE_URL_API;

export async function askGemini(prompt) {
  try {
    const response = await fetch(`${URL_API}/ask-gemini`, {
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
