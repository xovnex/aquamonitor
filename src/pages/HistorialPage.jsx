// ============================================================
// HistorialPage.jsx – Historial de consumos diarios
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, TrendingUp, TrendingDown, Filter, Coins } from "lucide-react";
import { useWaterData } from "../hooks/useWaterData";
import Header from "../components/layout/Header";
import { formatLitros, formatSoles } from "../utils/format";

const ESTADO_CONFIG = {
  normal: { label: "Normal", badge: "badge-ok" },
  excedido: { label: "Excedido", badge: "badge-alert" },
};

const costoDelDia = (item, tarifa) =>
  item.costo ?? Number((item.litros * tarifa).toFixed(2));

export default function HistorialPage() {
  const { data, loading, lastUpdate, refetch } = useWaterData();
  const { historial, costoPorLitroHistorial } = data;
  const [filtro, setFiltro] = useState("todos");

  const tarifa = costoPorLitroHistorial ?? 0.005;

  const filtrados =
    filtro === "todos"
      ? historial
      : historial.filter((h) => h.estado === filtro);

  const totalLitros = historial.reduce((acc, h) => acc + h.litros, 0);
  const totalCosto = historial.reduce(
    (acc, h) => acc + costoDelDia(h, tarifa),
    0,
  );
  const promedioDiario = historial.length
    ? Number((totalLitros / historial.length).toFixed(2))
    : 0;
  const promedioCosto = historial.length
    ? Number((totalCosto / historial.length).toFixed(2))
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

      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total acumulado",
              value: formatLitros(totalLitros),
              color: "#1eb8f0",
            },
            {
              label: "Costo total",
              value: formatSoles(totalCosto),
              color: "#a78bfa",
            },
            {
              label: "Promedio diario",
              value: formatLitros(promedioDiario),
              sub: formatSoles(promedioCosto),
              color: "#10b981",
            },
            {
              label: "Días excedidos",
              value: diasExcedidos,
              color: diasExcedidos > 5 ? "#ef4444" : "#fbbf24",
            },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="glass-card p-4 text-center">
              <p className="stat-label mb-1">{label}</p>
              <p className="text-xl font-bold font-mono" style={{ color }}>
                {value}
              </p>
              {sub && (
                <p className="text-xs font-mono text-white/35 mt-1">{sub}</p>
              )}
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs flex-wrap"
          style={{
            background: "rgba(167,139,250,0.06)",
            border: "1px solid rgba(167,139,250,0.12)",
          }}
        >
          <Coins size={14} className="text-purple-300 flex-shrink-0" />
          <span className="text-white/50">
            Tarifa actual:{" "}
            <span className="font-mono text-purple-200">{tarifa} S/L</span>
          </span>
          <Link
            to="/configuracion"
            className="ml-auto text-purple-300 hover:text-purple-200 transition-colors"
          >
            Cambiar en Configuración →
          </Link>
        </div>

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

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {[
                    "#",
                    "Fecha",
                    "Consumo",
                    "Límite",
                    "Ahorro",
                    "Costo del día",
                    "Estado",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left stat-label">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item, idx) => {
                  const { badge, label } =
                    ESTADO_CONFIG[item.estado] || ESTADO_CONFIG.normal;
                  const pct = Math.round((item.litros / item.limite) * 100);
                  const costo = costoDelDia(item, tarifa);

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
                            {formatLitros(item.litros)}
                          </span>
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
                                {formatLitros(item.ahorro)}
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
                        <span className="text-sm font-bold font-mono text-purple-300">
                          {formatSoles(costo)}
                        </span>
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
