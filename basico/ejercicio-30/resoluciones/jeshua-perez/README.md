# Ejercicio 30 - proyecto integrador basico (Jeshua Perez)

Taller mecanico de motos: API para ordenes de reparacion. Integra lo visto en
el nivel basico: capas routes/controllers/services, validacion, manejo de
errores, codigos HTTP correctos, logs y configuracion por entorno.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

## Endpoints

- `GET /ordenes` — lista las ordenes (filtro opcional `?estado=pendiente|cerrada`).
- `GET /ordenes/:id` — una orden (`404` si no existe).
- `POST /ordenes` — crea una orden (`{ "moto": "...", "falla": "..." }`), `400` si faltan datos.
- `PATCH /ordenes/:id/cerrar` — cierra una orden, `409` si ya estaba cerrada.

```bash
curl -X POST http://localhost:3020/ordenes \
  -H "Content-Type: application/json" \
  -d '{"moto":"Yamaha FZ","falla":"no arranca"}'
```

## Estructura

```text
src/
├── app.js
├── server.js
├── config/
├── routes/
├── controllers/
├── services/
└── middlewares/
```

## Tests

```bash
npm test
```
