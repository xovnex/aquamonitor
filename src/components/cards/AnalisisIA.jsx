// ============================================================
// AnalisisIA.jsx – Análisis inteligente con OpenAI
// ============================================================
import { useState } from "react";
import {
  Sparkles,
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function AnalisisIA() {
  const [analisis, setAnalisis] = useState(null);
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleAnalizar = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("aqua_token");
      const res = await fetch(`${BASE_URL}/analisis/semanal`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al analizar");
      setAnalisis(data.analisis);
      setDatos(data.datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-card p-6 animate-fade-up"
      style={{
        border: "1px solid rgba(168,85,247,0.2)",
        boxShadow: "0 0 30px rgba(168,85,247,0.08)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.25)",
            }}
          >
            <Brain size={18} style={{ color: "#c084fc" }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">
              Análisis inteligente
            </p>
            <p className="text-xs text-white/35 mt-0.5">
              Powered by OpenAI GPT
            </p>
          </div>
        </div>
        {analisis && (
          <button
            onClick={handleAnalizar}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: "rgba(168,85,247,0.1)",
              color: "#c084fc",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
        )}
      </div>

      {/* Estado inicial — sin analizar */}
      {!analisis && !loading && !error && (
        <div className="text-center py-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <Sparkles size={28} style={{ color: "#c084fc" }} />
          </div>
          <p className="text-white/60 text-sm mb-1">
            ¿Cómo va tu consumo esta semana?
          </p>
          <p className="text-white/35 text-xs mb-5">
            La IA analizará tus datos y te dará recomendaciones personalizadas
          </p>
          <button
            onClick={handleAnalizar}
            className="btn-primary flex items-center gap-2 mx-auto"
            style={{
              background: "linear-gradient(135deg, #a855f7, #7c3aed)",
              boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
            }}
          >
            <Brain size={16} />
            Analizar mi consumo con IA 🤖
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                border: "2px solid rgba(168,85,247,0.2)",
                borderTop: "2px solid #c084fc",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={20} style={{ color: "#c084fc" }} />
            </div>
          </div>
          <p className="text-white/60 text-sm">Analizando tu consumo...</p>
          <p className="text-white/30 text-xs mt-1">
            La IA está procesando tus datos
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-4"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={16} style={{ color: "#f87171" }} />
          <p className="text-sm" style={{ color: "#f87171" }}>
            {error}
          </p>
        </div>
      )}

      {/* Resultado */}
      {analisis && datos && !loading && (
        <div className="space-y-4">
          {/* Mini stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Total semana",
                value: `${datos.total} L`,
                color: "#c084fc",
              },
              {
                label: "Promedio diario",
                value: `${datos.promedio} L`,
                color: "#60a5fa",
              },
              {
                label: "Día más alto",
                value: datos.max_dia.dia,
                sub: `${datos.max_dia.litros} L`,
                color: "#f87171",
                Icon: TrendingUp,
              },
              {
                label: "Días excedidos",
                value: datos.dias_excedidos,
                sub: `de 7 días`,
                color: datos.dias_excedidos > 0 ? "#f87171" : "#34d399",
              },
            ].map(({ label, value, sub, color, Icon }) => (
              <div
                key={label}
                className="px-3 py-2.5 rounded-xl text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <p className="stat-label mb-1">{label}</p>
                <p className="text-sm font-bold font-mono" style={{ color }}>
                  {value}
                </p>
                {sub && <p className="text-xs text-white/30 mt-0.5">{sub}</p>}
              </div>
            ))}
          </div>

          {/* Análisis de la IA */}
          <div
            className="px-5 py-4 rounded-xl relative overflow-hidden"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            {/* Icono decorativo */}
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(168,85,247,0.2)" }}
              >
                <Sparkles size={14} style={{ color: "#c084fc" }} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold mb-2"
                  style={{ color: "#c084fc" }}
                >
                  Análisis de tu consumo semanal
                </p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {analisis}
                </p>
              </div>
            </div>
          </div>

          {/* Botón volver a analizar */}
          <button
            onClick={handleAnalizar}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2"
            style={{
              background: "rgba(168,85,247,0.1)",
              color: "#c084fc",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <Brain size={14} />
            Volver a analizar
          </button>
        </div>
      )}
    </div>
  );
}
