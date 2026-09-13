/**
 * Servicio que explica ES Modules desde dentro.
 *
 * Igual que el ejercicio 03 hacia con CommonJS, aqui el sistema de modulos es
 * el dato: se usan `import.meta`, import dinamico y top-level await, que son
 * cosas propias de ESM.
 */

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { radioActual } from '../lib/zona.js';

// En ESM no existen __dirname ni __filename. El equivalente es import.meta.url,
// que es una URL (file://...), no una ruta. Hay que convertirla.
const ARCHIVO_ACTUAL = fileURLToPath(import.meta.url);
const CARPETA_ACTUAL = path.dirname(ARCHIVO_ACTUAL);

// Top-level await: en ESM se puede esperar fuera de una funcion async. En
// CommonJS esto es un error de sintaxis. Se resuelve una vez, al cargar.
const { default: RAREZAS } = await import('../lib/rareza.js');

/** Datos del propio modulo, al estilo ESM. */
export function obtenerInfoModulo() {
  return {
    sistema: 'ES Modules',
    archivo: path.basename(ARCHIVO_ACTUAL),
    carpeta: path.basename(CARPETA_ACTUAL),
    urlDelModulo: `file://.../${path.basename(ARCHIVO_ACTUAL)}`,
    equivalencias: {
      __filename: 'fileURLToPath(import.meta.url)',
      __dirname: 'path.dirname(fileURLToPath(import.meta.url))',
      require: 'createRequire(import.meta.url)',
    },
    rarezasCargadasConTopLevelAwait: Object.keys(RAREZAS),
  };
}

/**
 * Carga un modulo solo cuando hace falta, con import dinamico.
 *
 * `import()` devuelve una promesa y acepta una ruta calculada en tiempo de
 * ejecucion, cosa que el `import` estatico no permite.
 */
export async function cargarModuloBajoDemanda(nombre) {
  const permitidos = { zona: '../lib/zona.js', rareza: '../lib/rareza.js' };

  if (!(nombre in permitidos)) {
    return { cargado: false, motivo: `Modulo no permitido: ${nombre}.` };
  }

  const modulo = await import(permitidos[nombre]);

  return {
    cargado: true,
    modulo: nombre,
    exportaciones: Object.keys(modulo).sort(),
    tieneDefault: 'default' in modulo,
  };
}

/**
 * Demuestra el live binding: se lee `radioActual` importado arriba y el valor
 * refleja los cierres de zona que hayan pasado, sin reimportar el modulo.
 */
export function leerZonaViaBindingVivo() {
  return { radioActualSegunElImport: radioActual };
}

/** Interoperabilidad: cargar un modulo CommonJS desde ESM. */
export function comprobarInteropConCommonJS() {
  const require = createRequire(import.meta.url);
  const rutaExpress = require.resolve('express');

  return {
    createRequireDisponible: typeof require === 'function',
    expressResueltoDesdeEsm: rutaExpress.includes('express'),
  };
}
