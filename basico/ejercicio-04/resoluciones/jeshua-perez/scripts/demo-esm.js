/**
 * Demuestra por consola lo que distingue a ES Modules de CommonJS.
 *
 * El punto central: los live bindings. Se importa `radioActual` una sola vez y
 * su valor cambia solo cuando la zona se cierra. En CommonJS, destructurar el
 * require habria congelado el numero.
 */

import { encogerZona, radioActual, reiniciarZona } from '../src/lib/zona.js';

reiniciarZona();

console.log('\n=== Live bindings de ES Modules ===\n');

// Copia manual: esto SI es una foto del valor, y se quedara atras.
const copiaCongelada = radioActual;

console.log(`Radio al importar:        ${radioActual}`);
console.log(`Copia guardada en const:  ${copiaCongelada}`);

encogerZona(250);
encogerZona(250);

console.log(`\nDespues de dos cierres de 250 m:`);
console.log(`Radio leido del import:   ${radioActual}   <- se actualizo solo`);
console.log(`Copia guardada en const:  ${copiaCongelada}   <- sigue congelada`);

console.log(
  '\nEn CommonJS, const { radioActual } = require(...) se comportaria como la copia.\n',
);

console.log('=== Import dinamico y top-level await ===\n');

// import() acepta una ruta calculada en ejecucion y devuelve una promesa.
const nombreModulo = 'rareza';
const modulo = await import(`../src/lib/${nombreModulo}.js`);

console.table({
  moduloCargado: nombreModulo,
  tieneDefault: 'default' in modulo,
  namedExports: Object.keys(modulo).filter((clave) => clave !== 'default').join(', '),
});

console.log('El await de arriba esta fuera de toda funcion: eso solo existe en ESM.\n');
