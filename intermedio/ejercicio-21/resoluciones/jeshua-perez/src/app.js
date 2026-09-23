import express from "express";
import { rateLimit } from "./middlewares/rate-limit.middleware.js";

export const app = express();

app.use(rateLimit({ maxPeticiones: 3, ventanaMs: 60000 }));

app.get("/renders", (req, res) => {
  res.json({ ok: true, message: "Render en cola" });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
