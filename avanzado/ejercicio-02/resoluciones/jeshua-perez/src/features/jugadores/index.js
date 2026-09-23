import { Router } from "express";
import { listar, crear } from "./jugadores.controller.js";

export const jugadoresRouter = Router();

jugadoresRouter.get("/", listar);
jugadoresRouter.post("/", crear);
