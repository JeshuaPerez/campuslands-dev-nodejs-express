# Ejercicio 21 avanzado - concurrencia controlada (Jeshua Perez)

## Que hace

Tematica animacion 3D. `Semaforo(maxConcurrentes)` limita cuantos renders
corren a la vez; las peticiones que exceden el limite esperan en cola
hasta que se libera un lugar, en vez de saturar el proceso.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3071/renders
```

## Tests

```bash
npm test
```
