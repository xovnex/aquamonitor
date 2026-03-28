// ============================================================
// GraficaCircular.jsx – Donut chart consumo vs límite
// ============================================================
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="font-bold" style={{ color: payload[0].payload.color }}>
        {payload[0].name}
      </p>
      <p className="font-mono text-white">{payload[0].value} L</p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function GraficaCircular({ litros = 0, limite = 200 }) {
  const consumido = Math.min(litros, limite);
  const restante = Math.max(0, limite - litros);
  const excedido = litros > limite;

  const data = excedido
    ? [
        { name: "Consumido", value: limite, color: "#ef4444" },
        { name: "Excedente", value: litros - limite, color: "#f87171" },
      ]
    : [
        { name: "Consumido", value: consumido, color: "#1eb8f0" },
        {
          name: "Disponible",
          value: restante,
          color: "rgba(255,255,255,0.06)",
        },
      ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-white/80">
            Consumo vs Límite
          </p>
          <p className="text-xs text-white/35 mt-0.5">Distribución del día</p>
        </div>
        <span className={excedido ? "badge-alert" : "badge-ok"}>
          {excedido ? "Excedido" : "OK"}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={76}
            paddingAngle={excedido ? 0 : 3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, idx) => (
              <Cell
                key={idx}
                fill={entry.color}
                style={{
                  filter:
                    idx === 0
                      ? `drop-shadow(0 0 8px ${entry.color}80)`
                      : "none",
                  outline: "none",
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Leyenda */}
      <div className="flex justify-center gap-4 text-xs">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: d.color }}
            />
            <span className="text-white/50">
              {d.name} —{" "}
              <span className="font-mono text-white/70">{d.value}L</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
