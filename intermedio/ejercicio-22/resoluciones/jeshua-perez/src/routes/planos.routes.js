import { Router } from "express";
import multer from "multer";

const TIPOS_PERMITIDOS = ["application/pdf", "image/png", "image/jpeg"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      cb(new Error("Tipo de archivo no permitido"));
      return;
    }
    cb(null, true);
  },
});

export const planosRouter = Router();

planosRouter.post("/", (req, res) => {
  upload.single("plano")(req, res, (error) => {
    if (error) {
      res.status(400).json({ ok: false, message: error.message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ ok: false, message: "El archivo plano es obligatorio" });
      return;
    }

    res.status(201).json({
      ok: true,
      data: { nombre: req.file.originalname, tamano: req.file.size, tipo: req.file.mimetype },
    });
  });
});
