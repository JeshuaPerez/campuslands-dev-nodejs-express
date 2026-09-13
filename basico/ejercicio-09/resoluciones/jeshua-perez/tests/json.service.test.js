import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  analizarViajeDeIdaYVuelta,
  bigIntFalla,
  ocultarClaves,
  recuperarConFechas,
} from '../src/services/json.service.js';

describe('lo que JSON conserva', () => {
  it('mantiene textos, numeros, booleanos, null y arreglos', () => {
    const { seMantienen } = analizarViajeDeIdaYVuelta();

    assert.equal(seMantienen.length, 5);
    assert.ok(seMantienen.every((entrada) => entrada.igual));
  });
});

describe('lo que JSON pierde', () => {
  it('borra las claves con undefined y con funciones', () => {
    const recuperado = JSON.parse(JSON.stringify({ a: 1, b: undefined, c: () => 1 }));

    assert.deepEqual(Object.keys(recuperado), ['a']);
  });

  it('convierte Date en string', () => {
    const recuperado = JSON.parse(JSON.stringify({ fecha: new Date('2026-02-10T14:00:00.000Z') }));

    assert.equal(typeof recuperado.fecha, 'string');
    assert.equal(recuperado.fecha, '2026-02-10T14:00:00.000Z');
  });

  it('convierte NaN e Infinity en null', () => {
    const recuperado = JSON.parse(
      JSON.stringify({ a: Number.NaN, b: Number.POSITIVE_INFINITY }),
    );

    assert.equal(recuperado.a, null);
    assert.equal(recuperado.b, null);
  });

  it('vacia los Set y los Map', () => {
    const recuperado = JSON.parse(JSON.stringify({ s: new Set([1, 2]), m: new Map([['a', 1]]) }));

    assert.deepEqual(recuperado.s, {});
    assert.deepEqual(recuperado.m, {});
  });

  it('con BigInt ni siquiera serializa: lanza', () => {
    const resultado = bigIntFalla();

    assert.equal(resultado.lanza, true);
    assert.match(resultado.mensaje, /BigInt/);
  });

  it('el analisis reporta las siete perdidas', () => {
    assert.equal(analizarViajeDeIdaYVuelta().sePierden.length, 7);
  });
});

describe('reviver de JSON.parse', () => {
  it('devuelve las fechas ISO a objetos Date', () => {
    const recuperado = recuperarConFechas('{"debut":"2026-02-10T14:00:00.000Z"}');

    assert.ok(recuperado.debut instanceof Date);
    assert.equal(recuperado.debut.getUTCFullYear(), 2026);
  });

  it('no toca los strings que no son fechas ISO', () => {
    const recuperado = recuperarConFechas('{"nombre":"Ana","fecha":"2026-02-10"}');

    assert.equal(recuperado.nombre, 'Ana');
    assert.equal(typeof recuperado.fecha, 'string');
  });
});

describe('replacer de JSON.stringify', () => {
  it('oculta las claves indicadas', () => {
    const salida = ocultarClaves({ usuario: 'ana', token: 'secreto-real' }, ['token']);

    assert.match(salida, /\[oculto\]/);
    assert.equal(salida.includes('secreto-real'), false);
  });

  it('deja intacto lo demas', () => {
    const salida = JSON.parse(ocultarClaves({ usuario: 'ana', token: 'x' }, ['token']));

    assert.equal(salida.usuario, 'ana');
  });

  it('sin claves que ocultar no cambia nada', () => {
    const objeto = { usuario: 'ana' };

    assert.deepEqual(JSON.parse(ocultarClaves(objeto)), objeto);
  });
});
