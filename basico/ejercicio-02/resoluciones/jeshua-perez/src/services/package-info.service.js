/**
 * Servicio que lee el propio package.json del proyecto.
 *
 * El tema del ejercicio es package.json y sus scripts, asi que el manifiesto
 * es aqui el dato de negocio: se lee del disco, se valida y se expone.
 */

import { readFile } from 'node:fs/promises';

/** Para que sirve cada script declarado. Se muestra en la API y en la consola. */
const DESCRIPCIONES = Object.freeze({
  prestart: 'Hook automatico: valida el entorno antes de `npm start`.',
  start: 'Levanta la API en el puerto configurado.',
  dev: 'Levanta la API recargando al guardar (node --watch).',
  'scripts:listar': 'Imprime esta misma tabla de scripts por consola.',
  loadout: 'Genera un loadout desde la consola. Admite `-- <arma> <estilo>`.',
  test: 'Ejecuta la bateria de pruebas con el runner nativo de Node.',
  'test:watch': 'Reejecuta las pruebas al guardar cambios.',
  validar: 'Encadena el reporte de scripts y las pruebas en un solo comando.',
});

// `new URL` resuelve relativo a este archivo, no al directorio desde el que se
// invoco el proceso. Asi el servicio funciona sin importar el cwd.
const RUTA_PACKAGE = new URL('../../package.json', import.meta.url);

/**
 * Lee y parsea el package.json del proyecto.
 *
 * @returns {Promise<object>} el manifiesto completo.
 */
async function leerPackageJson() {
  const contenido = await readFile(RUTA_PACKAGE, 'utf8');

  return JSON.parse(contenido);
}

/**
 * Resume el manifiesto para exponerlo por HTTP, sin volcarlo entero.
 */
async function obtenerResumenPaquete() {
  const paquete = await leerPackageJson();

  return {
    nombre: paquete.name,
    version: paquete.version,
    tipoModulo: paquete.type,
    nodeRequerido: paquete.engines?.node ?? 'sin restriccion',
    dependencias: Object.keys(paquete.dependencies ?? {}),
    totalScripts: Object.keys(paquete.scripts ?? {}).length,
  };
}

/**
 * Lista los scripts con su comando y su proposito.
 *
 * @returns {Promise<Array<{nombre: string, comando: string, proposito: string, invocacion: string}>>}
 */
async function listarScripts() {
  const paquete = await leerPackageJson();

  return Object.entries(paquete.scripts ?? {}).map(([nombre, comando]) => ({
    nombre,
    comando,
    proposito: DESCRIPCIONES[nombre] ?? 'Sin descripcion registrada.',
    // start y test son scripts reservados: npm los acepta sin `run`.
    invocacion: ['start', 'test'].includes(nombre) ? `npm ${nombre}` : `npm run ${nombre}`,
  }));
}

export { DESCRIPCIONES, leerPackageJson, listarScripts, obtenerResumenPaquete };
