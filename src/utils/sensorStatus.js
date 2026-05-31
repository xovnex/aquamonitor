/** Segundos sin datos del ESP32 para considerarlo desconectado */
export const SENSOR_TIMEOUT_SEC = 180;

export const isSensorOnline = (data) => {
  if (data?.sensor?.enLinea != null) return Boolean(data.sensor.enLinea);
  if (data?.sensor?.en_linea != null) return Boolean(data.sensor.en_linea);

  const minutos = minutosSinDatos(data);
  if (minutos == null) return false;
  return minutos * 60 <= SENSOR_TIMEOUT_SEC;
};

export const minutosSinDatos = (data) => {
  const fromApi =
    data?.sensor?.minutosSinDatos ?? data?.sensor?.minutos_sin_datos;
  if (fromApi != null && fromApi >= 0) return fromApi;

  const segundosApi =
    data?.sensor?.segundosSinDatos ?? data?.sensor?.segundos_sin_datos;
  if (segundosApi != null && segundosApi >= 0) {
    return Math.floor(segundosApi / 60);
  }

  const ultima =
    data?.sensor?.ultimaLectura ?? data?.sensor?.ultima_lectura ?? null;
  if (!ultima) return null;

  const diffSeg = Math.max(
    0,
    (Date.now() - new Date(ultima).getTime()) / 1000,
  );
  return Math.floor(diffSeg / 60);
};

/** @deprecated usa minutosSinDatos */
export const segundosSinDatos = (data) => {
  const min = minutosSinDatos(data);
  return min == null ? null : min * 60;
};

export const formatTiempoSinDatos = (minutos) => {
  if (minutos == null) return "Sin lecturas registradas";
  const min = Math.max(0, Math.floor(minutos));
  if (min === 0) return "Sin datos hace menos de 1 min";
  if (min < 60) return `Sin datos hace ${min} min`;
  const horas = Math.floor(min / 60);
  const resto = min % 60;
  if (resto === 0) return `Sin datos hace ${horas} h`;
  return `Sin datos hace ${horas} h ${resto} min`;
};
