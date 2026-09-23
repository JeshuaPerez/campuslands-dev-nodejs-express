import { readFile } from "node:fs/promises";

/**
 * Parsea un CSV simple (sin comillas ni comas escapadas) a un arreglo de
 * objetos, usando la primera linea como encabezados.
 */
export function parsearCsv(contenido) {
  const lineas = contenido.trim().split("\n");
  const [encabezado, ...filas] = lineas;
  const columnas = encabezado.split(",").map((c) => c.trim());

  return filas
    .filter((linea) => linea.trim())
    .map((linea) => {
      const valores = linea.split(",").map((v) => v.trim());
      return Object.fromEntries(columnas.map((columna, i) => [columna, valores[i]]));
    });
}

export async function leerResultados(rutaArchivo) {
  const contenido = await readFile(rutaArchivo, "utf-8");
  return parsearCsv(contenido);
}
