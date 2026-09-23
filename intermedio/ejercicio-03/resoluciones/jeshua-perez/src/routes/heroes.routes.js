import { Router } from "express";
import { listar, obtener, crear } from "../controllers/heroes.controller.js";

export const heroesRouter = Router();

heroesRouter.get("/", listar);
heroesRouter.get("/:id", obtener);
heroesRouter.post("/", crear);
