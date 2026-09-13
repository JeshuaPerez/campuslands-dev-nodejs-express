/**
 * Se ejecuta solo, antes de `npm start`, gracias al hook `prestart`.
 *
 * Demuestra dos cosas del tema del ejercicio:
 *  - npm inyecta el package.json en el entorno como variables `npm_package_*`.
 *  - un script que termina con codigo distinto de 0 aborta la cadena, asi que
 *    `start` no llega a correr si el entorno no sirve.
 */

const VERSION_MINIMA = 20;

const nombre = process.env.npm_package_name ?? '(desconocido)';
const version = process.env.npm_package_version ?? '(desconocida)';
const versionMayor = Number.parseInt(process.versions.node.split('.')[0], 10);

console.log(`Verificando entorno de ${nombre} v${version}`);

if (versionMayor < VERSION_MINIMA) {
  console.error(
    `Node ${VERSION_MINIMA}+ es requerido y estas en ${process.version}. Se aborta el arranque.`,
  );
  process.exit(1);
}

console.log(`Node ${process.version} cumple el minimo (>= ${VERSION_MINIMA}). Arrancando...`);
