import express from "express";
import helmet from "helmet";

const platillos = [{ id: 1, nombre: "Tacos al pastor" }];

export const app = express();

app.use(helmet());
app.disable("x-powered-by");

app.get("/platillos", (req, res) => {
  res.status(200).json({ ok: true, data: platillos });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
