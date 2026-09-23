# Ejercicio 18 intermedio - hash de passwords conceptual (Jeshua Perez)

## Que hace

Tematica paracaidismo. `registrar` usa `bcryptjs` para guardar la clave
hasheada (nunca en texto plano); `verificarClave` compara con `bcrypt.compare`.
`POST /paracaidistas/registro` y `POST /paracaidistas/login`.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3038/paracaidistas/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","clave":"secreta123"}'
```

## Tests

```bash
npm test
```
