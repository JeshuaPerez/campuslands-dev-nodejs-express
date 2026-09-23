/**
 * Carga la configuracion desde variables de entorno, con valores por defecto.
 */
export function cargarConfig(env = process.env) {
  const entorno = env.NODE_ENV || "development";
  const puerto = env.PORT === undefined ? 3018 : Number(env.PORT);
  const maxJugadores = Number(env.MAX_JUGADORES) || 100;

  if (Number.isNaN(puerto) || puerto <= 0) {
    throw new Error("PORT debe ser un numero valido");
  }

  return { entorno, puerto, maxJugadores };
}
