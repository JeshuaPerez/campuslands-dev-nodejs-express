import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  obtenerInfoRuntime,
  verificarVersionMinima,
} from '../src/services/runtime.service.js';

describe('obtenerInfoRuntime', () => {
  it('reporta los datos del proceso actual', () => {
    const info = obtenerInfoRuntime();

    assert.equal(info.nodeVersion, process.version);
    assert.equal(info.plataforma, process.platform);
    assert.equal(info.arquitectura, process.arch);
    assert.equal(info.pid, process.pid);
  });

  it('devuelve metricas numericas no negativas', () => {
    const info = obtenerInfoRuntime();

    assert.ok(Number.isFinite(info.uptimeSegundos) && info.uptimeSegundos >= 0);
    assert.ok(Number.isFinite(info.memoriaHeapMb) && info.memoriaHeapMb > 0);
  });
});

describe('verificarVersionMinima', () => {
  it('aprueba la version que ejecuta las pruebas', () => {
    const resultado = verificarVersionMinima(20);

    assert.equal(resultado.minimoRequerido, 20);
    assert.equal(resultado.cumple, true);
  });

  it('falla cuando el minimo exigido es mayor al instalado', () => {
    assert.equal(verificarVersionMinima(999).cumple, false);
  });
});
