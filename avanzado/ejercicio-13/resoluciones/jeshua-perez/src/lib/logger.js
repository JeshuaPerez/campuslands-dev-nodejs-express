/**
 * Logger estructurado: cada linea es un JSON (nivel, mensaje, timestamp y
 * metadatos), facil de indexar en un sistema de observabilidad real
 * (Datadog, ELK, etc). No usa console.log con texto libre.
 */
function log(nivel, mensaje, meta = {}) {
  console.log(JSON.stringify({ nivel, mensaje, timestamp: new Date().toISOString(), ...meta }));
}

export const logger = {
  info: (mensaje, meta) => log("info", mensaje, meta),
  warn: (mensaje, meta) => log("warn", mensaje, meta),
  error: (mensaje, meta) => log("error", mensaje, meta),
};
