/**
 * Punto de entrada HTTP.
 *
 * El puerto sale de PORT o, si no esta, del campo `config.puerto` del
 * package.json, que npm expone como `npm_package_config_puerto`.
 */

import { crearApp } from './app.js';

const PUERTO = Number(process.env.PORT ?? process.env.npm_package_config_puerto ?? 3000);

crearApp().listen(PUERTO, () => {
  console.log(`Servidor de shooters escuchando en http://localhost:${PUERTO}`);
  console.log('Endpoint principal: GET /basico/ejercicio-02');
  console.log('Scripts documentados: GET /basico/ejercicio-02/scripts');
});
