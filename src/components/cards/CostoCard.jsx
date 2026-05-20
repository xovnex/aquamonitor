// ============================================================
// CostoCard.jsx – Costo estimado del día (reemplaza Nivel del tanque)
// ============================================================
import { useEffect, useState } from "react";
import { Coins } from "lucide-react";

const formatSoles = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;

export default function CostoCard({
  costoHoy = 0,
  costoPorLitro = 0.005,
  litros = 0,
  limite = 200,
  excedido = false,
}) {
  const [animated, setAnimated] = useState(0);
  const costoMaximo = limite * costoPorLitro;
  const porcentajeCosto =
    costoMaximo > 0
      ? Math.min(100, Math.round((costoHoy / costoMaximo) * 100))
      : 0;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(porcentajeCosto), 300);
    return () => clearTimeout(t);
  }, [porcentajeCosto]);

  const safeP = Math.min(100, Math.max(0, animated));
  const color = excedido ? "#ef4444" : safeP > 75 ? "#f59e0b" : "#a78bfa";
  const glowColor = excedido
    ? "rgba(239,68,68,0.4)"
    : "rgba(167,139,250,0.4)";

  const costoMensualEstimado = Number((costoHoy * 30).toFixed(2));

  return (
    <div
      className="glass-card p-6 flex flex-col items-center"
      style={{ boxShadow: `0 0 30px ${glowColor}` }}
    >
      <div className="flex items-center gap-2 mb-4 self-start w-full">
        <Coins size={16} style={{ color }} />
        <p className="stat-label mb-0">Costo estimado hoy</p>
      </div>

      <div className="relative w-40 h-40 mb-5">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="68"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="12"
          />
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
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          <span
            className="text-2xl font-bold font-mono leading-tight"
            style={{ color }}
          >
            {formatSoles(costoHoy)}
          </span>
          <span className="text-[10px] text-white/40 mt-0.5">hoy</span>
        </div>
      </div>

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

      <div className="flex justify-between w-full text-xs text-white/40 mb-1">
        <span className="font-mono">
          {litros} L × {costoPorLitro}
        </span>
        <span className="font-mono">Tope: {formatSoles(costoMaximo)}</span>
      </div>

      <p className="text-[10px] text-white/30 w-full text-center mb-3">
        Tarifa configurada en soles por litro
      </p>

      <div
        className="w-full py-2 px-4 rounded-xl text-center text-sm font-semibold mb-2"
        style={{
          background: excedido
            ? "rgba(239,68,68,0.12)"
            : "rgba(167,139,250,0.12)",
          color: excedido ? "#f87171" : "#c4b5fd",
          border: `1px solid ${excedido ? "rgba(239,68,68,0.2)" : "rgba(167,139,250,0.2)"}`,
        }}
      >
        {excedido
          ? "⚠️ Gasto por encima de tu límite diario"
          : safeP > 75
            ? "⚡ Casi al tope de gasto del día"
            : "✅ Gasto dentro de lo esperado"}
      </div>

      <div
        className="w-full px-3 py-2 rounded-lg text-xs text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-white/35">Si sigues así este mes: </span>
        <span className="font-mono text-white/60">
          ~{formatSoles(costoMensualEstimado)}
        </span>
      </div>
    </div>
  );
}
