import { Router } from "express";
import { listar, crear, cerrar } from "../controllers/ordenes.controller.js";
import { requireAuth, requireAlgunRol } from "../middlewares/auth.middleware.js";
import { validarSchema } from "../middlewares/validar-schema.middleware.js";
import { crearOrdenSchema } from "../schemas/orden.schema.js";

export const ordenesRouter = Router();

ordenesRouter.get("/", requireAuth, requireAlgunRol("mecanico", "admin"), listar);
ordenesRouter.post("/", requireAuth, requireAlgunRol("mecanico", "admin"), validarSchema(crearOrdenSchema), crear);
ordenesRouter.patch("/:id/cerrar", requireAuth, requireAlgunRol("admin"), cerrar);
