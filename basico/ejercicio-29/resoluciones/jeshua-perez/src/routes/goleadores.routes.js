import { Router } from "express";
import { listar, agregarGol } from "../controllers/goleadores.controller.js";

export const goleadoresRouter = Router();

goleadoresRouter.get("/", listar);
goleadoresRouter.patch("/:id/gol", agregarGol);
