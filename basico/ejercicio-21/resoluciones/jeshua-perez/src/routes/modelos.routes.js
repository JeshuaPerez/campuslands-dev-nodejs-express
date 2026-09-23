import { Router } from "express";
import { listarModelos, crearModelo } from "../controllers/modelos.controller.js";

export const modelosRouter = Router();

modelosRouter.get("/", listarModelos);
modelosRouter.post("/", crearModelo);
