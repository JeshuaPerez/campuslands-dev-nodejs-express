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

describe('GET /basico/ejercicio-06', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-06`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'path y rutas seguras');
  });

  it('informa de la carpeta publica y sus extensiones', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-06`)).json();

    assert.equal(cuerpo.taller.documentos, 3);
    assert.deepEqual(cuerpo.taller.extensionesPermitidas, ['.txt', '.json', '.md']);
  });
});

describe('GET /basico/ejercicio-06/documentos', () => {
  it('lista los tres documentos servibles', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-06/documentos`)).json();

    assert.equal(cuerpo.total, 3);
    assert.ok(cuerpo.data.some((documento) => documento.ruta === 'informes/orden-1042.txt'));
  });

  it('lee un documento de la raiz', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-06/documentos/manual-cb500.txt`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.match(cuerpo.data.contenido, /Honda CB500F/);
  });

  it('lee un documento de una subcarpeta', async () => {
    const respuesta = await fetch(
      `${baseUrl}/basico/ejercicio-06/documentos/informes/orden-1042.txt`,
    );
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.ruta, 'informes/orden-1042.txt');
  });
});

describe('rutas inseguras por HTTP', () => {
  it('responde 403 al intentar salir a la carpeta hermana', async () => {
    const respuesta = await fetch(
      `${baseUrl}/basico/ejercicio-06/documentos/..%2Fpublico-privado%2Ftarifas-internas.txt`,
    );

    assert.equal(respuesta.status, 403);
    assert.match((await respuesta.json()).message, /sale de la carpeta publica/);
  });

  it('responde 403 ante una extension no permitida', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-06/documentos/manual.exe`);

    assert.equal(respuesta.status, 403);
  });

  it('responde 404 si la ruta es valida pero el archivo no esta', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-06/documentos/otro.txt`);

    assert.equal(respuesta.status, 404);
  });
});

describe('GET /basico/ejercicio-06/analizar', () => {
  it('descompone la ruta consultada', async () => {
    const respuesta = await fetch(
      `${baseUrl}/basico/ejercicio-06/analizar?ruta=informes/orden-1042.txt`,
    );
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.basename, 'orden-1042.txt');
    assert.equal(cuerpo.data.comoPosix, 'informes/orden-1042.txt');
  });

  it('responde 403 si no se manda ruta', async () => {
    assert.equal((await fetch(`${baseUrl}/basico/ejercicio-06/analizar`)).status, 403);
  });
});

describe('rutas inexistentes', () => {
  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/no-existe`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});
