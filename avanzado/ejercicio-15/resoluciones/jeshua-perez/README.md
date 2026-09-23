# Ejercicio 15 avanzado - seguridad de headers (Jeshua Perez)

## Que hace

Tematica comida urbana. `helmet()` agrega headers de seguridad estandar
(`X-Content-Type-Options`, `X-Frame-Options`, etc.) a cada respuesta;
`app.disable("x-powered-by")` oculta que el servidor es Express.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -i http://localhost:3065/platillos
```

## Tests

```bash
npm test
```
