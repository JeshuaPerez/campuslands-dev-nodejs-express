import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';

import { crearRepositorioJson } from '../src/repositorios/json.repositorio.js';
import {
  CATEGORIAS,
  NoEncontradoError,
  ValidacionError,
  calcularEstadisticas,
  crearServicioPeleadores,
  validarNuevoPeleador,
} from '../src/services/peleadores.service.js';

let carpeta;
let servicio;
let repositorio;

const SEMILLA = {
  version: 1,
  actualizadoEn: '2026-02-10T14:00:00.000Z',
  peleadores: [
    { id: 1, nombre: 'Ana Quintero', apodo: 'La Tormenta', categoria: 'ligero', pesoKg: 60, victorias: 18, derrotas: 3, empates: 1, ko: 11, debutEn: '2019-04-12' },
    { id: 2, nombre: 'Marco Duarte', apodo: 'El Muro', categoria: 'medio', pesoKg: 75, victorias: 24, derrotas: 6, empates: 2, ko: 9, debutEn: '2016-09-03' },
  ],
};

before(async () => {
  carpeta = await mkdtemp(path.join(tmpdir(), 'ejercicio09-svc-'));
});

after(async () => {
  await rm(carpeta, { recursive: true, force: true });
});

/** Archivo nuevo por prueba: nunca se tocan los datos reales del ejercicio. */
beforeEach(async () => {
  const ruta = path.join(carpeta, `${Date.now()}-${Math.random()}.json`);

  repositorio = crearRepositorioJson(ruta, structuredClone(SEMILLA));
  await repositorio.escribirAtomico(structuredClone(SEMILLA));
  servicio = crearServicioPeleadores(repositorio);
});

describe('calcularEstadisticas', () => {
  it('suma combates y calcula porcentajes', () => {
    const stats = calcularEstadisticas(SEMILLA.peleadores[0]);

    assert.equal(stats.combates, 22);
    assert.equal(stats.porcentajeVictorias, 81.8);
    assert.equal(stats.porcentajeKo, 61.1);
  });

  it('no divide por cero en un debutante', () => {
    const stats = calcularEstadisticas({ victorias: 0, derrotas: 0, empates: 0, ko: 0 });

    assert.equal(stats.porcentajeVictorias, 0);
    assert.equal(stats.porcentajeKo, 0);
  });
});

describe('listar y obtener', () => {
  it('lista todos con sus estadisticas', async () => {
    const peleadores = await servicio.listar();

    assert.equal(peleadores.length, 2);
    assert.equal(peleadores[0].combates, 22);
  });

  it('filtra por categoria sin distinguir mayusculas', async () => {
    assert.equal((await servicio.listar({ categoria: 'medio' })).length, 1);
    assert.equal((await servicio.listar({ categoria: 'MEDIO' })).length, 1);
    assert.equal((await servicio.listar({ categoria: 'pluma' })).length, 0);
  });

  it('rechaza una categoria inexistente', async () => {
    await assert.rejects(() => servicio.listar({ categoria: 'sumo' }), ValidacionError);
  });

  it('obtiene por id', async () => {
    assert.equal((await servicio.obtener(2)).apodo, 'El Muro');
  });

  it('lanza 404 si el id no existe', async () => {
    await assert.rejects(() => servicio.obtener(99), (error) => {
      assert.ok(error instanceof NoEncontradoError);
      assert.equal(error.statusCode, 404);
      return true;
    });
  });

  it('rechaza un id no entero', async () => {
    await assert.rejects(() => servicio.obtener('dos'), ValidacionError);
  });
});

describe('crear - persiste de verdad', () => {
  it('guarda el peleador en el archivo', async () => {
    await servicio.crear({ nombre: 'Lucia Ferrer', apodo: 'Rayo', categoria: 'pluma', pesoKg: 54 });

    // Se relee del disco: no basta con que lo devuelva en memoria.
    const enDisco = await repositorio.leer();

    assert.equal(enDisco.peleadores.length, 3);
    assert.equal(enDisco.peleadores.at(-1).nombre, 'Lucia Ferrer');
  });

  it('asigna el siguiente id libre', async () => {
    const creado = await servicio.crear({ nombre: 'Nuevo Uno', apodo: 'Uno', categoria: 'pluma', pesoKg: 54 });

    assert.equal(creado.id, 3);
  });

  it('actualiza la marca de tiempo del archivo', async () => {
    await servicio.crear({ nombre: 'Nuevo Dos', apodo: 'Dos', categoria: 'pluma', pesoKg: 54 });

    assert.notEqual((await repositorio.leer()).actualizadoEn, SEMILLA.actualizadoEn);
  });
});

