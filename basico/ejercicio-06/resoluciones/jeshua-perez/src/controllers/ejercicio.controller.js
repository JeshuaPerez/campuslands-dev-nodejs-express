/** Controladores del ejercicio 06. */

import path from 'node:path';

import {
  CARPETA_PUBLICA,
  EXTENSIONES_PERMITIDAS,
  describirRuta,
} from '../services/rutas.service.js';
import { leerDocumento, listarDocumentos } from '../services/manuales.service.js';

const TEMA = 'path y rutas seguras';

/** GET /basico/ejercicio-06 - respuesta principal pedida por el enunciado. */
export async function obtenerResumen(req, res, next) {
  try {
    const documentos = await listarDocumentos();

    res.status(200).json({
      ok: true,
      message: 'Ejercicio ejecutado correctamente',
      topic: TEMA,
      taller: {
        carpetaPublica: 'publico/',
        documentos: documentos.length,
        extensionesPermitidas: EXTENSIONES_PERMITIDAS,
        separadorDelSistema: path.sep,
      },
    });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-06/documentos - lista lo servible. */
export async function obtenerDocumentos(req, res, next) {
  try {
    const documentos = await listarDocumentos();

    res.status(200).json({ ok: true, total: documentos.length, data: documentos });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /basico/ejercicio-06/documentos/* - lee un documento.
 *
 * Se usa un comodin para admitir subcarpetas (informes/orden-1042.txt).
 */
export async function obtenerDocumento(req, res, next) {
  try {
    // En Express 5 el comodin con nombre llega como arreglo de segmentos.
    const segmentos = req.params.ruta;
    const solicitado = Array.isArray(segmentos) ? segmentos.join('/') : String(segmentos ?? '');

    res.status(200).json({ ok: true, data: await leerDocumento(solicitado) });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-06/analizar?ruta=... - explica una ruta con path. */
export function analizarRuta(req, res, next) {
  try {
    res.status(200).json({ ok: true, data: describirRuta(req.query.ruta) });
  } catch (error) {
    next(error);
  }
}
