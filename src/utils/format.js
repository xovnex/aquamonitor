/** Formatea litros con 2 decimales */
export const formatLitros = (n, conUnidad = true) => {
  const valor = Number(n ?? 0).toFixed(2);
  return conUnidad ? `${valor} L` : valor;
};

/** Formatea soles peruanos con 2 decimales */
export const formatSoles = (n) => `S/ ${Number(n ?? 0).toFixed(2)}`;
