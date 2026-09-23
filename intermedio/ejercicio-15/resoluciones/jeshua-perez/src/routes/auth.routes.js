import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middlewares/jwt-auth.middleware.js";

const USUARIO_DEMO = { usuario: "foodie", clave: "tacos123" };

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { usuario, clave } = req.body;

  if (usuario !== USUARIO_DEMO.usuario || clave !== USUARIO_DEMO.clave) {
    res.status(401).json({ ok: false, message: "Credenciales invalidas" });
    return;
  }

  const token = jwt.sign({ usuario }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ ok: true, token });
});
