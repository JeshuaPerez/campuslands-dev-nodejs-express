/**
 * Rate limit conceptual: ventana fija en memoria, por IP. No usa Redis ni
 * paquetes externos, solo para entender la idea (no serviria en produccion
 * con varias instancias del servidor).
 */
export function rateLimit({ maxPeticiones, ventanaMs }) {
  const peticionesPorIp = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const ahora = Date.now();
    const registro = peticionesPorIp.get(ip);

    if (!registro || ahora - registro.inicio > ventanaMs) {
      peticionesPorIp.set(ip, { inicio: ahora, conteo: 1 });
      next();
      return;
    }

    if (registro.conteo >= maxPeticiones) {
      res.status(429).json({ ok: false, message: "Demasiadas peticiones, intenta mas tarde" });
      return;
    }

    registro.conteo += 1;
    next();
  };
}
