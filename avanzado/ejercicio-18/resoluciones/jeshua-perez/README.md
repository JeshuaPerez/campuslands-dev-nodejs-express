# Ejercicio 18 avanzado - multirol avanzado (Jeshua Perez)

## Que hace

Tematica paracaidismo. Cada usuario tiene un arreglo de `roles` (no uno
solo): un instructor es `["alumno", "instructor"]`, el jefe de salto tiene
los tres. `requireAlgunRol(...roles)` deja pasar si el usuario tiene
**al menos uno** de los roles permitidos.

## Como ejecutar

```bash
npm install
npm run dev
```

```bash
curl http://localhost:3068/saltos -H "Authorization: Bearer token-alumno"
```

## Tests

```bash
npm test
```
