// ============================================================
// RegisterPage.jsx – Página de registro de usuario
// ============================================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Droplets,
  User,
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
} from "lucide-react";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    usuario: "",
    contrasena: "",
    confirmar: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.contrasena !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (form.contrasena.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);
    // Simulación – reemplazar por llamada real al backend
    await new Promise((res) => setTimeout(res, 1000));

    // Guarda usuario en localStorage (simulado)
    const usuarios = JSON.parse(localStorage.getItem("aqua_usuarios") || "[]");
    const existe = usuarios.find((u) => u.usuario === form.usuario);
    if (existe) {
      setError("Ese nombre de usuario ya está en uso");
      setLoading(false);
      return;
    }

    usuarios.push({
      nombre: form.nombre,
      email: form.email,
      usuario: form.usuario,
      contrasena: form.contrasena,
    });
    localStorage.setItem("aqua_usuarios", JSON.stringify(usuarios));
    setLoading(false);

    // Redirige al login con mensaje de éxito
    navigate("/login?registered=true");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-grid"
      style={{ background: "#060d1a" }}
    >
      {/* Orbs decorativos */}
      <div
        className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #1eb8f0, transparent)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #0878a8, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4 py-8">
        {/* Logo */}
        <div className="text-center mb-6 animate-fade-up">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{
              background: "linear-gradient(135deg, #1eb8f0, #0878a8)",
              boxShadow: "0 0 28px rgba(30,184,240,0.5)",
            }}
          >
            <Droplets size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AquaMonitor</h1>
          <p className="text-sm text-white/40 mt-1">Crea tu cuenta</p>
        </div>

        {/* Card */}
        <div
          className="glass-card p-7 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="text-lg font-semibold text-white mb-1">Registrarse</h2>
          <p className="text-xs text-white/35 mb-5">
            Completa los datos para crear tu cuenta
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

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nombre */}
            <div>
              <label className="stat-label block mb-1.5">Nombre completo</label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  className="input-field pl-10"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="stat-label block mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  className="input-field pl-10"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="juan@email.com"
                  required
                />
              </div>
            </div>

            {/* Usuario */}
            <div>
              <label className="stat-label block mb-1.5">
                Nombre de usuario
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">
                  @
                </span>
                <input
                  className="input-field pl-9"
                  name="usuario"
                  value={form.usuario}
                  onChange={handleChange}
                  placeholder="miusuario"
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

            {/* Confirmar contraseña */}
            <div>
              <label className="stat-label block mb-1.5">
                Confirmar contraseña
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                />
                <input
                  className="input-field pl-10"
                  type="password"
                  name="confirmar"
                  value={form.confirmar}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>
          </form>
        </div>

        {/* Link a login */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
          <ArrowLeft size={13} className="text-white/30" />
          <span className="text-white/40">¿Ya tienes cuenta?</span>
          <Link
            to="/login"
            className="text-aqua-400 font-semibold hover:text-aqua-300 transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
