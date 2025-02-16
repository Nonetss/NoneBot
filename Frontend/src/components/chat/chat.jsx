import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ChatComponent.css";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false); // Bloquear envío hasta recibir respuesta
  const chatBoxRef = useRef(null);
  const lastScrollPosition = useRef(0);

  // Guardar la posición del scroll antes de cerrar el chat
  useEffect(() => {
    if (!isOpen && chatBoxRef.current) {
      lastScrollPosition.current = chatBoxRef.current.scrollTop;
    }
  }, [isOpen]);

  // Restaurar el scroll cuando se reabre el chat
  useEffect(() => {
    if (isOpen && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = lastScrollPosition.current;
    }
  }, [isOpen]);

  // Scroll automático al recibir nuevos mensajes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "" || isWaitingForResponse) return; // Bloquea si está esperando respuesta

    setMessages([...messages, { text: input, sender: "user", id: Date.now() }]);
    setInput("");
    setIsWaitingForResponse(true); // Bloquea hasta recibir respuesta

    // Simula una respuesta después de 1 segundo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "Esta es una respuesta de prueba.",
          sender: "bot",
          id: Date.now() + 1,
        },
      ]);
      setIsWaitingForResponse(false); // Desbloquea el envío de mensajes
    }, 1000);
  };

  return (
    <>
      <motion.button
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
        aria-label="Toggle chat"
      >
        <img
          src="/src/assets/robot-svgrepo-com.svg"
          alt="Chat icon"
          className=" h-10 w-10 bg-transparent"
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat-container"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="chat-box" ref={chatBoxRef}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`chat-message ${msg.sender}`}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {msg.text}
                </motion.div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                aria-label="Message input"
              />
              <motion.button
                onClick={sendMessage}
                whileHover={{ backgroundColor: "var(--color-secundario)" }}
                whileTap={{ scale: 0.9 }}
                disabled={isWaitingForResponse} // Deshabilita el botón mientras espera respuesta
                aria-label="Send message"
              >
                Enviar
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatComponent;
