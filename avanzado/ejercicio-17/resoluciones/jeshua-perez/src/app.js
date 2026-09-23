import express from "express";
import { authRouter } from "./routes/auth.routes.js";

export const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
