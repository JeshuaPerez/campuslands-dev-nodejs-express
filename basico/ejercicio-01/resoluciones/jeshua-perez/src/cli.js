/**
 * CLI del ejercicio 01.
 *
 * Aqui se practica la parte de "consola" del tema: leer argumentos con
 * `process.argv`, imprimir con `console.table` / `console.group` y marcar el
 * fallo con `process.exitCode` en vez de lanzar la excepcion sin control.
 *
 * Uso:
 *   node src/cli.js
 *   node src/cli.js Lyra mago 12
 */

import { ValidacionError, crearPersonaje } from './services/character.service.js';
import { obtenerInfoRuntime, verificarVersionMinima } from './services/runtime.service.js';

/**
 * Convierte los argumentos crudos de la consola en datos de personaje.
 * `process.argv` siempre entrega strings, por eso el nivel se parsea aparte.
 */
function leerArgumentos(argv) {
  const [nombre, clase, nivel] = argv.slice(2);

  return {
    nombre: nombre ?? 'Aldric',
    clase,
    nivel: nivel === undefined ? undefined : Number(nivel),
  };
}

function imprimirRuntime() {
  const info = obtenerInfoRuntime();
  const version = verificarVersionMinima(20);

  console.group('Runtime de Node');
  console.table(info);
  console.log(
    version.cumple
      ? `Version soportada (>= ${version.minimoRequerido}).`
      : `Aviso: se recomienda Node ${version.minimoRequerido} o superior.`,
  );
  console.groupEnd();
}

function main(argv = process.argv) {
  imprimirRuntime();

  try {
    const personaje = crearPersonaje(leerArgumentos(argv));

    console.group('\nPersonaje creado');
    console.table(personaje);
    console.groupEnd();
  } catch (error) {
    if (error instanceof ValidacionError) {
      console.error(`\nEntrada invalida: ${error.message}`);
    } else {
      console.error('\nError inesperado:', error);
    }

    // Codigo de salida distinto de 0 para que la consola y CI lo detecten.
    process.exitCode = 1;
  }
}

main();
