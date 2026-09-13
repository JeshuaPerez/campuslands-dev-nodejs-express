/**
 * Servicio de acceso a archivos.
 *
 * Tema del ejercicio: leer del disco con `fs`. Toda la entrada/salida vive
 * aqui para que los servicios de dominio reciban datos ya parseados y no
 * sepan nada del sistema de archivos.
 *
 * Se usa `node:fs/promises` (API con promesas) en lugar de callbacks o de la
 * version sincrona: no bloquea el bucle de eventos, que es justo lo que un
 * servidor no se puede permitir.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Carpeta de datos, resuelta relativa a este archivo y no al cwd. */
const CARPETA_DATOS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'datos',
);

/** Error de archivo no encontrado, con el status HTTP que le toca. */
export class ArchivoNoEncontradoError extends Error {
  constructor(nombre) {
    super(`No existe el archivo de datos: ${nombre}`);
    this.name = 'ArchivoNoEncontradoError';
    this.statusCode = 404;
  }
}

/** Error de archivo presente pero ilegible o mal formado. */
export class ArchivoInvalidoError extends Error {
  constructor(nombre, detalle) {
    super(`El archivo ${nombre} no se pudo interpretar: ${detalle}`);
    this.name = 'ArchivoInvalidoError';
    this.statusCode = 422;
  }
}

/**
 * Resuelve un nombre de archivo dentro de la carpeta de datos.
 *
 * Importante: se comprueba que la ruta resuelta siga colgando de CARPETA_DATOS.
 * Sin eso, un nombre como `../../.env` permitiria leer archivos de fuera. Es la
 * trampa clasica al combinar `fs` con datos que llegan del cliente.
 */
function resolverRutaSegura(nombre) {
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    throw new ArchivoNoEncontradoError(String(nombre));
  }

  const rutaFinal = path.resolve(CARPETA_DATOS, nombre);

  if (rutaFinal !== CARPETA_DATOS && !rutaFinal.startsWith(CARPETA_DATOS + path.sep)) {
    throw new ArchivoNoEncontradoError(nombre);
  }

  return rutaFinal;
}

/**
 * Lee un archivo de texto de la carpeta de datos.
 *
 * @throws {ArchivoNoEncontradoError} si no existe (ENOENT).
 */
export async function leerTexto(nombre) {
  const ruta = resolverRutaSegura(nombre);

  try {
    return await readFile(ruta, 'utf8');
  } catch (error) {
    // ENOENT es el codigo que pone Node cuando el archivo no existe. Conviene
    // distinguirlo de un fallo real de disco en lugar de tragarse todo.
    if (error.code === 'ENOENT') {
      throw new ArchivoNoEncontradoError(nombre);
    }

    throw error;
  }
}

/**
 * Lee y parsea un archivo JSON de la carpeta de datos.
 *
 * @throws {ArchivoNoEncontradoError} si no existe.
 * @throws {ArchivoInvalidoError} si el contenido no es JSON valido.
 */
export async function leerJson(nombre) {
  const contenido = await leerTexto(nombre);

  try {
    return JSON.parse(contenido);
  } catch (error) {
    throw new ArchivoInvalidoError(nombre, error.message);
  }
}

/**
 * Lee un CSV y lo convierte en objetos, usando la primera fila como cabecera.
 *
 * Es un parser deliberadamente simple: no cubre comillas ni comas escapadas.
 * Para eso se usaria una libreria, pero el ejercicio pide practicar `fs`.
 *
 * @throws {ArchivoInvalidoError} si el CSV esta vacio o alguna fila descuadra.
 */
export async function leerCsv(nombre) {
  const contenido = await leerTexto(nombre);

  const filas = contenido
    .split(/\r?\n/)
    .map((fila) => fila.trim())
    .filter((fila) => fila !== '');

  if (filas.length < 2) {
    throw new ArchivoInvalidoError(nombre, 'necesita una cabecera y al menos una fila');
  }

  const cabecera = filas[0].split(',').map((columna) => columna.trim());

  return filas.slice(1).map((fila, indice) => {
    const celdas = fila.split(',').map((celda) => celda.trim());

    if (celdas.length !== cabecera.length) {
      throw new ArchivoInvalidoError(
        nombre,
        `la fila ${indice + 2} tiene ${celdas.length} columnas y la cabecera ${cabecera.length}`,
      );
    }

    return Object.fromEntries(
      cabecera.map((columna, posicion) => {
        const valor = celdas[posicion];
        // Se convierte a numero solo si la celda entera lo es.
        const numero = Number(valor);

        return [columna, valor !== '' && Number.isFinite(numero) ? numero : valor];
      }),
    );
  });
}

/** Lista los archivos disponibles en la carpeta de datos, con su tamano. */
export async function listarArchivos() {
  const nombres = await readdir(CARPETA_DATOS);

  const archivos = await Promise.all(
    nombres.map(async (nombre) => {
      const info = await stat(path.join(CARPETA_DATOS, nombre));

      return {
        nombre,
        extension: path.extname(nombre).replace('.', ''),
        bytes: info.size,
        esArchivo: info.isFile(),
      };
    }),
  );

  return archivos.filter((archivo) => archivo.esArchivo).sort((a, b) =>
    a.nombre.localeCompare(b.nombre),
  );
}

export { CARPETA_DATOS };
