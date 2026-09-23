import { Router } from "express";
import { listar, crear, obtener } from "../controllers/equipos.controller.js";

export const equiposRouter = Router();

equiposRouter.get("/", listar);
equiposRouter.get("/:id", obtener);
equiposRouter.post("/", crear);
