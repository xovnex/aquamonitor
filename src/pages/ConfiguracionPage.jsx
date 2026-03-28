// ============================================================
// ConfiguracionPage.jsx – Configuración del sistema
// ============================================================
import { useState } from "react";
import {
  Settings,
  Save,
  Users,
  Gauge,
  Bell,
  Droplets,
  Wifi,
  CheckCircle,
} from "lucide-react";
import { useConfig } from "../hooks/useWaterData";
import { postConfiguracion } from "../services/api";
import Header from "../components/layout/Header";

export default function ConfiguracionPage() {
  const { config, updateConfig } = useConfig();
  const [form, setForm] = useState({ ...config });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await postConfiguracion(form);
      updateConfig(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const consumoSugerido = form.personas * 100; // 100 L/persona es referencia OMS

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header title="Configuración" />

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-5">
        {/* Toast de guardado */}
        {saved && (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-fade-up"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.2)",
              color: "#34d399",
            }}
          >
            <CheckCircle size={16} />
            Configuración guardada correctamente
          </div>
        )}

        {/* Límite diario */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Gauge size={16} className="text-aqua-400" />
            <h3 className="text-sm font-semibold text-white/80">
              Límite de consumo diario
            </h3>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="stat-label">Litros por día</label>
              <span className="text-lg font-bold font-mono text-aqua-400">
                {form.limiteDiario} L
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={form.limiteDiario}
              onChange={(e) =>
                handleChange("limiteDiario", Number(e.target.value))
              }
              className="w-full h-2 rounded-full outline-none cursor-pointer"
              style={{ accentColor: "#1eb8f0" }}
            />
            <div className="flex justify-between text-xs text-white/25 mt-1 font-mono">
              <span>50 L</span>
              <span>500 L</span>
            </div>
          </div>

          {/* Presets rápidos */}
          <div>
            <p className="stat-label mb-2">Presets rápidos</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Mínimo", value: 100 },
                { label: "OMS recomendado", value: form.personas * 100 },
                { label: "Estándar", value: 200 },
                { label: "Amplio", value: 300 },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => handleChange("limiteDiario", value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background:
                      form.limiteDiario === value
                        ? "rgba(30,184,240,0.15)"
                        : "rgba(255,255,255,0.05)",
                    color:
                      form.limiteDiario === value
                        ? "#48d7ff"
                        : "rgba(255,255,255,0.45)",
                    border: `1px solid ${form.limiteDiario === value ? "rgba(30,184,240,0.3)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  {label} ({value} L)
                </button>
              ))}
            </div>
          </div>

          {/* Sugerencia OMS */}
          <div
            className="px-4 py-3 rounded-xl text-xs"
            style={{
              background: "rgba(30,184,240,0.06)",
              border: "1px solid rgba(30,184,240,0.12)",
            }}
          >
            <p className="text-aqua-400 font-semibold mb-0.5">
              💡 Referencia OMS
            </p>
            <p className="text-white/40">
              Para {form.personas} persona{form.personas > 1 ? "s" : ""}, se
              recomienda{" "}
              <span className="text-white/60 font-mono">
                {consumoSugerido} L/día
              </span>{" "}
              (100 L por persona).
            </p>
          </div>
        </div>

        {/* Número de personas */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-aqua-400" />
            <h3 className="text-sm font-semibold text-white/80">
              Personas en el hogar
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                handleChange("personas", Math.max(1, form.personas - 1))
              }
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              −
            </button>
            <div className="flex-1 text-center">
              <p className="text-4xl font-bold font-mono text-aqua-400">
                {form.personas}
              </p>
              <p className="text-xs text-white/35 mt-0.5">
                persona{form.personas > 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() =>
                handleChange("personas", Math.min(20, form.personas + 1))
              }
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}
            >
              +
            </button>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: form.personas }, (_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(30,184,240,0.15)",
                  border: "1px solid rgba(30,184,240,0.2)",
                }}
              >
                <span className="text-sm">👤</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notificaciones y alertas */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={16} className="text-aqua-400" />
            <h3 className="text-sm font-semibold text-white/80">
              Alertas y notificaciones
            </h3>
          </div>

          {[
            {
              key: "notificaciones",
              label: "Notificaciones push",
              desc: "Alertas cuando superes el límite diario",
            },
            {
              key: "alertaFuga",
              label: "Detección de fuga",
              desc: "Alerta si se detecta flujo continuo nocturno",
            },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-white/70 font-medium">{label}</p>
                <p className="text-xs text-white/35 mt-0.5">{desc}</p>
              </div>
              <button
                onClick={() => handleChange(key, !form[key])}
                className="flex-shrink-0 w-12 h-6 rounded-full relative transition-all duration-300"
                style={{
                  background: form[key] ? "#1eb8f0" : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                  style={{
                    left: form[key] ? "26px" : "2px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Info del sensor */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wifi size={14} className="text-emerald-400" />
            <p className="text-sm font-semibold text-white/80">
              Información del sensor
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: "Dispositivo", value: "ESP32-001" },
              { label: "Firmware", value: "v2.4.1" },
              { label: "Protocolo", value: "MQTT / HTTP REST" },
              {
                label: "API URL",
                value: import.meta.env.VITE_API_URL || "localhost:3000",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="stat-label">{label}</p>
                <p className="font-mono text-white/60 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={16} />
              Guardar configuración
            </>
          )}
        </button>
      </div>
    </div>
  );
}
