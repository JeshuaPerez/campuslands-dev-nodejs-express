const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');

const { crearApp } = require('../src/app');

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

function draftValido() {
  return {
    picks: [
      { rol: 'top', campeon: 'Darius' },
      { rol: 'jungla', campeon: 'Warwick' },
      { rol: 'medio', campeon: 'Lux' },
      { rol: 'tirador', campeon: 'Jinx' },
      { rol: 'soporte', campeon: 'Lulu' },
    ],
  };
}

async function postDraft(body) {
  return fetch(`${baseUrl}/basico/ejercicio-03/drafts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /basico/ejercicio-03', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-03`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'modulos CommonJS');
  });

  it('informa del sistema de modulos', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-03`);
    const cuerpo = await respuesta.json();

    assert.equal(cuerpo.modulo.sistema, 'CommonJS');
    assert.ok(cuerpo.modulo.variablesInyectadas.includes('__dirname'));
  });
});

describe('GET /basico/ejercicio-03/cache', () => {
  it('demuestra que require devuelve la misma referencia', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-03/cache`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.mismaReferencia, true);
    assert.ok(cuerpo.data.modulosPropiosEnCache.total > 0);
  });
});

describe('GET /basico/ejercicio-03/campeones', () => {
  it('devuelve los cinco roles con sus campeones', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-03/campeones`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.roles.length, 5);
    assert.ok(Object.keys(cuerpo.data.campeones.top).includes('Darius'));
  });
});

describe('POST /basico/ejercicio-03/drafts', () => {
  it('acepta un draft valido y responde 201', async () => {
    const respuesta = await postDraft(draftValido());
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 201);
    assert.equal(cuerpo.data.picks.length, 5);
    assert.equal(cuerpo.data.favorito.campeon, 'Lulu');
  });

  it('responde 400 si el draft esta incompleto', async () => {
    const respuesta = await postDraft({ picks: draftValido().picks.slice(0, 3) });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.match(cuerpo.message, /5 picks/);
  });

  it('responde 400 si hay un rol repetido', async () => {
    const picks = draftValido().picks;
    picks[1] = { rol: 'top', campeon: 'Garen' };

    assert.equal((await postDraft({ picks })).status, 400);
  });

  it('responde 400 si el campeon no juega ese rol', async () => {
    const picks = draftValido().picks;
    picks[0] = { rol: 'top', campeon: 'Jinx' };

    assert.equal((await postDraft({ picks })).status, 400);
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
