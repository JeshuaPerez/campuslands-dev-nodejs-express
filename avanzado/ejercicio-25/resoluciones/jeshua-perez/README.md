# Ejercicio 25 avanzado - testing de integracion (Jeshua Perez)

## Que hace

Tematica videojuegos RPG. `POST /personajes`, `PATCH /personajes/:id/equipar`
y `POST /personajes/:id/atacar`. El test de integracion recorre las tres
rutas en secuencia (crear, equipar, atacar) contra el servidor real,
verificando que el dano cambie segun el arma equipada, en vez de probar
cada endpoint aislado.

## Como ejecutar

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```
