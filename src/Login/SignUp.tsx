import styles from './LogIn.module.css';
import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { appContext } from '../App';

const API = import.meta.env.VITE_API_URL;

export default function SignUp() {

  const [inputData, setInputData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const context = useContext(appContext);
  if (!context) {
    throw new Error("appContext must be used within an AppProvider");
  }
  const { users, setUsers, setUserLoggedIn } = context;

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        createNewUser(event);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [inputData.name, inputData.email, inputData.password]);

  function createNewUser(e: any) {

    e.preventDefault();

    if (inputData.name === '') {
      alert("Enter username");
      return;
    } else if (inputData.name.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    } else if (users.some(user => user.name === inputData.name)) {
      alert("Username already exists");
      return;
    } else if (inputData.email === '') {
      alert("Enter email");
      return;
    } else if (!inputData.email.endsWith('@gmail.com')) {
      alert("Email must end with @gmail.com");
      return;
    } else if (users.some(user => user.email === inputData.email)) {
      alert("Email is already registered");
      return;
    } else if (inputData.password === '') {
      alert("Enter password");
      return;
    } else if (inputData.password !== '' && inputData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    } else {
      fetch(`${API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputData)
      }).then(res => {
        if (!res.ok) throw new Error("Create user failed");
        return res.json();
      }).then((data) => {
        setUsers([...users, data.user]);
        setUserLoggedIn(data.user);
      }).catch(error => {
        console.error('Error creating user:', error);
        alert("Error creating user");
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear Cuenta</h1>
        <form className={styles.form}>
          <input
            type="text"
            placeholder="Nombre"
            className={styles.input}
            value={inputData.name}
            onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
          />
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
          <button className={styles.button} onClick={createNewUser}>
            Registrarme
          </button>
        </form>
        <p className={styles.text}>
          ¿Ya tienes cuenta? <Link className={styles.link} to={'/sign-in'}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
