/**
 * Informe de la liga por consola, leyendo los dos archivos de datos.
 *
 * Muestra el caso feliz y tambien el manejo de un archivo que no existe.
 */

import {
  ArchivoNoEncontradoError,
  leerCsv,
  leerJson,
  listarArchivos,
} from '../src/services/archivos.service.js';
import { construirGoleadores, construirTabla, resumirLiga } from '../src/services/liga.service.js';

const { temporada, competicion, equipos } = await leerJson('equipos.json');
const goleadores = await leerCsv('goleadores.csv');

console.log(`\n=== ${competicion} ${temporada} ===\n`);

console.log('Archivos leidos de la carpeta datos/:');
console.table(await listarArchivos());

console.log('\nTabla de posiciones:');
console.table(
  construirTabla(equipos).map(({ posicion, nombre, modalidad, jugados, puntos, diferenciaGoles }) => ({
    posicion,
    nombre,
    modalidad,
    jugados,
    puntos,
    dif: diferenciaGoles,
  })),
);

console.log('\nTop 5 goleadores:');
console.table(
  construirGoleadores(goleadores, { limite: 5 }).map(({ jugador, modalidad, goles, asistencias, golesPorPartido }) => ({
    jugador,
    modalidad,
    goles,
    asistencias,
    golesPorPartido,
  })),
);

const resumen = resumirLiga(equipos, goleadores);

console.log('\nResumen:');
console.log(`  Lider:           ${resumen.lider}`);
console.log(`  Colista:         ${resumen.colista}`);
console.log(`  Maximo goleador: ${resumen.maximoGoleador.jugador} (${resumen.maximoGoleador.goles})`);
console.log(`  Goles totales:   ${resumen.totalGoles}`);

// Caso de error: un archivo que no esta.
try {
  await leerJson('plantillas.json');
} catch (error) {
  if (error instanceof ArchivoNoEncontradoError) {
    console.log(`\nManejo de error esperado -> ${error.message} (status ${error.statusCode})\n`);
  } else {
    throw error;
  }
}
