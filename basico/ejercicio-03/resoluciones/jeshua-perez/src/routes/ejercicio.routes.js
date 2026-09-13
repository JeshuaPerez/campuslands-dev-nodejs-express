const { Router } = require('express');

const {
  obtenerCache,
  obtenerCampeones,
  obtenerResumen,
  registrarDraft,
} = require('../controllers/ejercicio.controller');

const router = Router();

router.get('/ejercicio-03', obtenerResumen);
router.get('/ejercicio-03/cache', obtenerCache);
router.get('/ejercicio-03/campeones', obtenerCampeones);
router.post('/ejercicio-03/drafts', registrarDraft);

module.exports = router;
