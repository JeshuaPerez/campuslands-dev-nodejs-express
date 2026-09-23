const usuariosPorToken = {
  "token-mecanico": { nombre: "Mecanico Demo", rol: "mecanico" },
  "token-admin": { nombre: "Admin Demo", rol: "admin" },
};

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, message: "Falta el header Authorization" });
    return;
  }

  const usuario = usuariosPorToken[header.slice("Bearer ".length)];

  if (!usuario) {
    res.status(403).json({ ok: false, message: "Token invalido" });
    return;
  }

  req.usuario = usuario;
  next();
}

export function requireRol(rol) {
  return (req, res, next) => {
    if (req.usuario?.rol !== rol) {
      res.status(403).json({ ok: false, message: `Se requiere el rol ${rol}` });
      return;
    }
    next();
  };
}
