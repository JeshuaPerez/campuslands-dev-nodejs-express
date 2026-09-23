import express from "express";

const sneakers = [
  { id: 1, marca: "Nike", modelo: "Air Force 1" },
  { id: 2, marca: "Adidas", modelo: "Superstar" },
  { id: 3, marca: "New Balance", modelo: "550" },
];

export const app = express();

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Servidor de sneakers activo" });
});

app.get("/sneakers", (req, res) => {
  res.json({ ok: true, data: sneakers });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
