const assert = require('node:assert/strict');
const { beforeEach, describe, it } = require('node:test');

const contador = require('../src/lib/contador');
const { ROLES, ValidacionError, crearDraft } = require('../src/services/draft.service');

/** Draft valido de referencia, uno por cada rol. */
function draftValido() {
  return {
    picks: [
      { rol: 'top', campeon: 'Darius' },
      { rol: 'jungla', campeon: 'Warwick' },
      { rol: 'medio', campeon: 'Lux' },
      { rol: 'tirador', campeon: 'Jinx' },
      { rol: 'soporte', campeon: 'Lulu' },
    ],
  };
}

beforeEach(() => {
  contador.reiniciar();
});

describe('crearDraft - casos normales', () => {
  it('acepta un draft con los cinco roles', () => {
    const draft = crearDraft(draftValido());

    assert.equal(draft.picks.length, 5);
    assert.deepEqual(draft.picks.map((pick) => pick.rol), ROLES);
  });

  it('calcula el winrate medio y el favorito', () => {
    const draft = crearDraft(draftValido());

    assert.equal(draft.winrateMedio, 52.26);
    assert.equal(draft.favorito.campeon, 'Lulu');
  });

  it('ordena los picks por rol aunque lleguen desordenados', () => {
    const desordenado = { picks: draftValido().picks.reverse() };

    assert.deepEqual(crearDraft(desordenado).picks.map((pick) => pick.rol), ROLES);
  });

  it('no distingue mayusculas en rol ni campeon', () => {
    const picks = draftValido().picks.map((pick) => ({
      rol: pick.rol.toUpperCase(),
      campeon: pick.campeon.toLowerCase(),
    }));

    assert.equal(crearDraft({ picks }).picks[0].campeon, 'Darius');
  });

  it('numera los drafts usando el modulo cacheado por require', () => {
    assert.equal(crearDraft(draftValido()).numeroDeDraft, 1);
    assert.equal(crearDraft(draftValido()).numeroDeDraft, 2);
  });
});

describe('crearDraft - casos limite', () => {
  it('calcula la cuota de picks por encima del 50 por ciento', () => {
    const draft = crearDraft(draftValido());

    assert.equal(draft.cuotaSobre50, 100);
  });

  it('baja la cuota cuando se eligen los campeones mas flojos', () => {
    const draft = crearDraft({
      picks: [
        { rol: 'top', campeon: 'Garen' },
        { rol: 'jungla', campeon: 'Lee Sin' },
        { rol: 'medio', campeon: 'Zed' },
        { rol: 'tirador', campeon: 'Caitlyn' },
        { rol: 'soporte', campeon: 'Thresh' },
      ],
    });

    // Solo Garen (50.8) y Thresh (50.6) superan el 50: 2 de 5 = 40 por ciento.
    // No existe draft con 0 por ciento porque top y soporte no tienen
    // ningun campeon por debajo de 50.
    assert.equal(draft.cuotaSobre50, 40);
    assert.equal(draft.winrateMedio, 49.8);
  });
});

describe('crearDraft - casos invalidos', () => {
  it('rechaza la llamada sin argumentos', () => {
    assert.throws(() => crearDraft(), ValidacionError);
  });

  it('rechaza picks que no sean arreglo', () => {
    assert.throws(() => crearDraft({ picks: 'top' }), ValidacionError);
  });

  it('rechaza un draft incompleto o con picks de mas', () => {
    const base = draftValido().picks;

    assert.throws(() => crearDraft({ picks: base.slice(0, 4) }), ValidacionError);
    assert.throws(() => crearDraft({ picks: [...base, base[0]] }), ValidacionError);
  });

  it('rechaza roles repetidos', () => {
    const picks = draftValido().picks;
    picks[1] = { rol: 'top', campeon: 'Garen' };

    assert.throws(() => crearDraft({ picks }), ValidacionError);
  });

  it('rechaza un campeon que no juega ese rol', () => {
    const picks = draftValido().picks;
    picks[0] = { rol: 'top', campeon: 'Jinx' };

    assert.throws(() => crearDraft({ picks }), ValidacionError);
  });

  it('expone statusCode 400 en el error de validacion', () => {
    assert.throws(() => crearDraft({ picks: [] }), (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    });
  });
});
