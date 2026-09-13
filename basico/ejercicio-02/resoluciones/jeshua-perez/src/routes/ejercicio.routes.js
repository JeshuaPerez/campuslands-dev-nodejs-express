import { Router } from 'express';

import {
  obtenerArmas,
  obtenerResumen,
  obtenerScripts,
  registrarLoadout,
} from '../controllers/ejercicio.controller.js';

const router = Router();

router.get('/ejercicio-02', obtenerResumen);
router.get('/ejercicio-02/scripts', obtenerScripts);
router.get('/ejercicio-02/armas', obtenerArmas);
router.post('/ejercicio-02/loadouts', registrarLoadout);

export default router;
