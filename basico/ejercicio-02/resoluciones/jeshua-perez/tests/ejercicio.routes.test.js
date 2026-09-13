import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { crearApp } from '../src/app.js';

let servidor;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    servidor = crearApp().listen(0, resolve);
  });

  baseUrl = `http://localhost:${servidor.address().port}`;
});

after(async () => {
  await new Promise((resolve) => servidor.close(resolve));
});

describe('GET /basico/ejercicio-02', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-02`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'npm scripts y package.json');
  });

  it('expone el resumen del package.json', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-02`);
    const cuerpo = await respuesta.json();

    assert.equal(cuerpo.paquete.nombre, 'basico-ejercicio-02-jeshua-perez');
    assert.equal(cuerpo.paquete.nodeRequerido, '>=20');
  });
});

describe('GET /basico/ejercicio-02/scripts', () => {
  it('lista los scripts con su invocacion', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-02/scripts`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.total, cuerpo.data.length);
    assert.ok(cuerpo.data.some((script) => script.invocacion === 'npm start'));
  });
});

describe('GET /basico/ejercicio-02/armas', () => {
  it('devuelve el catalogo de armas y estilos', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-02/armas`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.ok(cuerpo.data.armas.length >= 5);
    assert.deepEqual(cuerpo.data.estilos, ['agresivo', 'tactico', 'apoyo']);
  });
});

describe('POST /basico/ejercicio-02/loadouts', () => {
  async function crear(body) {
    return fetch(`${baseUrl}/basico/ejercicio-02/loadouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('crea el loadout y responde 201', async () => {
    const respuesta = await crear({ armaPrincipal: 'AWP', estilo: 'tactico', granadas: 2 });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 201);
    assert.equal(cuerpo.data.armaPrincipal, 'AWP');
    assert.equal(cuerpo.data.costeTotal, 5350);
  });

  it('responde 400 si falta el arma', async () => {
    const respuesta = await crear({ estilo: 'tactico' });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.match(cuerpo.message, /arma/i);
  });

  it('responde 400 si el arma no existe', async () => {
    const respuesta = await crear({ armaPrincipal: 'Bazuca' });

    assert.equal(respuesta.status, 400);
  });

  it('responde 400 si las granadas se salen de rango', async () => {
    const respuesta = await crear({ armaPrincipal: 'AK-47', granadas: 9 });

    assert.equal(respuesta.status, 400);
  });
});

describe('rutas inexistentes', () => {
  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/no-existe`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 404);
    assert.equal(cuerpo.ok, false);
  });
});
