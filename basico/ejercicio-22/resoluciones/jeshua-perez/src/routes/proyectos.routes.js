import { Router } from "express";
import { crearEstimacion } from "../controllers/proyectos.controller.js";

export const proyectosRouter = Router();

proyectosRouter.post("/estimaciones", crearEstimacion);
