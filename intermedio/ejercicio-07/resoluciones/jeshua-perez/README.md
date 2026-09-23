# Ejercicio 07 intermedio - middleware de errores (Jeshua Perez)

## Que hace

Tematica autos de lujo. `HttpError` (errors/http-error.js) lleva su propio
`statusCode`; las rutas hacen `next(new HttpError(...))` en vez de responder
directo, y `errorHandler` (middleware de 4 argumentos, al final de la cadena)
centraliza como se convierten esos errores en respuesta HTTP.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
