import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';

import { crearApp } from '../src/app.js';
import { crearRepositorioJson } from '../src/repositorios/json.repositorio.js';
import { crearServicioPeleadores } from '../src/services/peleadores.service.js';

const SEMILLA = {
  version: 1,
  actualizadoEn: '2026-02-10T14:00:00.000Z',
  peleadores: [
    { id: 1, nombre: 'Ana Quintero', apodo: 'La Tormenta', categoria: 'ligero', pesoKg: 60, victorias: 18, derrotas: 3, empates: 1, ko: 11, debutEn: '2019-04-12' },
    { id: 2, nombre: 'Marco Duarte', apodo: 'El Muro', categoria: 'medio', pesoKg: 75, victorias: 24, derrotas: 6, empates: 2, ko: 9, debutEn: '2016-09-03' },
  ],
};

let carpeta;
let servidor;
let baseUrl;
let repositorio;

before(async () => {
  carpeta = await mkdtemp(path.join(tmpdir(), 'ejercicio09-http-'));
});

after(async () => {
  await new Promise((resolve) => servidor.close(resolve));
  await rm(carpeta, { recursive: true, force: true });
});

/** La app se levanta contra un archivo temporal, no contra datos/ */
beforeEach(async () => {
  const ruta = path.join(carpeta, `${Date.now()}-${Math.random()}.json`);

  repositorio = crearRepositorioJson(ruta, structuredClone(SEMILLA));
  await repositorio.escribirAtomico(structuredClone(SEMILLA));

  if (servidor) {
    await new Promise((resolve) => servidor.close(resolve));
  }

  await new Promise((resolve) => {
    servidor = crearApp(crearServicioPeleadores(repositorio), repositorio).listen(0, resolve);
  });

  baseUrl = `http://localhost:${servidor.address().port}`;
});

async function enviar(metodo, ruta, body) {
  return fetch(`${baseUrl}${ruta}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('GET /basico/ejercicio-09', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-09`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'JSON y persistencia simple');
  });

  it('informa del estado del gimnasio', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-09`)).json();

    assert.equal(cuerpo.gimnasio.peleadores, 2);
    assert.equal(cuerpo.gimnasio.categorias.length, 4);
  });
});

describe('GET /basico/ejercicio-09/json', () => {
  it('reporta que se mantiene y que se pierde', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-09/json`)).json();

    assert.equal(cuerpo.data.seMantienen.length, 5);
    assert.equal(cuerpo.data.sePierden.length, 7);
    assert.equal(cuerpo.data.bigInt.lanza, true);
  });
});

describe('GET /basico/ejercicio-09/replacer', () => {
  it('el replacer oculta el token', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-09/replacer`)).json();

    assert.match(cuerpo.data.sinFiltrar, /secreto-real/);
    assert.equal(cuerpo.data.conReplacer.includes('secreto-real'), false);
  });
});

describe('CRUD por HTTP', () => {
  it('lista y filtra por categoria', async () => {
    assert.equal((await (await fetch(`${baseUrl}/basico/ejercicio-09/peleadores`)).json()).total, 2);

    const filtrado = await (
      await fetch(`${baseUrl}/basico/ejercicio-09/peleadores?categoria=medio`)
    ).json();

    assert.equal(filtrado.total, 1);
  });

  it('crea y el cambio queda en el archivo', async () => {
    const respuesta = await enviar('POST', '/basico/ejercicio-09/peleadores', {
      nombre: 'Lucia Ferrer',
      apodo: 'Rayo',
      categoria: 'pluma',
      pesoKg: 54,
    });

    assert.equal(respuesta.status, 201);
    assert.equal((await repositorio.leer()).peleadores.length, 3);
  });

  it('registra un combate y persiste', async () => {
    const respuesta = await enviar('POST', '/basico/ejercicio-09/peleadores/1/combates', {
      resultado: 'ko',
    });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.ko, 12);
    assert.equal((await repositorio.leer()).peleadores[0].ko, 12);
  });

  it('elimina y persiste', async () => {
    const respuesta = await enviar('DELETE', '/basico/ejercicio-09/peleadores/1');

    assert.equal(respuesta.status, 200);
    assert.equal((await repositorio.leer()).peleadores.length, 1);
  });
});

describe('errores por HTTP', () => {
  it('responde 404 si el peleador no existe', async () => {
    assert.equal((await fetch(`${baseUrl}/basico/ejercicio-09/peleadores/99`)).status, 404);
  });

  it('responde 400 si el peso no cuadra con la categoria', async () => {
    const respuesta = await enviar('POST', '/basico/ejercicio-09/peleadores', {
      nombre: 'Malo Peso',
      apodo: 'Malo',
      categoria: 'pluma',
      pesoKg: 90,
    });

    assert.equal(respuesta.status, 400);
    assert.match((await respuesta.json()).message, /entre 50 y 57 kg/);
  });

  it('responde 400 si el resultado del combate es desconocido', async () => {
    const respuesta = await enviar('POST', '/basico/ejercicio-09/peleadores/1/combates', {
      resultado: 'abandono',
    });

    assert.equal(respuesta.status, 400);
  });

  it('responde 400 si la categoria del filtro no existe', async () => {
    assert.equal(
      (await fetch(`${baseUrl}/basico/ejercicio-09/peleadores?categoria=sumo`)).status,
      400,
    );
  });

  it('responde 404 en una ruta inexistente', async () => {
    assert.equal((await fetch(`${baseUrl}/no-existe`)).status, 404);
  });
});
