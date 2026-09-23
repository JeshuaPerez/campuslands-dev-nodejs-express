import { Router } from "express";
import { crear, obtener, finalizar } from "../controllers/partidas.controller.js";

export const partidasRouter = Router();

partidasRouter.post("/", crear);
partidasRouter.get("/:id", obtener);
partidasRouter.patch("/:id/finalizar", finalizar);
