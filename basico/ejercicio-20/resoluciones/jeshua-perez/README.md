# Ejercicio 20 - middleware express.json (Jeshua Perez)

## Que hace

Tematica dibujo digital. `POST /ilustraciones` usa el middleware
`express.json()` para parsear el body. Un middleware de error captura el JSON
malformado (`entity.parse.failed`) y responde 400 en vez de tumbar el server.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3010/ilustraciones \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Paisaje","software":"Procreate"}'
```

## Como probar el caso de error

```bash
curl -X POST http://localhost:3010/ilustraciones \
  -H "Content-Type: application/json" \
  -d '{titulo: mal formado'
```

## Tests

```bash
npm test
```
