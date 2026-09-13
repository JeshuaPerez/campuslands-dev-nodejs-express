/**
 * CLI de dominio: genera un loadout de shooter desde la consola.
 *
 * Muestra como pasar argumentos a un script de npm usando el separador `--`:
 *   npm run loadout -- AWP tactico
 */

import { ValidacionError, crearLoadout } from '../src/services/loadout.service.js';

const [armaPrincipal, estilo] = process.argv.slice(2);

try {
  const loadout = crearLoadout({
    armaPrincipal: armaPrincipal ?? 'AK-47',
    estilo,
  });

  console.log('\nLoadout generado:');
  console.table(loadout);
} catch (error) {
  if (error instanceof ValidacionError) {
    console.error(`\nEntrada invalida: ${error.message}`);
  } else {
    console.error('\nError inesperado:', error);
  }

  process.exitCode = 1;
}
