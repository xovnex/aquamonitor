// ============================================================
// GraficaDiaria.jsx – Gráfica de área con datos reales de la API
// ============================================================
// ============================================================
// GraficaDiaria.jsx – Gráfica de área con datos reales por hora
// ============================================================
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length || payload[0].value === 0) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-white/50 mb-1">{label}</p>
      <p className="font-bold font-mono text-aqua-400">{payload[0].value} L</p>
    </div>
  );
};

export default function GraficaDiaria() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const token = localStorage.getItem("aqua_token");

    // Genera 24 horas todas en 0
    const horas = Array.from({ length: 24 }, (_, i) => ({
      hora: `${String(i).padStart(2, "0")}:00`,
      litros: 0,
    }));

    fetch(`${BASE_URL}/consumo/hoy`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        const horaActual = new Date().getHours();
        // Solo pone el valor en la hora actual, el resto queda en 0
        const dataConLitros = horas.map((h, i) => ({
          ...h,
          litros: i === horaActual && d.litros > 0 ? d.litros : 0,
        }));
        setData(dataConLitros);
      })
      .catch(() => setData(horas))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-6 h-6 border-2 border-aqua-500/30 border-t-aqua-500 rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
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
              allowDecimals={false}
              domain={[0, "auto"]}
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
      )}
    </div>
  );
}
