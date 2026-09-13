/** Controladores del ejercicio 08. */

import { ocultarSecretos } from '../config/index.js';
import { ESQUEMA } from '../config/esquema.js';
import { obtenerCatalogo, registrarAuto } from '../services/autos.service.js';

const TEMA = 'variables de entorno';

/**
 * Los controladores reciben la configuracion por cierre, desde crearApp.
 * Nada aqui dentro lee process.env directamente.
 */
export function crearControladores(configuracion) {
  return {
    /** GET /basico/ejercicio-08 - respuesta principal del enunciado. */
    obtenerResumen(req, res) {
      res.status(200).json({
        ok: true,
        message: 'Ejercicio ejecutado correctamente',
        topic: TEMA,
        entorno: {
          NODE_ENV: configuracion.NODE_ENV,
          esProduccion: configuracion.esProduccion,
          variablesDeclaradas: Object.keys(ESQUEMA).length,
        },
      });
    },

    /** GET /basico/ejercicio-08/config - la configuracion, con secretos ocultos. */
    obtenerConfiguracion(req, res) {
      res.status(200).json({ ok: true, data: ocultarSecretos(configuracion) });
    },

    /** GET /basico/ejercicio-08/esquema - que se puede configurar y como. */
    obtenerEsquema(req, res) {
      res.status(200).json({
        ok: true,
        data: Object.entries(ESQUEMA).map(([clave, regla]) => ({
          variable: clave,
          tipo: regla.tipo,
          obligatoria: Boolean(regla.obligatoria),
          secreto: Boolean(regla.secreto),
          porDefecto: regla.secreto ? null : (regla.porDefecto ?? null),
          descripcion: regla.descripcion,
        })),
      });
    },

    /** GET /basico/ejercicio-08/autos - catalogo afectado por la configuracion. */
    obtenerAutos(req, res) {
      const autos = obtenerCatalogo(configuracion);

      res.status(200).json({
        ok: true,
        total: autos.length,
        topeConfigurado: configuracion.MAX_VELOCIDAD_KMH,
        data: autos,
      });
    },

    /** POST /basico/ejercicio-08/autos - registra respetando el tope. */
    registrarAuto(req, res, next) {
      try {
        const auto = registrarAuto(req.body, configuracion);

        res.status(201).json({ ok: true, message: 'Auto registrado', data: auto });
      } catch (error) {
        next(error);
      }
    },
  };
}
