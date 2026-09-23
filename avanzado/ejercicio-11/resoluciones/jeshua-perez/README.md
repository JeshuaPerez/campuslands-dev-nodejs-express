# Ejercicio 11 avanzado - importacion masiva (Jeshua Perez)

## Que hace

Tematica musica. `POST /canciones/importar` recibe un arreglo de canciones
y las procesa una por una: las validas se importan, las invalidas se
reportan con su indice de fila, sin abortar el lote completo. Responde
`207 Multi-Status`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3061/canciones/importar \
  -H "Content-Type: application/json" \
  -d '[{"titulo":"Yesterday","artista":"The Beatles"},{"titulo":"Sin artista"}]'
```

## Tests

```bash
npm test
```
