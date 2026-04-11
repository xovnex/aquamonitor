// ============================================================
// VerificarPage.jsx – Verificación de email con código
// ============================================================
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Droplets, Mail, ArrowLeft } from "lucide-react";

export default function VerificarPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reenviando, setReenviando] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleVerificar = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Código incorrecto");
        return;
      }
      localStorage.setItem("aqua_token", data.token);
      localStorage.setItem("aqua_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleReenviar = async () => {
    setReenviando(true);
    try {
      await fetch(`${BASE_URL}/auth/reenviar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setReenviado(true);
      setTimeout(() => setReenviado(false), 30000);
    } finally {
      setReenviando(false);
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
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-up">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, #1eb8f0, #0878a8)",
              boxShadow: "0 0 32px rgba(30,184,240,0.5)",
            }}
          >
            <Mail size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Verifica tu cuenta</h1>
          <p className="text-sm text-white/40 mt-1">
            Revisa tu bandeja de entrada
          </p>
        </div>

        {/* Card */}
        <div
          className="glass-card p-7 animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <p className="text-sm text-white/60 mb-1">Enviamos un código a:</p>
          <p className="text-sm font-semibold text-aqua-400 mb-5">{email}</p>

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

          {reenviado && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-sm"
              style={{
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#34d399",
              }}
            >
              ✅ Código reenviado, revisa tu email
            </div>
          )}

          <form onSubmit={handleVerificar} className="space-y-4">
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
              disabled={loading || codigo.length !== 6}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar cuenta"
              )}
            </button>
          </form>

          {/* Reenviar */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/40 mb-2">¿No llegó el código?</p>
            <button
              onClick={handleReenviar}
              disabled={reenviando || reenviado}
              className="text-xs text-aqua-400 hover:text-aqua-300 transition-colors font-semibold"
            >
              {reenviando
                ? "Reenviando..."
                : reenviado
                  ? "Reenviado ✅"
                  : "Reenviar código"}
            </button>
          </div>
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
} // ============================================================
