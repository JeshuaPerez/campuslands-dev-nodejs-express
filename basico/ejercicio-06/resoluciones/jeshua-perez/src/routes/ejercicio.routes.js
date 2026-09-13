import { Router } from 'express';

import {
  analizarRuta,
  obtenerDocumento,
  obtenerDocumentos,
  obtenerResumen,
} from '../controllers/ejercicio.controller.js';

const router = Router();

router.get('/ejercicio-06', obtenerResumen);
router.get('/ejercicio-06/analizar', analizarRuta);
router.get('/ejercicio-06/documentos', obtenerDocumentos);

// Comodin con nombre: en Express 5 se escribe *nombre y llega como arreglo de
// segmentos en req.params.nombre. Hace falta para admitir subcarpetas.
router.get('/ejercicio-06/documentos/*ruta', obtenerDocumento);

export default router;
