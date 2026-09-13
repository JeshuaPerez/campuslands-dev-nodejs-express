import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  ARMAS,
  ESTILOS,
  PRESUPUESTO_MAXIMO,
  ValidacionError,
  crearLoadout,
} from '../src/services/loadout.service.js';

describe('crearLoadout - casos normales', () => {
  it('usa estilo tactico y 2 granadas por defecto', () => {
    const loadout = crearLoadout({ armaPrincipal: 'AK-47' });

    assert.equal(loadout.estilo, 'tactico');
    assert.equal(loadout.granadas, 2);
    assert.equal(loadout.tipo, 'rifle');
  });

  it('calcula coste y creditos restantes', () => {
    const loadout = crearLoadout({ armaPrincipal: 'AK-47', granadas: 2 });

    assert.equal(loadout.costeTotal, 3300);
    assert.equal(loadout.creditosRestantes, PRESUPUESTO_MAXIMO - 3300);
  });

  it('aplica el ajuste del estilo agresivo al dano', () => {
    const loadout = crearLoadout({ armaPrincipal: 'AK-47', estilo: 'agresivo' });

    assert.equal(loadout.danoEfectivo, Math.round(36 * 1.1));
    assert.equal(loadout.movilidad, 115);
  });

  it('no distingue mayusculas en arma ni estilo', () => {
    const loadout = crearLoadout({ armaPrincipal: 'awp', estilo: 'APOYO' });

    assert.equal(loadout.armaPrincipal, 'AWP');
    assert.equal(loadout.estilo, 'apoyo');
  });

  it('acepta todas las armas y estilos del catalogo', () => {
    for (const arma of Object.keys(ARMAS)) {
      for (const estilo of ESTILOS) {
        assert.ok(crearLoadout({ armaPrincipal: arma, estilo, granadas: 0 }));
      }
    }
  });
});

describe('crearLoadout - casos limite', () => {
  it('acepta 0 y 4 granadas', () => {
    assert.equal(crearLoadout({ armaPrincipal: 'MP9', granadas: 0 }).granadas, 0);
    assert.equal(crearLoadout({ armaPrincipal: 'MP9', granadas: 4 }).granadas, 4);
  });

  it('acepta el loadout mas caro sin pasarse del presupuesto', () => {
    const loadout = crearLoadout({ armaPrincipal: 'AWP', granadas: 4 });

    assert.equal(loadout.costeTotal, 5950);
    assert.ok(loadout.creditosRestantes >= 0);
  });
});

describe('crearLoadout - casos invalidos', () => {
  it('rechaza la llamada sin argumentos', () => {
    assert.throws(() => crearLoadout(), ValidacionError);
  });

  it('rechaza un arma vacia o desconocida', () => {
    assert.throws(() => crearLoadout({ armaPrincipal: '' }), ValidacionError);
    assert.throws(() => crearLoadout({ armaPrincipal: 'Bazuca' }), ValidacionError);
  });

  it('rechaza un estilo inexistente', () => {
    assert.throws(
      () => crearLoadout({ armaPrincipal: 'AK-47', estilo: 'sigiloso' }),
      ValidacionError,
    );
  });

  it('rechaza granadas fuera de rango o no enteras', () => {
    assert.throws(() => crearLoadout({ armaPrincipal: 'AK-47', granadas: -1 }), ValidacionError);
    assert.throws(() => crearLoadout({ armaPrincipal: 'AK-47', granadas: 5 }), ValidacionError);
    assert.throws(() => crearLoadout({ armaPrincipal: 'AK-47', granadas: 1.5 }), ValidacionError);
  });

  it('expone statusCode 400 en el error de validacion', () => {
    assert.throws(() => crearLoadout({ armaPrincipal: 'Bazuca' }), (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    });
  });
});
