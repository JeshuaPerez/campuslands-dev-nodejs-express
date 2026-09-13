/**
 * Construccion de la aplicacion Express, en CommonJS.
 *
 * No abre el puerto: exporta la fabrica para que `server.js` la escuche y las
 * pruebas la levanten en un puerto efimero.
 */

const express = require('express');

const ejercicioRoutes = require('./routes/ejercicio.routes');

function crearApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ ok: true, message: 'Servidor activo' });
  });

  app.use('/basico', ejercicioRoutes);

  app.use((req, res) => {
    res.status(404).json({
      ok: false,
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
  });

  app.use((error, req, res, next) => {
    const statusCode = error.statusCode ?? 500;

    if (statusCode >= 500) {
      console.error('Error no controlado:', error);
    }

    res.status(statusCode).json({
      ok: false,
      message: statusCode >= 500 ? 'Error interno del servidor' : error.message,
    });
  });

  return app;
}

module.exports = { crearApp };
