# Ejercicio 22 avanzado - webhooks simulados (Jeshua Perez)

## Que hace

Tematica arquitectura 3D. `POST /webhooks/suscripciones` registra una URL
que quiere escuchar un evento. `POST /webhooks/disparar/:evento` envia el
payload por POST a cada suscriptor de ese evento; si uno falla, no
detiene el envio a los demas (se reporta cada intento por separado).

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl -X POST http://localhost:3072/webhooks/suscripciones \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:4000/webhook","evento":"render.completado"}'
```

## Tests

```bash
npm test
```
