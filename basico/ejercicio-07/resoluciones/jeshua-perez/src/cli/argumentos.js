/**
 * Parseo de argumentos de consola.
 *
 * Tema del ejercicio: `process.argv`. Aqui conviven dos enfoques a proposito:
 *
 *  - `parsearManual`: recorre el arreglo a mano. Sirve para entender que hay
 *    debajo, porque `process.argv` no es magia: es un arreglo de strings.
 *  - `parsearConUtil`: usa `util.parseArgs`, que trae Node desde la 18. Es lo
 *    que se debe usar en la practica, y las pruebas comprueban que ambos
 *    coinciden en las entradas normales.
 */

import { parseArgs } from 'node:util';

export class ArgumentoInvalidoError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ArgumentoInvalidoError';
    this.statusCode = 400;
  }
}

/**
 * Estructura de process.argv:
 *   [0] ruta del ejecutable de node
 *   [1] ruta del script
 *   [2..] lo que escribio la persona
 *
 * Por eso todo parseo empieza en el indice 2.
 */
export const INDICE_PRIMER_ARGUMENTO = 2;

/** Opciones que entiende el CLI, en el formato que espera parseArgs. */
export const OPCIONES = Object.freeze({
  marca: { type: 'string', short: 'm' },
  'precio-max': { type: 'string', short: 'p' },
  'anio-min': { type: 'string', short: 'a' },
  disponibles: { type: 'boolean', short: 'd', default: false },
  ordenar: { type: 'string', short: 'o' },
  desc: { type: 'boolean', default: false },
  limite: { type: 'string', short: 'l' },
  json: { type: 'boolean', default: false },
  ayuda: { type: 'boolean', short: 'h', default: false },
});

/**
 * Separa el arreglo crudo en el subcomando y el resto.
 *
 * @param {string[]} argv el process.argv completo.
 */
export function extraerArgumentos(argv) {
  return argv.slice(INDICE_PRIMER_ARGUMENTO);
}

/**
 * Parser escrito a mano, para ver el mecanismo.
 *
 * Entiende `--opcion=valor`, `--opcion valor`, banderas `--bandera` y el
 * separador `--`, tras el cual todo se trata como texto suelto.
 */
export function parsearManual(argumentos) {
  const opciones = {};
  const sueltos = [];

  let soloTexto = false;

  for (let indice = 0; indice < argumentos.length; indice += 1) {
    const actual = argumentos[indice];

    if (soloTexto) {
      sueltos.push(actual);
      continue;
    }

    if (actual === '--') {
      soloTexto = true;
      continue;
    }

    if (!actual.startsWith('--')) {
      sueltos.push(actual);
      continue;
    }

    const sinGuiones = actual.slice(2);

    if (sinGuiones === '') {
      throw new ArgumentoInvalidoError('Hay un "--" suelto mal colocado.');
    }

    // Forma --opcion=valor
    if (sinGuiones.includes('=')) {
      const posicion = sinGuiones.indexOf('=');
      const nombre = sinGuiones.slice(0, posicion);
      const valor = sinGuiones.slice(posicion + 1);

      if (nombre === '') {
        throw new ArgumentoInvalidoError(`Opcion sin nombre: ${actual}`);
      }

      opciones[nombre] = valor;
      continue;
    }

    // Forma --opcion valor, solo si lo siguiente no es otra opcion.
    const siguiente = argumentos[indice + 1];

    if (siguiente !== undefined && !siguiente.startsWith('-')) {
      opciones[sinGuiones] = siguiente;
      indice += 1;
      continue;
    }

    // Bandera sin valor.
    opciones[sinGuiones] = true;
  }

  return { opciones, sueltos };
}

/**
 * Parser real de la aplicacion, con util.parseArgs.
 *
 * `allowPositionals` habilita el subcomando. `strict` hace que una opcion
 * desconocida falle en vez de colarse en silencio, que es lo que se quiere en
 * un CLI: avisar del error de escritura en lugar de ignorarlo.
 *
 * @throws {ArgumentoInvalidoError} si hay una opcion desconocida o mal formada.
 */
export function parsearConUtil(argumentos) {
  try {
    const { values, positionals } = parseArgs({
      args: argumentos,
      options: OPCIONES,
      allowPositionals: true,
      strict: true,
    });

    return { opciones: values, sueltos: positionals };
  } catch (error) {
    throw new ArgumentoInvalidoError(error.message);
  }
}

/**
 * Traduce las opciones del CLI a los criterios que entiende el servicio.
 *
 * Es la frontera: a partir de aqui el dominio no sabe que existe una consola.
 */
export function aCriterios(opciones) {
  const criterios = {};

  if (opciones.marca !== undefined) criterios.marca = opciones.marca;
  if (opciones['precio-max'] !== undefined) criterios.precioMax = opciones['precio-max'];
  if (opciones['anio-min'] !== undefined) criterios.anioMin = opciones['anio-min'];
  if (opciones.ordenar !== undefined) criterios.ordenarPor = opciones.ordenar;
  if (opciones.limite !== undefined) criterios.limite = opciones.limite;

  criterios.soloDisponibles = Boolean(opciones.disponibles);
  criterios.descendente = Boolean(opciones.desc);

  return criterios;
}
