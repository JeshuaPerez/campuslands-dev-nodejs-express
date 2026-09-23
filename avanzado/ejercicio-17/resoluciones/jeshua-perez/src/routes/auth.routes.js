import { Router } from "express";
import { emitirTokens, refrescarAccessToken, revocarRefreshToken } from "../services/tokens.service.js";

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const tokens = emitirTokens("viajero-demo");
  res.status(200).json({ ok: true, ...tokens });
});

authRouter.post("/refresh", (req, res) => {
  try {
    const accessToken = refrescarAccessToken(req.body.refreshToken);
    res.status(200).json({ ok: true, accessToken });
  } catch (error) {
    res.status(401).json({ ok: false, message: "Refresh token invalido o revocado" });
  }
});

authRouter.post("/logout", (req, res) => {
  revocarRefreshToken(req.body.refreshToken);
  res.status(204).end();
});
