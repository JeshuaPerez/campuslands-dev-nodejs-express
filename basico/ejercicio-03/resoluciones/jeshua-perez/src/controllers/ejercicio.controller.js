/** Controladores del ejercicio 03. Traducen entre HTTP y los servicios. */

const { CAMPEONES, ROLES, crearDraft } = require('../services/draft.service');
const {
  comprobarCacheDeRequire,
  contarModulosEnCache,
  obtenerInfoModulo,
} = require('../services/module-info.service');

const TEMA = 'modulos CommonJS';

/** GET /basico/ejercicio-03 - respuesta principal pedida por el enunciado. */
function obtenerResumen(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Ejercicio ejecutado correctamente',
    topic: TEMA,
    modulo: obtenerInfoModulo(),
  });
}

/** GET /basico/ejercicio-03/cache - evidencia de que require cachea. */
function obtenerCache(req, res) {
  res.status(200).json({
    ok: true,
    data: {
      ...comprobarCacheDeRequire(),
      modulosPropiosEnCache: contarModulosEnCache(),
    },
  });
}

/** GET /basico/ejercicio-03/campeones - catalogo por rol. */
function obtenerCampeones(req, res) {
  res.status(200).json({ ok: true, data: { roles: ROLES, campeones: CAMPEONES } });
}

/** POST /basico/ejercicio-03/drafts - valida un draft de cinco picks. */
function registrarDraft(req, res, next) {
  try {
    const draft = crearDraft(req.body);

    res.status(201).json({
      ok: true,
      message: 'Draft valido',
      data: draft,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerCache,
  obtenerCampeones,
  obtenerResumen,
  registrarDraft,
};
