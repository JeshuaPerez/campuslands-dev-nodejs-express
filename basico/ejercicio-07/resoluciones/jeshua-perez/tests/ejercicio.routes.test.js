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

describe('GET /basico/ejercicio-07', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-07`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'process.argv y CLI');
  });

  it('describe los comandos y opciones del CLI', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-07`)).json();

    assert.deepEqual(cuerpo.cli.comandos, ['listar', 'buscar', 'resumen', 'ayuda']);
    assert.ok(cuerpo.cli.opciones.includes('marca'));
  });
});

describe('GET /basico/ejercicio-07/ayuda', () => {
  it('sirve el mismo texto que imprime --ayuda', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-07/ayuda`);
    const texto = await respuesta.text();

    assert.equal(respuesta.status, 200);
    assert.match(texto, /CODIGOS DE SALIDA/);
  });
});

describe('GET /basico/ejercicio-07/autos', () => {
  it('devuelve el catalogo completo', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-07/autos`)).json();

    assert.equal(cuerpo.total, 6);
  });

  it('aplica los mismos filtros que el CLI', async () => {
    const cuerpo = await (
      await fetch(`${baseUrl}/basico/ejercicio-07/autos?marca=Porsche&ordenar=cv&desc=true`)
    ).json();

    assert.equal(cuerpo.total, 2);
    assert.equal(cuerpo.data[0].modelo, '911 Turbo S');
  });

  it('filtra por disponibilidad', async () => {
    const cuerpo = await (
      await fetch(`${baseUrl}/basico/ejercicio-07/autos?disponibles=true`)
    ).json();

    assert.equal(cuerpo.total, 5);
  });

  it('responde 400 si el campo de orden no existe', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-07/autos?ordenar=puertas`);

    assert.equal(respuesta.status, 400);
    assert.match((await respuesta.json()).message, /Campos validos/);
  });

  it('responde 400 si el limite es invalido', async () => {
    assert.equal((await fetch(`${baseUrl}/basico/ejercicio-07/autos?limite=0`)).status, 400);
  });
});

describe('GET /basico/ejercicio-07/inventario', () => {
  it('devuelve las mismas estadisticas que el comando resumen', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-07/inventario`)).json();

    assert.equal(cuerpo.data.modelos, 6);
    assert.equal(cuerpo.data.unidades, 16);
    assert.deepEqual(cuerpo.data.sinStock, ['Roma']);
  });
});

describe('rutas inexistentes', () => {
  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/no-existe`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});
