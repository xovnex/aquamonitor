// ============================================================
// AuthContext.jsx – Contexto global de autenticación
// ============================================================
import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("aqua_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (usuario, contrasena) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/login`, {
        usuario,
        contrasena,
      });
      localStorage.setItem("aqua_token", data.token);
      localStorage.setItem("aqua_user", JSON.stringify(data.user));
      setUser(data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Credenciales incorrectas");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("aqua_token");
    localStorage.removeItem("aqua_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
