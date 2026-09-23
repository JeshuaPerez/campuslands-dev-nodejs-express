# Ejercicio 22 intermedio - subida simulada de archivos (Jeshua Perez)

## Que hace

Tematica arquitectura 3D. `POST /planos` usa `multer` (almacenamiento en
memoria, sin escribir a disco) para recibir un archivo `plano`. Solo acepta
PDF, PNG o JPEG, hasta 2MB.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3042/planos -F "plano=@plano.pdf"
```

## Tests

```bash
npm test
```
