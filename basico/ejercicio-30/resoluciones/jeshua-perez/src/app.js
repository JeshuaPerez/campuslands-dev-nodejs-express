import express from "express";
import { ordenesRouter } from "./routes/ordenes.routes.js";
import { logger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

export const app = express();

app.use(logger);
app.use(express.json());
app.use("/ordenes", ordenesRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use(errorHandler);
