import { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import Main from "./Components/Main/Main";
import styles from "./UI.module.css";

const API = import.meta.env.VITE_API_URL;

export default function UI() {

    const [agents, setAgents] = useState<any[]>([]); // Estado para almacenar los agentes

    useEffect(() => {
        // Función para obtener los agentes desde el backend
        fetch(`${API}/agents`)
        .then(response => response.json())
        .then(data => setAgents(data))
        .catch(error => console.error("Error al obtener agentes:", error));
    }, []);

  return (
    <div className={styles.container}>
      <Header />
      <Main agents={agents}/>
    </div>
  );
}
