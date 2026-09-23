import { listarHeroes, crearHeroe, obtenerHeroe, HeroeNoEncontradoError } from "../services/heroes.service.js";
import { asyncHandler } from "../utils/async-handler.js";

export const listar = asyncHandler(async (req, res) => {
  const heroes = await listarHeroes();
  res.status(200).json({ ok: true, data: heroes });
});

export const obtener = asyncHandler(async (req, res) => {
  try {
    const heroe = await obtenerHeroe(Number(req.params.id));
    res.status(200).json({ ok: true, data: heroe });
  } catch (error) {
    if (error instanceof HeroeNoEncontradoError) {
      res.status(404).json({ ok: false, message: error.message });
      return;
    }
    throw error;
  }
});

export const crear = asyncHandler(async (req, res) => {
  try {
    const heroe = await crearHeroe(req.body);
    res.status(201).json({ ok: true, data: heroe });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
});
