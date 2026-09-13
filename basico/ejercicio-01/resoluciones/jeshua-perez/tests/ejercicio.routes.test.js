import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { crearApp } from '../src/app.js';

let servidor;
let baseUrl;

// Puerto 0 = el sistema asigna uno libre, asi las pruebas no chocan con un
// servidor levantado a mano en el 3000.
before(async () => {
  await new Promise((resolve) => {
    servidor = crearApp().listen(0, resolve);
  });

  baseUrl = `http://localhost:${servidor.address().port}`;
});

after(async () => {
  await new Promise((resolve) => servidor.close(resolve));
});

describe('GET /health', () => {
  it('responde 200 cuando el servidor esta arriba', async () => {
    const respuesta = await fetch(`${baseUrl}/health`);

    assert.equal(respuesta.status, 200);
    assert.deepEqual(await respuesta.json(), {
      ok: true,
      message: 'Servidor activo',
    });
  });
});

describe('GET /basico/ejercicio-01', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-01`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'Node runtime y consola');
  });

  it('incluye la informacion del runtime', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-01`);
    const cuerpo = await respuesta.json();

    assert.equal(cuerpo.runtime.nodeVersion, process.version);
    assert.ok(Array.isArray(cuerpo.clasesDisponibles));
  });
});

describe('POST /basico/ejercicio-01/personajes', () => {
  async function crear(body) {
    return fetch(`${baseUrl}/basico/ejercicio-01/personajes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  it('crea el personaje y responde 201', async () => {
    const respuesta = await crear({ nombre: 'Lyra', clase: 'mago', nivel: 10 });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 201);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.data.nombre, 'Lyra');
    assert.equal(cuerpo.data.hp, 90);
  });

  it('responde 400 con mensaje util si el nombre falta', async () => {
    const respuesta = await crear({ clase: 'mago' });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.equal(cuerpo.ok, false);
    assert.match(cuerpo.message, /nombre/i);
  });

  it('responde 400 si la clase no existe', async () => {
    const respuesta = await crear({ nombre: 'Aldric', clase: 'druida' });

    assert.equal(respuesta.status, 400);
  });

  it('responde 400 si el nivel esta fuera de rango', async () => {
    const respuesta = await crear({ nombre: 'Aldric', nivel: 100 });

    assert.equal(respuesta.status, 400);
  });
});

describe('rutas inexistentes', () => {
  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/ruta-que-no-existe`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 404);
    assert.equal(cuerpo.ok, false);
  });
});
