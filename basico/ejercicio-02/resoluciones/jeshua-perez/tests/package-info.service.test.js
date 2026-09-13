import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  leerPackageJson,
  listarScripts,
  obtenerResumenPaquete,
} from '../src/services/package-info.service.js';

describe('leerPackageJson', () => {
  it('lee el manifiesto real del proyecto', async () => {
    const paquete = await leerPackageJson();

    assert.equal(paquete.name, 'basico-ejercicio-02-jeshua-perez');
    assert.equal(paquete.type, 'module');
    assert.equal(paquete.private, true);
  });

  it('declara el minimo de Node que pide el enunciado', async () => {
    const paquete = await leerPackageJson();

    assert.equal(paquete.engines.node, '>=20');
  });
});

describe('obtenerResumenPaquete', () => {
  it('resume el manifiesto sin volcarlo entero', async () => {
    const resumen = await obtenerResumenPaquete();

    assert.equal(resumen.nombre, 'basico-ejercicio-02-jeshua-perez');
    assert.equal(resumen.nodeRequerido, '>=20');
    assert.deepEqual(resumen.dependencias, ['express']);
    assert.ok(resumen.totalScripts >= 8);
  });
});

describe('listarScripts', () => {
  it('incluye todos los scripts declarados', async () => {
    const scripts = await listarScripts();
    const nombres = scripts.map((script) => script.nombre);

    assert.ok(nombres.includes('start'));
    assert.ok(nombres.includes('prestart'));
    assert.ok(nombres.includes('validar'));
  });

  it('marca start y test como invocables sin run', async () => {
    const scripts = await listarScripts();
    const start = scripts.find((script) => script.nombre === 'start');
    const dev = scripts.find((script) => script.nombre === 'dev');

    assert.equal(start.invocacion, 'npm start');
    assert.equal(dev.invocacion, 'npm run dev');
  });

  it('documenta el proposito de cada script', async () => {
    const scripts = await listarScripts();

    for (const script of scripts) {
      assert.notEqual(script.proposito, 'Sin descripcion registrada.');
    }
  });
});
