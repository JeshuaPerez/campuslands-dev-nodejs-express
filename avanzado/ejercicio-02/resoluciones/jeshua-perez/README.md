# Ejercicio 02 avanzado - arquitectura escalable (Jeshua Perez)

## Que hace

Tematica shooters competitivos. En vez de agrupar por capa (`routes/`,
`controllers/`, `services/` a nivel global), se agrupa por **feature**:
`features/armas/` y `features/jugadores/` cada una con su propio service,
controller, router (`index.js`) autocontenidos. Agregar una feature nueva
no toca las demas.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
