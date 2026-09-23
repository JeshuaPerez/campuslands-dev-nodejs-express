# Ejercicio 24 avanzado - documentacion OpenAPI manual (Jeshua Perez)

## Que hace

Tematica formulas quimicas. `openapi.json` describe a mano (sin
swagger-jsdoc ni generadores) los endpoints reales de `/formulas`:
metodos, request body, responses y el schema `Formula`. Se sirve en
`GET /openapi.json` para poder abrirlo en editor.swagger.io o Postman.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3074/openapi.json
```

## Tests

```bash
npm test
```
