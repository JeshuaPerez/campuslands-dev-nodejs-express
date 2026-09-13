/**
 * Construccion de la aplicacion Express.
 *
 * `crearApp` recibe la configuracion en vez de leerla. Es lo que permite
 * levantar la app en pruebas con un entorno inventado, sin tocar process.env.
 */

import express from 'express';

import { crearRutas } from './routes/ejercicio.routes.js';

export function crearApp(configuracion) {
  const app = express();

  app.use(express.json());

  // El detalle de los logs depende de LOG_NIVEL.
  if (configuracion.LOG_NIVEL === 'debug' && !configuracion.esPruebas) {
    app.use((req, res, next) => {
      console.log(`[debug] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  app.get('/health', (req, res) => {
    res.status(200).json({
      ok: true,
      message: 'Servidor activo',
      entorno: configuracion.NODE_ENV,
    });
  });

  app.use('/basico', crearRutas(configuracion));

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
      // El detalle del error solo se expone fuera de produccion: en produccion
      // filtrar rutas internas o nombres de archivo ayuda a un atacante.
      ...(configuracion.esProduccion ? {} : { detalle: error.name }),
    });
  });

  return app;
}

export default crearApp;
