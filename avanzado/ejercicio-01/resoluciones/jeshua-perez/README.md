# Ejercicio 01 avanzado - diseno API versionada (Jeshua Perez)

## Que hace

Tematica videojuegos RPG. `/api/v1/personajes` y `/api/v2/personajes` viven
en routers separados (`routes/v1/`, `routes/v2/`); v2 agrega el campo
`nivel` sin romper el contrato de v1, que sigue funcionando igual.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3051/api/v1/personajes
curl http://localhost:3051/api/v2/personajes
```

## Tests

```bash
npm test
```
