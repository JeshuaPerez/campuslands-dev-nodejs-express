import { Router } from "express";

/**
 * Documentacion minima de la API en JSON (estilo OpenAPI simplificado),
 * generada a mano para que sea legible sin herramientas externas.
 */
const documentacion = {
  titulo: "API de torneos MOBA",
  version: "1.0.0",
  endpoints: [
    {
      metodo: "GET",
      ruta: "/torneos",
      descripcion: "Lista todos los torneos",
      respuestas: { 200: "Lista de torneos" },
    },
    {
      metodo: "POST",
      ruta: "/torneos",
      descripcion: "Crea un torneo",
      body: { nombre: "string", juego: "string" },
      respuestas: { 201: "Torneo creado", 400: "Datos invalidos" },
    },
  ],
};

export const docsRouter = Router();

docsRouter.get("/", (req, res) => {
  res.status(200).json(documentacion);
});
