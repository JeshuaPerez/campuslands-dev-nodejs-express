# Ejercicio 04 avanzado - errores de dominio (Jeshua Perez)

## Que hace

Tematica battle royale. `DomainError` es la clase base; cada error concreto
(`PartidaNoEncontradaError`, `PartidaLlenaError`, `DatosInvalidosError`)
lleva su propio `statusCode`. El `errorHandler` central solo pregunta
`instanceof DomainError` y usa `err.statusCode`, sin un switch por tipo de
error.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
