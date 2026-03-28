// ============================================================
// StatCard.jsx – Tarjeta de métrica reutilizable
// ============================================================

export default function StatCard({
  label,
  value,
  unit,
  Icon,
  color = "aqua",
  badge,
  sublabel,
  delay = 0,
}) {
  const colorMap = {
    aqua: {
      accent: "#1eb8f0",
      bg: "rgba(30,184,240,0.1)",
      border: "rgba(30,184,240,0.2)",
      glow: "0 0 20px rgba(30,184,240,0.2)",
    },
    green: {
      accent: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      border: "rgba(16,185,129,0.2)",
      glow: "0 0 20px rgba(16,185,129,0.2)",
    },
    red: {
      accent: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.2)",
      glow: "0 0 20px rgba(239,68,68,0.2)",
    },
    amber: {
      accent: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)",
      glow: "0 0 20px rgba(245,158,11,0.2)",
    },
  };
  const c = colorMap[color] || colorMap.aqua;

  return (
    <div
      className="glass-card-hover p-5 animate-fade-up"
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
        boxShadow: c.glow,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          {Icon && <Icon size={18} style={{ color: c.accent }} />}
        </div>
        {badge}
      </div>

      <p className="stat-label mb-1">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="stat-value" style={{ color: c.accent }}>
          {value ?? "—"}
        </span>
        {unit && (
          <span className="text-sm text-white/40 font-medium">{unit}</span>
        )}
      </div>
      {sublabel && <p className="text-xs text-white/35 mt-1.5">{sublabel}</p>}
    </div>
  );
}
