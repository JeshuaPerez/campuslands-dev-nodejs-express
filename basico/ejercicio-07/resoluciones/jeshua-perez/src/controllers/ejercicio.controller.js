/** Controladores del ejercicio 07. */

import { OPCIONES } from '../cli/argumentos.js';
import { COMANDOS, textoDeAyuda } from '../cli/ayuda.js';
import {
  CAMPOS_ORDENABLES,
  buscarAutos,
  listarMarcas,
  obtenerCatalogo,
  resumirInventario,
} from '../services/inventario.service.js';

const TEMA = 'process.argv y CLI';

/** GET /basico/ejercicio-07 - respuesta principal pedida por el enunciado. */
export function obtenerResumen(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Ejercicio ejecutado correctamente',
    topic: TEMA,
    cli: {
      comandos: COMANDOS,
      opciones: Object.keys(OPCIONES),
      // El mismo dominio alimenta la consola y la API: solo cambia la entrada.
      argvEjemplo: ['node', 'src/cli/index.js', 'buscar', '--marca', 'Ferrari'],
    },
  });
}

/** GET /basico/ejercicio-07/ayuda - el mismo texto que imprime --ayuda. */
export function obtenerAyuda(req, res) {
  res.status(200).type('text/plain').send(textoDeAyuda());
}

/** GET /basico/ejercicio-07/autos - el catalogo, con los mismos filtros del CLI. */
export function obtenerAutos(req, res, next) {
  try {
    const autos = buscarAutos({
      marca: req.query.marca,
      precioMax: req.query.precioMax,
      anioMin: req.query.anioMin,
      soloDisponibles: req.query.disponibles === 'true',
      ordenarPor: req.query.ordenar,
      descendente: req.query.desc === 'true',
      limite: req.query.limite,
    });

    res.status(200).json({ ok: true, total: autos.length, data: autos });
  } catch (error) {
    next(error);
  }
}

/** GET /basico/ejercicio-07/inventario - estadisticas agregadas. */
export function obtenerInventario(req, res) {
  res.status(200).json({
    ok: true,
    data: {
      ...resumirInventario(),
      totalCatalogo: obtenerCatalogo().length,
      marcas: listarMarcas(),
      camposOrdenables: CAMPOS_ORDENABLES,
    },
  });
}
