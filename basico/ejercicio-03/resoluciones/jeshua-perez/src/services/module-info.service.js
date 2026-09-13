/**
 * Servicio que explica el sistema de modulos CommonJS desde dentro.
 *
 * El tema del ejercicio es CommonJS, asi que el propio sistema de modulos es
 * el dato: aqui se leen `__dirname`, `__filename`, `require.resolve` y
 * `require.cache`, que son cosas que existen en CommonJS y no en ES Modules.
 */

const path = require('node:path');

const contador = require('../lib/contador');

/**
 * Devuelve las variables que CommonJS inyecta en cada modulo.
 *
 * En CommonJS el codigo corre envuelto en una funcion con los parametros
 * (exports, require, module, __filename, __dirname). Por eso existen sin
 * importarlas. En ES Modules no existen: alli se usa `import.meta.url`.
 */
function obtenerInfoModulo() {
  return {
    sistema: 'CommonJS',
    archivo: path.basename(__filename),
    carpeta: path.basename(__dirname),
    esModuloPrincipal: require.main === module,
    // Los 5 parametros del envoltorio que Node pone alrededor de cada modulo.
    variablesInyectadas: ['exports', 'require', 'module', '__filename', '__dirname'],
  };
}

/**
 * Demuestra que `require` cachea: dos require del mismo modulo devuelven
 * exactamente el mismo objeto, no dos copias.
 */
function comprobarCacheDeRequire() {
  const primera = require('../lib/contador');
  const segunda = require('../lib/contador');

  const rutaResuelta = require.resolve('../lib/contador');

  return {
    mismaReferencia: primera === segunda,
    estaEnCache: Boolean(require.cache[rutaResuelta]),
    archivoResuelto: path.basename(rutaResuelta),
    cargadoEn: contador.cargadoEn,
    draftsRegistrados: contador.obtenerTotal(),
  };
}

/** Cuantos modulos del propio proyecto llevan cargados en el cache. */
function contarModulosEnCache() {
  const propios = Object.keys(require.cache).filter(
    (ruta) => !ruta.includes('node_modules'),
  );

  return {
    total: propios.length,
    archivos: propios.map((ruta) => path.basename(ruta)).sort(),
  };
}

module.exports = {
  comprobarCacheDeRequire,
  contarModulosEnCache,
  obtenerInfoModulo,
};
