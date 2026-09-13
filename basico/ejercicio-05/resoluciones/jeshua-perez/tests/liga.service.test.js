import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  MODALIDADES,
  ValidacionError,
  calcularEstadisticas,
  construirGoleadores,
  construirTabla,
  resumirLiga,
} from '../src/services/liga.service.js';

/** Datos en memoria: el dominio no necesita tocar el disco para probarse. */
function equipos() {
  return [
    { id: 1, nombre: 'Alfa', modalidad: 'futbol', ganados: 5, empatados: 2, perdidos: 1, golesFavor: 15, golesContra: 7 },
    { id: 2, nombre: 'Beta', modalidad: 'futbol', ganados: 5, empatados: 2, perdidos: 1, golesFavor: 12, golesContra: 8 },
    { id: 3, nombre: 'Gamma', modalidad: 'futsal', ganados: 1, empatados: 0, perdidos: 7, golesFavor: 9, golesContra: 30 },
  ];
}

function goleadores() {
  return [
    { jugador: 'Mora', equipoId: 1, modalidad: 'futbol', goles: 10, asistencias: 2, partidos: 8 },
    { jugador: 'Rey', equipoId: 2, modalidad: 'futbol', goles: 10, asistencias: 5, partidos: 8 },
    { jugador: 'Vera', equipoId: 3, modalidad: 'futsal', goles: 3, asistencias: 1, partidos: 8 },
  ];
}

describe('calcularEstadisticas', () => {
  it('aplica 3 puntos por victoria y 1 por empate', () => {
    const stats = calcularEstadisticas(equipos()[0]);

    assert.equal(stats.jugados, 8);
    assert.equal(stats.puntos, 17);
    assert.equal(stats.diferenciaGoles, 8);
  });

  it('calcula rendimiento sobre el maximo posible', () => {
    assert.equal(calcularEstadisticas(equipos()[0]).rendimiento, 70.8);
  });

  it('no divide por cero si el equipo no ha jugado', () => {
    const stats = calcularEstadisticas({
      nombre: 'Nuevo', ganados: 0, empatados: 0, perdidos: 0, golesFavor: 0, golesContra: 0,
    });

    assert.equal(stats.promedioGolesFavor, 0);
    assert.equal(stats.rendimiento, 0);
  });
});

describe('construirTabla - casos normales', () => {
  it('desempata por diferencia de goles', () => {
    const tabla = construirTabla(equipos());

    assert.equal(tabla[0].nombre, 'Alfa');
    assert.equal(tabla[1].nombre, 'Beta');
    assert.equal(tabla[0].posicion, 1);
  });

  it('filtra por modalidad', () => {
    const tabla = construirTabla(equipos(), { modalidad: 'futsal' });

    assert.equal(tabla.length, 1);
    assert.equal(tabla[0].nombre, 'Gamma');
  });

  it('no distingue mayusculas en la modalidad', () => {
    assert.equal(construirTabla(equipos(), { modalidad: 'FUTBOL' }).length, 2);
  });
});

describe('construirTabla - casos limite', () => {
  it('devuelve una tabla vacia si no hay equipos', () => {
    assert.deepEqual(construirTabla([]), []);
  });

  it('reconoce las dos modalidades declaradas', () => {
    assert.deepEqual(MODALIDADES, ['futbol', 'futsal']);
  });
});

describe('construirTabla - casos invalidos', () => {
  it('rechaza equipos que no sea arreglo', () => {
    assert.throws(() => construirTabla('Alfa'), ValidacionError);
  });

  it('rechaza una modalidad inexistente', () => {
    assert.throws(() => construirTabla(equipos(), { modalidad: 'rugby' }), (error) => {
      assert.equal(error.statusCode, 400);
      return true;
    });
  });
});

describe('construirGoleadores', () => {
  it('ordena por goles y desempata por asistencias', () => {
    const ranking = construirGoleadores(goleadores());

    assert.equal(ranking[0].jugador, 'Rey');
    assert.equal(ranking[1].jugador, 'Mora');
  });

  it('calcula contribuciones y goles por partido', () => {
    const [primero] = construirGoleadores(goleadores());

    assert.equal(primero.contribuciones, 15);
    assert.equal(primero.golesPorPartido, 1.25);
  });

  it('respeta el limite pedido', () => {
    assert.equal(construirGoleadores(goleadores(), { limite: 2 }).length, 2);
    assert.equal(construirGoleadores(goleadores(), { limite: 1 }).length, 1);
  });

  it('no falla si el limite supera el total', () => {
    assert.equal(construirGoleadores(goleadores(), { limite: 99 }).length, 3);
  });

  it('rechaza limites invalidos', () => {
    assert.throws(() => construirGoleadores(goleadores(), { limite: 0 }), ValidacionError);
    assert.throws(() => construirGoleadores(goleadores(), { limite: -1 }), ValidacionError);
    assert.throws(() => construirGoleadores(goleadores(), { limite: 'dos' }), ValidacionError);
  });
});

describe('resumirLiga', () => {
  it('identifica lider, colista y maximo goleador', () => {
    const resumen = resumirLiga(equipos(), goleadores());

    assert.equal(resumen.lider, 'Alfa');
    assert.equal(resumen.colista, 'Gamma');
    assert.equal(resumen.maximoGoleador.jugador, 'Rey');
    assert.equal(resumen.totalGoles, 36);
  });

  it('cuenta equipos por modalidad', () => {
    assert.deepEqual(resumirLiga(equipos(), goleadores()).porModalidad, [
      { modalidad: 'futbol', equipos: 2 },
      { modalidad: 'futsal', equipos: 1 },
    ]);
  });

  it('maneja una liga vacia sin romperse', () => {
    const resumen = resumirLiga([], []);

    assert.equal(resumen.lider, null);
    assert.equal(resumen.maximoGoleador, null);
    assert.equal(resumen.mediaGolesPorPartido, 0);
  });
});
