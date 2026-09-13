import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

import {
  DatosCorruptosError,
  crearRepositorioJson,
} from '../src/repositorios/json.repositorio.js';

let carpeta;

/** Cada prueba escribe en un archivo temporal, nunca en los datos reales. */
before(async () => {
  carpeta = await mkdtemp(path.join(tmpdir(), 'ejercicio09-'));
});

after(async () => {
  await rm(carpeta, { recursive: true, force: true });
});

function repositorio(nombre, inicial = { peleadores: [] }) {
  return crearRepositorioJson(path.join(carpeta, nombre), inicial);
}

describe('leer', () => {
  it('devuelve el valor inicial si el archivo no existe', async () => {
    const repo = repositorio('nuevo.json', { peleadores: [], version: 1 });

    assert.deepEqual(await repo.leer(), { peleadores: [], version: 1 });
  });

  it('lee lo que se guardo', async () => {
    const repo = repositorio('leer.json');

    await repo.escribirAtomico({ peleadores: [{ id: 1 }] });

    assert.equal((await repo.leer()).peleadores.length, 1);
  });

  it('lanza DatosCorruptosError si el JSON esta roto', async () => {
    const ruta = path.join(carpeta, 'roto.json');
    await writeFile(ruta, '{ esto no es json', 'utf8');

    await assert.rejects(() => crearRepositorioJson(ruta).leer(), (error) => {
      assert.ok(error instanceof DatosCorruptosError);
      assert.equal(error.statusCode, 500);
      return true;
    });
  });
});

describe('escritura atomica', () => {
  it('deja el archivo indentado y legible', async () => {
    const repo = repositorio('formato.json');

    await repo.escribirAtomico({ peleadores: [{ id: 1, nombre: 'Ana' }] });

    const contenido = await readFile(repo.rutaArchivo, 'utf8');

    assert.match(contenido, /\n {2}"peleadores"/);
    assert.ok(contenido.endsWith('\n'));
  });

  it('no deja archivos temporales tras escribir', async () => {
    const repo = repositorio('limpio.json');

    await repo.escribirAtomico({ peleadores: [] });

    const archivos = await readdir(carpeta);

    assert.equal(archivos.some((archivo) => archivo.endsWith('.tmp')), false);
  });
});

describe('cola de escrituras concurrentes', () => {
  it('no pierde ninguna actualizacion lanzada a la vez', async () => {
    const repo = repositorio('concurrente.json', { peleadores: [] });

    // Sin cola, estas 20 escrituras leerian el mismo estado inicial y se
    // pisarian entre si: quedaria un solo elemento en vez de veinte.
    await Promise.all(
      Array.from({ length: 20 }, (valor, indice) =>
        repo.actualizar((estado) => {
          estado.peleadores.push({ id: indice });
          return estado;
        }),
      ),
    );

    assert.equal((await repo.leer()).peleadores.length, 20);
  });

  it('las aplica en orden', async () => {
    const repo = repositorio('orden.json', { pasos: [] });

    await Promise.all(
      ['a', 'b', 'c'].map((letra) =>
        repo.actualizar((estado) => {
          estado.pasos.push(letra);
          return estado;
        }),
      ),
    );

    assert.deepEqual((await repo.leer()).pasos, ['a', 'b', 'c']);
  });

  it('un fallo no bloquea las escrituras siguientes', async () => {
    const repo = repositorio('fallo.json', { pasos: [] });

    await assert.rejects(() =>
      repo.actualizar(() => {
        throw new Error('fallo a proposito');
      }),
    );

    await repo.actualizar((estado) => {
      estado.pasos.push('sigue viva');
      return estado;
    });

    assert.deepEqual((await repo.leer()).pasos, ['sigue viva']);
  });

  it('la transformacion recibe una copia, no el estado guardado', async () => {
    const repo = repositorio('copia.json', { peleadores: [{ id: 1, nombre: 'Ana' }] });

    await repo.actualizar((estado) => {
      estado.peleadores[0].nombre = 'Modificado';
      return estado;
    });

    assert.equal((await repo.leer()).peleadores[0].nombre, 'Modificado');
  });
});
