/**
 * Demuestra por consola el cache de require.
 *
 * Se requiere el mismo modulo tres veces y se comprueba que el estado es
 * compartido: no se crean tres contadores, se reusa siempre el mismo.
 */

const path = require('node:path');

const primera = require('../src/lib/contador');
const segunda = require('../src/lib/contador');

console.log('\n=== Cache de require ===\n');

console.log(`Misma referencia en dos require: ${primera === segunda}`);
console.log(`Ruta resuelta: ${path.basename(require.resolve('../src/lib/contador'))}`);
console.log(`Modulo cargado en: ${primera.cargadoEn}`);

primera.registrarPartida();
primera.registrarPartida();
segunda.registrarPartida();

console.log(
  `\nSe registraron 2 partidas por la primera referencia y 1 por la segunda.`,
);
console.log(`Total leido desde la segunda referencia: ${segunda.obtenerTotal()}`);
console.log('Si fueran copias distintas, el total seria 1 y no 3.\n');

const propios = Object.keys(require.cache).filter((ruta) => !ruta.includes('node_modules'));

console.log('Modulos propios en require.cache:');
console.table(propios.map((ruta) => ({ archivo: path.basename(ruta) })));
