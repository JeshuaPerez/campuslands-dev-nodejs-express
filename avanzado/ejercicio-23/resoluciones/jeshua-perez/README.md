# Ejercicio 23 avanzado - jobs programados (Jeshua Perez)

## Que hace

Tematica soldadura. `Programador` corre una tarea cada cierto intervalo
(`setInterval`) sin superponer ejecuciones: si la anterior sigue corriendo,
el siguiente tick se salta en vez de acumularse. `revisar-ordenes-vencidas.job.js`
lo usa para marcar ordenes de soldadura con mas de 7 dias abiertas.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3073/ordenes/revisar-vencidas
```

## Tests

```bash
npm test
```
