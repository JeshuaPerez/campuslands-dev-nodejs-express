import { eventos } from "../events/eventos.js";

const autos = [{ id: 1, marca: "Bugatti", modelo: "Chiron", vendido: false }];

export function venderAuto(id) {
  const auto = autos.find((a) => a.id === id);

  if (!auto) {
    throw new Error("AUTO_NO_ENCONTRADO");
  }

  if (auto.vendido) {
    throw new Error("AUTO_YA_VENDIDO");
  }

  auto.vendido = true;
  eventos.emit("auto.vendido", auto);

  return auto;
}
