import styles from './Landing.module.css';

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <h1>🚀 TurulasAI</h1>
        <p className={styles.subtitle}>
          Tu marketplace de agentes de IA personalizados.  
          Descubre el futuro de la productividad, el aprendizaje y las finanzas.
        </p>
        <div className={styles.buttons}>
          <a href="/#signin" className={styles.btnPrimary}>Sign In</a>
          <a href="/#signup" className={styles.btnSecondary}>Sign Up</a>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>✨ Características del MVP</h2>
        <ul>
          <li>🔹 Catálogo de agentes IA listos para usar.</li>
          <li>🔹 Chats personalizados con memoria por usuario.</li>
          <li>🔹 Clasificación por categorías: productividad, finanzas, fitness y aprendizaje.</li>
          <li>🔹 Backend sólido con PostgreSQL + API lista para escalar.</li>
        </ul>
      </section>

      {/* Coming Soon Section */}
      <section className={styles.comingSoon}>
        <h2>🚧 Y esto es solo el inicio...</h2>
        <p>
          Estamos construyendo mucho más:  
          integraciones avanzadas, suscripciones, métricas de uso y un ecosistema completo de agentes inteligentes.
        </p>
      </section>
    </div>
  );
}
