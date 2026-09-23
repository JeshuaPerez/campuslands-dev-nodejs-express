import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/formulas.controller.js";

export const formulasRouter = Router();

formulasRouter.get("/", listar);
formulasRouter.get("/:id", obtener);
formulasRouter.post("/", crear);
formulasRouter.put("/:id", actualizar);
formulasRouter.delete("/:id", eliminar);
