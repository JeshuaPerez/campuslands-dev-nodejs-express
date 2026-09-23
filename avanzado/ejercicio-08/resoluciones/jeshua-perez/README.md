# Ejercicio 08 avanzado - event emitter (Jeshua Perez)

## Que hace

Tematica hiperdeportivos. `venderAuto` emite `auto.vendido` (usando
`node:events`) en vez de llamar directo al log o a las notificaciones.
`events/listeners.js` reacciona a ese evento sin que el service sepa que
existen esos listeners.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X PATCH http://localhost:3058/autos/1/vender
```

## Tests

```bash
npm test
```
