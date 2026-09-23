import { Router } from "express";
import { listar, crear, cerrar } from "../controllers/ordenes.controller.js";
import { requireAuth, requireRol } from "../middlewares/auth.middleware.js";

export const ordenesRouter = Router();

ordenesRouter.get("/", requireAuth, listar);
ordenesRouter.post("/", requireAuth, requireRol("mecanico"), crear);
ordenesRouter.patch("/:id/cerrar", requireAuth, requireRol("admin"), cerrar);
