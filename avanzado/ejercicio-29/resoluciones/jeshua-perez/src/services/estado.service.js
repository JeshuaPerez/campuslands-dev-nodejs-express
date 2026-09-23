/**
 * Estado de "listo para recibir trafico". Arranca en false: el servidor
 * esta vivo (liveness) pero no listo (readiness) hasta que termine de
 * inicializar sus dependencias (simulado aqui con un timeout corto).
 */
let listo = false;

export function marcarListo() {
  listo = true;
}

export function marcarNoListo() {
  listo = false;
}

export function estaListo() {
  return listo;
}

export function inicializarDependencias() {
  return new Promise((resolve) => {
    setTimeout(() => {
      marcarListo();
      resolve();
    }, 50);
  });
}
