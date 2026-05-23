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
import { EQUIVALENCIAS } from "../utils/mockData";

const DEFAULT_COSTO_POR_LITRO = 0.005;

const resolveCostoPorLitro = (hoy) =>
  Number(
    hoy?.costoPorLitro ??
      hoy?.costo_por_litro ??
      DEFAULT_COSTO_POR_LITRO,
  ) || DEFAULT_COSTO_POR_LITRO;

const resolveCostoHoy = (hoy, costoPorLitro) => {
  const fromApi = hoy?.costoEstimado ?? hoy?.costo_estimado;
  if (fromApi != null && !Number.isNaN(Number(fromApi))) {
    return Number(fromApi);
  }
  return Number(((hoy?.litros ?? 0) * costoPorLitro).toFixed(2));
};

export const useWaterData = () => {
  const [data, setData] = useState({
    hoy: null,
    semanal: [],
    mensual: [],
    historial: [],
    historialTotal: 0,
    costoPorLitroHistorial: DEFAULT_COSTO_POR_LITRO,
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
        costoPorLitroHistorial:
          historialRes.costo_por_litro ??
          historialRes.costoPorLitro ??
          resolveCostoPorLitro(hoy),
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
    const interval = setInterval(fetchAll, 10_000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const metrics = data.hoy
    ? (() => {
        const costoPorLitro = resolveCostoPorLitro(data.hoy);
        const costoHoy = resolveCostoHoy(data.hoy, costoPorLitro);
        const litros = data.hoy.litros ?? 0;
        const limite = data.hoy.limite ?? 200;

        return {
          porcentaje: Math.min(100, Math.round((litros / limite) * 100)),
          excedido: litros > limite,
          ahorro: Math.max(0, limite - litros),
          porPersona: Math.round(litros / (data.hoy.personas || 1)),
          fujaDetectada: data.hoy.flujoActual > 10,
          duchasAhorradas: Math.floor(
            Math.max(0, limite - litros) / EQUIVALENCIAS.duchaPorLitros,
          ),
          costoPorLitro,
          costoHoy,
          ahorroSoles: Number(
            (Math.max(0, limite - litros) * costoPorLitro).toFixed(2),
          ),
        };
      })()
    : null;

  return { data, loading, error, metrics, lastUpdate, refetch: fetchAll };
};

export const useConfig = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const [config, setConfig] = useState({
    limiteDiario: 200,
    personas: 3,
    costoPorLitro: DEFAULT_COSTO_POR_LITRO,
    notificaciones: true,
    alertaFuga: true,
  });

  const updateConfig = useCallback(
    async (updates) => {
      const next = { ...config, ...updates };
      setConfig(next);

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
            costo_por_litro: next.costoPorLitro,
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
