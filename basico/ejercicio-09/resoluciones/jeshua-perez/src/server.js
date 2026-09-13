/** Punto de entrada HTTP. */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { crearApp } from './app.js';
import { crearRepositorioJson } from './repositorios/json.repositorio.js';
import { crearServicioPeleadores } from './services/peleadores.service.js';

const RUTA_DATOS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'datos',
  'peleadores.json',
);

const PUERTO = Number(process.env.PORT ?? 3000);

const repositorio = crearRepositorioJson(RUTA_DATOS, {
  version: 1,
  actualizadoEn: new Date().toISOString(),
  peleadores: [],
});

crearApp(crearServicioPeleadores(repositorio), repositorio).listen(PUERTO, () => {
  console.log(`Servidor del gimnasio escuchando en http://localhost:${PUERTO}`);
  console.log('Endpoint principal: GET /basico/ejercicio-09');
  console.log(`Datos en: ${path.basename(RUTA_DATOS)}`);
});
