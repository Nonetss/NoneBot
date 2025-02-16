import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Soporte para listas, tablas, enlaces...
import "./ChatComponent.css"; // Asegúrate de definir los estilos
import { askGemini } from "@utils/askGemini";
import ROBOT from "@img/robot-svgrepo-com.svg";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const chatBoxRef = useRef(null);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    if (!isOpen && chatBoxRef.current) {
      lastScrollPosition.current = chatBoxRef.current.scrollTop;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = lastScrollPosition.current;
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === "" || isWaitingForResponse) return;

    const userMessage = { text: input, sender: "user", id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsWaitingForResponse(true);

    try {
      const response = await askGemini(userMessage.text);
      setMessages((prev) => [
        ...prev,
        { text: response, sender: "bot", id: Date.now() + 1 },
      ]);
    } catch (error) {
      console.error("Error al obtener respuesta de Gemini:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Error al obtener respuesta.",
          sender: "bot",
          id: Date.now() + 1,
        },
      ]);
    } finally {
      setIsWaitingForResponse(false);
    }
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
        <img src={ROBOT} alt="Chat icon" className="h-10 w-10 bg-transparent" />
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
                  <ReactMarkdown
                    className="markdown-content"
                    remarkPlugins={[remarkGfm]}
                  >
                    {msg.text}
                  </ReactMarkdown>
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
                disabled={isWaitingForResponse}
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
