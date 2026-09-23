# Ejercicio 19 intermedio - dotenv y config (Jeshua Perez)

## Que hace

Tematica tatuajes. `src/config/index.js` carga `.env` con el paquete
`dotenv` y expone `cargarConfig()` con `PORT`, `NODE_ENV` y
`NOMBRE_ESTUDIO`, con defaults y validacion de `PORT`. Ver `env.example`.

## Como ejecutar

```bash
npm install
cp env.example .env
npm run dev
```

```bash
curl http://localhost:3039/config
```

## Tests

```bash
npm test
```
