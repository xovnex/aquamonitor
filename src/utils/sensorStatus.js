/** Segundos sin datos del ESP32 para considerarlo desconectado */
export const SENSOR_TIMEOUT_SEC = 180;

export const isSensorOnline = (data) => {
  if (data?.sensor?.enLinea != null) return Boolean(data.sensor.enLinea);
  if (data?.sensor?.en_linea != null) return Boolean(data.sensor.en_linea);

  const ultima =
    data?.sensor?.ultimaLectura ?? data?.sensor?.ultima_lectura ?? null;
  if (!ultima) return false;

  const diffSeg = (Date.now() - new Date(ultima).getTime()) / 1000;
  return diffSeg >= 0 && diffSeg <= SENSOR_TIMEOUT_SEC;
};

export const segundosSinDatos = (data) => {
  const fromApi =
    data?.sensor?.segundosSinDatos ?? data?.sensor?.segundos_sin_datos;
  if (fromApi != null) return fromApi;

  const ultima =
    data?.sensor?.ultimaLectura ?? data?.sensor?.ultima_lectura ?? null;
  if (!ultima) return null;

  return Math.max(0, Math.floor((Date.now() - new Date(ultima).getTime()) / 1000));
};
