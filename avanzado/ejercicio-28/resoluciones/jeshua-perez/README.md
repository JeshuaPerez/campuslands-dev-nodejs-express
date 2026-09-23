# Ejercicio 28 avanzado - separacion app/server (Jeshua Perez)

## Que hace

Tematica battle royale. `app.js` construye la app de Express (rutas,
middlewares) y la exporta, sin llamar `app.listen` nunca. `server.js` es
el unico archivo que decide el puerto real y arranca el servidor. Los
tests importan `app.js` directo y usan `app.listen(0)` (puerto efimero),
sin depender del puerto 3078 real ni de que `server.js` se ejecute.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
