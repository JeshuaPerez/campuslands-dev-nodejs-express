import { obtenerEquipo } from "../repositorios/equipos.repositorio.js";
import { ejecutarTransaccion } from "./transaccion.js";

/**
 * "destino" paga "monto" a "origen" por un fichaje. Se resta primero y se
 * valida despues, a proposito, para que el rollback de la transaccion
 * tenga sentido si el presupuesto queda negativo.
 */
export function ficharJugador(origenNombre, destinoNombre, monto) {
  return ejecutarTransaccion(() => {
    const origen = obtenerEquipo(origenNombre);
    const destino = obtenerEquipo(destinoNombre);

    destino.presupuesto -= monto;
    origen.presupuesto += monto;

    if (destino.presupuesto < 0) {
      throw new Error("PRESUPUESTO_INSUFICIENTE");
    }

    return { origen: { ...origen }, destino: { ...destino } };
  });
}
