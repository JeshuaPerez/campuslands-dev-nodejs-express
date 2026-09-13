import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  SALIDA_ARGUMENTOS,
  SALIDA_COMANDO,
  SALIDA_OK,
  ejecutar,
} from '../src/cli/index.js';

/**
 * Ejecuta el CLI capturando lo que imprime.
 *
 * `ejecutar` devuelve el codigo de salida en vez de llamar a process.exit, y
 * por eso se puede probar aqui sin matar el proceso de pruebas.
 */
function correr(...argumentos) {
  const salida = [];
  const errores = [];

  const logOriginal = console.log;
  const errorOriginal = console.error;
  const tableOriginal = console.table;

  console.log = (...partes) => salida.push(partes.join(' '));
  console.error = (...partes) => errores.push(partes.join(' '));
  console.table = (datos) => salida.push(JSON.stringify(datos));

  try {
    const codigo = ejecutar(['/node', '/src/cli/index.js', ...argumentos]);

    return { codigo, salida: salida.join('\n'), errores: errores.join('\n') };
  } finally {
    console.log = logOriginal;
    console.error = errorOriginal;
    console.table = tableOriginal;
  }
}

describe('CLI - casos normales', () => {
  it('sin argumentos muestra la ayuda y sale con 0', () => {
    const { codigo, salida } = correr();

    assert.equal(codigo, SALIDA_OK);
    assert.match(salida, /concesionario - inventario de autos de lujo/);
  });

  it('listar devuelve el catalogo completo', () => {
    const { codigo, salida } = correr('listar', '--json');
    const autos = JSON.parse(salida);

    assert.equal(codigo, SALIDA_OK);
    assert.equal(autos.length, 6);
  });

  it('buscar filtra por marca', () => {
    const { codigo, salida } = correr('buscar', '--marca', 'Ferrari', '--json');
    const autos = JSON.parse(salida);

    assert.equal(codigo, SALIDA_OK);
    assert.equal(autos.length, 2);
    assert.ok(autos.every((auto) => auto.marca === 'Ferrari'));
  });

  it('acepta alias cortos y orden descendente', () => {
    const autos = JSON.parse(correr('buscar', '-m', 'Porsche', '-o', 'cv', '--desc', '--json').salida);

    assert.equal(autos[0].modelo, '911 Turbo S');
  });

  it('acepta la forma --opcion=valor', () => {
    const autos = JSON.parse(correr('buscar', '--precio-max=1000000000', '--json').salida);

    assert.equal(autos.length, 2);
  });

  it('resumen imprime las estadisticas', () => {
    const { codigo, salida } = correr('resumen', '--json');
    const resumen = JSON.parse(salida);

    assert.equal(codigo, SALIDA_OK);
    assert.equal(resumen.modelos, 6);
    assert.equal(resumen.unidades, 16);
  });

  it('la bandera --ayuda funciona en cualquier comando', () => {
    const { codigo, salida } = correr('buscar', '--ayuda');

    assert.equal(codigo, SALIDA_OK);
    assert.match(salida, /CODIGOS DE SALIDA/);
  });
});

describe('CLI - casos limite', () => {
  it('avisa cuando ningun auto cumple, sin fallar', () => {
    const { codigo, salida } = correr('buscar', '--marca', 'Bugatti');

    assert.equal(codigo, SALIDA_OK);
    assert.match(salida, /Ningun auto cumple esos criterios/);
  });

  it('el limite recorta el resultado', () => {
    assert.equal(JSON.parse(correr('buscar', '-l', '2', '--json').salida).length, 2);
  });
});

describe('CLI - codigos de salida en error', () => {
  it('sale con 2 ante un comando desconocido', () => {
    const { codigo, errores } = correr('vender');

    assert.equal(codigo, SALIDA_COMANDO);
    assert.match(errores, /Comando desconocido: vender/);
  });

  it('sale con 1 ante una opcion desconocida', () => {
    const { codigo, errores } = correr('buscar', '--color', 'rojo');

    assert.equal(codigo, SALIDA_ARGUMENTOS);
    assert.match(errores, /Error en los argumentos/);
  });

  it('sale con 1 si el campo de orden no existe', () => {
    const { codigo, errores } = correr('buscar', '--ordenar', 'puertas');

    assert.equal(codigo, SALIDA_ARGUMENTOS);
    assert.match(errores, /Campos validos/);
  });

  it('sale con 1 si el limite es invalido', () => {
    assert.equal(correr('buscar', '--limite', '0').codigo, SALIDA_ARGUMENTOS);
  });

  it('los tres codigos son distintos entre si', () => {
    assert.deepEqual([SALIDA_OK, SALIDA_ARGUMENTOS, SALIDA_COMANDO], [0, 1, 2]);
  });
});
