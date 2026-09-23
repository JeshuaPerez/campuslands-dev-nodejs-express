import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { leerResultados } from "./services/csv.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RUTA_CSV = path.join(__dirname, "..", "datos", "resultados.csv");

export const app = express();

app.get("/resultados", async (req, res) => {
  try {
    const resultados = await leerResultados(RUTA_CSV);
    res.status(200).json({ ok: true, data: resultados });
  } catch (error) {
    res.status(500).json({ ok: false, message: "No se pudo leer el archivo de resultados" });
  }
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
