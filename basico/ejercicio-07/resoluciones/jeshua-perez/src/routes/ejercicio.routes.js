import { Router } from 'express';

import {
  obtenerAutos,
  obtenerAyuda,
  obtenerInventario,
  obtenerResumen,
} from '../controllers/ejercicio.controller.js';

const router = Router();

router.get('/ejercicio-07', obtenerResumen);
router.get('/ejercicio-07/ayuda', obtenerAyuda);
router.get('/ejercicio-07/autos', obtenerAutos);
router.get('/ejercicio-07/inventario', obtenerInventario);

export default router;
