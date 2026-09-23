import express from "express";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import path from "node:path";
import { formulasRouter } from "./routes/formulas.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openapiSpec = JSON.parse(readFileSync(path.join(__dirname, "..", "openapi.json"), "utf-8"));

export const app = express();

app.use(express.json());
app.use("/formulas", formulasRouter);

app.get("/openapi.json", (req, res) => {
  res.status(200).json(openapiSpec);
});

app.use((req, res) => {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
});
