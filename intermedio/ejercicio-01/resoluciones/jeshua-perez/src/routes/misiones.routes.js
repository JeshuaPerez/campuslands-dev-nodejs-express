import { Router } from "express";
import { listar, crear, completar } from "../controllers/misiones.controller.js";

export const misionesRouter = Router();

misionesRouter.get("/", listar);
misionesRouter.post("/", crear);
misionesRouter.patch("/:id/completar", completar);
