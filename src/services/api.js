// ============================================================
// api.js – Capa de servicios para comunicación con el backend
// Usa datos mock si VITE_MOCK_DATA=true o si la API falla
// ============================================================
import axios from "axios";
import {
  mockConsumoHoy,
  mockConsumoSemanal,
  mockConsumoMensual,
  mockHistorial,
  mockConfiguracion,
} from "../utils/mockData";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const USE_MOCK = import.meta.env.VITE_MOCK_DATA === "true";

/** Cliente axios configurado con interceptores */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token JWT en cada request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("aqua_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejo global de errores 401 (token expirado)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("aqua_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

/** Helper: simula latencia de red para datos mock */
const mockDelay = (data, ms = 400) =>
  new Promise((res) => setTimeout(() => res(data), ms));

// ─── Endpoints ────────────────────────────────────────────────

/** GET /consumo/hoy – Consumo del día actual */
export const getConsumoHoy = async () => {
  if (USE_MOCK) return mockDelay(mockConsumoHoy);
  const { data } = await apiClient.get("/consumo/hoy");
  return data;
};

/** GET /consumo/semanal – Consumo de los últimos 7 días */
export const getConsumoSemanal = async () => {
  if (USE_MOCK) return mockDelay(mockConsumoSemanal);
  const { data } = await apiClient.get("/consumo/semanal");
  return data;
};

/** GET /consumo/mensual – Consumo de los últimos 30 días */
export const getConsumoMensual = async () => {
  if (USE_MOCK) return mockDelay(mockConsumoMensual);
  const { data } = await apiClient.get("/consumo/mensual");
  return data;
};

/** GET /historial – Lista paginada de consumos */
export const getHistorial = async (page = 1, limit = 10) => {
  if (USE_MOCK) {
    const start = (page - 1) * limit;
    return mockDelay({
      items: mockHistorial.slice(start, start + limit),
      total: mockHistorial.length,
    });
  }
  const { data } = await apiClient.get("/historial", {
    params: { page, limit },
  });
  return data;
};

/** POST /configuracion – Guarda la configuración del usuario */
export const postConfiguracion = async (config) => {
  if (USE_MOCK) return mockDelay({ success: true, config });
  const { data } = await apiClient.post("/configuracion", config);
  return data;
};

/** POST /auth/login – Autenticación (simulada en frontend) */
export const loginUser = async (usuario, contrasena) => {
  // Simulación JWT – reemplazar por llamada real al backend
  if (USE_MOCK || true) {
    await mockDelay(null, 800);
    if (usuario === "admin" && contrasena === "1234") {
      const fakeToken = btoa(JSON.stringify({ sub: usuario, iat: Date.now() }));
      return {
        token: fakeToken,
        user: { nombre: "Administrador", email: "admin@aqua.io" },
      };
    }
    throw new Error("Credenciales incorrectas");
  }
  const { data } = await apiClient.post("/auth/login", { usuario, contrasena });
  return data;
};
