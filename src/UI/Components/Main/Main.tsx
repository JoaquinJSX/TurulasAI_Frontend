import { useContext, useEffect, useState } from "react";
import styles from "./Main.module.css";
import AgentsCatalog from "./AgentsCatalog/AgentsCatalog";
import ChatWindow from "./Chats/ChatWindow";
import ChatInput from "./Chats/ChatInput";
import { appContext } from "../../../App";

interface Message {
  sender: "user" | "assistant";
  text: string;
  created_at?: string;
}

const API = import.meta.env.VITE_API_URL;

export default function Main({ agents }: { agents: any[] }) {
  const context = useContext(appContext);
  if (!context || !context.userLoggedIn) {
    throw new Error("appContext must be used within an AppProvider");
  }
  const { userLoggedIn } = context;

  const [hasChat, setHasChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [agentSelected, setAgentSelected] = useState<string | null>(null);

  // Cargar mensajes de un chat ya abierto
  useEffect(() => {
    if (!chatId) return;
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${API}/${chatId}`,
          { signal: ctrl.signal }
        );
        if (!res.ok) {
          console.error("HTTP", res.status);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.items ?? [];
        const mapped: Message[] = list.map((m: any) => ({
          sender: m.role === "user" ? "user" : "assistant",
          text: m.content,
          created_at: m.created_at,
        }));
        setMessages(mapped);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error("No se pudieron cargar mensajes", e);
        }
      }
    })();

    return () => ctrl.abort();
  }, [chatId]);

  // Al seleccionar un agente
  const handleStartChat = async (agent: { id: string; category: string }) => {
    try {
      const res = await fetch(
        `${API}/chats/user/${userLoggedIn.id}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const chats = await res.json();

      const existingChat = chats.find((c: any) => c.agent_id === agent.id);

      if (existingChat) {
        setChatId(existingChat.id);
        setHasChat(true);

        const resMsgs = await fetch(
          `${API}/${existingChat.id}`
        );
        if (resMsgs.ok) {
          const data = await resMsgs.json();
          const list = Array.isArray(data) ? data : data.items ?? [];
          const mapped: Message[] = list.map((m: any) => ({
            sender: m.role === "user" ? "user" : "assistant",
            text: m.content,
            created_at: m.created_at,
          }));
          setMessages(mapped);
        }
        return;
      }

      // Crear chat nuevo
      const body = {
        user_id: userLoggedIn.id,
        agent_id: agent.id,
        category: agent.category,
      };

      const resNew = await fetch(`${API}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resNew.ok) throw new Error(`HTTP ${resNew.status}`);
      const newChat = await resNew.json();

      setChatId(newChat.id);
      setHasChat(true);

      // 👇 Enviar mensaje automático
      const initialMessage = `Hola, soy ${userLoggedIn.name}`;
      setMessages([
        {
          sender: "user",
          text: initialMessage,
          created_at: new Date().toISOString(),
        },
      ]);

      // 🔥 Guardar en backend y obtener respuesta
      const resMsg = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: newChat.id, content: initialMessage }),
      });

      const data = await resMsg.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: data.reply ?? "🤖 (sin respuesta)",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error al iniciar chat", err);
    }
  };

  // Enviar mensaje manual
  const handleSend = async (text: string) => {
    if (!chatId) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);

    try {
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, content: text }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: data.reply ?? "🤖 (sin respuesta)",
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error("Error enviando mensaje", err);
    }
  };

  return (
    <main className={styles.main}>
      {hasChat ? (
        <>
          <div className={styles.chatHeader}>
            <button
              className={styles.backBtn}
              onClick={() => {
                setHasChat(false);
                setChatId(null);
                setMessages([]);
                setAgentSelected(null);
              }}
            >
              ← Ver agentes
            </button>
            {chatId && (
              <h2 className={styles.chatTitle}>
                {agentSelected
                  ? `Chat con ${
                      agents.find((a) => a.id === agentSelected)?.category ??
                      "Agente"
                    }`
                  : "Chat"}
              </h2>
            )}
          </div>
          <ChatWindow messages={messages} />
          <ChatInput onSend={handleSend} />
        </>
      ) : (
        <section className={styles.catalog}>
          <h2>Elige tu agente</h2>
          <AgentsCatalog
            onStartChat={handleStartChat}
            agents={agents}
            setAgentSelected={setAgentSelected}
          />
        </section>
      )}
    </main>
  );
}
