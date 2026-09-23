# Ejercicio 12 intermedio - subrecursos REST (Jeshua Perez)

## Que hace

Tematica peliculas de miedo. `GET /peliculas/:peliculaId/resenas` y
`POST /peliculas/:peliculaId/resenas` son un subrecurso: las resenas
dependen de una pelicula que debe existir (404 si no).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3032/peliculas/1/resenas \
  -H "Content-Type: application/json" \
  -d '{"autor":"Ana","comentario":"Muy tensa"}'
```

## Tests

```bash
npm test
```
