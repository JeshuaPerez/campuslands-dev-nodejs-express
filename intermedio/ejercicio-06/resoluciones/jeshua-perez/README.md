# Ejercicio 06 intermedio - validacion centralizada (Jeshua Perez)

## Que hace

Tematica motos y mecanica. `validar(esquema)` es un middleware generico que
valida `req.body` contra un esquema simple (`requerido`, `tipo`) antes de que
la peticion llegue a la ruta. Se usa en `POST /reparaciones`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3026/reparaciones \
  -H "Content-Type: application/json" \
  -d '{"moto":"Yamaha","costo":150}'
```

## Tests

```bash
npm test
```
