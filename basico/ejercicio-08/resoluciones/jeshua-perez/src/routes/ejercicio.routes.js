import { Router } from 'express';

import { crearControladores } from '../controllers/ejercicio.controller.js';

/** El router recibe la configuracion y se la pasa a los controladores. */
export function crearRutas(configuracion) {
  const router = Router();
  const controlador = crearControladores(configuracion);

  router.get('/ejercicio-08', controlador.obtenerResumen);
  router.get('/ejercicio-08/config', controlador.obtenerConfiguracion);
  router.get('/ejercicio-08/esquema', controlador.obtenerEsquema);
  router.get('/ejercicio-08/autos', controlador.obtenerAutos);
  router.post('/ejercicio-08/autos', controlador.registrarAuto);

  return router;
}

export default crearRutas;
