/**
 * Servicio de dominio: tabla de la liga y goleadores.
 *
 * No toca el disco. Recibe los datos ya leidos por `archivos.service.js` y se
 * limita a calcular. Asi se puede probar sin montar archivos de prueba.
 */

export class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

const PUNTOS_VICTORIA = 3;
const PUNTOS_EMPATE = 1;

export const MODALIDADES = Object.freeze(['futbol', 'futsal']);

/**
 * Calcula puntos, partidos y diferencia de goles de un equipo.
 */
export function calcularEstadisticas(equipo) {
  const jugados = equipo.ganados + equipo.empatados + equipo.perdidos;
  const puntos = equipo.ganados * PUNTOS_VICTORIA + equipo.empatados * PUNTOS_EMPATE;

  return {
    ...equipo,
    jugados,
    puntos,
    diferenciaGoles: equipo.golesFavor - equipo.golesContra,
    promedioGolesFavor: jugados === 0 ? 0 : Number((equipo.golesFavor / jugados).toFixed(2)),
    rendimiento: jugados === 0 ? 0 : Number(((puntos / (jugados * PUNTOS_VICTORIA)) * 100).toFixed(1)),
  };
}

/**
 * Ordena la tabla: puntos, luego diferencia de goles, luego goles a favor.
 *
 * @param {Array<object>} equipos equipos ya leidos del JSON.
 * @param {{modalidad?: string}} [filtros]
 * @throws {ValidacionError} si la modalidad pedida no existe.
 */
export function construirTabla(equipos, filtros = {}) {
  if (!Array.isArray(equipos)) {
    throw new ValidacionError('Los equipos deben venir en un arreglo.');
  }

  let seleccion = equipos;

  if (filtros.modalidad !== undefined) {
    const modalidad = String(filtros.modalidad).trim().toLowerCase();

    if (!MODALIDADES.includes(modalidad)) {
      throw new ValidacionError(`La modalidad debe ser una de: ${MODALIDADES.join(', ')}.`);
    }

    seleccion = equipos.filter((equipo) => equipo.modalidad === modalidad);
  }

  return seleccion
    .map(calcularEstadisticas)
    .sort(
      (a, b) =>
        b.puntos - a.puntos ||
        b.diferenciaGoles - a.diferenciaGoles ||
        b.golesFavor - a.golesFavor,
    )
    .map((equipo, indice) => ({ posicion: indice + 1, ...equipo }));
}

/**
 * Ordena los goleadores y calcula su promedio por partido.
 *
 * @param {Array<object>} goleadores filas ya parseadas del CSV.
 * @param {{limite?: number}} [opciones]
 * @throws {ValidacionError} si el limite no es un entero positivo.
 */
export function construirGoleadores(goleadores, opciones = {}) {
  if (!Array.isArray(goleadores)) {
    throw new ValidacionError('Los goleadores deben venir en un arreglo.');
  }

  let limite = goleadores.length;

  if (opciones.limite !== undefined) {
    limite = Number(opciones.limite);

    if (!Number.isInteger(limite) || limite < 1) {
      throw new ValidacionError('El limite debe ser un entero mayor o igual a 1.');
    }
  }

  return goleadores
    .map((jugador) => ({
      ...jugador,
      contribuciones: jugador.goles + jugador.asistencias,
      golesPorPartido:
        jugador.partidos === 0 ? 0 : Number((jugador.goles / jugador.partidos).toFixed(2)),
    }))
    .sort((a, b) => b.goles - a.goles || b.asistencias - a.asistencias)
    .slice(0, limite);
}

/**
 * Cruza la tabla con los goleadores para dar un resumen de la liga.
 */
export function resumirLiga(equipos, goleadores) {
  const tabla = construirTabla(equipos);
  const ranking = construirGoleadores(goleadores);

  const totalGoles = equipos.reduce((suma, equipo) => suma + equipo.golesFavor, 0);
  const totalPartidos = tabla.reduce((suma, equipo) => suma + equipo.jugados, 0) / 2;

  return {
    lider: tabla[0]?.nombre ?? null,
    colista: tabla.at(-1)?.nombre ?? null,
    equipos: tabla.length,
    maximoGoleador: ranking[0] ?? null,
    totalGoles,
    mediaGolesPorPartido: totalPartidos === 0 ? 0 : Number((totalGoles / totalPartidos).toFixed(2)),
    porModalidad: MODALIDADES.map((modalidad) => ({
      modalidad,
      equipos: equipos.filter((equipo) => equipo.modalidad === modalidad).length,
    })),
  };
}
