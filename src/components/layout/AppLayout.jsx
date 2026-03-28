// ============================================================
// AppLayout.jsx – Layout principal con sidebar + contenido
// ============================================================
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen bg-grid"
      style={{ background: "#060d1a" }}
    >
      {/* Overlay móvil */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar – oculto en móvil, visible en desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar collapsed={sidebarCollapsed} />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
