# Ejercicio 13 intermedio - relaciones simples (Jeshua Perez)

## Que hace

Tematica ciencia ficcion. Cada nave tiene un `pilotoId`; `GET /naves` y
`GET /naves/:id` resuelven esa relacion y devuelven el objeto `piloto`
embebido en la respuesta.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3033/naves/1
```

## Tests

```bash
npm test
```
