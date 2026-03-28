// ============================================================
// Header.jsx – Barra superior del dashboard
// ============================================================
import { RefreshCw, Bell, Clock } from "lucide-react";

export default function Header({
  title,
  lastUpdate,
  onRefresh,
  loading,
  alertCount = 0,
}) {
  const formatTime = (date) =>
    date?.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  return (
    <header
      className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
      style={{
        background: "rgba(6,13,26,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(30,184,240,0.08)",
      }}
    >
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {lastUpdate && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock size={11} className="text-white/30" />
            <span className="text-xs text-white/30">
              Actualizado {formatTime(lastUpdate)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl glass-card text-white/50 hover:text-white transition-colors">
          <Bell size={16} />
          {alertCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ background: "#ef4444", fontSize: "10px" }}
            >
              {alertCount}
            </span>
          )}
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-aqua-400 transition-all"
          style={{
            background: "rgba(30,184,240,0.1)",
            border: "1px solid rgba(30,184,240,0.2)",
          }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Actualizar</span>
        </button>
      </div>
    </header>
  );
}
