import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import {
  RADIO_INICIAL,
  encogerZona,
  estaEnZona,
  radioActual,
  reiniciarZona,
} from '../src/lib/zona.js';

beforeEach(() => {
  reiniciarZona();
});

describe('live bindings de ES Modules', () => {
  it('el valor importado se actualiza sin reimportar', () => {
    assert.equal(radioActual, RADIO_INICIAL);

    encogerZona(300);

    // Esta es la prueba clave: `radioActual` se importo una sola vez arriba y
    // aun asi refleja el cambio. En CommonJS seguiria valiendo 1000.
    assert.equal(radioActual, 700);
  });

  it('acumula varios cierres', () => {
    encogerZona(200);
    encogerZona(300);

    assert.equal(radioActual, 500);
  });

  it('una copia en const si se queda congelada', () => {
    const copia = radioActual;

    encogerZona(400);

    assert.equal(copia, RADIO_INICIAL);
    assert.equal(radioActual, 600);
  });
});

describe('encogerZona', () => {
  it('devuelve la fase y el radio resultante', () => {
    assert.deepEqual(encogerZona(100), { fase: 1, radioActual: 900 });
    assert.deepEqual(encogerZona(100), { fase: 2, radioActual: 800 });
  });

  it('nunca deja el radio por debajo de cero', () => {
    assert.equal(encogerZona(5000).radioActual, 0);
  });

  it('rechaza metros no positivos o no numericos', () => {
    assert.throws(() => encogerZona(0), TypeError);
    assert.throws(() => encogerZona(-10), TypeError);
    assert.throws(() => encogerZona('mucho'), TypeError);
  });
});

describe('estaEnZona', () => {
  it('acepta al jugador justo en el borde', () => {
    assert.equal(estaEnZona(RADIO_INICIAL), true);
  });

  it('rechaza al jugador un metro fuera', () => {
    assert.equal(estaEnZona(RADIO_INICIAL + 1), false);
  });

  it('rechaza distancias no numericas', () => {
    assert.equal(estaEnZona('lejos'), false);
    assert.equal(estaEnZona(undefined), false);
  });
});
