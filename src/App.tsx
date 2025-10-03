import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { createContext, useMemo, useContext } from "react";

import LandingPage from "./Landing/Landing";
import SignIn from "./Login/SignIn";
import SignUp from "./Login/SignUp";
import UI from "./UI/UI";
import { useEffect, useState } from "react";

type UserLoggedIn = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type AppContextType = {
  userLoggedIn: UserLoggedIn | null;
  setUserLoggedIn: React.Dispatch<React.SetStateAction<UserLoggedIn | null>>;
  users: UserLoggedIn[];
  setUsers: React.Dispatch<React.SetStateAction<UserLoggedIn[]>>;
};

export const appContext = createContext<AppContextType | undefined>(undefined);

function useAppCtx() {
  const ctx = useContext(appContext);
  if (!ctx) throw new Error("appContext must be used within its Provider");
  return ctx;
}

function RequireAuth() {
  const { userLoggedIn, users } = useAppCtx();
  const noUsers = !users || users.length === 0;
  return userLoggedIn && !noUsers ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

function RedirectIfAuth() {
  const { userLoggedIn, users } = useAppCtx();
  const noUsers = !users || users.length === 0;
  return userLoggedIn && !noUsers ? <Navigate to="/main" replace /> : <Outlet />;
}

export default function App() {

  const API = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState<any[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState<UserLoggedIn | null>(() => {
    const stored = localStorage.getItem("userLoggedIn");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    fetch(`${API}/users`)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (userLoggedIn) {
      localStorage.setItem("userLoggedIn", JSON.stringify(userLoggedIn));
    } else {
      localStorage.removeItem("userLoggedIn");
    }
  }, [userLoggedIn]);

  const contextValue = useMemo<AppContextType>(
    () => ({ userLoggedIn, setUserLoggedIn, users, setUsers }),
    [userLoggedIn, users]
  );

  return (
    <div>
      <appContext.Provider value={contextValue}>
          <BrowserRouter>
            <Routes>
              {/* Redirección base: que caiga siempre en main_content;
                  si no está logueado, RequireAuth ya lo manda a /login */}
              <Route path="/" element={<LandingPage />} />

              {/* Rutas públicas: si ya está logueado, lo mandamos a /main_content */}
              <Route element={<RedirectIfAuth />}>
                <Route
                  path="/sign-in"
                  element={<SignIn />}
                />
                <Route
                  path="/sign-up"
                  element={<SignUp />}
                />
              </Route>

              {/* Rutas protegidas */}
              <Route element={<RequireAuth />}>
                <Route path="/main" element={<UI />} />
              </Route>

              {/* 404 simple */}
              <Route path="*" element={<Navigate to="/main" replace />} />
            </Routes>
          </BrowserRouter>
        </appContext.Provider>
    </div >
  );
}