/**
 * Mismo modulo, otra forma de exportar.
 *
 * Aqui se usa `exports.x = ...` en lugar de reasignar `module.exports`.
 * Funciona porque `exports` es una referencia al mismo objeto que
 * `module.exports`. Lo que NO funciona es `exports = {...}`: eso solo
 * reapunta la variable local y el modulo acabaria exportando un objeto vacio.
 */

exports.aTitulo = function aTitulo(texto) {
  if (typeof texto !== 'string' || texto.trim() === '') {
    return '';
  }

  return texto
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((palabra) => palabra[0].toUpperCase() + palabra.slice(1))
    .join(' ');
};

exports.porcentaje = function porcentaje(parte, total) {
  if (!Number.isFinite(parte) || !Number.isFinite(total) || total === 0) {
    return 0;
  }

  return Number(((parte / total) * 100).toFixed(1));
};
