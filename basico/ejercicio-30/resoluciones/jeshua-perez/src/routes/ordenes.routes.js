import { Router } from "express";
import { listar, obtener, crear, cerrar } from "../controllers/ordenes.controller.js";

export const ordenesRouter = Router();

ordenesRouter.get("/", listar);
ordenesRouter.get("/:id", obtener);
ordenesRouter.post("/", crear);
ordenesRouter.patch("/:id/cerrar", cerrar);
