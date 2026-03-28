// ============================================================
// GraficaMensual.jsx – Gráfica de área histórico mensual
// ============================================================
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  const limite = payload[0].payload.limite;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1">
      <p className="text-white/50">{label}</p>
      <p
        className="font-bold font-mono"
        style={{ color: v > limite ? "#f87171" : "#1eb8f0" }}
      >
        {v} L
      </p>
      <p className="text-white/30">Límite: {limite} L</p>
    </div>
  );
};

export default function GraficaMensual({ data = [] }) {
  // Formatear fechas para label corto
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.fecha).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white/80">
            Histórico mensual
          </p>
          <p className="text-xs text-white/35 mt-0.5">Últimos 30 días</p>
        </div>
        <span className="badge-warn">30d</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={formatted}
          margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
        >
          <defs>
            <linearGradient id="gradMensual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1eb8f0" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#1eb8f0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={200}
            stroke="rgba(245,158,11,0.4)"
            strokeDasharray="4 4"
          />
          <Area
            type="monotone"
            dataKey="litros"
            stroke="#1eb8f0"
            strokeWidth={2}
            fill="url(#gradMensual)"
            dot={false}
            activeDot={{ r: 4, fill: "#1eb8f0", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
