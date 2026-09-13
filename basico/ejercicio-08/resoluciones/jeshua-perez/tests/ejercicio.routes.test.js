import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { crearApp } from '../src/app.js';
import { cargarConfiguracion } from '../src/config/index.js';

/**
 * La app se levanta con una configuracion inventada.
 *
 * Esto es lo que se gana al no leer process.env dentro de la app: las pruebas
 * controlan el entorno sin ensuciar el del proceso.
 */
const configuracion = cargarConfiguracion({
  APP_NOMBRE: 'Escuderia de prueba',
  API_CLAVE: 'clave-secreta-de-pruebas-larga',
  NODE_ENV: 'test',
  MAX_VELOCIDAD_KMH: '420',
});

let servidor;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    servidor = crearApp(configuracion).listen(0, resolve);
  });

  baseUrl = `http://localhost:${servidor.address().port}`;
});

after(async () => {
  await new Promise((resolve) => servidor.close(resolve));
});

async function postAuto(body) {
  return fetch(`${baseUrl}/basico/ejercicio-08/autos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /basico/ejercicio-08', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-08`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'variables de entorno');
  });

  it('informa del entorno activo', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-08`)).json();

    assert.equal(cuerpo.entorno.NODE_ENV, 'test');
    assert.equal(cuerpo.entorno.esProduccion, false);
    assert.equal(cuerpo.entorno.variablesDeclaradas, 8);
  });
});

describe('GET /basico/ejercicio-08/config', () => {
  it('nunca devuelve la clave entera', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-08/config`)).json();

    assert.notEqual(cuerpo.data.API_CLAVE, configuracion.API_CLAVE);
    assert.equal(cuerpo.data.API_CLAVE.includes('secreta'), false);
    assert.match(cuerpo.data.API_CLAVE, /\*/);
  });

  it('si devuelve los valores que no son secretos', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-08/config`)).json();

    assert.equal(cuerpo.data.APP_NOMBRE, 'Escuderia de prueba');
    assert.equal(cuerpo.data.MAX_VELOCIDAD_KMH, 420);
  });
});

describe('GET /basico/ejercicio-08/esquema', () => {
  it('documenta cada variable sin filtrar el valor de los secretos', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-08/esquema`)).json();
    const clave = cuerpo.data.find((variable) => variable.variable === 'API_CLAVE');

    assert.equal(clave.obligatoria, true);
    assert.equal(clave.secreto, true);
    assert.equal(clave.porDefecto, null);
  });
});

describe('autos por HTTP', () => {
  it('el catalogo refleja el tope configurado', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-08/autos`)).json();

    assert.equal(cuerpo.topeConfigurado, 420);
    // Solo la Koenigsegg (483) y la Bugatti (440) pasan de 420.
    assert.equal(cuerpo.data.filter((auto) => auto.superaElTope).length, 2);
  });

  it('registra un auto por debajo del tope', async () => {
    const respuesta = await postAuto({ marca: 'SSC', modelo: 'Tuatara', velocidadMaxima: 410 });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 201);
    assert.equal(cuerpo.data.registradoEn, 'test');
  });

  it('responde 400 si supera el tope del entorno', async () => {
    const respuesta = await postAuto({ marca: 'X', modelo: 'Y', velocidadMaxima: 500 });

    assert.equal(respuesta.status, 400);
    assert.match((await respuesta.json()).message, /supera el tope configurado de 420/);
  });

  it('responde 400 si faltan datos', async () => {
    assert.equal((await postAuto({})).status, 400);
  });
});

describe('health y rutas inexistentes', () => {
  it('health informa del entorno', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/health`)).json();

    assert.equal(cuerpo.entorno, 'test');
  });

  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/no-existe`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});
