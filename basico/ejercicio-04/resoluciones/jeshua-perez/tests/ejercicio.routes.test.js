import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';

import { crearApp } from '../src/app.js';
import { reiniciarZona } from '../src/lib/zona.js';

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

beforeEach(() => {
  reiniciarZona();
});

async function postJson(ruta, body) {
  return fetch(`${baseUrl}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('GET /basico/ejercicio-04', () => {
  it('responde el contrato pedido por el enunciado', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-04`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.ok, true);
    assert.equal(cuerpo.message, 'Ejercicio ejecutado correctamente');
    assert.equal(cuerpo.topic, 'modulos ES Modules');
  });

  it('informa del sistema de modulos y sus equivalencias', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-04`)).json();

    assert.equal(cuerpo.modulo.sistema, 'ES Modules');
    assert.equal(cuerpo.modulo.equivalencias.__dirname, 'path.dirname(fileURLToPath(import.meta.url))');
  });

  it('demuestra que el top-level await se resolvio al cargar', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-04`)).json();

    assert.deepEqual(cuerpo.modulo.rarezasCargadasConTopLevelAwait, [
      'comun',
      'raro',
      'epico',
      'legendario',
    ]);
  });
});

describe('zona por HTTP', () => {
  it('devuelve el radio inicial', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-04/zona`)).json();

    assert.equal(cuerpo.data.radioActualSegunElImport, 1000);
  });

  it('cierra la zona y el binding vivo refleja el cambio', async () => {
    const respuesta = await postJson('/basico/ejercicio-04/zona/cerrar', { metros: 400 });
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.radioActual, 600);
    assert.equal(cuerpo.data.radioActualSegunElImport, 600);
  });

  it('responde 400 si los metros no son validos', async () => {
    assert.equal((await postJson('/basico/ejercicio-04/zona/cerrar', { metros: -1 })).status, 400);
    assert.equal((await postJson('/basico/ejercicio-04/zona/cerrar', {})).status, 400);
  });
});

describe('import dinamico por HTTP', () => {
  it('carga un modulo permitido', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-04/modulos/rareza`);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 200);
    assert.equal(cuerpo.data.tieneDefault, true);
    assert.ok(cuerpo.data.exportaciones.includes('multiplicadorDe'));
  });

  it('confirma la interoperabilidad con CommonJS', async () => {
    const cuerpo = await (await fetch(`${baseUrl}/basico/ejercicio-04/modulos/zona`)).json();

    assert.equal(cuerpo.interop.createRequireDisponible, true);
    assert.equal(cuerpo.interop.expressResueltoDesdeEsm, true);
  });

  it('responde 404 si el modulo no esta permitido', async () => {
    const respuesta = await fetch(`${baseUrl}/basico/ejercicio-04/modulos/secreto`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});

describe('POST /basico/ejercicio-04/escuadras', () => {
  const escuadra = {
    jugadores: [
      { nombre: 'Nova', distanciaAlCentro: 100, loot: 'legendario' },
      { nombre: 'Rex', distanciaAlCentro: 1500, loot: 'raro' },
    ],
  };

  it('evalua la escuadra y responde 201', async () => {
    const respuesta = await postJson('/basico/ejercicio-04/escuadras', escuadra);
    const cuerpo = await respuesta.json();

    assert.equal(respuesta.status, 201);
    assert.equal(cuerpo.data.aSalvo, 1);
    assert.equal(cuerpo.data.mejorEquipado.nombre, 'Nova');
  });

  it('responde 400 si la escuadra esta vacia', async () => {
    assert.equal((await postJson('/basico/ejercicio-04/escuadras', { jugadores: [] })).status, 400);
  });

  it('responde 400 si la rareza no existe', async () => {
    const respuesta = await postJson('/basico/ejercicio-04/escuadras', {
      jugadores: [{ nombre: 'X', distanciaAlCentro: 0, loot: 'mitico' }],
    });

    assert.equal(respuesta.status, 400);
    assert.match((await respuesta.json()).message, /Loot invalido/);
  });
});

describe('rutas inexistentes', () => {
  it('responde 404 en JSON', async () => {
    const respuesta = await fetch(`${baseUrl}/no-existe`);

    assert.equal(respuesta.status, 404);
    assert.equal((await respuesta.json()).ok, false);
  });
});
