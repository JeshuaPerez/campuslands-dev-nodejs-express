# Ejercicio 17 intermedio - roles y permisos (Jeshua Perez)

## Que hace

Tematica viajes y turismo. Tres roles (`viajero`, `agente`, `admin`), cada uno
con su lista de permisos (`ver_reservas`, `crear_reserva`,
`cancelar_reserva`). `requierePermiso(permiso)` protege cada ruta segun el
permiso que necesita.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3037/reservas -H "Authorization: Bearer token-viajero"
```

## Tests

```bash
npm test
```
