import { calcularViajeWarp, WarpError } from "./services/warp.service.js";

const distancia = Number(process.argv[2] || 4);
const factor = Number(process.argv[3] || 7);

try {
  const tiempo = calcularViajeWarp(distancia, factor);
  console.log(`Llegada estimada en ${tiempo.toFixed(2)} anios a warp ${factor}`);
} catch (error) {
  if (error instanceof WarpError) {
    console.log(`Error de navegacion: ${error.message}`);
  } else {
    console.log(`Error inesperado: ${error.message}`);
  }
}
