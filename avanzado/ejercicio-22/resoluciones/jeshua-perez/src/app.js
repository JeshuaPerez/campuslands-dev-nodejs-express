import express from "express";
import { webhooksRouter } from "./routes/webhooks.routes.js";

export const app = express();

app.use(express.json());
app.use("/webhooks", webhooksRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
