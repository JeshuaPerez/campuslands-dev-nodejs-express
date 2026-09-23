import { Programador } from "../lib/programador.js";

const ordenes = [
  { id: 1, pieza: "Viga", creadaHace: 10 * 24 * 60 * 60 * 1000, cerrada: false },
  { id: 2, pieza: "Tuberia", creadaHace: 1 * 24 * 60 * 60 * 1000, cerrada: false },
];

const DIAS_LIMITE_MS = 7 * 24 * 60 * 60 * 1000;

export function marcarVencidas() {
  const vencidas = ordenes.filter((o) => !o.cerrada && o.creadaHace > DIAS_LIMITE_MS);
  vencidas.forEach((o) => (o.vencida = true));
  return vencidas;
}

export function listarOrdenes() {
  return ordenes;
}

export const programadorOrdenesVencidas = new Programador(async () => {
  marcarVencidas();
}, 60 * 60 * 1000);
