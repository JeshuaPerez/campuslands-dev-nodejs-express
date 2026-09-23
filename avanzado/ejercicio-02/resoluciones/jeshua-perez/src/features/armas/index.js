import { Router } from "express";
import { listar, crear } from "./armas.controller.js";

export const armasRouter = Router();

armasRouter.get("/", listar);
armasRouter.post("/", crear);
