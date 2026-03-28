// ============================================================
// GraficaDiaria.jsx – Gráfica de línea de consumo diario (24h)
// ============================================================
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";

// Simula lectura horaria del sensor
const HORAS = Array.from({ length: 24 }, (_, i) => {
  const base =
    i < 6
      ? 2
      : i < 9
        ? 18
        : i < 12
          ? 12
          : i < 14
            ? 15
            : i < 18
              ? 10
              : i < 21
                ? 14
                : 6;
  const noise = Math.random() * 4 - 2;
  return {
    hora: `${String(i).padStart(2, "0")}:00`,
    litros: Math.max(0, Math.round(base + noise)),
  };
});

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="font-bold font-mono text-aqua-400">{payload[0].value} L</p>
    </div>
  );
};

export default function GraficaDiaria({ limite = 200 }) {
  const maxHora = Math.max(...HORAS.map((h) => h.litros));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white/80">
            Consumo por hora
          </p>
          <p className="text-xs text-white/35 mt-0.5">Lectura del sensor hoy</p>
        </div>
        <span className="badge-ok">En tiempo real</span>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart
          data={HORAS}
          margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
        >
          <defs>
            <linearGradient id="colorLitros" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1eb8f0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1eb8f0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="hora"
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="litros"
            stroke="#1eb8f0"
            strokeWidth={2}
            fill="url(#colorLitros)"
            dot={false}
            activeDot={{ r: 4, fill: "#1eb8f0", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
