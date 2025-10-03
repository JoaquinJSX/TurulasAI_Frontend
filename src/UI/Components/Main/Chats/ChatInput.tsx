import { useState } from "react";
import styles from "./Chat.module.css";

interface Props {
  onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={handleSend}>Enviar</button>
    </div>
  );
}
