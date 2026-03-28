// ============================================================
// Sidebar.jsx – Navegación lateral principal
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
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { path: "/historial", label: "Historial", Icon: History },
  { path: "/configuracion", label: "Configuración", Icon: Settings },
];

export default function Sidebar({ collapsed = false }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <aside
      className="flex flex-col h-screen sticky top-0"
      style={{
        width: collapsed ? 72 : 240,
        background: "linear-gradient(180deg, #0a1628 0%, #060d1a 100%)",
        borderRight: "1px solid rgba(30,184,240,0.1)",
        transition: "width 0.3s ease",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center glow-aqua"
          style={{ background: "linear-gradient(135deg, #1eb8f0, #0878a8)" }}
        >
          <Droplets size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="animate-slide-in">
            <p className="font-bold text-white text-sm leading-tight">
              AquaMonitor
            </p>
            <p className="text-xs text-white/30">Sistema IoT</p>
          </div>
        )}
      </div>

      {/* Estado del sensor */}
      {!collapsed && (
        <div
          className="mx-3 my-3 px-3 py-2 rounded-xl"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
            <Wifi size={12} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">
              Sensor en línea
            </span>
          </div>
          <p className="text-xs text-white/30 mt-0.5 font-mono">ESP32-001</p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, label, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink key={path} to={path}>
              <div className={`nav-item ${isActive ? "active" : ""}`}>
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1">{label}</span>}
                {!collapsed && isActive && (
                  <ChevronRight size={14} className="opacity-50" />
                )}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer con usuario */}
      <div className="px-3 py-4 border-t border-white/5">
        {!collapsed && user && (
          <div
            className="px-3 py-2 mb-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <p className="text-xs font-semibold text-white/80 truncate">
              {user.nombre}
            </p>
            <p className="text-xs text-white/30 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="nav-item w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
