# Ejercicio 21 intermedio - rate limit conceptual (Jeshua Perez)

## Que hace

Tematica animacion 3D. `rateLimit({ maxPeticiones, ventanaMs })` es un
limitador en memoria por IP y ventana fija: pasado el maximo de peticiones
en la ventana, responde `429`. Es conceptual (no serviria con varias
instancias del servidor, ahi se necesitaria Redis).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
for i in 1 2 3 4; do curl -i http://localhost:3041/renders; done
```

## Tests

```bash
npm test
```
