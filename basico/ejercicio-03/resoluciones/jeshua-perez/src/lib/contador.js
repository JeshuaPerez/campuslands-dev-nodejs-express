/**
 * Modulo con estado, para demostrar el cache de `require`.
 *
 * Node ejecuta el cuerpo de un modulo UNA sola vez y guarda el resultado en
 * `require.cache`. Los `require` siguientes devuelven ese mismo objeto, no una
 * copia. Por eso este contador es compartido por todo el proceso: es el
 * comportamiento que convierte a un modulo CommonJS en un singleton de facto.
 */

// Esta linea corre una unica vez por proceso, por muchos require que se hagan.
let partidasRegistradas = 0;

const cargadoEn = new Date().toISOString();

function registrarPartida() {
  partidasRegistradas += 1;

  return partidasRegistradas;
}

function obtenerTotal() {
  return partidasRegistradas;
}

function reiniciar() {
  partidasRegistradas = 0;
}

// Forma canonica: reasignar module.exports con el objeto publico del modulo.
module.exports = {
  cargadoEn,
  obtenerTotal,
  registrarPartida,
  reiniciar,
};
