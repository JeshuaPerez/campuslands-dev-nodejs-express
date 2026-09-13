/**
 * Construccion de la aplicacion Express.
 *
 * Este archivo no abre el puerto. Exporta la app ya montada para que
 * `server.js` la escuche y las pruebas la puedan levantar en un puerto
 * efimero sin arrastrar un servidor que quede vivo.
 */

import express from 'express';

import ejercicioRoutes from './routes/ejercicio.routes.js';

function crearApp() {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ ok: true, message: 'Servidor activo' });
  });

  app.use('/basico', ejercicioRoutes);

  // Ruta no encontrada: se responde 404 en lugar de dejar colgar la peticion.
  app.use((req, res) => {
    res.status(404).json({
      ok: false,
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    });
  });

  // Manejador de errores. Los errores de validacion traen su propio
  // statusCode; cualquier otro se trata como fallo interno.
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

export { crearApp };
