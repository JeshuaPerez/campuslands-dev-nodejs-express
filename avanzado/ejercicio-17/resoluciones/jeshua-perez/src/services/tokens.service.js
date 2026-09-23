import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

const SECRETO = "clave-secreta-viajes";
const refreshTokensActivos = new Set();

export function emitirTokens(usuario) {
  const accessToken = jwt.sign({ usuario }, SECRETO, { expiresIn: "5m" });

  const refreshToken = randomUUID();
  refreshTokensActivos.add(refreshToken);

  return { accessToken, refreshToken };
}

export function refrescarAccessToken(refreshToken) {
  if (!refreshTokensActivos.has(refreshToken)) {
    throw new Error("REFRESH_TOKEN_INVALIDO");
  }

  return jwt.sign({ usuario: "viajero-demo" }, SECRETO, { expiresIn: "5m" });
}

export function revocarRefreshToken(refreshToken) {
  refreshTokensActivos.delete(refreshToken);
}

export function verificarAccessToken(accessToken) {
  return jwt.verify(accessToken, SECRETO);
}
