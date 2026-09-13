import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { cargarConfiguracion } from '../src/config/index.js';
import {
  ValidacionError,
  obtenerCatalogo,
  registrarAuto,
} from '../src/services/autos.service.js';

/** Configuracion de prueba: el tope se puede mover sin tocar process.env. */
function config(extra = {}) {
  return cargarConfiguracion({
    APP_NOMBRE: 'Pruebas',
    API_CLAVE: 'clave-de-prueba-con-largo',
    NODE_ENV: 'test',
    ...extra,
  });
}

describe('obtenerCatalogo', () => {
  it('convierte a millas con el factor configurado', () => {
    const catalogo = obtenerCatalogo(config());
    const bugatti = catalogo.find((auto) => auto.marca === 'Bugatti');

    assert.equal(bugatti.velocidadMaximaMph, Math.round(440 * 0.621371));
  });

  it('cambiar el factor cambia el resultado', () => {
    const catalogo = obtenerCatalogo(config({ FACTOR_CONVERSION_MILLAS: '1' }));
    const bugatti = catalogo.find((auto) => auto.marca === 'Bugatti');

    assert.equal(bugatti.velocidadMaximaMph, 440);
  });

  it('marca los que superan el tope configurado', () => {
    const conTopeBajo = obtenerCatalogo(config({ MAX_VELOCIDAD_KMH: '400' }));

    assert.equal(conTopeBajo.filter((auto) => auto.superaElTope).length, 4);
  });

  it('subir el tope deja de marcarlos', () => {
    const conTopeAlto = obtenerCatalogo(config({ MAX_VELOCIDAD_KMH: '500' }));

    assert.equal(conTopeAlto.filter((auto) => auto.superaElTope).length, 0);
  });
});

describe('registrarAuto - casos normales', () => {
  it('registra un auto por debajo del tope', () => {
    const auto = registrarAuto(
      { marca: 'Hennessey', modelo: 'Venom F5', velocidadMaxima: 350 },
      config(),
    );

    assert.equal(auto.marca, 'Hennessey');
    assert.equal(auto.registradoEn, 'test');
  });

  it('recorta los espacios de marca y modelo', () => {
    const auto = registrarAuto(
      { marca: '  SSC  ', modelo: '  Tuatara  ', velocidadMaxima: 300 },
      config(),
    );

    assert.equal(auto.marca, 'SSC');
    assert.equal(auto.modelo, 'Tuatara');
  });
});

describe('registrarAuto - el tope viene del entorno', () => {
  it('acepta la velocidad exactamente igual al tope', () => {
    const auto = registrarAuto(
      { marca: 'X', modelo: 'Y', velocidadMaxima: 400 },
      config({ MAX_VELOCIDAD_KMH: '400' }),
    );

    assert.equal(auto.velocidadMaxima, 400);
  });

  it('rechaza un km/h por encima del tope', () => {
    assert.throws(
      () => registrarAuto({ marca: 'X', modelo: 'Y', velocidadMaxima: 401 }, config({ MAX_VELOCIDAD_KMH: '400' })),
      /supera el tope configurado/,
    );
  });

  it('el mismo auto pasa o no segun la configuracion', () => {
    const auto = { marca: 'X', modelo: 'Y', velocidadMaxima: 450 };

    assert.throws(() => registrarAuto(auto, config({ MAX_VELOCIDAD_KMH: '400' })), ValidacionError);
    assert.ok(registrarAuto(auto, config({ MAX_VELOCIDAD_KMH: '500' })));
  });
});

describe('registrarAuto - casos invalidos', () => {
  it('rechaza la llamada sin datos', () => {
    assert.throws(() => registrarAuto(undefined, config()), ValidacionError);
  });

  it('rechaza marca o modelo vacios', () => {
    assert.throws(() => registrarAuto({ modelo: 'Y', velocidadMaxima: 300 }, config()), ValidacionError);
    assert.throws(() => registrarAuto({ marca: '  ', modelo: 'Y', velocidadMaxima: 300 }, config()), ValidacionError);
    assert.throws(() => registrarAuto({ marca: 'X', velocidadMaxima: 300 }, config()), ValidacionError);
  });

  it('rechaza velocidades no numericas o no positivas', () => {
    assert.throws(() => registrarAuto({ marca: 'X', modelo: 'Y', velocidadMaxima: 0 }, config()), ValidacionError);
    assert.throws(() => registrarAuto({ marca: 'X', modelo: 'Y', velocidadMaxima: -1 }, config()), ValidacionError);
    assert.throws(() => registrarAuto({ marca: 'X', modelo: 'Y', velocidadMaxima: 'rapido' }, config()), ValidacionError);
  });

  it('expone statusCode 400', () => {
    assert.throws(() => registrarAuto({}, config()), (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    });
  });
});
