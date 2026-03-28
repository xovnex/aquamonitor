// AppLayout.jsx – Layout responsive (drawer móvil + sidebar desktop)
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#060d1a" }}>
      {/* Overlay oscuro (solo móvil) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(3px)",
          }}
        />
      )}

      {/* Sidebar desktop – siempre visible */}
      <div
        className="hidden lg:block"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 30,
          flexShrink: 0,
        }}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Sidebar móvil – drawer deslizable */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: 240,
          zIndex: 30,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Sidebar onClose={() => setMobileOpen(false)} />
      </div>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileTopBar onMenuOpen={() => setMobileOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
}

function MobileTopBar({ onMenuOpen }) {
  return (
    <div
      className="lg:hidden flex items-center justify-between px-4 sticky top-0 z-10"
      style={{
        height: 56,
        background: "rgba(6,13,26,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(30,184,240,0.12)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "linear-gradient(135deg,#1eb8f0,#0878a8)",
            boxShadow: "0 0 14px rgba(30,184,240,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 14 }}>💧</span>
        </div>
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            AquaMonitor
          </p>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
            Sistema IoT
          </p>
        </div>
      </div>

      <button
        onClick={onMenuOpen}
        aria-label="Abrir menú"
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: "rgba(30,184,240,0.12)",
          border: "1px solid rgba(30,184,240,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: 16,
            height: 2,
            borderRadius: 2,
            background: "#1eb8f0",
            display: "block",
          }}
        />
        <span
          style={{
            width: 16,
            height: 2,
            borderRadius: 2,
            background: "#1eb8f0",
            display: "block",
          }}
        />
        <span
          style={{
            width: 10,
            height: 2,
            borderRadius: 2,
            background: "#1eb8f0",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}
