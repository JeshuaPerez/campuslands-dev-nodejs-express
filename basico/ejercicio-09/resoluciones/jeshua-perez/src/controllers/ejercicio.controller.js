/** Controladores del ejercicio 09. */

import {
  analizarViajeDeIdaYVuelta,
  bigIntFalla,
  ocultarClaves,
} from '../services/json.service.js';
import { CATEGORIAS, RESULTADOS } from '../services/peleadores.service.js';

const TEMA = 'JSON y persistencia simple';

export function crearControladores(servicio, repositorio) {
  return {
    /** GET /basico/ejercicio-09 - respuesta principal del enunciado. */
    async obtenerResumen(req, res, next) {
      try {
        const estado = await repositorio.leer();

        res.status(200).json({
          ok: true,
          message: 'Ejercicio ejecutado correctamente',
          topic: TEMA,
          gimnasio: {
            peleadores: estado.peleadores.length,
            actualizadoEn: estado.actualizadoEn,
            categorias: CATEGORIAS,
          },
        });
      } catch (error) {
        next(error);
      }
    },

    /** GET /basico/ejercicio-09/json - que pierde JSON en el viaje. */
    obtenerAnalisisJson(req, res) {
      res.status(200).json({
        ok: true,
        data: { ...analizarViajeDeIdaYVuelta(), bigInt: bigIntFalla() },
      });
    },

    /** GET /basico/ejercicio-09/peleadores - lista, con filtro opcional. */
    async listar(req, res, next) {
      try {
        const peleadores = await servicio.listar({ categoria: req.query.categoria });

        res.status(200).json({ ok: true, total: peleadores.length, data: peleadores });
      } catch (error) {
        next(error);
      }
    },

    /** GET /basico/ejercicio-09/peleadores/:id */
    async obtener(req, res, next) {
      try {
        res.status(200).json({ ok: true, data: await servicio.obtener(req.params.id) });
      } catch (error) {
        next(error);
      }
    },

    /** POST /basico/ejercicio-09/peleadores - alta persistida en el JSON. */
    async crear(req, res, next) {
      try {
        const peleador = await servicio.crear(req.body);

        res.status(201).json({ ok: true, message: 'Peleador registrado', data: peleador });
      } catch (error) {
        next(error);
      }
    },

    /** POST /basico/ejercicio-09/peleadores/:id/combates */
    async registrarCombate(req, res, next) {
      try {
        const peleador = await servicio.registrarCombate(req.params.id, req.body?.resultado);

        res.status(200).json({ ok: true, message: 'Combate registrado', data: peleador });
      } catch (error) {
        next(error);
      }
    },

    /** DELETE /basico/ejercicio-09/peleadores/:id */
    async eliminar(req, res, next) {
      try {
        res.status(200).json({ ok: true, data: await servicio.eliminar(req.params.id) });
      } catch (error) {
        next(error);
      }
    },

    /** GET /basico/ejercicio-09/replacer - el replacer ocultando claves. */
    obtenerReplacer(req, res) {
      const ejemplo = { usuario: 'ana', token: 'secreto-real', rol: 'admin' };

      res.status(200).json({
        ok: true,
        data: {
          resultados: RESULTADOS,
          sinFiltrar: JSON.stringify(ejemplo),
          conReplacer: ocultarClaves(ejemplo, ['token']),
        },
      });
    },
  };
}
