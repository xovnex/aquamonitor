// ============================================================
// WaterGauge.jsx – Indicador visual tipo tanque de agua
// ============================================================
import { useEffect, useState } from "react";

export default function WaterGauge({
  porcentaje = 0,
  litros = 0,
  limite = 200,
  excedido = false,
}) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(porcentaje), 300);
    return () => clearTimeout(t);
  }, [porcentaje]);

  const safeP = Math.min(100, Math.max(0, animated));
  const color = excedido ? "#ef4444" : safeP > 75 ? "#f59e0b" : "#1eb8f0";
  const glowColor = excedido ? "rgba(239,68,68,0.4)" : "rgba(30,184,240,0.4)";

  // SVG wave path
  const waveOffset = 100 - safeP;

  return (
    <div
      className="glass-card p-6 flex flex-col items-center"
      style={{ boxShadow: `0 0 30px ${glowColor}` }}
    >
      <p className="stat-label mb-4 self-start">Nivel del tanque</p>

      {/* Gauge circular + tanque */}
      <div className="relative w-40 h-40 mb-5">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
          />
          {/* Progress */}
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 68}`}
            strokeDashoffset={`${2 * Math.PI * 68 * (1 - safeP / 100)}`}
            style={{
              transition:
                "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease",
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold font-mono" style={{ color }}>
            {safeP}%
          </span>
          <span className="text-xs text-white/40 mt-0.5">consumido</span>
        </div>
      </div>

      {/* Bar de agua */}
      <div
        className="w-full h-3 rounded-full mb-3"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${safeP}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 10px ${color}`,
            transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      <div className="flex justify-between w-full text-xs text-white/40">
        <span className="font-mono">{litros} L</span>
        <span className="font-mono">Límite: {limite} L</span>
      </div>

      {/* Estado */}
      <div
        className="mt-4 w-full py-2 px-4 rounded-xl text-center text-sm font-semibold"
        style={{
          background: excedido
            ? "rgba(239,68,68,0.12)"
            : "rgba(16,185,129,0.12)",
          color: excedido ? "#f87171" : "#34d399",
          border: `1px solid ${excedido ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
        }}
      >
        {excedido
          ? "⚠️ Límite excedido"
          : safeP > 75
            ? "⚡ Alto consumo"
            : "✅ Consumo normal"}
      </div>
    </div>
  );
}
