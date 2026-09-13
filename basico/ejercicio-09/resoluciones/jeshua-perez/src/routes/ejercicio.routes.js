import { Router } from 'express';

import { crearControladores } from '../controllers/ejercicio.controller.js';

export function crearRutas(servicio, repositorio) {
  const router = Router();
  const controlador = crearControladores(servicio, repositorio);

  router.get('/ejercicio-09', controlador.obtenerResumen);
  router.get('/ejercicio-09/json', controlador.obtenerAnalisisJson);
  router.get('/ejercicio-09/replacer', controlador.obtenerReplacer);
  router.get('/ejercicio-09/peleadores', controlador.listar);
  router.post('/ejercicio-09/peleadores', controlador.crear);
  router.get('/ejercicio-09/peleadores/:id', controlador.obtener);
  router.delete('/ejercicio-09/peleadores/:id', controlador.eliminar);
  router.post('/ejercicio-09/peleadores/:id/combates', controlador.registrarCombate);

  return router;
}

export default crearRutas;
