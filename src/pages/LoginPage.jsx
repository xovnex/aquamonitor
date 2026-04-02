// ============================================================
// LoginPage.jsx – Página de autenticación con JWT simulado
// ============================================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Droplets, User, Lock, Eye, EyeOff, Wifi } from "lucide-react";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: "", contrasena: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.usuario, form.contrasena);
    if (ok) navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-grid"
      style={{ background: "#060d1a" }}
    >
      {/* Orbs decorativos */}
      <div
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #1eb8f0, transparent)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #0878a8, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-wave"
            style={{
              background: "linear-gradient(135deg, #1eb8f0, #0878a8)",
              boxShadow: "0 0 32px rgba(30,184,240,0.5)",
            }}
          >
            <Droplets size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AquaMonitor</h1>
          <p className="text-sm text-white/40 mt-1">Sistema de monitoreo IoT</p>
        </div>

        {/* Card del formulario */}
        <div
          className="glass-card p-7 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="text-lg font-semibold text-white mb-1">
            Iniciar sesión
          </h2>
          <p className="text-xs text-white/35 mb-6">
            Ingresa tus credenciales para acceder
          </p>

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-sm"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <div>
              <label className="stat-label block mb-1.5">Usuario</label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  className="input-field pl-10"
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="stat-label block mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  className="input-field pl-10 pr-10"
                  type={showPass ? "text" : "password"}
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Autenticando...
                </>
              ) : (
                "Ingresar al sistema"
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div
            className="mt-5 px-3 py-2.5 rounded-xl text-center"
            style={{
              background: "rgba(30,184,240,0.06)",
              border: "1px solid rgba(30,184,240,0.12)",
            }}
          >
            <p className="text-xs text-white/40">
              Credenciales de demo:{" "}
              <span className="font-mono text-aqua-400">admin</span> /{" "}
              <span className="font-mono text-aqua-400">1234</span>
            </p>
          </div>

          {/* Link a registro */}
          <div className="mt-3 text-center text-sm">
            <span className="text-white/40">¿No tienes cuenta? </span>
            <Link
              to="/register"
              className="text-aqua-400 font-semibold hover:text-aqua-300 transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>

        {/* Estado conexión */}
        <div className="flex items-center justify-center gap-2 mt-5 text-xs text-white/25">
          <Wifi size={12} />
          <span>Sensor ESP32 · Modo simulación activo</span>
        </div>
      </div>
    </div>
  );
}
