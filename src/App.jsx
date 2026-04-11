// ============================================================
// App.jsx – Rutas y providers globales
// ============================================================
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// ✅ Lazy imports — cada página carga solo cuando se necesita
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const VerificarPage = lazy(() => import("./pages/VerificarPage"));
const RecuperarPage = lazy(() => import("./pages/RecuperarPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HistorialPage = lazy(() => import("./pages/HistorialPage"));
const ConfiguracionPage = lazy(() => import("./pages/ConfiguracionPage"));

// Fallback mientras carga la página
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <span>Cargando...</span>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
