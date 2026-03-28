// ============================================================
// AuthContext.jsx – Contexto global de autenticación
// ============================================================
import { createContext, useContext, useState, useCallback } from "react";
import { loginUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("aqua_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Inicia sesión y guarda token + datos del usuario */
  const login = useCallback(async (usuario, contrasena) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user: userData } = await loginUser(usuario, contrasena);
      localStorage.setItem("aqua_token", token);
      localStorage.setItem("aqua_user", JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Cierra sesión y limpia almacenamiento */
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

/** Hook de acceso al contexto de autenticación */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
