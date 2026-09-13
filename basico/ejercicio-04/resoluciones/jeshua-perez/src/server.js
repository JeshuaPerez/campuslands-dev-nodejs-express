/**
 * Punto de entrada HTTP.
 *
 * Se importa el default de app.js, renombrandolo: el default no tiene nombre
 * fijo, quien importa elige como llamarlo.
 */

import montarAplicacion from './app.js';

const PUERTO = Number(process.env.PORT ?? 3000);

montarAplicacion().listen(PUERTO, () => {
  console.log(`Servidor battle royale escuchando en http://localhost:${PUERTO}`);
  console.log('Endpoint principal: GET /basico/ejercicio-04');
});
