const usuariosPorToken = {
  "token-alumno": { nombre: "Alumno Demo", roles: ["alumno"] },
  "token-instructor": { nombre: "Instructor Demo", roles: ["alumno", "instructor"] },
  "token-jefe": { nombre: "Jefe de Salto", roles: ["alumno", "instructor", "jefe_salto"] },
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

/**
 * Un usuario puede tener varios roles a la vez (multirol). Alcanza con
 * que tenga UNO de los roles permitidos para pasar.
 */
export function requireAlgunRol(...rolesPermitidos) {
  return (req, res, next) => {
    const tieneAlguno = req.usuario?.roles.some((rol) => rolesPermitidos.includes(rol));

    if (!tieneAlguno) {
      res.status(403).json({ ok: false, message: `Se requiere alguno de estos roles: ${rolesPermitidos.join(", ")}` });
      return;
    }

    next();
  };
}
