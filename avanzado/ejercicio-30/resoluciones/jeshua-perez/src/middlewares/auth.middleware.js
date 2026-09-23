const usuariosPorToken = {
  "token-mecanico": { nombre: "Mecanico Demo", roles: ["mecanico"] },
  "token-admin": { nombre: "Admin Demo", roles: ["mecanico", "admin"] },
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

export function requireAlgunRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario?.roles.some((rol) => rolesPermitidos.includes(rol))) {
      res.status(403).json({ ok: false, message: `Se requiere alguno de estos roles: ${rolesPermitidos.join(", ")}` });
      return;
    }
    next();
  };
}
