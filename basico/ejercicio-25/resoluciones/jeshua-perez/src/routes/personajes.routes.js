import { Router } from "express";
import { listar, obtener, crear, eliminar } from "../controllers/personajes.controller.js";

export const personajesRouter = Router();

personajesRouter.get("/", listar);
personajesRouter.get("/:id", obtener);
personajesRouter.post("/", crear);
personajesRouter.delete("/:id", eliminar);
