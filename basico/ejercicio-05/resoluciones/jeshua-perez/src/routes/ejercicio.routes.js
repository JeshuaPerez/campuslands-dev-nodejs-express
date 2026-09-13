import { Router } from 'express';

import {
  obtenerArchivo,
  obtenerArchivos,
  obtenerGoleadores,
  obtenerResumen,
  obtenerTabla,
} from '../controllers/ejercicio.controller.js';

const router = Router();

router.get('/ejercicio-05', obtenerResumen);
router.get('/ejercicio-05/archivos', obtenerArchivos);
router.get('/ejercicio-05/archivos/:nombre', obtenerArchivo);
router.get('/ejercicio-05/tabla', obtenerTabla);
router.get('/ejercicio-05/goleadores', obtenerGoleadores);

export default router;
