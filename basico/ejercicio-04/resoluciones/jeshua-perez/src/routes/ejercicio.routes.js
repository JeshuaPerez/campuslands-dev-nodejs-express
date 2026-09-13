import { Router } from 'express';

import {
  cargarModulo,
  cerrarLaZona,
  obtenerResumen,
  obtenerZona,
  registrarEscuadra,
} from '../controllers/ejercicio.controller.js';

const router = Router();

router.get('/ejercicio-04', obtenerResumen);
router.get('/ejercicio-04/zona', obtenerZona);
router.post('/ejercicio-04/zona/cerrar', cerrarLaZona);
router.get('/ejercicio-04/modulos/:nombre', cargarModulo);
router.post('/ejercicio-04/escuadras', registrarEscuadra);

export default router;
