import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { appContext } from '../App';
import styles from './LogIn.module.css';

export default function SignIn() {

  const [inputData, setInputData] = useState({
    email: '',
    password: ''
  });

    const context = useContext(appContext);
    if (!context) {
        throw new Error("appContext must be used within an AppProvider");
    }
    const { users, setUserLoggedIn } = context;

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                signIn(event);
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [inputData.email, inputData.password]);


    function signIn(e: any) {

        e.preventDefault();

        let userIndex = 0;

        if (inputData.email?.length === 0) {
            alert("Enter email");
        } else if (!inputData.email.endsWith('@gmail.com')) {
            alert("Enter a valid email");
        } else if (users.length == 0 || users.length === undefined) {
            alert("User not found");
        } else {
            for (const i in users) {
                if (users[i].email !== inputData.email) {
                    userIndex++;
                    if (userIndex === users.length) {
                        alert("User not found");
                    }
                } else {
                    if (inputData.password.length === 0) {
                        alert("Enter password");
                    } else if (users[userIndex].password !== inputData.password) {
                        alert("Incorrect password");
                    } else {
                        setUserLoggedIn(users[userIndex]);
                    }
                }
            }
        }
    }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <form className={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className={styles.input}
            value={inputData.email}
            onChange={(e) => setInputData({ ...inputData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            className={styles.input}
            value={inputData.password}
            onChange={(e) => setInputData({ ...inputData, password: e.target.value })}
          />
          <button className={styles.button} onClick={signIn}>
            Ingresar
          </button>
        </form>
        <p className={styles.text}>
          ¿No tienes cuenta? <Link className={styles.link} to={'/sign-up'}>Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
