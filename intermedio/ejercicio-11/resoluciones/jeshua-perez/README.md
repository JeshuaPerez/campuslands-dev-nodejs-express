# Ejercicio 11 intermedio - busqueda textual (Jeshua Perez)

## Que hace

Tematica musica. `GET /canciones?q=texto` busca coincidencias parciales
(sin importar mayusculas) en titulo o artista.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl "http://localhost:3031/canciones?q=imagine"
```

## Tests

```bash
npm test
```
