import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ArgumentoInvalidoError,
  INDICE_PRIMER_ARGUMENTO,
  aCriterios,
  extraerArgumentos,
  parsearConUtil,
  parsearManual,
} from '../src/cli/argumentos.js';

/** Simula un process.argv real: [node, script, ...lo que escribio la persona]. */
function argv(...argumentos) {
  return ['/ruta/node', '/ruta/src/cli/index.js', ...argumentos];
}

describe('extraerArgumentos', () => {
  it('descarta el ejecutable y el script', () => {
    assert.deepEqual(extraerArgumentos(argv('buscar', '--marca', 'Ferrari')), [
      'buscar',
      '--marca',
      'Ferrari',
    ]);
  });

  it('el primer argumento de la persona esta en el indice 2', () => {
    assert.equal(INDICE_PRIMER_ARGUMENTO, 2);
    assert.deepEqual(extraerArgumentos(argv()), []);
  });
});

describe('parsearManual - el mecanismo por debajo', () => {
  it('entiende la forma --opcion=valor', () => {
    const { opciones } = parsearManual(['--marca=Ferrari']);

    assert.equal(opciones.marca, 'Ferrari');
  });

  it('entiende la forma --opcion valor', () => {
    const { opciones } = parsearManual(['--marca', 'Ferrari']);

    assert.equal(opciones.marca, 'Ferrari');
  });

  it('trata como bandera la opcion sin valor', () => {
    const { opciones } = parsearManual(['--disponibles', '--desc']);

    assert.equal(opciones.disponibles, true);
    assert.equal(opciones.desc, true);
  });

  it('recoge los argumentos sueltos como subcomando', () => {
    const { sueltos } = parsearManual(['buscar', '--marca', 'Ferrari']);

    assert.deepEqual(sueltos, ['buscar']);
  });

  it('tras el separador -- todo es texto suelto', () => {
    const { opciones, sueltos } = parsearManual(['buscar', '--', '--marca', 'x']);

    assert.deepEqual(sueltos, ['buscar', '--marca', 'x']);
    assert.deepEqual(opciones, {});
  });

  it('rechaza una opcion sin nombre', () => {
    assert.throws(() => parsearManual(['--=valor']), ArgumentoInvalidoError);
  });
});

describe('parsearConUtil - el parser real', () => {
  it('coincide con el manual en las entradas normales', () => {
    const entrada = ['buscar', '--marca', 'Ferrari'];
    const conUtil = parsearConUtil(entrada);
    const manual = parsearManual(entrada);

    assert.equal(conUtil.opciones.marca, manual.opciones.marca);
    assert.deepEqual(conUtil.sueltos, manual.sueltos);
  });

  it('entiende los alias cortos', () => {
    const { opciones } = parsearConUtil(['buscar', '-m', 'Porsche', '-l', '2']);

    assert.equal(opciones.marca, 'Porsche');
    assert.equal(opciones.limite, '2');
  });

  it('aplica los valores por defecto de las banderas', () => {
    const { opciones } = parsearConUtil(['listar']);

    assert.equal(opciones.disponibles, false);
    assert.equal(opciones.json, false);
  });

  it('rechaza una opcion desconocida en vez de ignorarla', () => {
    // En modo strict un error de escritura avisa, no se cuela en silencio.
    assert.throws(() => parsearConUtil(['buscar', '--color', 'rojo']), ArgumentoInvalidoError);
  });

  it('rechaza una opcion de texto sin valor', () => {
    assert.throws(() => parsearConUtil(['buscar', '--marca']), ArgumentoInvalidoError);
  });
});

describe('aCriterios', () => {
  it('traduce las opciones del CLI al lenguaje del dominio', () => {
    const criterios = aCriterios({
      marca: 'Ferrari',
      'precio-max': '1500000000',
      'anio-min': '2023',
      ordenar: 'cv',
      limite: '3',
      disponibles: true,
      desc: true,
    });

    assert.equal(criterios.marca, 'Ferrari');
    assert.equal(criterios.precioMax, '1500000000');
    assert.equal(criterios.anioMin, '2023');
    assert.equal(criterios.ordenarPor, 'cv');
    assert.equal(criterios.limite, '3');
    assert.equal(criterios.soloDisponibles, true);
    assert.equal(criterios.descendente, true);
  });

  it('omite los filtros que no se pidieron', () => {
    const criterios = aCriterios({ disponibles: false, desc: false });

    assert.equal('marca' in criterios, false);
    assert.equal('precioMax' in criterios, false);
    assert.equal(criterios.soloDisponibles, false);
  });
});
