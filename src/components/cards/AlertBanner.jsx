// ============================================================
// AlertBanner.jsx – Alertas inteligentes de consumo
// ============================================================
import { AlertTriangle, Droplets, CheckCircle, Zap, X } from "lucide-react";
import { useState } from "react";

const ALERT_TYPES = {
  ok: {
    Icon: CheckCircle,
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    color: "#34d399",
    title: "Buen trabajo, estás ahorrando agua 💧",
  },
  warning: {
    Icon: Zap,
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    color: "#fbbf24",
    title: "Atención: consumo elevado",
  },
  exceeded: {
    Icon: AlertTriangle,
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    color: "#f87171",
    title: "Alerta: estás excediendo tu consumo diario",
  },
  leak: {
    Icon: Droplets,
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.2)",
    color: "#c084fc",
    title: "🔍 Posible fuga detectada — consumo anormal constante",
  },
};

export default function AlertBanner({
  type = "ok",
  message,
  dismissible = true,
  hidden = false,
  onDismiss,
}) {
  if (hidden) return null;

  const { Icon, bg, border, color, title } = ALERT_TYPES[type];

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-xl animate-fade-up"
      style={{ background: bg, border: `1px solid ${border}` }}
    >
      <Icon size={18} style={{ color, flexShrink: 0, marginTop: 1 }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color }}>
          {title}
        </p>
        {message && <p className="text-xs text-white/50 mt-0.5">{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
