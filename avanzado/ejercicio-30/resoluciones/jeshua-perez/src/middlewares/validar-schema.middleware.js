export function validarSchema(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
      res.status(400).json({ ok: false, message: resultado.error.issues.map((i) => i.message).join(", ") });
      return;
    }

    req.body = resultado.data;
    next();
  };
}
