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

describe('GET /basico/ejercicio-05', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-05`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'fs para leer archivos');
  });

  it('resume la liga cruzando el JSON y el CSV', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-05`)).json();

    assert.equal(cuerpo.liga.equipos, 6);
    assert.equal(cuerpo.liga.maximoGoleador.jugador, 'Mateo Ruiz');
    assert.equal(cuerpo.liga.lider, 'Sala Giron');
  });
});

describe('GET /basico/ejercicio-05/archivos', () => {
  it('lista los archivos de la carpeta de datos', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-05/archivos`)).json();

    assert.equal(cuerpo.total, 2);
    assert.deepEqual(cuerpo.data.map((archivo) => archivo.nombre), [
      'equipos.json',
      'goleadores.csv',
    ]);
  });

  it('lee un archivo concreto en crudo', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-05/archivos/goleadores.csv`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.ok(cuerpo.data.contenido.startsWith('jugador,equipoId'));
  });

  it('responde 404 si el archivo no existe', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-05/archivos/plantillas.json`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});

describe('GET /basico/ejercicio-05/tabla', () => {
  it('devuelve la tabla completa ordenada', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-05/tabla`)).json();

    assert.equal(cuerpo.data.total, 6);
    assert.equal(cuerpo.data.tabla[0].posicion, 1);
    assert.equal(cuerpo.data.temporada, '2025-2026');
  });

  it('filtra por modalidad', async () => {
    const cuerpo = await (
      await fetch(`${baseUrl}/basico/ejercicio-05/tabla?modalidad=futsal`)
    ).json();

    assert.equal(cuerpo.data.total, 3);
    assert.ok(cuerpo.data.tabla.every((equipo) => equipo.modalidad === 'futsal'));
  });

  it('responde 400 si la modalidad no existe', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-05/tabla?modalidad=rugby`);

    assert.equal(respuesta.status, 400);
  });
});

describe('GET /basico/ejercicio-05/goleadores', () => {
  it('devuelve el ranking completo', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-05/goleadores`)).json();

    assert.equal(cuerpo.total, 10);
    assert.equal(cuerpo.data[0].jugador, 'Mateo Ruiz');
  });

  it('respeta el limite de la query', async () => {
    const cuerpo = await (
      await fetch(`${baseUrl}/basico/ejercicio-05/goleadores?limite=3`)
    ).json();

    assert.equal(cuerpo.total, 3);
  });

  it('responde 400 si el limite es invalido', async () => {
    assert.equal(
      (await fetch(`${baseUrl}/basico/ejercicio-05/goleadores?limite=0`)).status,
      400,
    );
  });
});

describe('rutas inexistentes', () => {
  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/no-existe`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});
