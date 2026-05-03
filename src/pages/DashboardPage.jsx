// ============================================================
// DashboardPage.jsx – Página principal del dashboard
// ============================================================
import { Droplets, Gauge, TrendingDown, Users, Activity } from "lucide-react";
import { useWaterData } from "../hooks/useWaterData";
import { useState } from "react";
import Header from "../components/layout/Header";
import StatCard from "../components/cards/StatCard";
import WaterGauge from "../components/cards/WaterGauge";
import AlertBanner from "../components/cards/AlertBanner";
import ImpactoAmbiental from "../components/cards/ImpactoAmbiental";
import GraficaDiaria from "../components/charts/GraficaDiaria";
import GraficaSemanal from "../components/charts/GraficaSemanal";
import GraficaCircular from "../components/charts/GraficaCircular";
import GraficaMensual from "../components/charts/GraficaMensual";
import AnalisisIA from "../components/cards/AnalisisIA";

export default function DashboardPage() {
  const { data, loading, error, metrics, lastUpdate, refetch } = useWaterData();
  const { hoy, semanal, mensual } = data;
  const [alertHidden, setAlertHidden] = useState(false);

  const alertType = metrics?.fujaDetectada
    ? "leak"
    : metrics?.excedido
      ? "exceeded"
      : (metrics?.porcentaje ?? 0) > 75
        ? "warning"
        : "ok";

  const alertMessages = {
    ok: `Llevas ${Number(hoy?.litros ?? 0).toFixed(2)} L de ${hoy?.limite ?? 200} L disponibles. ¡Vas excelente!`,
    warning: `Ya consumiste el ${metrics?.porcentaje ?? 0}% de tu límite diario. Ve despacio.`,
    exceeded: `Superaste tu límite por ${Number((hoy?.litros ?? 0) - (hoy?.limite ?? 200)).toFixed(2)} L. Reduce el consumo.`,
    leak: "Flujo constante detectado. Verifica tus cañerías.",
  };

  if (loading && !hoy) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-aqua-500/30 border-t-aqua-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Conectando con el sensor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Header
        title="Dashboard"
        lastUpdate={lastUpdate}
        onRefresh={refetch}
        loading={loading}
        alertCount={alertType !== "ok" ? 1 : 0}
        onBellClick={() => setAlertHidden((h) => !h)}
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Alertas */}
        <AlertBanner
          type={alertType}
          message={alertMessages[alertType]}
          hidden={alertHidden}
          onDismiss={() => setAlertHidden(true)}
        />

        {/* KPIs superiores */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Consumo hoy"
            value={Number(hoy?.litros ?? 0).toFixed(2)}
            unit="litros"
            Icon={Droplets}
            color={metrics?.excedido ? "red" : "aqua"}
            badge={
              <span className={metrics?.excedido ? "badge-alert" : "badge-ok"}>
                {metrics?.excedido ? "Excedido" : "Normal"}
              </span>
            }
            sublabel="Medido por sensor de flujo"
            delay={0}
          />
          <StatCard
            label="Límite diario"
            value={hoy?.limite ?? "—"}
            unit="litros"
            Icon={Gauge}
            color="amber"
            sublabel="Configurado por el usuario"
            delay={100}
          />
          <StatCard
            label="Ahorro del día"
            value={Number(metrics?.ahorro ?? 0).toFixed(2)}
            unit="litros"
            Icon={TrendingDown}
            color="green"
            badge={
              <span className="badge-ok">
                +{metrics?.duchasAhorradas ?? 0} duchas
              </span>
            }
            delay={200}
          />
          <StatCard
            label="Por persona"
            value={Number(metrics?.porPersona ?? 0).toFixed(2)}
            unit="L/pers"
            Icon={Users}
            color="aqua"
            sublabel={`${hoy?.personas ?? 1} personas en el hogar`}
            delay={300}
          />
        </div>

        {/* Fila intermedia: Gauge + Circular + Impacto */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WaterGauge
            porcentaje={metrics?.porcentaje ?? 0}
            litros={hoy?.litros ?? 0}
            limite={hoy?.limite ?? 200}
            excedido={metrics?.excedido}
          />
          <GraficaCircular
            litros={hoy?.litros ?? 0}
            limite={hoy?.limite ?? 200}
          />
          <ImpactoAmbiental ahorro={metrics?.ahorro ?? 0} />
        </div>

        {/* Gráfica diaria */}
        <GraficaDiaria limite={hoy?.limite ?? 200} />

        {/* Gráficas semanal + mensual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GraficaSemanal data={semanal} />
          <GraficaMensual data={mensual} />
        </div>

        {/* Análisis IA */}
        <AnalisisIA />

        {/* Resumen del día */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Activity size={14} className="text-aqua-400" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
              Resumen del día
            </span>
            <div className="flex items-center gap-4 ml-auto flex-wrap">
              {[
                {
                  label: "Total hoy",
                  value: `${Number(hoy?.litros ?? 0).toFixed(2)} L`,
                  color: metrics?.excedido ? "#f87171" : "#48d7ff",
                },
                {
                  label: "Límite",
                  value: `${hoy?.limite ?? 200} L`,
                  color: "rgba(255,255,255,0.7)",
                },
                {
                  label: "Ahorro",
                  value: `${Number(metrics?.ahorro ?? 0).toFixed(2)} L`,
                  color: "#34d399",
                },
                {
                  label: "Por persona",
                  value: `${Number(metrics?.porPersona ?? 0).toFixed(2)} L`,
                  color: "rgba(255,255,255,0.7)",
                },
                {
                  label: "Duchas ahorradas",
                  value: `${metrics?.duchasAhorradas ?? 0}`,
                  color: "#a78bfa",
                },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center">
                  <p className="stat-label text-[10px]">{label}</p>
                  <p
                    className="text-xs font-mono font-semibold"
                    style={{ color: color || "rgba(255,255,255,0.7)" }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
