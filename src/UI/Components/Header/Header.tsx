import { useState, useContext } from "react";
import { appContext } from "../../../App";
import styles from "./Header.module.css";

const API = import.meta.env.VITE_API_URL;

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const context = useContext(appContext);
    if (!context || !context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { userLoggedIn, setUserLoggedIn, setUsers } = context;

    const handleLogout = () => {
        setUserLoggedIn(null);
    };

    const handleDeleteAccount = async () => {
        try {
            await fetch(`${API}/users/${userLoggedIn?.id}`, { method: "DELETE" });
            setUsers((prev) => prev.filter(user => user.id !== userLoggedIn?.id));
            setUserLoggedIn(null);
        } catch (err) {
            console.error("Error al eliminar cuenta", err);
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>✨ TurulasAI</div>
            <div className={styles.user}>
                <span>Hola, {userLoggedIn?.name}</span>
                <div className={styles.menuWrapper}>
                    <button
                        className={styles.settingsBtn}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        ⚙
                    </button>
                    {menuOpen && (
                        <div className={styles.dropdown}>
                            <button onClick={handleLogout}>Cerrar sesión</button>
                            <button onClick={handleDeleteAccount}>Eliminar cuenta</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
