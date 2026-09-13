import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CLASES,
  NIVEL_MAXIMO,
  NIVEL_MINIMO,
  ValidacionError,
  crearPersonaje,
} from '../src/services/character.service.js';

describe('crearPersonaje - casos normales', () => {
  it('crea un personaje con clase y nivel por defecto', () => {
    const personaje = crearPersonaje({ nombre: 'Aldric' });

    assert.equal(personaje.nombre, 'Aldric');
    assert.equal(personaje.clase, 'guerrero');
    assert.equal(personaje.nivel, NIVEL_MINIMO);
  });

  it('calcula estadisticas deterministas segun clase y nivel', () => {
    const mago = crearPersonaje({ nombre: 'Lyra', clase: 'mago', nivel: 10 });

    // hp = 20 + 7*10, mp = 10 + 15*10, ataque = 9*10, defensa = 3*10
    assert.equal(mago.hp, 90);
    assert.equal(mago.mp, 160);
    assert.equal(mago.ataque, 90);
    assert.equal(mago.defensa, 30);
    assert.equal(mago.poder, 90 + 30 + 9 + 16);
  });

  it('normaliza espacios y mayusculas en la entrada', () => {
    const personaje = crearPersonaje({ nombre: '  Kael  ', clase: 'ARQUERO' });

    assert.equal(personaje.nombre, 'Kael');
    assert.equal(personaje.clase, 'arquero');
  });

  it('acepta todas las clases declaradas', () => {
    for (const clase of CLASES) {
      assert.equal(crearPersonaje({ nombre: 'Test', clase }).clase, clase);
    }
  });
});

describe('crearPersonaje - casos limite', () => {
  it('acepta el nivel minimo y el maximo', () => {
    assert.equal(crearPersonaje({ nombre: 'Borde', nivel: NIVEL_MINIMO }).nivel, 1);
    assert.equal(crearPersonaje({ nombre: 'Borde', nivel: NIVEL_MAXIMO }).nivel, 99);
  });

  it('acepta nombres en la longitud minima y maxima', () => {
    assert.equal(crearPersonaje({ nombre: 'Ana' }).nombre, 'Ana');
    assert.equal(crearPersonaje({ nombre: 'A'.repeat(20) }).nombre, 'A'.repeat(20));
  });
});

describe('crearPersonaje - casos invalidos', () => {
  it('rechaza la llamada sin argumentos', () => {
    assert.throws(() => crearPersonaje(), ValidacionError);
  });

  it('rechaza nombre vacio o solo espacios', () => {
    assert.throws(() => crearPersonaje({ nombre: '' }), ValidacionError);
    assert.throws(() => crearPersonaje({ nombre: '   ' }), ValidacionError);
  });

  it('rechaza nombres fuera de rango', () => {
    assert.throws(() => crearPersonaje({ nombre: 'Al' }), ValidacionError);
    assert.throws(() => crearPersonaje({ nombre: 'A'.repeat(21) }), ValidacionError);
  });

  it('rechaza una clase desconocida', () => {
    assert.throws(
      () => crearPersonaje({ nombre: 'Aldric', clase: 'druida' }),
      ValidacionError,
    );
  });

  it('rechaza niveles fuera de rango o no enteros', () => {
    assert.throws(() => crearPersonaje({ nombre: 'Aldric', nivel: 0 }), ValidacionError);
    assert.throws(() => crearPersonaje({ nombre: 'Aldric', nivel: 100 }), ValidacionError);
    assert.throws(() => crearPersonaje({ nombre: 'Aldric', nivel: 1.5 }), ValidacionError);
  });

  it('expone statusCode 400 en el error de validacion', () => {
    assert.throws(() => crearPersonaje({ nombre: '' }), (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    });
  });
});
