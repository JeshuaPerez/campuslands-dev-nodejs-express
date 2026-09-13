/**
 * Demuestra por consola el ataque de prefijo y las capas de defensa.
 */

import path from 'node:path';

import {
  CARPETA_PUBLICA,
  RutaInseguraError,
  describirRuta,
  pareceSeguraIngenuo,
  resolverRutaPublica,
} from '../src/services/rutas.service.js';

console.log('\n=== El ataque de prefijo ===\n');

// "publico-privado" empieza por "publico". Una comprobacion con startsWith
// a secas, sin el separador, la deja pasar.
const ataque = '../publico-privado/tarifas-internas.txt';

console.log(`Entrada del cliente: ${ataque}`);
console.log(`Resuelve a:          ${path.resolve(CARPETA_PUBLICA, ataque)}`);
console.log(`Carpeta publica:     ${CARPETA_PUBLICA}`);
console.log(`\nComprobacion ingenua (startsWith sin separador): ${pareceSeguraIngenuo(ataque)}  <- la deja pasar`);

try {
  resolverRutaPublica(ataque);
  console.log('Comprobacion buena: la dejo pasar  <- esto seria un fallo');
} catch (error) {
  console.log(`Comprobacion buena: BLOQUEADA -> ${error.message}`);
}

console.log('\n=== Entradas que se rechazan ===\n');

const intentos = [
  '../../../../etc/passwd',
  '/etc/passwd',
  'C:\\Windows\\win.ini',
  '..\\publico-privado\\tarifas-internas.txt',
  'manual-cb500.exe',
  'informes/../../publico-privado/tarifas-internas.txt',
];

console.table(
  intentos.map((intento) => {
    try {
      resolverRutaPublica(intento);
      return { entrada: intento, resultado: 'ACEPTADA (mal)' };
    } catch (error) {
      return {
        entrada: intento,
        resultado: error instanceof RutaInseguraError ? 'bloqueada' : 'error raro',
        motivo: error.message.slice(0, 46),
      };
    }
  }),
);

console.log('\n=== Entradas validas ===\n');

console.table(
  ['manual-cb500.txt', 'informes/orden-1042.txt', './ficha-mt07.txt'].map((entrada) => ({
    entrada,
    aceptada: (() => {
      try {
        resolverRutaPublica(entrada);
        return true;
      } catch {
        return false;
      }
    })(),
  })),
);

console.log('\n=== El modulo path sobre una misma entrada ===\n');
console.table(describirRuta('informes/orden-1042.txt'));
