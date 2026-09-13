import { Router } from 'express';

import {
  obtenerResumen,
  registrarPersonaje,
} from '../controllers/ejercicio.controller.js';

const router = Router();

router.get('/ejercicio-01', obtenerResumen);
router.post('/ejercicio-01/personajes', registrarPersonaje);

export default router;
