import { Router } from "express";
import { listar, crear, gol } from "../controllers/partidos.controller.js";

export const partidosRouter = Router();

partidosRouter.get("/", listar);
partidosRouter.post("/", crear);
partidosRouter.patch("/:id/gol", gol);
