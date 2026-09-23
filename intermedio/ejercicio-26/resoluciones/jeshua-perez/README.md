# Ejercicio 26 intermedio - mock de dependencias (Jeshua Perez)

## Que hace

Tematica shooters competitivos. `unirseAPartida` depende de
`servidor-partidas.client.js` (simula un servidor externo de matchmaking).
Los tests usan `t.mock.method` del runner nativo de Node para reemplazar
esa dependencia sin tocar el modulo real ni hacer llamadas de verdad.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
