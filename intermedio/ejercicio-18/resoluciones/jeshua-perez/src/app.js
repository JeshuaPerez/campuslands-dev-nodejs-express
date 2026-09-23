import express from "express";
import { paracaidistasRouter } from "./routes/paracaidistas.routes.js";

export const app = express();

app.use(express.json());
app.use("/paracaidistas", paracaidistasRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
