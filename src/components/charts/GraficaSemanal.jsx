// ============================================================
// GraficaSemanal.jsx – Gráfica de barras consumo semanal
// ============================================================
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const excedido = d.litros > d.limite;
  return (
    <div className="glass-card px-3 py-2 text-xs space-y-1">
      <p className="text-white/50">{label}</p>
      <p
        className="font-bold font-mono"
        style={{ color: excedido ? "#f87171" : "#1eb8f0" }}
      >
        {d.litros} L
      </p>
      <p className="text-white/30">Límite: {d.limite} L</p>
    </div>
  );
};

const CustomBar = (props) => {
  const { x, y, width, height, value, payload } = props;
  const excedido = payload.litros > payload.limite;
  const color = excedido ? "#ef4444" : "#1eb8f0";
  const radius = 6;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={radius}
        ry={radius}
        fill={color}
        fillOpacity={0.85}
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
    </g>
  );
};

// Orden de días de la semana (Lun=0 … Dom=6)
const DAY_ORDER = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Índice del día actual en escala Lun-Dom
function todayDayIndex() {
  return (new Date().getDay() + 6) % 7; // JS: Dom=0 → convertimos a Dom=6
}

export default function GraficaSemanal({ data = [] }) {
  // Filtra días futuros (ej: si hoy es Sáb, oculta Dom)
  const todayIdx = todayDayIndex();
  const filteredData = data.filter((d) => DAY_ORDER.indexOf(d.dia) <= todayIdx);

  // Dominio del eje Y: mínimo 250 para que el límite de 200 L siempre se vea
  const maxLitros = Math.max(250, ...filteredData.map((d) => d.litros || 0));

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-white/80">Consumo semanal</p>
          <p className="text-xs text-white/35 mt-0.5">Últimos 7 días</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-sm inline-block"
              style={{ background: "#1eb8f0" }}
            />
            Normal
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-sm inline-block"
              style={{ background: "#ef4444" }}
            />
            Excedido
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={filteredData}
          margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
          barSize={28}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="dia"
            tick={{ fontSize: 11, fill: "rgba(255,255,255,0.4)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)" }}
            axisLine={false}
            tickLine={false}
            domain={[0, maxLitros]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <ReferenceLine
            y={200}
            stroke="rgba(245,158,11,0.5)"
            strokeDasharray="4 4"
            label={{
              value: "Límite",
              position: "right",
              fontSize: 10,
              fill: "#fbbf24",
            }}
          />
          <Bar dataKey="litros" shape={<CustomBar />} radius={[6, 6, 0, 0]}>
            {filteredData.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.litros > entry.limite ? "#ef4444" : "#1eb8f0"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
