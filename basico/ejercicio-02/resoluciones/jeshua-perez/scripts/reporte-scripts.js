/**
 * Imprime por consola los scripts declarados en el package.json, con la
 * explicacion de para que sirve cada uno. Es el "npm run" documentado.
 *
 * Reutiliza el mismo servicio que alimenta la API para que la consola y el
 * endpoint nunca digan cosas distintas.
 */

import {
  leerPackageJson,
  listarScripts,
} from '../src/services/package-info.service.js';

const paquete = await leerPackageJson();
const scripts = await listarScripts();

console.log(`\nScripts disponibles en ${paquete.name} v${paquete.version}\n`);

console.table(
  scripts.map(({ invocacion, comando, proposito }) => ({
    invocacion,
    comando,
    proposito,
  })),
);

console.log('Nota: start y test son scripts reservados, npm los acepta sin `run`.\n');
