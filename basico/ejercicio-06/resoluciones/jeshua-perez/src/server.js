/** Punto de entrada HTTP. */

import { crearApp } from './app.js';

const PUERTO = Number(process.env.PORT ?? 3000);

crearApp().listen(PUERTO, () => {
  console.log(`Servidor del taller escuchando en http://localhost:${PUERTO}`);
  console.log('Endpoint principal: GET /basico/ejercicio-06');
});
