/**
 * Servicio de dominio: draft de un equipo de MOBA.
 *
 * Exporta con `module.exports = {...}`, la forma canonica de CommonJS.
 */

const { aTitulo, porcentaje } = require('../lib/formato');
const contador = require('../lib/contador');

class ValidacionError extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = 'ValidacionError';
    this.statusCode = 400;
  }
}

/** Los cinco puestos de un equipo. Un draft valido cubre exactamente estos. */
const ROLES = Object.freeze(['top', 'jungla', 'medio', 'tirador', 'soporte']);

/** Campeones disponibles por rol, con su winrate historico. */
const CAMPEONES = Object.freeze({
  top: { Darius: 52.1, Garen: 50.8, Ornn: 51.4 },
  jungla: { 'Lee Sin': 49.2, Warwick: 52.7, Vi: 50.3 },
  medio: { Ahri: 51.9, Zed: 48.6, Lux: 52.4 },
  tirador: { Jinx: 51.2, Caitlyn: 49.8, Ezreal: 50.1 },
  soporte: { Thresh: 50.6, Leona: 51.8, Lulu: 52.9 },
});

function validarRol(rol) {
  if (typeof rol !== 'string' || rol.trim() === '') {
    throw new ValidacionError('El rol es obligatorio.');
  }

  const normalizado = rol.trim().toLowerCase();

  if (!ROLES.includes(normalizado)) {
    throw new ValidacionError(`El rol debe ser uno de: ${ROLES.join(', ')}.`);
  }

  return normalizado;
}

function validarCampeon(rol, campeon) {
  if (typeof campeon !== 'string' || campeon.trim() === '') {
    throw new ValidacionError('El campeon es obligatorio.');
  }

  const disponibles = Object.keys(CAMPEONES[rol]);
  const encontrado = disponibles.find(
    (nombre) => nombre.toLowerCase() === campeon.trim().toLowerCase(),
  );

  if (!encontrado) {
    throw new ValidacionError(
      `${aTitulo(campeon)} no juega en ${rol}. Disponibles: ${disponibles.join(', ')}.`,
    );
  }

  return encontrado;
}

/**
 * Valida un draft completo de cinco escogidos y calcula su winrate medio.
 *
 * @param {{picks: Array<{rol: string, campeon: string}>}} datos
 * @throws {ValidacionError} si faltan roles, sobran, se repiten o no existen.
 */
function crearDraft(datos = {}) {
  const { picks } = datos;

  if (!Array.isArray(picks)) {
    throw new ValidacionError('picks debe ser un arreglo.');
  }

  if (picks.length !== ROLES.length) {
    throw new ValidacionError(
      `Un draft necesita exactamente ${ROLES.length} picks y llegaron ${picks.length}.`,
    );
  }

  const rolesVistos = new Set();
  const seleccion = picks.map((pick) => {
    const rol = validarRol(pick?.rol);

    if (rolesVistos.has(rol)) {
      throw new ValidacionError(`El rol ${rol} esta repetido en el draft.`);
    }

    rolesVistos.add(rol);

    const campeon = validarCampeon(rol, pick?.campeon);

    return { rol, campeon, winrate: CAMPEONES[rol][campeon] };
  });

  const sumaWinrate = seleccion.reduce((total, pick) => total + pick.winrate, 0);

  // Cada draft valido queda registrado en el modulo cacheado por require.
  const numeroDeDraft = contador.registrarPartida();

  return {
    numeroDeDraft,
    picks: seleccion.sort((a, b) => ROLES.indexOf(a.rol) - ROLES.indexOf(b.rol)),
    winrateMedio: Number((sumaWinrate / seleccion.length).toFixed(2)),
    favorito: seleccion.reduce((mejor, pick) =>
      pick.winrate > mejor.winrate ? pick : mejor,
    ),
    cuotaSobre50: porcentaje(
      seleccion.filter((pick) => pick.winrate > 50).length,
      seleccion.length,
    ),
  };
}

module.exports = {
  CAMPEONES,
  ROLES,
  ValidacionError,
  crearDraft,
};
