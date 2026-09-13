/**
 * Servicio de rutas seguras.
 *
 * Tema del ejercicio: el modulo `path` y como resolver rutas que vienen del
 * cliente sin dejar que se escapen de la carpeta publica.
 *
 * La idea central: nunca decidir si una ruta es segura mirando el texto que
 * mando el usuario. Hay que resolverla primero a una ruta absoluta y despues
 * comprobar donde cayo.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

export class RutaInseguraError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'RutaInseguraError';
    this.statusCode = 403;
  }
}

const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/** Carpeta que si se puede servir. */
export const CARPETA_PUBLICA = path.join(RAIZ_PROYECTO, 'publico');

/** Extensiones permitidas. Una lista blanca es mas segura que una negra. */
export const EXTENSIONES_PERMITIDAS = Object.freeze(['.txt', '.json', '.md']);

/**
 * Comprobacion INGENUA, aqui solo para demostrar por que falla.
 *
 * `startsWith(CARPETA_PUBLICA)` sin el separador deja pasar cualquier carpeta
 * hermana cuyo nombre empiece igual: "publico-privado" empieza por "publico".
 *
 * No se usa en produccion. Las pruebas la comparan contra la version buena.
 */
export function pareceSeguraIngenuo(entrada) {
  const resuelta = path.resolve(CARPETA_PUBLICA, entrada);

  return resuelta.startsWith(CARPETA_PUBLICA);
}

/**
 * Comprueba que una ruta absoluta cae dentro de una carpeta base.
 *
 * Se apoya en `path.relative`: si para ir de la base al destino hay que subir
 * (el resultado empieza por "..") o el destino es absoluto respecto a otra
 * raiz, entonces esta fuera. Es mas robusto que comparar textos.
 */
export function estaDentroDe(base, destino) {
  const relativa = path.relative(base, destino);

  return (
    relativa !== '' &&
    !relativa.startsWith('..') &&
    !path.isAbsolute(relativa)
  );
}

/**
 * Resuelve un nombre de archivo pedido por el cliente, o falla.
 *
 * Capas de defensa, en orden:
 *  1. Tipo y contenido: string no vacio, sin byte nulo.
 *  2. Sin rutas absolutas ni letra de unidad de Windows.
 *  3. Resolucion a ruta absoluta (normaliza ".." y "." por el camino).
 *  4. Comprobacion de que el resultado cae dentro de la carpeta publica.
 *  5. Lista blanca de extensiones.
 *
 * @throws {RutaInseguraError} si cualquier capa falla.
 */
export function resolverRutaPublica(entrada) {
  if (typeof entrada !== 'string' || entrada.trim() === '') {
    throw new RutaInseguraError('El nombre del archivo es obligatorio.');
  }

  // El byte nulo trunca cadenas en APIs de bajo nivel: "a.txt\0.png" podria
  // pasar una validacion de extension y abrirse como "a.txt".
  if (entrada.includes('\0')) {
    throw new RutaInseguraError('El nombre contiene un byte nulo.');
  }

  // Se normalizan las barras invertidas para tratar igual las dos notaciones.
  const normalizada = entrada.replaceAll('\\', '/');

  if (path.posix.isAbsolute(normalizada) || /^[a-zA-Z]:/.test(normalizada)) {
    throw new RutaInseguraError('No se admiten rutas absolutas.');
  }

  const resuelta = path.resolve(CARPETA_PUBLICA, normalizada);

  if (!estaDentroDe(CARPETA_PUBLICA, resuelta)) {
    throw new RutaInseguraError(`La ruta sale de la carpeta publica: ${entrada}`);
  }

  const extension = path.extname(resuelta).toLowerCase();

  if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
    throw new RutaInseguraError(
      `Extension no permitida: ${extension || '(ninguna)'}. Permitidas: ${EXTENSIONES_PERMITIDAS.join(', ')}.`,
    );
  }

  return resuelta;
}

/**
 * Describe una ruta con las operaciones del modulo `path`.
 *
 * Sirve para ver de un vistazo que hace cada funcion sobre la misma entrada.
 */
export function describirRuta(entrada) {
  if (typeof entrada !== 'string' || entrada === '') {
    throw new RutaInseguraError('Se necesita una ruta para describir.');
  }

  const partes = path.parse(entrada);

  return {
    entrada,
    // join pega segmentos y normaliza; resolve produce una ruta absoluta.
    join: path.join('publico', entrada),
    resolve: path.resolve(CARPETA_PUBLICA, entrada).replace(RAIZ_PROYECTO, '<proyecto>'),
    normalize: path.normalize(entrada),
    esAbsoluta: path.isAbsolute(entrada),
    dirname: path.dirname(entrada),
    basename: path.basename(entrada),
    nombreSinExtension: partes.name,
    extension: partes.ext,
    // path.posix y path.win32 permiten forzar una notacion concreta.
    comoPosix: path.posix.normalize(entrada.replaceAll('\\', '/')),
    separadorDelSistema: path.sep,
  };
}

export { RAIZ_PROYECTO };
