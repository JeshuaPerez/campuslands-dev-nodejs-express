import express from "express";
import { zonasRouter } from "./routes/zonas.routes.js";

/**
 * app.js SOLO arma la aplicacion Express (rutas, middlewares) y la
 * exporta. Arrancar el servidor con un puerto es trabajo de server.js.
 * Asi los tests pueden importar `app` y levantarla en un puerto
 * efimero (puerto 0), sin depender de que exista un puerto real fijo.
 */
export const app = express();

app.use("/zonas", zonasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
