# Ejercicio 20 intermedio - CORS controlado (Jeshua Perez)

## Que hace

Tematica dibujo digital. `corsOptions` solo permite una lista fija de
origenes (mas las peticiones sin `Origin`, como curl); cualquier otro
origen recibe `403`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3040/ilustraciones -H "Origin: http://localhost:5173"
```

## Tests

```bash
npm test
```
