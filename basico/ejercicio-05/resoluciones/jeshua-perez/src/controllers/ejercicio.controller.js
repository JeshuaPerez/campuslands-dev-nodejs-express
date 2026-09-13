/** Controladores del ejercicio 05. Traducen entre HTTP y los servicios. */

import {
  leerCsv,
  leerJson,
  leerTexto,
  listarArchivos,
} from '../services/archivos.service.js';
import {
  construirGoleadores,
  construirTabla,
  resumirLiga,
} from '../services/liga.service.js';

const TEMA = 'fs para leer archivos';

const ARCHIVO_EQUIPOS = 'equipos.json';
const ARCHIVO_GOLEADORES = 'goleadores.csv';

/** GET /basico/ejercicio-05 - respuesta principal pedida por el enunciado. */
export async function obtenerResumen(req, res, next) {
  try {
    const { equipos } = await leerJson(ARCHIVO_EQUIPOS);
    const goleadores = await leerCsv(ARCHIVO_GOLEADORES);

    res.status(200).json({
      ok: true,
      message: 'Ejercicio ejecutado correctamente',
      topic: TEMA,
      liga: resumirLiga(equipos, goleadores),
    });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-05/archivos - que hay en la carpeta de datos. */
export async function obtenerArchivos(req, res, next) {
  try {
    const archivos = await listarArchivos();

    res.status(200).json({ ok: true, total: archivos.length, data: archivos });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-05/archivos/:nombre - lee un archivo en crudo. */
export async function obtenerArchivo(req, res, next) {
  try {
    const contenido = await leerTexto(req.params.nombre);

    res.status(200).json({
      ok: true,
      data: { nombre: req.params.nombre, caracteres: contenido.length, contenido },
    });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-05/tabla - tabla de posiciones, con filtro opcional. */
export async function obtenerTabla(req, res, next) {
  try {
    const { temporada, competicion, equipos } = await leerJson(ARCHIVO_EQUIPOS);
    const tabla = construirTabla(equipos, { modalidad: req.query.modalidad });

    res.status(200).json({
      ok: true,
      data: { temporada, competicion, total: tabla.length, tabla },
    });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-05/goleadores - ranking desde el CSV. */
export async function obtenerGoleadores(req, res, next) {
  try {
    const goleadores = await leerCsv(ARCHIVO_GOLEADORES);
    const ranking = construirGoleadores(goleadores, { limite: req.query.limite });

    res.status(200).json({ ok: true, total: ranking.length, data: ranking });
  } catch (error) {
    next(error);
  }
}
