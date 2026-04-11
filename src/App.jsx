// ============================================================
// App.jsx – Rutas y providers globales
// ============================================================
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerificarPage from "./pages/VerificarPage";
import RecuperarPage from "./pages/RecuperarPage";
import DashboardPage from "./pages/DashboardPage";
import HistorialPage from "./pages/HistorialPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verificar" element={<VerificarPage />} />
          <Route path="/recuperar" element={<RecuperarPage />} />

          {/* Rutas protegidas */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/historial" element={<HistorialPage />} />
            <Route path="/configuracion" element={<ConfiguracionPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
