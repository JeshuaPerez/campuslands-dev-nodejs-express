/**
 * Repositorio de persistencia en un archivo JSON.
 *
 * Escribir en disco tiene dos problemas que no se ven hasta que muerden:
 *
 *  1. **Escritura a medias.** Si el proceso muere mientras `writeFile` esta
 *     a la mitad, el archivo queda truncado y se pierden todos los datos.
 *     Solucion: escribir en un temporal y renombrarlo encima. El renombrado
 *     es atomico en el mismo sistema de archivos, asi que o esta el archivo
 *     viejo entero o el nuevo entero, nunca una mezcla.
 *
 *  2. **Escrituras concurrentes.** Dos peticiones que guarden a la vez se
 *     pisan: la ultima gana y la otra se pierde. Solucion: encadenar las
 *     escrituras en una cola, para que se apliquen de una en una.
 */

import { readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

export class DatosCorruptosError extends Error {
  constructor(ruta, detalle) {
    super(`El archivo ${path.basename(ruta)} no contiene JSON valido: ${detalle}`);
    this.name = 'DatosCorruptosError';
    this.statusCode = 500;
  }
}

export function crearRepositorioJson(rutaArchivo, valorInicial = {}) {
  // La cola: cada escritura se engancha al final de la anterior. Mientras una
  // esta en curso, la siguiente espera en vez de pisarla.
  let cola = Promise.resolve();

  async function leer() {
    try {
      const contenido = await readFile(rutaArchivo, 'utf8');

      return JSON.parse(contenido);
    } catch (error) {
      // Si el archivo no existe todavia, se arranca con el valor inicial.
      if (error.code === 'ENOENT') {
        return structuredClone(valorInicial);
      }

      if (error instanceof SyntaxError) {
        throw new DatosCorruptosError(rutaArchivo, error.message);
      }

      throw error;
    }
  }

  /** Escritura atomica: temporal + renombrado. */
  async function escribirAtomico(datos) {
    const temporal = `${rutaArchivo}.${process.pid}.tmp`;

    // El tercer argumento de stringify indenta: el archivo queda legible y sus
    // diffs en git son utiles, en vez de una sola linea kilometrica.
    const contenido = `${JSON.stringify(datos, null, 2)}\n`;

    try {
      await writeFile(temporal, contenido, 'utf8');
      await rename(temporal, rutaArchivo);
    } catch (error) {
      // Si algo fallo, no dejar basura por ahi.
      await unlink(temporal).catch(() => {});
      throw error;
    }

    return datos;
  }

  /**
   * Lee, aplica una transformacion y guarda, todo dentro de la cola.
   *
   * Que la lectura ocurra tambien dentro de la cola es lo que evita el
   * "lost update": si se leyera fuera, dos peticiones podrian partir del
   * mismo estado viejo y la segunda borraria el cambio de la primera.
   *
   * @param {(datos: object) => object} transformar
   */
  function actualizar(transformar) {
    const resultado = cola.then(async () => {
      const datos = await leer();
      const nuevos = transformar(structuredClone(datos));

      await escribirAtomico(nuevos);

      return nuevos;
    });

    // La cola sigue viva aunque esta operacion falle, para no bloquear al resto.
    cola = resultado.catch(() => {});

    return resultado;
  }

  return { actualizar, escribirAtomico, leer, rutaArchivo };
}
