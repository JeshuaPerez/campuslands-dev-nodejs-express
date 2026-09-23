/**
 * Middleware de validacion centralizada. Recibe un esquema simple
 * { campo: { requerido, tipo } } y valida req.body antes de llegar a la ruta.
 */
export function validar(esquema) {
  return (req, res, next) => {
    const errores = [];

    for (const [campo, reglas] of Object.entries(esquema)) {
      const valor = req.body[campo];

      if (reglas.requerido && (valor === undefined || valor === null || valor === "")) {
        errores.push(`${campo} es obligatorio`);
        continue;
      }

      if (valor !== undefined && reglas.tipo && typeof valor !== reglas.tipo) {
        errores.push(`${campo} debe ser de tipo ${reglas.tipo}`);
      }
    }

    if (errores.length > 0) {
      res.status(400).json({ ok: false, message: errores.join(", ") });
      return;
    }

    next();
  };
}
