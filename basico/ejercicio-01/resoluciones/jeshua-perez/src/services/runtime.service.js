/**
 * Servicio de runtime.
 *
 * Tema del ejercicio: leer informacion del runtime de Node y mostrarla por
 * consola. Toda la lectura de `process` vive aqui para que los controladores
 * y el CLI no dependan directamente de la API global.
 */

const BYTES_POR_MB = 1024 * 1024;

/**
 * Devuelve una foto del runtime en el momento de la llamada.
 *
 * @returns {{nodeVersion: string, plataforma: string, arquitectura: string,
 *            pid: number, uptimeSegundos: number, memoriaHeapMb: number}}
 */
function obtenerInfoRuntime() {
  const memoria = process.memoryUsage();

  return {
    nodeVersion: process.version,
    plataforma: process.platform,
    arquitectura: process.arch,
    pid: process.pid,
    uptimeSegundos: Number(process.uptime().toFixed(3)),
    memoriaHeapMb: Number((memoria.heapUsed / BYTES_POR_MB).toFixed(2)),
  };
}

/**
 * Comprueba que la version de Node cumple el minimo pedido por el ejercicio.
 *
 * @param {number} [minimo=20] version mayor minima requerida.
 * @returns {{cumple: boolean, versionMayor: number, minimoRequerido: number}}
 */
function verificarVersionMinima(minimo = 20) {
  const versionMayor = Number.parseInt(process.versions.node.split('.')[0], 10);

  return {
    cumple: versionMayor >= minimo,
    versionMayor,
    minimoRequerido: minimo,
  };
}

export { obtenerInfoRuntime, verificarVersionMinima };
