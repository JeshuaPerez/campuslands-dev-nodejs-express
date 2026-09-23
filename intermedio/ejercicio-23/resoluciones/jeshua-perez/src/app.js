import express from "express";
import { Inventario } from "./services/inventario.service.js";

const inventario = new Inventario();
inventario.agregar(50);

export const app = express();

app.use(express.json());

app.get("/inventario", (req, res) => {
  res.json({ ok: true, stock: inventario.stock });
});

app.post("/inventario/consumir", (req, res) => {
  try {
    const stock = inventario.consumir(req.body.cantidad);
    res.status(200).json({ ok: true, stock });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
