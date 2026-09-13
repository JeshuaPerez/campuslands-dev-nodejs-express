/** Controladores del ejercicio 04. Traducen entre HTTP y los servicios. */

import { NOMBRES_RAREZA } from '../lib/rareza.js';
import {
  cargarModuloBajoDemanda,
  comprobarInteropConCommonJS,
  leerZonaViaBindingVivo,
  obtenerInfoModulo,
} from '../services/module-info.service.js';
import { cerrarZona, evaluarEscuadra } from '../services/partida.service.js';

const TEMA = 'modulos ES Modules';

/** GET /basico/ejercicio-04 - respuesta principal pedida por el enunciado. */
export function obtenerResumen(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Ejercicio ejecutado correctamente',
    topic: TEMA,
    modulo: obtenerInfoModulo(),
  });
}

/** GET /basico/ejercicio-04/zona - estado leido por live binding. */
export function obtenerZona(req, res) {
  res.status(200).json({
    ok: true,
    data: { ...leerZonaViaBindingVivo(), rarezas: NOMBRES_RAREZA },
  });
}

/** POST /basico/ejercicio-04/zona/cerrar - encoge la zona. */
export function cerrarLaZona(req, res, next) {
  try {
    const estado = cerrarZona(req.body?.metros);

    res.status(200).json({
      ok: true,
      message: 'Zona cerrada',
      data: { ...estado, ...leerZonaViaBindingVivo() },
    });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-04/modulos/:nombre - import dinamico. */
export async function cargarModulo(req, res, next) {
  try {
    const resultado = await cargarModuloBajoDemanda(req.params.nombre);

    res.status(resultado.cargado ? 200 : 404).json({
      ok: resultado.cargado,
      data: resultado,
      interop: comprobarInteropConCommonJS(),
    });
  } catch (error) {
    next(error);
  }
}

/** POST /basico/ejercicio-04/escuadras - evalua una escuadra contra la zona. */
export function registrarEscuadra(req, res, next) {
  try {
    const resumen = evaluarEscuadra(req.body);

    res.status(201).json({
      ok: true,
      message: 'Escuadra evaluada',
      data: resumen,
    });
  } catch (error) {
    next(error);
  }
}
