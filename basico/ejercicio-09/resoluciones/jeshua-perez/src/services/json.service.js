/**
 * Lo que JSON pierde por el camino.
 *
 * JSON es un formato mas pobre que los valores de JavaScript, y el viaje de
 * ida y vuelta no siempre devuelve lo mismo que entro. Conviene saberlo antes
 * de guardar algo importante y descubrirlo al recuperarlo.
 */

/** Aplica el ciclo stringify -> parse y reporta que sobrevivio. */
export function analizarViajeDeIdaYVuelta() {
  const original = {
    texto: 'combate',
    numero: 12,
    booleano: true,
    nulo: null,
    arreglo: [1, 2, 3],
    // Lo que no sobrevive intacto:
    indefinido: undefined,
    funcion: () => 'no viaja',
    fecha: new Date('2026-02-10T14:00:00.000Z'),
    noEsNumero: Number.NaN,
    infinito: Number.POSITIVE_INFINITY,
    conjunto: new Set([1, 2]),
    mapa: new Map([['a', 1]]),
  };

  const recuperado = JSON.parse(JSON.stringify(original));

  return {
    seMantienen: ['texto', 'numero', 'booleano', 'nulo', 'arreglo'].map((clave) => ({
      clave,
      valor: recuperado[clave],
      igual: JSON.stringify(original[clave]) === JSON.stringify(recuperado[clave]),
    })),
    sePierden: [
      { clave: 'indefinido', antes: 'undefined', despues: 'la clave desaparece' },
      { clave: 'funcion', antes: 'function', despues: 'la clave desaparece' },
      { clave: 'fecha', antes: 'objeto Date', despues: `string (${typeof recuperado.fecha})` },
      { clave: 'noEsNumero', antes: 'NaN', despues: String(recuperado.noEsNumero) },
      { clave: 'infinito', antes: 'Infinity', despues: String(recuperado.infinito) },
      { clave: 'conjunto', antes: 'Set con 2 valores', despues: JSON.stringify(recuperado.conjunto) },
      { clave: 'mapa', antes: 'Map con 1 entrada', despues: JSON.stringify(recuperado.mapa) },
    ],
  };
}

/** BigInt ni siquiera se puede serializar: lanza. */
export function bigIntFalla() {
  try {
    JSON.stringify({ total: 10n });

    return { lanza: false, mensaje: null };
  } catch (error) {
    return { lanza: true, mensaje: error.message };
  }
}

/**
 * El reviver de JSON.parse permite reconstruir lo que se perdio.
 *
 * Aqui devuelve las fechas a objetos Date, reconociendolas por su formato ISO.
 * Es la contraparte de toJSON, que decide como se serializa un valor.
 */
export function reviverDeFechas(clave, valor) {
  const esIso =
    typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(valor);

  return esIso ? new Date(valor) : valor;
}

/** Demuestra el reviver funcionando sobre un objeto con fecha. */
export function recuperarConFechas(texto) {
  return JSON.parse(texto, reviverDeFechas);
}

/**
 * El replacer de JSON.stringify permite filtrar lo que sale.
 *
 * Es la forma limpia de no volcar secretos a un archivo o a un log.
 */
export function ocultarClaves(objeto, clavesOcultas = []) {
  return JSON.stringify(
    objeto,
    (clave, valor) => (clavesOcultas.includes(clave) ? '[oculto]' : valor),
    2,
  );
}
