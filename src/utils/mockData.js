// ============================================================
// mockData.js – Datos simulados del sensor de agua (ESP8266/ESP32)
// Reemplazar por llamadas reales a la API cuando el backend esté listo
// ============================================================

const hoy = new Date();
const fmt = (d) => d.toISOString().split("T")[0];

/** Genera un valor aleatorio entre min y max */
const rand = (min, max) => Math.round(Math.random() * (max - min) + min);

const COSTO_POR_LITRO_MOCK = 0.005;

/** Consumo del día actual en litros */
export const mockConsumoHoy = {
  fecha: fmt(hoy),
  litros: 142,
  limite: 200,
  personas: 3,
  costoPorLitro: COSTO_POR_LITRO_MOCK,
  costoEstimado: Number((142 * COSTO_POR_LITRO_MOCK).toFixed(2)),
  flujoActual: 0,
  temperaturaAgua: 18,
  sensor: {
    id: "ESP32-001",
    enLinea: false,
    ultimaLectura: null,
    segundosSinDatos: null,
  },
};

/** Consumo de los últimos 7 días */
export const mockConsumoSemanal = [
  { dia: "Lun", litros: 185, limite: 200 },
  { dia: "Mar", litros: 210, limite: 200 },
  { dia: "Mié", litros: 175, limite: 200 },
  { dia: "Jue", litros: 160, limite: 200 },
  { dia: "Vie", litros: 195, limite: 200 },
  { dia: "Sáb", litros: 230, limite: 200 },
  { dia: "Dom", litros: 142, limite: 200 },
];

/** Consumo de los últimos 30 días (historial mensual) */
export const mockConsumoMensual = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(hoy);
  d.setDate(d.getDate() - (29 - i));
  return {
    fecha: fmt(d),
    litros: rand(110, 260),
    limite: 200,
  };
});

/** Historial de consumo diario paginado */
export const mockHistorial = mockConsumoMensual
  .slice()
  .reverse()
  .map((item, idx) => ({
    id: idx + 1,
    ...item,
    estado: item.litros > item.limite ? "excedido" : "normal",
    ahorro: Number(Math.max(0, item.limite - item.litros).toFixed(2)),
    costo: Number((item.litros * COSTO_POR_LITRO_MOCK).toFixed(2)),
  }));

/** Configuración del usuario */
export const mockConfiguracion = {
  limiteDiario: 200,
  personas: 3,
  costoPorLitro: COSTO_POR_LITRO_MOCK,
  notificaciones: true,
  alertaFuga: true,
  umbralFuga: 50, // litros/hora considerado fuga
};

/** Equivalencias de ahorro ambiental (referencias realistas) */
export const EQUIVALENCIAS = {
  duchaPorLitros: 40, // ducha media ~8 min, ~5 L/min
  plantaPorLitros: 5, // litros para regar una planta mediana
  botellaLitros: 0.5, // tamaño de cada botella (500 ml)
};
