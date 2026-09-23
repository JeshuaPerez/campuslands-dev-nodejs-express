# Ejercicio 05 avanzado - transacciones simuladas (Jeshua Perez)

## Que hace

Tematica futbol y futbol sala. `ejecutarTransaccion(operacion)` toma una
foto (`snapshot`) del estado de los equipos antes de ejecutar la
operacion; si algo lanza a mitad de camino (presupuesto negativo), restaura
el snapshot completo, como un `ROLLBACK`. `ficharJugador` mueve presupuesto
entre dos equipos usando esa transaccion.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3055/fichajes \
  -H "Content-Type: application/json" \
  -d '{"origen":"River","destino":"Boca","monto":100}'
```

## Tests

```bash
npm test
```
