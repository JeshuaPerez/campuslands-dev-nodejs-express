import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  CAMPOS_ORDENABLES,
  ValidacionError,
  buscarAutos,
  listarMarcas,
  obtenerCatalogo,
  resumirInventario,
} from '../src/services/inventario.service.js';

describe('obtenerCatalogo', () => {
  it('devuelve copias, no el catalogo interno', () => {
    const primera = obtenerCatalogo();
    primera[0].precio = 1;

    assert.notEqual(obtenerCatalogo()[0].precio, 1);
  });

  it('lista las marcas ordenadas y sin repetir', () => {
    assert.deepEqual(listarMarcas(), ['Aston Martin', 'Ferrari', 'Lamborghini', 'Porsche']);
  });
});

describe('buscarAutos - casos normales', () => {
  it('sin criterios devuelve todo ordenado por precio', () => {
    const autos = buscarAutos();

    assert.equal(autos.length, 6);
    assert.equal(autos[0].modelo, 'Taycan Turbo');
  });

  it('filtra por marca sin distinguir mayusculas', () => {
    assert.equal(buscarAutos({ marca: 'ferrari' }).length, 2);
    assert.equal(buscarAutos({ marca: 'FERRARI' }).length, 2);
  });

  it('filtra por precio maximo y anio minimo', () => {
    assert.equal(buscarAutos({ precioMax: 1000000000 }).length, 2);
    assert.equal(buscarAutos({ anioMin: 2025 }).length, 2);
  });

  it('filtra los que no tienen stock', () => {
    const autos = buscarAutos({ soloDisponibles: true });

    assert.equal(autos.length, 5);
    assert.ok(autos.every((auto) => auto.stock > 0));
  });

  it('ordena por el campo pedido y en descendente', () => {
    const porCv = buscarAutos({ ordenarPor: 'cv', descendente: true });

    assert.equal(porCv[0].cv, 830);
    assert.equal(porCv.at(-1).cv, 620);
  });

  it('ordena por marca alfabeticamente', () => {
    assert.equal(buscarAutos({ ordenarPor: 'marca' })[0].marca, 'Aston Martin');
  });

  it('combina varios criterios a la vez', () => {
    const autos = buscarAutos({ marca: 'Porsche', ordenarPor: 'cv', descendente: true });

    assert.deepEqual(autos.map((auto) => auto.modelo), ['911 Turbo S', 'Taycan Turbo']);
  });
});

describe('buscarAutos - casos limite', () => {
  it('devuelve vacio si nada cumple', () => {
    assert.deepEqual(buscarAutos({ marca: 'Bugatti' }), []);
    assert.deepEqual(buscarAutos({ precioMax: 0 }), []);
  });

  it('acepta el limite de 1 y uno mayor que el total', () => {
    assert.equal(buscarAutos({ limite: 1 }).length, 1);
    assert.equal(buscarAutos({ limite: 99 }).length, 6);
  });

  it('precioMax exacto incluye el auto que cuesta justo eso', () => {
    assert.ok(buscarAutos({ precioMax: 980000000 }).some((auto) => auto.precio === 980000000));
  });
});

describe('buscarAutos - casos invalidos', () => {
  it('rechaza una marca vacia', () => {
    assert.throws(() => buscarAutos({ marca: '   ' }), ValidacionError);
  });

  it('rechaza numeros negativos o no numericos', () => {
    assert.throws(() => buscarAutos({ precioMax: -1 }), ValidacionError);
    assert.throws(() => buscarAutos({ precioMax: 'caro' }), ValidacionError);
    assert.throws(() => buscarAutos({ anioMin: 'ayer' }), ValidacionError);
  });

  it('rechaza ordenar por un campo que no existe', () => {
    assert.throws(() => buscarAutos({ ordenarPor: 'puertas' }), (error) => {
      assert.equal(error.statusCode, 400);
      assert.match(error.message, /Campos validos/);
      return true;
    });
  });

  it('rechaza limites invalidos', () => {
    assert.throws(() => buscarAutos({ limite: 0 }), ValidacionError);
    assert.throws(() => buscarAutos({ limite: -2 }), ValidacionError);
    assert.throws(() => buscarAutos({ limite: 1.5 }), ValidacionError);
  });

  it('declara los campos ordenables', () => {
    assert.deepEqual(CAMPOS_ORDENABLES, ['precio', 'anio', 'cv', 'stock', 'marca']);
  });
});

describe('resumirInventario', () => {
  it('agrega modelos, unidades y valor del stock', () => {
    const resumen = resumirInventario();

    assert.equal(resumen.modelos, 6);
    assert.equal(resumen.unidades, 16);
    assert.equal(resumen.masPotente.modelo, '296 GTB');
  });

  it('senala los modelos sin stock', () => {
    assert.deepEqual(resumirInventario().sinStock, ['Roma']);
  });
});
