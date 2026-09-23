# Ejercicio 20 avanzado - idempotencia (Jeshua Perez)

## Que hace

Tematica dibujo digital. El middleware `idempotencia` guarda la respuesta
de cada peticion que trae header `Idempotency-Key`. Si la misma clave
vuelve a llegar (por ejemplo, el cliente reintento un POST por timeout),
devuelve la respuesta guardada sin volver a crear el recurso.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3070/ilustraciones \
  -H "Content-Type: application/json" -H "Idempotency-Key: abc-123" \
  -d '{"titulo":"Paisaje"}'
```

## Tests

```bash
npm test
```
