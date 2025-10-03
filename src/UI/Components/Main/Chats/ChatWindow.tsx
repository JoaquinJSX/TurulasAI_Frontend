import { useEffect, useRef } from "react";
import styles from "./Chat.module.css";

interface Message {
  sender: "user" | "assistant";
  text: string;
  created_at?: string; // viene del backend
}

interface Props {
  messages: Message[];
}

export default function ChatWindow({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Auto-scroll al último mensaje
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 👇 Ocultamos el primer mensaje automático
  const visibleMessages = messages.length > 1 ? messages.slice(1) : [];

  return (
    <div className={styles.chatWindow}>
      {visibleMessages.length === 0 ? (
        <p className={styles.empty}>Selecciona un agente para comenzar</p>
      ) : (
        visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.sender === "user" ? styles.user : styles.bot
            }`}
          >
            <p className={styles.text}>{msg.text}</p>
            <span className={styles.timestamp}>
              {msg.created_at
                ? new Date(msg.created_at).toLocaleTimeString([], {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>
          </div>
        ))
      )}
      {/* Ancla invisible para scrollear */}
      <div ref={bottomRef} />
    </div>
  );
}
