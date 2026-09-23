const registros = [];

export function registrarAuditoria({ usuario, accion, recurso }) {
  const entrada = { usuario, accion, recurso, fecha: new Date().toISOString() };
  registros.push(entrada);
  return entrada;
}

export function listarAuditoria() {
  return registros;
}
