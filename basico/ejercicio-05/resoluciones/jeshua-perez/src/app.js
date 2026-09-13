/** Construccion de la aplicacion Express. No abre el puerto. */

import express from 'express';

import ejercicioRoutes from './routes/ejercicio.routes.js';

export function crearApp() {
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
    // Los errores de archivo ya traen su propio statusCode: 404 si no existe,
    // 422 si existe pero no se puede interpretar, 400 si la entrada es mala.
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

export default crearApp;
