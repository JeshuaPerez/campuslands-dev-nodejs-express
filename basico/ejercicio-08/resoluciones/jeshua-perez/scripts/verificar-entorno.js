/**
 * Comprueba el entorno e imprime el diagnostico, sin arrancar el servidor.
 *
 * Util antes de un despliegue: dice exactamente que falta.
 */

import { ConfiguracionInvalidaError, cargarConfiguracion, ocultarSecretos } from '../src/config/index.js';
import { ESQUEMA } from '../src/config/esquema.js';

console.log('\n=== Variables declaradas ===\n');

console.table(
  Object.entries(ESQUEMA).map(([clave, regla]) => ({
    variable: clave,
    tipo: regla.tipo,
    obligatoria: Boolean(regla.obligatoria),
    secreto: Boolean(regla.secreto),
    porDefecto: regla.porDefecto ?? '(ninguno)',
    definida: process.env[clave] !== undefined,
  })),
);

try {
  const configuracion = cargarConfiguracion(process.env);

  console.log('\n=== Configuracion valida ===\n');
  console.table(ocultarSecretos(configuracion));
  console.log('Todo listo para arrancar.\n');
} catch (error) {
  if (!(error instanceof ConfiguracionInvalidaError)) throw error;

  console.log('\n=== Configuracion invalida ===\n');
  error.problemas.forEach((problema) => console.log(`  - ${problema}`));
  console.log('\nCopia .env.example a .env y completa lo que falte.\n');

  process.exitCode = 1;
}
