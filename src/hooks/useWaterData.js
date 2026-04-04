// ============================================================
// useWaterData.js – Hook que centraliza la obtención de datos
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

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    const interval = setInterval(fetchAll, 30_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const metrics = data.hoy
    ? {
        porcentaje: Math.min(
          100,
          Math.round((data.hoy.litros / data.hoy.limite) * 100),
        ),
        excedido: data.hoy.litros > data.hoy.limite,
        ahorro: Math.max(0, data.hoy.limite - data.hoy.litros),
        porPersona: Math.round(data.hoy.litros / (data.hoy.personas || 1)),
        fujaDetectada: data.hoy.flujoActual > 2.5,
        duchasAhorradas: Math.floor(
          Math.max(0, data.hoy.limite - data.hoy.litros) / 60,
        ),
      }
    : null;

  return { data, loading, error, metrics, lastUpdate, refetch: fetchAll };
};

export const useConfig = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [config, setConfig] = useState({
    limiteDiario: 200,
    personas: 3,
    notificaciones: true,
    alertaFuga: true,
  });

  const updateConfig = useCallback(
    async (updates) => {
      const next = { ...config, ...updates };
      setConfig(next);

      // Guarda en la API real
      try {
        const token = localStorage.getItem("aqua_token");
        await fetch(`${BASE_URL}/configuracion`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            limite_diario: next.limiteDiario,
            personas: next.personas,
            notificaciones: next.notificaciones,
            alerta_fuga: next.alertaFuga,
          }),
        });
      } catch (err) {
        console.error("Error guardando config:", err);
      }
    },
    [config],
  );

  return { config, updateConfig };
};
