import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import RAREZAS, { NOMBRES_RAREZA, multiplicadorDe } from '../src/lib/rareza.js';
import { reiniciarZona } from '../src/lib/zona.js';
import {
  TAMANO_MAXIMO_ESCUADRA,
  ValidacionError,
  cerrarZona,
  evaluarEscuadra,
} from '../src/services/partida.service.js';

function escuadraValida() {
  return {
    jugadores: [
      { nombre: 'Nova', distanciaAlCentro: 100, loot: 'legendario' },
      { nombre: 'Rex', distanciaAlCentro: 500, loot: 'raro' },
      { nombre: 'Kai', distanciaAlCentro: 1500, loot: 'comun' },
    ],
  };
}

beforeEach(() => {
  reiniciarZona();
});

describe('rareza - default y named exports', () => {
  it('expone el default con las cuatro rarezas', () => {
    assert.deepEqual(Object.keys(RAREZAS), ['comun', 'raro', 'epico', 'legendario']);
  });

  it('expone tambien named exports', () => {
    assert.deepEqual(NOMBRES_RAREZA, ['comun', 'raro', 'epico', 'legendario']);
    assert.equal(multiplicadorDe('epico'), 5);
    assert.equal(multiplicadorDe('mitico'), 0);
  });
});

describe('evaluarEscuadra - casos normales', () => {
  it('marca quien esta a salvo segun el radio actual', () => {
    const resumen = evaluarEscuadra(escuadraValida());

    assert.equal(resumen.totalJugadores, 3);
    assert.equal(resumen.aSalvo, 2);
    assert.equal(resumen.fueraDeZona, 1);
  });

  it('calcula el valor del loot por rareza', () => {
    const resumen = evaluarEscuadra(escuadraValida());

    // legendario x10, raro x2.5, comun x1 sobre una base de 100.
    assert.equal(resumen.valorTotalLoot, 1000 + 250 + 100);
    assert.equal(resumen.mejorEquipado.nombre, 'Nova');
  });

  it('lee el radio via live binding tras cerrar la zona', () => {
    cerrarZona(600);

    const resumen = evaluarEscuadra(escuadraValida());

    assert.equal(resumen.radioDeLaZona, 400);
    // Ahora solo Nova (100 m) sigue dentro.
    assert.equal(resumen.aSalvo, 1);
  });
});

describe('evaluarEscuadra - casos limite', () => {
  it('acepta una escuadra de un solo jugador', () => {
    const resumen = evaluarEscuadra({
      jugadores: [{ nombre: 'Solo', distanciaAlCentro: 0, loot: 'comun' }],
    });

    assert.equal(resumen.totalJugadores, 1);
  });

  it('acepta el maximo de jugadores', () => {
    const jugadores = Array.from({ length: TAMANO_MAXIMO_ESCUADRA }, (valor, indice) => ({
      nombre: `Jugador${indice}`,
      distanciaAlCentro: indice * 10,
      loot: 'comun',
    }));

    assert.equal(evaluarEscuadra({ jugadores }).totalJugadores, TAMANO_MAXIMO_ESCUADRA);
  });

  it('acepta al jugador justo en el borde de la zona', () => {
    const resumen = evaluarEscuadra({
      jugadores: [{ nombre: 'Borde', distanciaAlCentro: 1000, loot: 'comun' }],
    });

    assert.equal(resumen.aSalvo, 1);
  });
});

describe('evaluarEscuadra - casos invalidos', () => {
  it('rechaza la llamada sin argumentos', () => {
    assert.throws(() => evaluarEscuadra(), ValidacionError);
  });

  it('rechaza jugadores que no sea arreglo', () => {
    assert.throws(() => evaluarEscuadra({ jugadores: 'Nova' }), ValidacionError);
  });

  it('rechaza escuadra vacia o demasiado grande', () => {
    assert.throws(() => evaluarEscuadra({ jugadores: [] }), ValidacionError);

    const demasiados = Array.from({ length: 5 }, (valor, indice) => ({
      nombre: `J${indice}`,
      distanciaAlCentro: 0,
      loot: 'comun',
    }));

    assert.throws(() => evaluarEscuadra({ jugadores: demasiados }), ValidacionError);
  });

  it('rechaza nombres vacios o repetidos', () => {
    assert.throws(
      () => evaluarEscuadra({ jugadores: [{ nombre: '  ', distanciaAlCentro: 0, loot: 'comun' }] }),
      ValidacionError,
    );

    assert.throws(
      () =>
        evaluarEscuadra({
          jugadores: [
            { nombre: 'Nova', distanciaAlCentro: 0, loot: 'comun' },
            { nombre: 'nova', distanciaAlCentro: 10, loot: 'raro' },
          ],
        }),
      ValidacionError,
    );
  });

  it('rechaza distancias negativas o no numericas', () => {
    assert.throws(
      () => evaluarEscuadra({ jugadores: [{ nombre: 'X', distanciaAlCentro: -1, loot: 'comun' }] }),
      ValidacionError,
    );

    assert.throws(
      () => evaluarEscuadra({ jugadores: [{ nombre: 'X', distanciaAlCentro: 'lejos', loot: 'comun' }] }),
      ValidacionError,
    );
  });

  it('rechaza una rareza inexistente', () => {
    assert.throws(
      () => evaluarEscuadra({ jugadores: [{ nombre: 'X', distanciaAlCentro: 0, loot: 'mitico' }] }),
      ValidacionError,
    );
  });
});

describe('cerrarZona', () => {
  it('traduce el TypeError del modulo a ValidacionError con status 400', () => {
    assert.throws(() => cerrarZona(-5), (error) => {
      assert.equal(error.name, 'ValidacionError');
      assert.equal(error.statusCode, 400);
      return true;
    });
  });
});
