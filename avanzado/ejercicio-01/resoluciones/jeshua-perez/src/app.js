import express from "express";
import { personajesRouterV1 } from "./routes/v1/personajes.routes.js";
import { personajesRouterV2 } from "./routes/v2/personajes.routes.js";

export const app = express();

app.use("/api/v1/personajes", personajesRouterV1);
app.use("/api/v2/personajes", personajesRouterV2);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
