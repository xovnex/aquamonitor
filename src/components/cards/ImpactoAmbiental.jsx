// ============================================================
// ImpactoAmbiental.jsx – Impacto ambiental del ahorro de agua
// ============================================================
import { Leaf, ShowerHead, Droplets } from "lucide-react";

const EQUIVALENCIAS = {
  duchaPorLitros: 60,
  plantasPorLitros: 5,
  botellaPorLitros: 0.5,
};

export default function ImpactoAmbiental({ ahorro = 0 }) {
  const duchas = Math.floor(ahorro / EQUIVALENCIAS.duchaPorLitros);
  const plantas = Math.floor(ahorro / EQUIVALENCIAS.plantasPorLitros);
  const botellas = Math.floor(ahorro / EQUIVALENCIAS.botellaPorLitros);

  const items = [
    {
      Icon: ShowerHead,
      label: "Duchas ahorradas",
      value: duchas,
      color: "#1eb8f0",
      unit: "duchas",
    },
    {
      Icon: Leaf,
      label: "Plantas regadas",
      value: plantas,
      color: "#10b981",
      unit: "plantas",
    },
    {
      Icon: Droplets,
      label: "Botellas equivalentes",
      value: botellas,
      color: "#8b5cf6",
      unit: "botellas",
    },
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Leaf size={16} className="text-emerald-400" />
        <p className="text-sm font-semibold text-white/80">Impacto Ambiental</p>
        <span className="badge-ok ml-auto">Hoy</span>
      </div>

      {ahorro > 0 ? (
        <>
          <div
            className="px-4 py-3 rounded-xl mb-4 text-center"
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}
          >
            <p className="text-2xl font-bold font-mono text-emerald-400">
              {ahorro} L
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              ahorro respecto al límite
            </p>
          </div>
          <div className="space-y-3">
            {items.map(({ Icon, label, value, color, unit }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${color}18`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/40">{label}</p>
                  <p className="text-sm font-bold font-mono text-white">
                    {value}{" "}
                    <span className="text-xs font-normal text-white/40">
                      {unit}
                    </span>
                  </p>
                </div>
                {/* Mini bar */}
                <div
                  className="w-16 h-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (value / 10) * 100)}%`,
                      background: color,
                      transition: "width 1s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-white/40">Has superado tu límite hoy.</p>
          <p className="text-xs text-white/25 mt-1">
            Reduce tu consumo para ver el impacto positivo 🌍
          </p>
        </div>
      )}
    </div>
  );
}
