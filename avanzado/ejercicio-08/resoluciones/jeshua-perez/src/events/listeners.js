import { eventos } from "./eventos.js";

export const notificacionesEnviadas = [];

eventos.on("auto.vendido", (auto) => {
  console.log(`[log] Se vendio: ${auto.marca} ${auto.modelo}`);
});

eventos.on("auto.vendido", (auto) => {
  notificacionesEnviadas.push(`Felicidades por tu ${auto.marca} ${auto.modelo}`);
});
