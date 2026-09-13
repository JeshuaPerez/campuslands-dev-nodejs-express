/** Punto de entrada HTTP: levanta la app en el puerto configurado. */

import { crearApp } from './app.js';
import { verificarVersionMinima } from './services/runtime.service.js';

const PUERTO = Number(process.env.PORT ?? 3000);

const version = verificarVersionMinima(20);

if (!version.cumple) {
  console.error(
    `Node ${version.minimoRequerido} o superior es requerido. ` +
      `Version detectada: ${process.version}.`,
  );
  process.exit(1);
}

crearApp().listen(PUERTO, () => {
  console.log(`Servidor RPG escuchando en http://localhost:${PUERTO}`);
  console.log(`Endpoint principal: GET /basico/ejercicio-01`);
});
