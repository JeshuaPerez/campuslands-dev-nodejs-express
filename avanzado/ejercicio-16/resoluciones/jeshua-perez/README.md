# Ejercicio 16 avanzado - sanitizacion de entrada (Jeshua Perez)

## Que hace

Tematica ropa y sneakers. `sanitizarTexto` quita tags HTML/script de
cualquier string; `sanitizarBody` (middleware) lo aplica a todos los
campos string de `req.body` antes de que lleguen a la ruta, para no
guardar una inyeccion XSS tal cual la mando el cliente.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3066/sneakers \
  -H "Content-Type: application/json" \
  -d '{"modelo":"<b>Superstar</b>"}'
```

## Tests

```bash
npm test
```
