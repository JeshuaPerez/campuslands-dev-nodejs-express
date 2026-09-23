import { Router } from "express";
import { listar, crear, eliminar } from "../controllers/trabajos.controller.js";

export const trabajosRouter = Router();

trabajosRouter.get("/", listar);
trabajosRouter.post("/", crear);
trabajosRouter.delete("/:id", eliminar);
