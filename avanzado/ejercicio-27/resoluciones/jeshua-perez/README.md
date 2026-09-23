# Ejercicio 27 avanzado - manejo de configuracion avanzada (Jeshua Perez)

## Que hace

Tematica MOBA esports. `config/base.js` tiene los valores por defecto;
`config/por-entorno.js` los sobreescribe segun `NODE_ENV`
(development/test/production); `cargarConfig` mezcla ambos y valida el
resultado final con zod antes de devolverlo.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3077/config
```

## Tests

```bash
npm test
```
