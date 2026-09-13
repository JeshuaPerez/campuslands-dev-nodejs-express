/**
 * Carga y validacion de la configuracion.
 *
 * La regla que gobierna todo este archivo: **process.env solo contiene
 * strings**. No hay numeros ni booleanos ahi dentro. El error clasico es
 * escribir `if (process.env.TELEMETRIA_ACTIVA)`, que es cierto incluso cuando
 * la variable vale exactamente "false", porque "false" es un string no vacio.
 *
 * Por eso cada valor se convierte de forma explicita segun el esquema.
 */

import { ESQUEMA } from './esquema.js';

export class ConfiguracionInvalidaError extends Error {
  constructor(problemas) {
    super(`Configuracion invalida:\n  - ${problemas.join('\n  - ')}`);
    this.name = 'ConfiguracionInvalidaError';
    this.problemas = problemas;
    this.statusCode = 500;
  }
}

/** Strings que se aceptan como verdadero y como falso. */
const VERDADEROS = Object.freeze(['true', '1', 'si', 'yes', 'on']);
const FALSOS = Object.freeze(['false', '0', 'no', 'off']);

function convertir(clave, crudo, regla, problemas) {
  if (regla.tipo === 'texto') {
    const texto = crudo.trim();

    if (texto === '') {
      problemas.push(`${clave} esta vacia.`);
      return undefined;
    }

    if (regla.minimo !== undefined && texto.length < regla.minimo) {
      problemas.push(`${clave} debe tener al menos ${regla.minimo} caracteres.`);
      return undefined;
    }

    return texto;
  }

  if (regla.tipo === 'entero' || regla.tipo === 'decimal') {
    const numero = Number(crudo);

    if (!Number.isFinite(numero)) {
      problemas.push(`${clave} debe ser un numero y llego "${crudo}".`);
      return undefined;
    }

    if (regla.tipo === 'entero' && !Number.isInteger(numero)) {
      problemas.push(`${clave} debe ser un entero y llego "${crudo}".`);
      return undefined;
    }

    if (regla.minimo !== undefined && numero < regla.minimo) {
      problemas.push(`${clave} debe ser mayor o igual a ${regla.minimo}.`);
      return undefined;
    }

    if (regla.maximo !== undefined && numero > regla.maximo) {
      problemas.push(`${clave} debe ser menor o igual a ${regla.maximo}.`);
      return undefined;
    }

    return numero;
  }

  if (regla.tipo === 'booleano') {
    const normalizado = crudo.trim().toLowerCase();

    if (VERDADEROS.includes(normalizado)) return true;
    if (FALSOS.includes(normalizado)) return false;

    problemas.push(
      `${clave} debe ser ${VERDADEROS.join('/')} o ${FALSOS.join('/')}, y llego "${crudo}".`,
    );

    return undefined;
  }

  const normalizado = crudo.trim().toLowerCase();

  if (!regla.valores.includes(normalizado)) {
    problemas.push(`${clave} debe ser uno de: ${regla.valores.join(', ')}. Llego "${crudo}".`);
    return undefined;
  }

  return normalizado;
}

/**
 * Construye la configuracion a partir de un objeto de entorno.
 *
 * Recibe el entorno como parametro en vez de leer `process.env` por dentro:
 * asi las pruebas pueden pasar entornos inventados sin ensuciar el proceso.
 *
 * Falla de golpe con **todos** los problemas, no con el primero. Arreglar la
 * configuracion de una vez es mejor que descubrir los errores de uno en uno.
 *
 * @throws {ConfiguracionInvalidaError}
 */
export function cargarConfiguracion(entorno = process.env) {
  const problemas = [];
  const configuracion = {};

  for (const [clave, regla] of Object.entries(ESQUEMA)) {
    const crudo = entorno[clave];

    if (crudo === undefined || crudo === '') {
      if (regla.obligatoria) {
        problemas.push(`${clave} es obligatoria y no esta definida.`);
        continue;
      }

      configuracion[clave] = regla.porDefecto;
      continue;
    }

    const valor = convertir(clave, String(crudo), regla, problemas);

    if (valor !== undefined) {
      configuracion[clave] = valor;
    }
  }

  if (problemas.length > 0) {
    throw new ConfiguracionInvalidaError(problemas);
  }

  return Object.freeze({
    ...configuracion,
    esProduccion: configuracion.NODE_ENV === 'production',
    esDesarrollo: configuracion.NODE_ENV === 'development',
    esPruebas: configuracion.NODE_ENV === 'test',
  });
}

/**
 * Oculta los valores marcados como secretos.
 *
 * Se deja ver el principio y el final para poder reconocer cual clave es sin
 * revelarla. Todo lo que se imprima o se devuelva por HTTP debe pasar por aqui.
 */
export function ocultarSecretos(configuracion) {
  const visible = {};

  for (const [clave, valor] of Object.entries(configuracion)) {
    const regla = ESQUEMA[clave];

    if (regla?.secreto && typeof valor === 'string') {
      visible[clave] =
        valor.length <= 8
          ? '********'
          : `${valor.slice(0, 3)}${'*'.repeat(8)}${valor.slice(-2)}`;
      continue;
    }

    visible[clave] = valor;
  }

  return visible;
}
