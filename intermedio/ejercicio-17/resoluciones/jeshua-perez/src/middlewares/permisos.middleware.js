const PERMISOS_POR_ROL = {
  viajero: ["ver_reservas"],
  agente: ["ver_reservas", "crear_reserva"],
  admin: ["ver_reservas", "crear_reserva", "cancelar_reserva"],
};

const usuariosPorToken = {
  "token-viajero": { nombre: "Viajero Demo", rol: "viajero" },
  "token-agente": { nombre: "Agente Demo", rol: "agente" },
  "token-admin": { nombre: "Admin Demo", rol: "admin" },
};

export function identificar(req, res, next) {
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

export function requierePermiso(permiso) {
  return (req, res, next) => {
    const permisos = PERMISOS_POR_ROL[req.usuario?.rol] ?? [];

    if (!permisos.includes(permiso)) {
      res.status(403).json({ ok: false, message: `No tenes el permiso: ${permiso}` });
      return;
    }

    next();
  };
}
