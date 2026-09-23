import { Router } from "express";
import { armasRouter } from "./armas.routes.js";
import { jugadoresRouter } from "./jugadores.routes.js";

export const router = Router();

router.use("/armas", armasRouter);
router.use("/jugadores", jugadoresRouter);
