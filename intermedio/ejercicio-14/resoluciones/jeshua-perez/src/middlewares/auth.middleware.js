const TOKEN_VALIDO = "token-biblioteca-123";

/**
 * Autenticacion simulada: exige un Bearer token fijo en el header Authorization.
 * No usa JWT ni base de datos, es solo para practicar el patron de middleware.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ ok: false, message: "Falta el header Authorization" });
    return;
  }

  const token = header.slice("Bearer ".length);

  if (token !== TOKEN_VALIDO) {
    res.status(403).json({ ok: false, message: "Token invalido" });
    return;
  }

  next();
}
