/**
 * Controladores del ejercicio 02. Traducen entre HTTP y los servicios.
 */

import { ARMAS, ESTILOS, crearLoadout } from '../services/loadout.service.js';
import {
  listarScripts,
  obtenerResumenPaquete,
} from '../services/package-info.service.js';

const TEMA = 'npm scripts y package.json';

/** GET /basico/ejercicio-02 - respuesta principal pedida por el enunciado. */
async function obtenerResumen(req, res, next) {
  try {
    res.status(200).json({
      ok: true,
      message: 'Ejercicio ejecutado correctamente',
      topic: TEMA,
      paquete: await obtenerResumenPaquete(),
    });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-02/scripts - los scripts del manifiesto, documentados. */
async function obtenerScripts(req, res, next) {
  try {
    const scripts = await listarScripts();

    res.status(200).json({ ok: true, total: scripts.length, data: scripts });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-02/armas - catalogo disponible para armar loadouts. */
function obtenerArmas(req, res) {
  res.status(200).json({
    ok: true,
    data: {
      armas: Object.entries(ARMAS).map(([nombre, perfil]) => ({ nombre, ...perfil })),
      estilos: ESTILOS,
    },
  });
}

/** POST /basico/ejercicio-02/loadouts - arma un loadout validando la entrada. */
function registrarLoadout(req, res, next) {
  try {
    const loadout = crearLoadout(req.body);

    res.status(201).json({
      ok: true,
      message: 'Loadout creado correctamente',
      data: loadout,
    });
  } catch (error) {
    next(error);
  }
}

export { obtenerArmas, obtenerResumen, obtenerScripts, registrarLoadout };
