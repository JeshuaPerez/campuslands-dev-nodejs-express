import express from "express";
import { CsvAPeleasStream } from "./streams/csv-a-peleas.stream.js";

export const app = express();

app.use(express.text({ type: "text/csv" }));

app.post("/peleas/importar", (req, res) => {
  const stream = new CsvAPeleasStream();
  const peleas = [];

  stream.on("data", (pelea) => peleas.push(pelea));
  stream.on("end", () => res.status(200).json({ ok: true, data: peleas }));
  stream.on("error", () => res.status(400).json({ ok: false, message: "CSV invalido" }));

  stream.end(req.body ?? "");
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
