// ============================================================
// HistorialPage.jsx – Historial de consumos diarios
// ============================================================
import { useState } from "react";
import { Calendar, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { useWaterData } from "../hooks/useWaterData";
import Header from "../components/layout/Header";

const ESTADO_CONFIG = {
  normal: { label: "Normal", badge: "badge-ok" },
  excedido: { label: "Excedido", badge: "badge-alert" },
};

export default function HistorialPage() {
  const { data, loading, lastUpdate, refetch } = useWaterData();
  const { historial } = data;
  const [filtro, setFiltro] = useState("todos");

  const filtrados =
    filtro === "todos"
      ? historial
      : historial.filter((h) => h.estado === filtro);

  const totalLitros = historial.reduce((acc, h) => acc + h.litros, 0);
  const promedioDiario = historial.length
    ? Math.round(totalLitros / historial.length)
    : 0;
  const diasExcedidos = historial.filter((h) => h.estado === "excedido").length;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header
        title="Historial"
        lastUpdate={lastUpdate}
        onRefresh={refetch}
        loading={loading}
      />

      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-5">
        {/* Resumen */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Total acumulado",
              value: `${totalLitros} L`,
              color: "#1eb8f0",
            },
            {
              label: "Promedio diario",
              value: `${promedioDiario} L`,
              color: "#10b981",
            },
            {
              label: "Días excedidos",
              value: diasExcedidos,
              color: diasExcedidos > 5 ? "#ef4444" : "#fbbf24",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card p-4 text-center">
              <p className="stat-label mb-1">{label}</p>
              <p className="text-xl font-bold font-mono" style={{ color }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={14} className="text-white/40" />
          {["todos", "normal", "excedido"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
              style={{
                background:
                  filtro === f
                    ? "rgba(30,184,240,0.15)"
                    : "rgba(255,255,255,0.05)",
                color: filtro === f ? "#48d7ff" : "rgba(255,255,255,0.4)",
                border: `1px solid ${filtro === f ? "rgba(30,184,240,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-white/30">
            {filtrados.length} registros
          </span>
        </div>

        {/* Tabla */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {["#", "Fecha", "Consumo", "Límite", "Ahorro", "Estado"].map(
                    (h) => (
                      <th key={h} className="px-5 py-3.5 text-left stat-label">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item, idx) => {
                  const { badge, label } =
                    ESTADO_CONFIG[item.estado] || ESTADO_CONFIG.normal;
                  const pct = Math.round((item.litros / item.limite) * 100);
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors"
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        animationDelay: `${idx * 30}ms`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td className="px-5 py-3.5 text-xs text-white/25 font-mono">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Calendar
                            size={12}
                            className="text-white/30 flex-shrink-0"
                          />
                          <span className="text-sm text-white/70 font-mono">
                            {item.fecha}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-sm font-bold font-mono"
                            style={{
                              color:
                                item.estado === "excedido"
                                  ? "#f87171"
                                  : "#48d7ff",
                            }}
                          >
                            {item.litros} L
                          </span>
                          {/* Mini progreso */}
                          <div
                            className="w-16 h-1.5 rounded-full hidden sm:block"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(100, pct)}%`,
                                background:
                                  item.estado === "excedido"
                                    ? "#ef4444"
                                    : "#1eb8f0",
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-white/40 font-mono">
                        {item.limite} L
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          {item.ahorro > 0 ? (
                            <>
                              <TrendingDown
                                size={12}
                                className="text-emerald-400"
                              />
                              <span className="text-sm font-mono text-emerald-400">
                                {item.ahorro} L
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingUp size={12} className="text-red-400" />
                              <span className="text-sm font-mono text-red-400">
                                —
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={badge}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