describe('validarNuevoPeleador - casos invalidos', () => {
  const base = { nombre: 'Nombre Valido', apodo: 'Apodo', categoria: 'pluma', pesoKg: 54 };

  it('rechaza nombre o apodo vacios o cortos', () => {
    assert.throws(() => validarNuevoPeleador({ ...base, nombre: '' }), ValidacionError);
    assert.throws(() => validarNuevoPeleador({ ...base, nombre: 'ab' }), ValidacionError);
    assert.throws(() => validarNuevoPeleador({ ...base, apodo: 'a' }), ValidacionError);
  });

  it('rechaza una categoria fuera de la lista', () => {
    assert.throws(() => validarNuevoPeleador({ ...base, categoria: 'sumo' }), ValidacionError);
    assert.deepEqual(CATEGORIAS, ['pluma', 'ligero', 'medio', 'pesado']);
  });

  it('rechaza un peso fuera del rango de su categoria', () => {
    assert.throws(() => validarNuevoPeleador({ ...base, pesoKg: 70 }), /entre 50 y 57 kg/);
    assert.throws(() => validarNuevoPeleador({ ...base, pesoKg: 'ligero' }), ValidacionError);
  });

  it('acepta el peso justo en los bordes del rango', () => {
    assert.ok(validarNuevoPeleador({ ...base, pesoKg: 50 }));
    assert.ok(validarNuevoPeleador({ ...base, pesoKg: 57 }));
  });

  it('rechaza mas KO que victorias', () => {
    assert.throws(() => validarNuevoPeleador({ ...base, victorias: 2, ko: 3 }), /no pueden superar/);
  });

  it('rechaza contadores negativos o no enteros', () => {
    assert.throws(() => validarNuevoPeleador({ ...base, victorias: -1 }), ValidacionError);
    assert.throws(() => validarNuevoPeleador({ ...base, derrotas: 1.5 }), ValidacionError);
  });
});

describe('registrarCombate', () => {
  it('suma victoria', async () => {
    const peleador = await servicio.registrarCombate(1, 'victoria');

    assert.equal(peleador.victorias, 19);
    assert.equal(peleador.combates, 23);
  });

  it('ko suma victoria y ko a la vez', async () => {
    const peleador = await servicio.registrarCombate(1, 'ko');

    assert.equal(peleador.victorias, 19);
    assert.equal(peleador.ko, 12);
  });

  it('suma derrota y empate', async () => {
    assert.equal((await servicio.registrarCombate(1, 'derrota')).derrotas, 4);
    assert.equal((await servicio.registrarCombate(1, 'empate')).empates, 2);
  });

  it('persiste el cambio en el archivo', async () => {
    await servicio.registrarCombate(2, 'ko');

    const enDisco = await repositorio.leer();

    assert.equal(enDisco.peleadores.find((peleador) => peleador.id === 2).ko, 10);
  });

  it('rechaza un resultado desconocido', async () => {
    await assert.rejects(() => servicio.registrarCombate(1, 'abandono'), ValidacionError);
  });

  it('lanza 404 si el peleador no existe', async () => {
    await assert.rejects(() => servicio.registrarCombate(99, 'victoria'), NoEncontradoError);
  });
});

describe('eliminar', () => {
  it('borra y persiste', async () => {
    assert.deepEqual(await servicio.eliminar(1), { eliminado: 1 });
    assert.equal((await repositorio.leer()).peleadores.length, 1);
  });

  it('lanza 404 si no existe', async () => {
    await assert.rejects(() => servicio.eliminar(99), NoEncontradoError);
  });
});
