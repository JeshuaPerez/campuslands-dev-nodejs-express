import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ConfiguracionInvalidaError,
  cargarConfiguracion,
  ocultarSecretos,
} from '../src/config/index.js';

/** Entorno minimo valido. Las pruebas parten de aqui y cambian lo que miran. */
function entornoValido(extra = {}) {
  return {
    APP_NOMBRE: 'Escuderia de prueba',
    API_CLAVE: 'clave-de-prueba-con-largo',
    ...extra,
  };
}

describe('cargarConfiguracion - casos normales', () => {
  it('aplica los valores por defecto de lo que no se define', () => {
    const config = cargarConfiguracion(entornoValido());

    assert.equal(config.NODE_ENV, 'development');
    assert.equal(config.PORT, 3000);
    assert.equal(config.LOG_NIVEL, 'info');
    assert.equal(config.TELEMETRIA_ACTIVA, true);
  });

  it('convierte los numeros, que en process.env son strings', () => {
    const config = cargarConfiguracion(entornoValido({ PORT: '8080' }));

    assert.equal(config.PORT, 8080);
    assert.equal(typeof config.PORT, 'number');
  });

  it('convierte los decimales', () => {
    const config = cargarConfiguracion(entornoValido({ FACTOR_CONVERSION_MILLAS: '0.5' }));

    assert.equal(config.FACTOR_CONVERSION_MILLAS, 0.5);
  });

  it('normaliza los enumerados a minusculas', () => {
    assert.equal(cargarConfiguracion(entornoValido({ NODE_ENV: 'PRODUCTION' })).NODE_ENV, 'production');
  });

  it('deriva las banderas de entorno', () => {
    const produccion = cargarConfiguracion(entornoValido({ NODE_ENV: 'production' }));

    assert.equal(produccion.esProduccion, true);
    assert.equal(produccion.esDesarrollo, false);
  });

  it('devuelve un objeto congelado', () => {
    const config = cargarConfiguracion(entornoValido());

    assert.throws(() => {
      config.PORT = 9999;
    }, TypeError);
  });
});

describe('el string "false" es la trampa clasica', () => {
  it('convierte "false" a false de verdad', () => {
    const config = cargarConfiguracion(entornoValido({ TELEMETRIA_ACTIVA: 'false' }));

    assert.equal(config.TELEMETRIA_ACTIVA, false);
  });

  it('demuestra por que hace falta convertir', () => {
    // Sin conversion explicita, esto seria cierto: "false" es un string no
    // vacio, y todo string no vacio es truthy en JavaScript.
    assert.equal(Boolean('false'), true);
    assert.equal(Boolean('0'), true);
  });

  it('acepta las formas habituales de escribir si y no', () => {
    for (const valor of ['true', '1', 'si', 'yes', 'on', 'TRUE']) {
      assert.equal(cargarConfiguracion(entornoValido({ TELEMETRIA_ACTIVA: valor })).TELEMETRIA_ACTIVA, true);
    }

    for (const valor of ['false', '0', 'no', 'off', 'FALSE']) {
      assert.equal(cargarConfiguracion(entornoValido({ TELEMETRIA_ACTIVA: valor })).TELEMETRIA_ACTIVA, false);
    }
  });
});

describe('cargarConfiguracion - casos limite', () => {
  it('trata la cadena vacia como no definida', () => {
    assert.equal(cargarConfiguracion(entornoValido({ PORT: '' })).PORT, 3000);
  });

  it('acepta el puerto minimo y el maximo', () => {
    assert.equal(cargarConfiguracion(entornoValido({ PORT: '1' })).PORT, 1);
    assert.equal(cargarConfiguracion(entornoValido({ PORT: '65535' })).PORT, 65535);
  });

  it('acepta la clave de exactamente el largo minimo', () => {
    const config = cargarConfiguracion(entornoValido({ API_CLAVE: 'a'.repeat(16) }));

    assert.equal(config.API_CLAVE.length, 16);
  });
});

describe('cargarConfiguracion - casos invalidos', () => {
  it('falla si falta una variable obligatoria', () => {
    assert.throws(() => cargarConfiguracion({}), ConfiguracionInvalidaError);
  });

  it('enumera TODOS los problemas de golpe, no solo el primero', () => {
    assert.throws(
      () => cargarConfiguracion({ PORT: 'ocho', NODE_ENV: 'staging' }),
      (error) => {
        // Faltan las dos obligatorias, mas el puerto y el entorno malos.
        assert.equal(error.problemas.length, 4);
        return true;
      },
    );
  });

  it('rechaza un puerto fuera de rango o no entero', () => {
    assert.throws(() => cargarConfiguracion(entornoValido({ PORT: '0' })), ConfiguracionInvalidaError);
    assert.throws(() => cargarConfiguracion(entornoValido({ PORT: '70000' })), ConfiguracionInvalidaError);
    assert.throws(() => cargarConfiguracion(entornoValido({ PORT: '3000.5' })), ConfiguracionInvalidaError);
    assert.throws(() => cargarConfiguracion(entornoValido({ PORT: 'ocho' })), ConfiguracionInvalidaError);
  });

  it('rechaza un enumerado fuera de la lista', () => {
    assert.throws(
      () => cargarConfiguracion(entornoValido({ NODE_ENV: 'staging' })),
      /NODE_ENV debe ser uno de/,
    );
    assert.throws(
      () => cargarConfiguracion(entornoValido({ LOG_NIVEL: 'verboso' })),
      /LOG_NIVEL debe ser uno de/,
    );
  });

  it('rechaza un booleano que no reconoce', () => {
    assert.throws(
      () => cargarConfiguracion(entornoValido({ TELEMETRIA_ACTIVA: 'quiza' })),
      ConfiguracionInvalidaError,
    );
  });

  it('rechaza una clave demasiado corta', () => {
    assert.throws(
      () => cargarConfiguracion(entornoValido({ API_CLAVE: 'corta' })),
      /al menos 16 caracteres/,
    );
  });
});

describe('ocultarSecretos', () => {
  it('nunca devuelve la clave entera', () => {
    const config = cargarConfiguracion(entornoValido({ API_CLAVE: 'supersecreto-1234567' }));
    const visible = ocultarSecretos(config);

    assert.notEqual(visible.API_CLAVE, config.API_CLAVE);
    assert.equal(visible.API_CLAVE.includes('secreto'), false);
  });

  it('deja reconocer cual clave es sin revelarla', () => {
    const visible = ocultarSecretos(cargarConfiguracion(entornoValido({ API_CLAVE: 'abcdefghijklmnop' })));

    assert.equal(visible.API_CLAVE, 'abc********op');
  });

  it('oculta del todo las claves muy cortas', () => {
    assert.equal(ocultarSecretos({ API_CLAVE: 'corta' }).API_CLAVE, '********');
  });

  it('no toca los valores que no son secretos', () => {
    const config = cargarConfiguracion(entornoValido({ PORT: '8080' }));

    assert.equal(ocultarSecretos(config).PORT, 8080);
    assert.equal(ocultarSecretos(config).APP_NOMBRE, 'Escuderia de prueba');
  });
});
