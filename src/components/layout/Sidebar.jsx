// ============================================================
// Sidebar.jsx – Navegación lateral (desktop estático, móvil drawer)
// ============================================================
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Droplets,
  Wifi,
  ChevronRight,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { path: "/historial", label: "Historial", Icon: History },
  { path: "/configuracion", label: "Configuración", Icon: Settings },
];

export default function Sidebar({ onClose }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  return (
    <aside
      className="flex flex-col h-screen"
      style={{
        width: 240,
        minWidth: 240,
        background: "linear-gradient(180deg, #0a1628 0%, #060d1a 100%)",
        borderRight: "1px solid rgba(30,184,240,0.1)",
      }}
    >
      {/* ── Header del sidebar ── */}
      <div
        className="flex items-center justify-between px-5 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #1eb8f0, #0878a8)",
              boxShadow: "0 0 20px rgba(30,184,240,0.4)",
            }}
          >
            <Droplets size={18} color="white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">
              AquaMonitor
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Sistema IoT
            </p>
          </div>
        </div>

        {/* Botón X – solo visible en móvil */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.5)",
          }}
          aria-label="Cerrar menú"
        >
          <X size={15} />
        </button>
      </div>

      {/* ── Estado del sensor ── */}
      <div
        className="mx-3 my-3 px-3 py-2.5 rounded-xl"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.15)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse-dot"
            style={{ background: "#34d399", boxShadow: "0 0 6px #34d399" }}
          />
          <Wifi size={12} color="#34d399" />
          <span className="text-xs font-medium" style={{ color: "#34d399" }}>
            Sensor en línea
          </span>
        </div>
        <p
          className="text-xs mt-0.5 font-mono"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          ESP32-001
        </p>
      </div>

      {/* ── Navegación ── */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink key={path} to={path} onClick={onClose}>
              <div
                className="nav-item"
                style={
                  isActive
                    ? {
                        background: "rgba(30,184,240,0.12)",
                        color: "#48d7ff",
                        border: "1px solid rgba(30,184,240,0.2)",
                      }
                    : {}
                }
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <ChevronRight size={14} style={{ opacity: 0.5 }} />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer: usuario + cerrar sesión ── */}
      <div
        className="px-3 py-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {user && (
          <div
            className="px-3 py-2.5 mb-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p
              className="text-xs font-semibold truncate"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {user.nombre}
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="nav-item w-full"
          style={{ color: "rgba(248,113,113,0.7)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.color = "#f87171";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "rgba(248,113,113,0.7)";
          }}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
