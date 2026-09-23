import express from "express";
import { ordenesRouter } from "./routes/ordenes.routes.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

/**
 * app.js solo arma la aplicacion; arrancar el puerto real es trabajo
 * de server.js (separacion app/server para poder testear sin listen fijo).
 */
export const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, status: "alive" });
});

app.use("/ordenes", ordenesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use(errorHandler);
