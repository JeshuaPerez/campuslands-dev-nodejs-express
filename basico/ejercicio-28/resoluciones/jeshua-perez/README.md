# Ejercicio 28 - configuracion por entorno (Jeshua Perez)

## Que hace

Tematica battle royale. `src/config/env.js` lee `NODE_ENV`, `PORT` y
`MAX_JUGADORES` de `process.env`, con valores por defecto y validacion de
`PORT`. Ver `.env.example` para las variables esperadas.

## Como ejecutar

```bash
npm install
cp .env.example .env
npm run dev
```

```bash
curl http://localhost:3018/config
```

## Tests

```bash
npm test
```
