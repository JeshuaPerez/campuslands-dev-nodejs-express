# Ejercicio 26 avanzado - fixtures y factories (Jeshua Perez)

## Que hace

Tematica shooters competitivos. `tests/factories/jugador.factory.js`
expone `crearJugadorFake` y `crearPartidaFake`: dan valores por defecto
razonables y cada test sobreescribe solo el campo que le importa, en vez
de repetir el objeto entero en cada archivo.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
