import express from "express";
import { autosRouter } from "./routes/autos.routes.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

export const app = express();

app.use(express.json());
app.use("/autos", autosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});

app.use(errorHandler);
