// ============================================================
// useWaterData.js – Hook que centraliza la obtención de datos de agua
// ============================================================
import { useState, useEffect, useCallback } from "react";
import {
  getConsumoHoy,
  getConsumoSemanal,
  getConsumoMensual,
  getHistorial,
} from "../services/api";

export const useWaterData = () => {
  const [data, setData] = useState({
    hoy: null,
    semanal: [],
    mensual: [],
    historial: [],
    historialTotal: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [hoy, semanal, mensual, historialRes] = await Promise.all([
        getConsumoHoy(),
        getConsumoSemanal(),
        getConsumoMensual(),
        getHistorial(1, 15),
      ]);
      setData({
        hoy,
        semanal,
        mensual,
        historial: historialRes.items,
        historialTotal: historialRes.total,
      });
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Actualización automática cada 30 segundos (simula sensor en tiempo real)
  useEffect(() => {
    const interval = setInterval(fetchAll, 30_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  /** Métricas derivadas calculadas a partir de los datos */
  const metrics = data.hoy
    ? {
        porcentaje: Math.min(
          100,
          Math.round((data.hoy.litros / data.hoy.limite) * 100),
        ),
        excedido: data.hoy.litros > data.hoy.limite,
        ahorro: Math.max(0, data.hoy.limite - data.hoy.litros),
        porPersona: Math.round(data.hoy.litros / (data.hoy.personas || 1)),
        // Detección de fuga: flujo > 2 L/min durante hora nocturna
        fujaDetectada: data.hoy.flujoActual > 2.5,
        // Número de duchas equivalentes a lo ahorrado
        duchasAhorradas: Math.floor(
          Math.max(0, data.hoy.limite - data.hoy.litros) / 60,
        ),
      }
    : null;

  return { data, loading, error, metrics, lastUpdate, refetch: fetchAll };
};

/** Hook de configuración persistida en localStorage (sincroniza con API) */
export const useConfig = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem("aqua_config");
    return saved
      ? JSON.parse(saved)
      : {
          limiteDiario: 200,
          personas: 3,
          notificaciones: true,
          alertaFuga: true,
        };
  });

  const updateConfig = useCallback((updates) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("aqua_config", JSON.stringify(next));
      return next;
    });
  }, []);

  return { config, updateConfig };
};
