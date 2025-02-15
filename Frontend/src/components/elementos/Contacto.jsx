import React from "react";
import "@styles/elementos/ContactForm.css"; // Importa el CSS externo (ajusta la ruta si es necesario)

export default function ContactForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Validaciones básicas
    const nombre = formData.get("nombre").trim();
    const email = formData.get("email").trim();
    const mensaje = formData.get("mensaje").trim();

    if (!nombre || !email || !mensaje) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Enviar datos a un backend (ejemplo con fetch)
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Mensaje enviado con éxito 🎉");
        form.reset();
      } else {
        alert("Hubo un problema al enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (error) {
      alert("Error al enviar el mensaje. Revisa tu conexión.");
    }
  };

  return (
    <section id="contacto">
      <div className="contacto-div">
        <h1>Contacto:</h1>
        <nav>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />

            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="mensaje">Mensaje:</label>
            <textarea id="mensaje" name="mensaje" rows="4" required />

            <button type="submit">Enviar</button>
          </form>
        </nav>
      </div>
    </section>
  );
}
