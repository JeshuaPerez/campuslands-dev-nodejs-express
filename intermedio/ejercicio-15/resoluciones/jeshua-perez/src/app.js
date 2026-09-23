import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import { pedidosRouter } from "./routes/pedidos.routes.js";

export const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/pedidos", pedidosRouter);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
