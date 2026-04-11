// ============================================================
// RecuperarPage.jsx – Recuperar contraseña
// ============================================================
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Droplets, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function RecuperarPage() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1); // 1=email, 2=código, 3=nueva contraseña
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [form, setForm] = useState({ nueva: "", confirmar: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleEmail = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/recuperar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail);
        return;
      }
      setPaso(2);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleCodigo = async (e) => {
    e.preventDefault();
    setPaso(3);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.nueva !== form.confirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo, nueva_contrasena: form.nueva }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail);
        return;
      }
      setExito("¡Contraseña actualizada! Redirigiendo...");
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-grid"
      style={{ background: "#060d1a" }}
    >
      <div
        className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #1eb8f0, transparent)" }}
      />

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="text-center mb-8 animate-fade-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, #1eb8f0, #0878a8)",
              boxShadow: "0 0 32px rgba(30,184,240,0.5)",
            }}
          >
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Recuperar contraseña
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {paso === 1 && "Ingresa tu email registrado"}
            {paso === 2 && "Ingresa el código que te enviamos"}
            {paso === 3 && "Crea tu nueva contraseña"}
          </p>
        </div>

        {/* Pasos */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: paso >= p ? "#1eb8f0" : "rgba(255,255,255,0.08)",
                  color: paso >= p ? "white" : "rgba(255,255,255,0.3)",
                }}
              >
                {p}
              </div>
              {p < 3 && (
                <div
                  className="w-8 h-0.5"
                  style={{
                    background: paso > p ? "#1eb8f0" : "rgba(255,255,255,0.08)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          className="glass-card p-7 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
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
          {exito && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-sm"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#34d399",
              }}
            >
              ✅ {exito}
            </div>
          )}

          {/* Paso 1 - Email */}
          {paso === 1 && (
            <form onSubmit={handleEmail} className="space-y-4">
              <div>
                <label className="stat-label block mb-1.5">
                  Email registrado
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    className="input-field pl-10"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@email.com"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar código"
                )}
              </button>
            </form>
          )}

          {/* Paso 2 - Código */}
          {paso === 2 && (
            <form onSubmit={handleCodigo} className="space-y-4">
              <p className="text-xs text-white/50">
                Código enviado a: <span className="text-aqua-400">{email}</span>
              </p>
              <div>
                <label className="stat-label block mb-1.5">
                  Código de 6 dígitos
                </label>
                <input
                  className="input-field text-center text-2xl font-mono tracking-widest"
                  value={codigo}
                  onChange={(e) =>
                    setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={codigo.length !== 6}
                className="btn-primary w-full"
              >
                Continuar
              </button>
            </form>
          )}

          {/* Paso 3 - Nueva contraseña */}
          {paso === 3 && (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="stat-label block mb-1.5">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    className="input-field pl-10 pr-10"
                    type={showPass ? "text" : "password"}
                    value={form.nueva}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, nueva: e.target.value }))
                    }
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
                    value={form.confirmar}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, confirmar: e.target.value }))
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar contraseña"
                )}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm">
          <ArrowLeft size={13} className="text-white/30" />
          <Link
            to="/login"
            className="text-white/40 hover:text-white/60 transition-colors"
          >
            Volver al login
          </Link>
        </div>
      </div>
    </div>
  );
}
