# Ejercicio 07 avanzado - cache en memoria (Jeshua Perez)

## Que hace

Tematica autos de lujo. `CacheTTL` guarda valores con expiracion en
memoria. `obtenerAuto` la usa para no repetir la "consulta costosa" al
catalogo si el mismo id se pide varias veces dentro del TTL (5s).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3057/autos/1
```

## Tests

```bash
npm test
```
