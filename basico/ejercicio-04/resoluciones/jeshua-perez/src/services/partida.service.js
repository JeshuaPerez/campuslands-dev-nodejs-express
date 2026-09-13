/**
 * Servicio de dominio: partidas de battle royale.
 *
 * Usa named exports. Importa la zona para apoyarse en sus live bindings.
 */

import RAREZAS, { esRarezaValida, multiplicadorDe } from '../lib/rareza.js';
import { encogerZona, estaEnZona, radioActual } from '../lib/zona.js';

/** Error de validacion de entrada. Lleva el status HTTP que le corresponde. */
export class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

const TAMANO_MAXIMO_ESCUADRA = 4;
const VALOR_BASE_LOOT = 100;

function validarJugador(jugador, indice) {
  if (typeof jugador?.nombre !== 'string' || jugador.nombre.trim() === '') {
    throw new ValidacionError(`El jugador ${indice + 1} necesita un nombre.`);
  }

  if (!Number.isFinite(jugador.distanciaAlCentro) || jugador.distanciaAlCentro < 0) {
    throw new ValidacionError(
      `${jugador.nombre.trim()} necesita una distancia al centro valida y no negativa.`,
    );
  }

  if (!esRarezaValida(jugador.loot)) {
    throw new ValidacionError(
      `Loot invalido para ${jugador.nombre.trim()}. Usa: ${Object.keys(RAREZAS).join(', ')}.`,
    );
  }

  return {
    nombre: jugador.nombre.trim(),
    distanciaAlCentro: jugador.distanciaAlCentro,
    loot: jugador.loot.toLowerCase(),
  };
}

/**
 * Evalua una escuadra contra el estado actual de la zona.
 *
 * Lee `radioActual` importado del modulo de zona. Como es un live binding, el
 * valor refleja los cierres que hayan ocurrido, sin reimportar.
 *
 * @param {{jugadores: Array<{nombre: string, distanciaAlCentro: number, loot: string}>}} datos
 * @throws {ValidacionError} si la escuadra o algun jugador no cumple las reglas.
 */
export function evaluarEscuadra(datos = {}) {
  const { jugadores } = datos;

  if (!Array.isArray(jugadores)) {
    throw new ValidacionError('jugadores debe ser un arreglo.');
  }

  if (jugadores.length === 0 || jugadores.length > TAMANO_MAXIMO_ESCUADRA) {
    throw new ValidacionError(
      `Una escuadra tiene entre 1 y ${TAMANO_MAXIMO_ESCUADRA} jugadores, y llegaron ${jugadores.length}.`,
    );
  }

  const validados = jugadores.map(validarJugador);
  const nombres = new Set(validados.map((jugador) => jugador.nombre.toLowerCase()));

  if (nombres.size !== validados.length) {
    throw new ValidacionError('Hay nombres repetidos en la escuadra.');
  }

  const evaluados = validados.map((jugador) => ({
    ...jugador,
    aSalvo: estaEnZona(jugador.distanciaAlCentro),
    valorLoot: Math.round(VALOR_BASE_LOOT * multiplicadorDe(jugador.loot)),
  }));

  const aSalvo = evaluados.filter((jugador) => jugador.aSalvo);

  return {
    radioDeLaZona: radioActual,
    jugadores: evaluados,
    totalJugadores: evaluados.length,
    aSalvo: aSalvo.length,
    fueraDeZona: evaluados.length - aSalvo.length,
    valorTotalLoot: evaluados.reduce((total, jugador) => total + jugador.valorLoot, 0),
    mejorEquipado: evaluados.reduce((mejor, jugador) =>
      jugador.valorLoot > mejor.valorLoot ? jugador : mejor,
    ),
  };
}

/**
 * Cierra la zona y devuelve el estado resultante.
 *
 * @throws {ValidacionError} si los metros no son un numero positivo.
 */
export function cerrarZona(metros) {
  try {
    return encogerZona(metros);
  } catch (error) {
    // El modulo de zona lanza TypeError; aqui se traduce al error de dominio
    // que el manejador HTTP sabe convertir en un 400.
    throw new ValidacionError(error.message);
  }
}

export { TAMANO_MAXIMO_ESCUADRA };
