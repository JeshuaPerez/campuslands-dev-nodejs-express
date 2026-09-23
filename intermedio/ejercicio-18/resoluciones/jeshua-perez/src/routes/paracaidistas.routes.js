import { Router } from "express";
import { registrar, verificarClave } from "../services/paracaidistas.service.js";

export const paracaidistasRouter = Router();

paracaidistasRouter.post("/registro", async (req, res) => {
  try {
    const paracaidista = await registrar(req.body);
    res.status(201).json({ ok: true, data: paracaidista });
  } catch (error) {
    if (error.message === "YA_REGISTRADO") {
      res.status(409).json({ ok: false, message: "Ese nombre ya esta registrado" });
      return;
    }
    res.status(400).json({ ok: false, message: error.message });
  }
});

paracaidistasRouter.post("/login", async (req, res) => {
  const { nombre, clave } = req.body;
  const valido = await verificarClave(nombre, clave);

  if (!valido) {
    res.status(401).json({ ok: false, message: "Credenciales invalidas" });
    return;
  }

  res.status(200).json({ ok: true, message: "Ingreso valido" });
});
