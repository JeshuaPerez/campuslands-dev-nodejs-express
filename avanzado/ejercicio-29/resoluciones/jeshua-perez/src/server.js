import { app } from "./app.js";
import { inicializarDependencias, marcarNoListo } from "./services/estado.service.js";

const PUERTO = process.env.PORT || 3079;

const servidor = app.listen(PUERTO, async () => {
  console.log(`Servidor de futbol escuchando en el puerto ${PUERTO}`);
  await inicializarDependencias();
  console.log("Dependencias listas, /ready ahora responde 200");
});

/** Apagado ordenado: deja de aceptar trafico nuevo antes de salir. */
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido, cerrando ordenadamente...");
  marcarNoListo();
  servidor.close(() => process.exit(0));
});
