/** Punto de entrada HTTP. */

import { crearApp } from './app.js';

const PUERTO = Number(process.env.PORT ?? 3000);

crearApp().listen(PUERTO, () => {
  console.log(`Servidor del concesionario escuchando en http://localhost:${PUERTO}`);
  console.log('Endpoint principal: GET /basico/ejercicio-07');
  console.log('El mismo catalogo por consola: node src/cli/index.js ayuda');
});
