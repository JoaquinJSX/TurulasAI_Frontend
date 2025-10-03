import styles from "./AgentsCatalog.module.css";

interface Props {
  onStartChat: (agent: any) => void;
  agents: any[];
  setAgentSelected: (id: string | null) => void;
}

export default function AgentsCatalog({ onStartChat, agents, setAgentSelected }: Props) {
  const categoryNames: Record<string, string> = {
    productivity: "Productividad",
    finance: "Finanzas",
    fitness: "Fitness",
    learning: "Aprendizaje",
  };

  const categoryDescriptions: Record<string, string> = {
    productivity: "Organiza tareas, gestiona tu tiempo y aumenta tu productividad diaria.",
    finance: "Controla tus gastos y recibe consejos financieros personalizados.",
    fitness: "Rutinas, seguimiento de progreso y hábitos saludables.",
    learning: "Apoyo al aprendizaje con recursos y recomendaciones.",
  };

  return (
    <div className={styles.cards}>
      {agents.map((a) => (
        <div key={a.id} className={styles.card}>
          <h3>{categoryNames[a.category] ?? a.category}</h3>
          <p>{categoryDescriptions[a.category] ?? a.description ?? "Agente sin descripción."}</p>
          <div className={styles.actions}>
            <button
              className={styles.chatBtn}
              onClick={() => {
                onStartChat(a);
                if (a.id) setAgentSelected(a.id);
              }}
            >
              Ir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
