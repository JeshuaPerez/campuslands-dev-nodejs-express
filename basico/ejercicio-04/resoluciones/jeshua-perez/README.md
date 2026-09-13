# Basico 04 - modulos ES Modules (Jeshua Perez)

Tematica: battle royale.

## Que resuelve

Este ejercicio es el contrapunto del 03. Aquel iba entero en CommonJS; este va
entero en **ES Modules** (`import` / `export`), y la entrega se centra en lo que
de verdad los diferencia, no solo en la sintaxis.

La diferencia grande son los **live bindings**: lo que exporta un modulo ESM no
es una copia del valor, es una vista viva de la variable.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm start          # API en http://localhost:3000
npm run dev        # con recarga
npm run esm        # demo por consola de live bindings e import dinamico
npm test           # 37 pruebas
```

## Lo que demuestra sobre ES Modules

### 1. Live bindings, la diferencia de verdad con CommonJS

`src/lib/zona.js` exporta `let radioActual`. Quien lo importa ve el valor nuevo
despues de cada cierre de zona, **sin volver a importar**.

```bash
npm run esm
```

```text
Radio al importar:        1000
Copia guardada en const:  1000

Despues de dos cierres de 250 m:
Radio leido del import:   500   <- se actualizo solo
Copia guardada en const:  1000   <- sigue congelada
```

En CommonJS, `const { radioActual } = require('./zona')` se comporta como esa
copia congelada: el valor queda fijado en el momento del require. Esa es la
distincion que el ejercicio 03 no podia mostrar y este si.

### 2. Default y named exports conviviendo

`src/lib/rareza.js` tiene un `export default` (la tabla de rarezas) y ademas
varios named exports. El default no tiene nombre fijo: quien importa elige como
llamarlo, y por eso `src/server.js` importa la app como `montarAplicacion`.

```js
import RAREZAS, { esRarezaValida, multiplicadorDe } from '../lib/rareza.js';
```

### 3. No hay __dirname ni __filename

En ESM esas variables no existen. El equivalente es `import.meta.url`, que es
una URL y no una ruta, asi que hay que convertirla:

| CommonJS | ES Modules |
|---|---|
| `__filename` | `fileURLToPath(import.meta.url)` |
| `__dirname` | `path.dirname(fileURLToPath(import.meta.url))` |
| `require` | `createRequire(import.meta.url)` |

### 4. Top-level await

`src/services/module-info.service.js` hace `await import(...)` fuera de toda
funcion. En CommonJS eso es un error de sintaxis.

### 5. Import dinamico

`import()` devuelve una promesa y acepta una ruta calculada en ejecucion, cosa
que el `import` estatico no permite. El endpoint `/modulos/:nombre` lo usa, con
una lista blanca para no cargar rutas arbitrarias que llegan del cliente.

### 6. Interoperabilidad

`createRequire(import.meta.url)` permite cargar modulos CommonJS desde ESM.

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-04` | 200 | Respuesta del enunciado + info del modulo. |
| GET | `/basico/ejercicio-04/zona` | 200 | Radio leido por live binding. |
| POST | `/basico/ejercicio-04/zona/cerrar` | 200 / 400 | Encoge la zona. |
| GET | `/basico/ejercicio-04/modulos/:nombre` | 200 / 404 | Import dinamico con lista blanca. |
| POST | `/basico/ejercicio-04/escuadras` | 201 / 400 | Evalua una escuadra contra la zona. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

### GET /basico/ejercicio-04

```json
{
  "ok": true,
  "message": "Ejercicio ejecutado correctamente",
  "topic": "modulos ES Modules",
  "modulo": {
    "sistema": "ES Modules",
    "equivalencias": {
      "__filename": "fileURLToPath(import.meta.url)",
      "__dirname": "path.dirname(fileURLToPath(import.meta.url))",
      "require": "createRequire(import.meta.url)"
    },
    "rarezasCargadasConTopLevelAwait": ["comun", "raro", "epico", "legendario"]
  }
}
```

### El live binding, por HTTP

```bash
curl -X POST http://localhost:3000/basico/ejercicio-04/zona/cerrar \
  -H "Content-Type: application/json" -d '{"metros":400}'
```

```json
{ "ok": true, "message": "Zona cerrada",
  "data": { "fase": 1, "radioActual": 600, "radioActualSegunElImport": 600 } }
```

`radioActualSegunElImport` lo lee un modulo distinto que importo la variable una
sola vez al arrancar. Que valga 600 y no 1000 es la prueba del binding vivo.

### POST /basico/ejercicio-04/escuadras

```bash
curl -X POST http://localhost:3000/basico/ejercicio-04/escuadras \
  -H "Content-Type: application/json" \
  -d '{"jugadores":[
        {"nombre":"Nova","distanciaAlCentro":100,"loot":"legendario"},
        {"nombre":"Rex","distanciaAlCentro":900,"loot":"raro"}]}'
```

```json
{
  "ok": true,
  "message": "Escuadra evaluada",
  "data": {
    "radioDeLaZona": 600, "totalJugadores": 2, "aSalvo": 1, "fueraDeZona": 1,
    "valorTotalLoot": 1250,
    "mejorEquipado": { "nombre": "Nova", "loot": "legendario", "valorLoot": 1000 }
  }
}
```

## Reglas de validacion

| Campo | Regla | Si falla |
|---|---|---|
| `jugadores` | arreglo de 1 a 4 elementos | 400 |
| `nombre` | obligatorio, sin repetir dentro de la escuadra | 400 |
| `distanciaAlCentro` | numero finito y no negativo | 400 |
| `loot` | una de las 4 rarezas | 400 |
| `metros` (cerrar zona) | numero positivo | 400 |

El modulo de zona lanza `TypeError`, y el servicio lo traduce a
`ValidacionError` para que el manejador HTTP pueda responder 400 en vez de 500.

## Pruebas

```bash
npm test
```

```text
ℹ tests 37
ℹ suites 13
ℹ pass 37
ℹ fail 0
```

- **Normal**: quien esta a salvo segun el radio, valor del loot por rareza,
  lectura del radio via live binding tras cerrar la zona, default y named
  exports.
- **Limite**: escuadra de 1 y de 4 jugadores, jugador justo en el borde de la
  zona, radio que nunca baja de cero, y la copia en `const` que si se congela.
- **Invalido**: sin argumentos, `jugadores` que no es arreglo, escuadra vacia o
  de 5, nombre vacio o repetido, distancia negativa o no numerica, rareza
  inexistente, metros cero o negativos.

## Estructura

```text
basico/ejercicio-04/resoluciones/jeshua-perez/
├── package.json                      # "type": "module"
├── README.md
├── scripts/demo-esm.js               # live bindings e import dinamico por consola
├── src/
│   ├── app.js                        # named export + default export
│   ├── server.js                     # importa el default renombrandolo
│   ├── lib/
│   │   ├── zona.js                   # export let -> binding vivo
│   │   └── rareza.js                 # export default + named exports
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── partida.service.js        # reglas del dominio battle royale
│       └── module-info.service.js    # import.meta, top-level await, createRequire
└── tests/
    ├── zona.test.js
    ├── partida.service.test.js
    └── ejercicio.routes.test.js
```
