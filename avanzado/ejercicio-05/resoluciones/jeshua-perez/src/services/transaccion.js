import { tomarSnapshot, restaurarSnapshot } from "../repositorios/equipos.repositorio.js";

/**
 * Simula una transaccion: si algo dentro de "operacion" lanza, se
 * restaura el estado que habia antes de empezar (como un ROLLBACK).
 */
export function ejecutarTransaccion(operacion) {
  const snapshot = tomarSnapshot();

  try {
    return operacion();
  } catch (error) {
    restaurarSnapshot(snapshot);
    throw error;
  }
}
