#!/usr/bin/env node
/**
 * CLI del concesionario.
 *
 * Se escribe como funcion `ejecutar(argv)` que devuelve un codigo de salida, en
 * vez de llamar a process.exit por dentro. Asi las pruebas la pueden invocar
 * sin matar el proceso de pruebas.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ArgumentoInvalidoError,
  aCriterios,
  extraerArgumentos,
  parsearConUtil,
} from './argumentos.js';
import { COMANDOS, textoDeAyuda } from './ayuda.js';
import {
  ValidacionError,
  buscarAutos,
  obtenerCatalogo,
  resumirInventario,
} from '../services/inventario.service.js';

export const SALIDA_OK = 0;
export const SALIDA_ARGUMENTOS = 1;
export const SALIDA_COMANDO = 2;

const formatoPesos = new Intl.NumberFormat('es-CO');

function comoTabla(autos) {
  return autos.map(({ marca, modelo, anio, cv, stock, precio }) => ({
    marca,
    modelo,
    anio,
    cv,
    stock,
    precio: formatoPesos.format(precio),
  }));
}

function imprimirAutos(autos, comoJson) {
  if (comoJson) {
    console.log(JSON.stringify(autos, null, 2));
    return;
  }

  if (autos.length === 0) {
    console.log('Ningun auto cumple esos criterios.');
    return;
  }

  console.table(comoTabla(autos));
  console.log(`${autos.length} resultado(s).`);
}

/**
 * Ejecuta el CLI.
 *
 * @param {string[]} argv normalmente process.argv.
 * @returns {number} el codigo de salida.
 */
export function ejecutar(argv = process.argv) {
  const argumentos = extraerArgumentos(argv);

  let parseado;

  try {
    parseado = parsearConUtil(argumentos);
  } catch (error) {
    if (error instanceof ArgumentoInvalidoError) {
      console.error(`Error en los argumentos: ${error.message}`);
      console.error('Usa --ayuda para ver las opciones disponibles.');

      return SALIDA_ARGUMENTOS;
    }

    throw error;
  }

  const { opciones, sueltos } = parseado;
  const comando = sueltos[0] ?? 'ayuda';

  if (opciones.ayuda || comando === 'ayuda') {
    console.log(textoDeAyuda());

    return SALIDA_OK;
  }

  if (!COMANDOS.includes(comando)) {
    console.error(`Comando desconocido: ${comando}`);
    console.error(`Comandos validos: ${COMANDOS.join(', ')}.`);

    return SALIDA_COMANDO;
  }

  try {
    if (comando === 'listar') {
      imprimirAutos(obtenerCatalogo(), opciones.json);

      return SALIDA_OK;
    }

    if (comando === 'buscar') {
      imprimirAutos(buscarAutos(aCriterios(opciones)), opciones.json);

      return SALIDA_OK;
    }

    const resumen = resumirInventario();

    if (opciones.json) {
      console.log(JSON.stringify(resumen, null, 2));

      return SALIDA_OK;
    }

    console.log('\nResumen del inventario\n');
    console.log(`  Modelos:       ${resumen.modelos}`);
    console.log(`  Unidades:      ${resumen.unidades}`);
    console.log(`  Marcas:        ${resumen.marcas.join(', ')}`);
    console.log(`  Sin stock:     ${resumen.sinStock.join(', ') || 'ninguno'}`);
    console.log(`  Precio medio:  ${formatoPesos.format(resumen.precioMedio)}`);
    console.log(`  Valor stock:   ${formatoPesos.format(resumen.valorStock)}`);
    console.log(`  Mas potente:   ${resumen.masPotente.modelo} (${resumen.masPotente.cv} CV)\n`);

    return SALIDA_OK;
  } catch (error) {
    if (error instanceof ValidacionError) {
      console.error(`Error: ${error.message}`);

      return SALIDA_ARGUMENTOS;
    }

    throw error;
  }
}

// Solo se ejecuta si este archivo es el punto de entrada, no al importarlo.
// Comparar la ruta resuelta evita depender de la notacion de barras del sistema.
const esEntrada =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (esEntrada) {
  process.exitCode = ejecutar(process.argv);
}
