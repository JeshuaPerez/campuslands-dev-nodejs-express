import { createServer } from "node:http";

const platillos = [
  { id: 1, nombre: "Tacos al pastor" },
  { id: 2, nombre: "Hot dog callejero" },
  { id: 3, nombre: "Arepa venezolana" },
];

export function crearServidor() {
  return createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/platillos") {
      res.statusCode = 200;
      res.end(JSON.stringify({ ok: true, data: platillos }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ ok: false, message: "Ruta no encontrada" }));
  });
}
