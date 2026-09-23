/**
 * Middleware generico: valida req.body contra cualquier schema de zod.
 */
export function validarSchema(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      const mensajes = resultado.error.issues.map((issue) => issue.message);
      res.status(400).json({ ok: false, message: mensajes.join(", ") });
      return;
    }

    req.body = resultado.data;
    next();
  };
}
