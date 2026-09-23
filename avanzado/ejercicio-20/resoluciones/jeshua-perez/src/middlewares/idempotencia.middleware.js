const respuestasPorClave = new Map();

/**
 * Si la peticion trae header Idempotency-Key y esa clave ya se proceso
 * antes, devuelve la misma respuesta guardada sin volver a ejecutar la
 * ruta (evita crear el recurso dos veces si el cliente reintenta).
 */
export function idempotencia(req, res, next) {
  const clave = req.headers["idempotency-key"];

  if (!clave) {
    next();
    return;
  }

  const guardada = respuestasPorClave.get(clave);

  if (guardada) {
    res.status(guardada.status).json(guardada.body);
    return;
  }

  const jsonOriginal = res.json.bind(res);

  res.json = (body) => {
    respuestasPorClave.set(clave, { status: res.statusCode, body });
    return jsonOriginal(body);
  };

  next();
}
