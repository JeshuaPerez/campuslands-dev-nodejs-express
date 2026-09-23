const partidos = [];
let siguienteId = 1;

export function crearPartido({ local, visitante }) {
  if (!local || !visitante) {
    throw new Error("local y visitante son obligatorios");
  }

  if (local === visitante) {
    throw new Error("local y visitante no pueden ser el mismo equipo");
  }

  const partido = { id: siguienteId++, local, visitante, golesLocal: 0, golesVisitante: 0 };
  partidos.push(partido);
  return partido;
}

export function registrarGol(id, equipo) {
  const partido = partidos.find((p) => p.id === id);

  if (!partido) {
    throw new Error("PARTIDO_NO_ENCONTRADO");
  }

  if (equipo === "local") {
    partido.golesLocal += 1;
  } else if (equipo === "visitante") {
    partido.golesVisitante += 1;
  } else {
    throw new Error("equipo debe ser 'local' o 'visitante'");
  }

  return partido;
}

export function listarPartidos() {
  return partidos;
}
