/**
 * Controladores del ejercicio 01.
 *
 * Su unica responsabilidad es traducir entre HTTP y los servicios: leer la
 * peticion, llamar al servicio y elegir el status code de la respuesta.
 */

import { CLASES, crearPersonaje } from '../services/character.service.js';
import { obtenerInfoRuntime } from '../services/runtime.service.js';

const TEMA = 'Node runtime y consola';

/** GET /basico/ejercicio-01 - respuesta principal pedida por el enunciado. */
function obtenerResumen(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Ejercicio ejecutado correctamente',
    topic: TEMA,
    runtime: obtenerInfoRuntime(),
    clasesDisponibles: CLASES,
  });
}

/** POST /basico/ejercicio-01/personajes - crea un personaje RPG. */
function registrarPersonaje(req, res, next) {
  try {
    const personaje = crearPersonaje(req.body);

    res.status(201).json({
      ok: true,
      message: 'Personaje creado correctamente',
      data: personaje,
    });
  } catch (error) {
    next(error);
  }
}

export { registrarPersonaje, obtenerResumen };
