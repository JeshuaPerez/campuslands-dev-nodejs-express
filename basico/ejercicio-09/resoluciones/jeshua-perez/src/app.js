/**
 * Construccion de la aplicacion Express.
 *
 * Recibe el servicio y el repositorio ya montados, para que las pruebas puedan
 * levantarla contra un archivo temporal.
 */

import express from 'express';

import { crearRutas } from './routes/ejercicio.routes.js';

export function crearApp(servicio, repositorio) {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ ok: true, message: 'Servidor activo' });
  });

  app.use('/basico', crearRutas(servicio, repositorio));

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

export default crearApp;
