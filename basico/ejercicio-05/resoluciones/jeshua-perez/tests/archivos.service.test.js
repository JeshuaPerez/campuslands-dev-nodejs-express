import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ArchivoInvalidoError,
  ArchivoNoEncontradoError,
  leerCsv,
  leerJson,
  leerTexto,
  listarArchivos,
} from '../src/services/archivos.service.js';

describe('leerJson - casos normales', () => {
  it('lee y parsea el archivo de equipos', async () => {
    const datos = await leerJson('equipos.json');

    assert.equal(datos.temporada, '2025-2026');
    assert.equal(datos.equipos.length, 6);
  });
});

describe('leerCsv - casos normales', () => {
  it('usa la primera fila como cabecera', async () => {
    const filas = await leerCsv('goleadores.csv');

    assert.equal(filas.length, 10);
    assert.deepEqual(Object.keys(filas[0]), [
      'jugador',
      'equipoId',
      'modalidad',
      'goles',
      'asistencias',
      'partidos',
    ]);
  });

  it('convierte a numero solo las celdas numericas', async () => {
    const [primera] = await leerCsv('goleadores.csv');

    assert.equal(typeof primera.jugador, 'string');
    assert.equal(typeof primera.goles, 'number');
    assert.equal(primera.goles, 17);
  });
});

describe('listarArchivos', () => {
  it('lista los dos archivos de datos con su tamano', async () => {
    const archivos = await listarArchivos();
    const nombres = archivos.map((archivo) => archivo.nombre);

    assert.deepEqual(nombres, ['equipos.json', 'goleadores.csv']);
    assert.ok(archivos.every((archivo) => archivo.bytes > 0));
    assert.equal(archivos[0].extension, 'json');
  });
});

describe('archivos - casos invalidos', () => {
  it('lanza ArchivoNoEncontradoError con status 404 si no existe', async () => {
    await assert.rejects(() => leerJson('no-existe.json'), (error) => {
      assert.ok(error instanceof ArchivoNoEncontradoError);
      assert.equal(error.statusCode, 404);
      return true;
    });
  });

  it('rechaza nombres vacios o no textuales', async () => {
    await assert.rejects(() => leerTexto(''), ArchivoNoEncontradoError);
    await assert.rejects(() => leerTexto(undefined), ArchivoNoEncontradoError);
  });

  it('bloquea el salto fuera de la carpeta de datos', async () => {
    await assert.rejects(() => leerTexto('../package.json'), ArchivoNoEncontradoError);
    await assert.rejects(() => leerTexto('../../../../.env'), ArchivoNoEncontradoError);
  });

  it('lanza ArchivoInvalidoError con status 422 si el JSON esta roto', async () => {
    await assert.rejects(() => leerJson('goleadores.csv'), (error) => {
      assert.ok(error instanceof ArchivoInvalidoError);
      assert.equal(error.statusCode, 422);
      return true;
    });
  });

  it('lanza ArchivoInvalidoError si el CSV descuadra en columnas', async () => {
    await assert.rejects(() => leerCsv('equipos.json'), ArchivoInvalidoError);
  });
});
