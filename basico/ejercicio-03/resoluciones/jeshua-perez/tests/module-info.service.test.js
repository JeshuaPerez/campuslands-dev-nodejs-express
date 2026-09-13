const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const contador = require('../src/lib/contador');
const formato = require('../src/lib/formato');
const {
  comprobarCacheDeRequire,
  contarModulosEnCache,
  obtenerInfoModulo,
} = require('../src/services/module-info.service');

describe('obtenerInfoModulo', () => {
  it('reporta que el sistema de modulos es CommonJS', () => {
    const info = obtenerInfoModulo();

    assert.equal(info.sistema, 'CommonJS');
    assert.equal(info.archivo, 'module-info.service.js');
    assert.equal(info.carpeta, 'services');
  });

  it('lista las cinco variables que CommonJS inyecta', () => {
    assert.deepEqual(obtenerInfoModulo().variablesInyectadas, [
      'exports',
      'require',
      'module',
      '__filename',
      '__dirname',
    ]);
  });

  it('sabe que no es el modulo principal cuando lo carga otro', () => {
    assert.equal(obtenerInfoModulo().esModuloPrincipal, false);
  });
});

describe('comprobarCacheDeRequire', () => {
  it('devuelve la misma referencia en dos require', () => {
    const resultado = comprobarCacheDeRequire();

    assert.equal(resultado.mismaReferencia, true);
    assert.equal(resultado.estaEnCache, true);
    assert.equal(resultado.archivoResuelto, 'contador.js');
  });

  it('comparte el estado del modulo entre quienes lo requieren', () => {
    contador.reiniciar();
    contador.registrarPartida();
    contador.registrarPartida();

    assert.equal(comprobarCacheDeRequire().draftsRegistrados, 2);
  });
});

describe('contarModulosEnCache', () => {
  it('cuenta solo modulos propios, sin node_modules', () => {
    const cache = contarModulosEnCache();

    assert.ok(cache.total > 0);
    assert.ok(cache.archivos.includes('contador.js'));
    assert.ok(cache.archivos.every((archivo) => archivo.endsWith('.js')));
  });
});

describe('formato - exports.x en lugar de module.exports', () => {
  it('expone las dos funciones declaradas con exports.x', () => {
    assert.equal(typeof formato.aTitulo, 'function');
    assert.equal(typeof formato.porcentaje, 'function');
  });

  it('convierte a titulo', () => {
    assert.equal(formato.aTitulo('  lee SIN  '), 'Lee Sin');
    assert.equal(formato.aTitulo(''), '');
    assert.equal(formato.aTitulo(null), '');
  });

  it('calcula porcentajes y protege la division por cero', () => {
    assert.equal(formato.porcentaje(1, 4), 25);
    assert.equal(formato.porcentaje(1, 0), 0);
    assert.equal(formato.porcentaje('a', 4), 0);
  });
});
