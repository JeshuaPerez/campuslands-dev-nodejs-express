# Ejercicio 09 avanzado - streams basicos (Jeshua Perez)

## Que hace

Tematica kickboxing. `CsvAPeleasStream` (Transform stream, `node:stream`)
convierte lineas CSV `nombre,golpes,resultado` en objetos, una linea a la
vez, sin esperar a tener todo el archivo en memoria. `POST /peleas/importar`
recibe un body `text/csv` y lo procesa con ese stream.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3059/peleas/importar \
  -H "Content-Type: text/csv" \
  --data-binary $'Buakaw,52,gano\nSaenchai,48,perdio'
```

## Tests

```bash
npm test
```
