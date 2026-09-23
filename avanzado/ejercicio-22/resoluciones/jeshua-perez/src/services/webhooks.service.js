const suscripciones = [];

export function suscribir({ url, evento }) {
  if (!url || !evento) {
    throw new Error("url y evento son obligatorios");
  }

  const suscripcion = { id: suscripciones.length + 1, url, evento };
  suscripciones.push(suscripcion);
  return suscripcion;
}

/**
 * Envia el evento a cada suscriptor que lo escucha. Un suscriptor que
 * falla no detiene el envio a los demas; se reporta cada intento.
 */
export async function dispararEvento(evento, payload) {
  const destinatarios = suscripciones.filter((s) => s.evento === evento);

  const resultados = await Promise.all(
    destinatarios.map(async (suscripcion) => {
      try {
        const respuesta = await fetch(suscripcion.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return { url: suscripcion.url, ok: respuesta.ok, status: respuesta.status };
      } catch (error) {
        return { url: suscripcion.url, ok: false, error: error.message };
      }
    })
  );

  return resultados;
}
