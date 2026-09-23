import jwt from "jsonwebtoken";

export const JWT_SECRET = "clave-secreta-comida-urbana";

export function requireJwt(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, message: "Falta el header Authorization" });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ ok: false, message: "Token invalido o expirado" });
  }
}
