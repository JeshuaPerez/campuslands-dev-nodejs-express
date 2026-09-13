/**
 * Servicio de dominio: manuales y fichas del taller de motos.
 *
 * Se apoya en `rutas.service.js` para no tocar el disco con rutas sin validar.
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import {
  CARPETA_PUBLICA,
  EXTENSIONES_PERMITIDAS,
  resolverRutaPublica,
} from './rutas.service.js';

export class DocumentoNoEncontradoError extends Error {
  constructor(nombre) {
    super(`No existe el documento: ${nombre}`);
    this.name = 'DocumentoNoEncontradoError';
    this.statusCode = 404;
  }
}

/**
 * Lista todos los documentos servibles, recorriendo subcarpetas.
 *
 * Las rutas se devuelven relativas a la carpeta publica y con barras normales,
 * para que el cliente las pueda pedir igual en Windows y en Linux.
 */
export async function listarDocumentos(carpeta = CARPETA_PUBLICA) {
  const entradas = await readdir(carpeta, { withFileTypes: true });

  const documentos = await Promise.all(
    entradas.map(async (entrada) => {
      const rutaCompleta = path.join(carpeta, entrada.name);

      if (entrada.isDirectory()) {
        return listarDocumentos(rutaCompleta);
      }

      if (!EXTENSIONES_PERMITIDAS.includes(path.extname(entrada.name).toLowerCase())) {
        return [];
      }

      const info = await stat(rutaCompleta);

      return [
        {
          // path.relative da el camino de la base al archivo; se pasa a barras
          // normales para que la ruta publica sea igual en todos los sistemas.
          ruta: path.relative(CARPETA_PUBLICA, rutaCompleta).replaceAll(path.sep, '/'),
          nombre: entrada.name,
          extension: path.extname(entrada.name),
          bytes: info.size,
        },
      ];
    }),
  );

  return documentos.flat().sort((a, b) => a.ruta.localeCompare(b.ruta));
}

/**
 * Lee un documento pedido por el cliente.
 *
 * @throws {RutaInseguraError} si la ruta no supera la validacion (403).
 * @throws {DocumentoNoEncontradoError} si la ruta es valida pero no existe (404).
 */
export async function leerDocumento(entrada) {
  const ruta = resolverRutaPublica(entrada);

  try {
    const contenido = await readFile(ruta, 'utf8');

    return {
      ruta: path.relative(CARPETA_PUBLICA, ruta).replaceAll(path.sep, '/'),
      nombre: path.basename(ruta),
      extension: path.extname(ruta),
      lineas: contenido.split(/\r?\n/).filter((linea) => linea.trim() !== '').length,
      contenido,
    };
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      throw new DocumentoNoEncontradoError(entrada);
    }

    throw error;
  }
}
