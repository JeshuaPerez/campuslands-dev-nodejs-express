# Basico 03 - modulos CommonJS (Jeshua Perez)

Tematica: MOBA esports.

## Que resuelve

Toda la entrega esta escrita en **CommonJS** (`require` / `module.exports`), a
diferencia de los ejercicios 01 y 02 que usaban ES Modules. El sistema de
modulos no es solo el vehiculo: es el objeto de estudio. La API expone desde
dentro como funciona `require`, su cache y las variables que Node inyecta.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm start          # API en http://localhost:3000
npm run dev        # con recarga
npm run cache      # demo por consola del cache de require
npm test           # 31 pruebas
```

## Lo que demuestra sobre CommonJS

### 1. Las dos formas de exportar

`src/services/draft.service.js` reasigna el objeto completo, que es la forma
canonica:

```js
module.exports = { CAMPEONES, ROLES, ValidacionError, crearDraft };
```

`src/lib/formato.js` usa la forma alternativa, colgando propiedades:

```js
exports.aTitulo = function aTitulo(texto) { ... };
```

Las dos funcionan porque `exports` es una referencia al mismo objeto que
`module.exports`. Lo que **no** funciona es `exports = {...}`: eso reapunta la
variable local y el modulo acaba exportando un objeto vacio.

### 2. require cachea, no copia

`src/lib/contador.js` mantiene estado. Node ejecuta el cuerpo de un modulo una
sola vez por proceso y guarda el resultado en `require.cache`; los `require`
siguientes devuelven **el mismo objeto**.

```bash
npm run cache
```

```text
Misma referencia en dos require: true
Ruta resuelta: contador.js

Se registraron 2 partidas por la primera referencia y 1 por la segunda.
Total leido desde la segunda referencia: 3
Si fueran copias distintas, el total seria 1 y no 3.
```

Eso es lo que convierte a un modulo CommonJS en un singleton de facto. El
servicio de drafts se apoya en ello para numerar los drafts del proceso.

### 3. Las variables inyectadas

CommonJS envuelve cada archivo en una funcion con cinco parametros:
`exports`, `require`, `module`, `__filename` y `__dirname`. Por eso existen sin
importarlas. En ES Modules no existen, alli se usa `import.meta.url`.

### 4. require.main === module

`src/server.js` solo abre el puerto si se ejecuto directamente. Asi las pruebas
pueden requerir `app.js` sin dejar un servidor escuchando.

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-03` | 200 | Respuesta del enunciado + info del modulo. |
| GET | `/basico/ejercicio-03/cache` | 200 | Evidencia del cache de require. |
| GET | `/basico/ejercicio-03/campeones` | 200 | Catalogo por rol. |
| POST | `/basico/ejercicio-03/drafts` | 201 / 400 | Valida un draft de cinco picks. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

### GET /basico/ejercicio-03

```json
{
  "ok": true,
  "message": "Ejercicio ejecutado correctamente",
  "topic": "modulos CommonJS",
  "modulo": {
    "sistema": "CommonJS",
    "archivo": "module-info.service.js",
    "carpeta": "services",
    "esModuloPrincipal": false,
    "variablesInyectadas": ["exports", "require", "module", "__filename", "__dirname"]
  }
}
```

### POST /basico/ejercicio-03/drafts

Cuerpo con los cinco picks, uno por rol:

```json
{
  "picks": [
    { "rol": "top", "campeon": "Darius" },
    { "rol": "jungla", "campeon": "Warwick" },
    { "rol": "medio", "campeon": "Lux" },
    { "rol": "tirador", "campeon": "Jinx" },
    { "rol": "soporte", "campeon": "Lulu" }
  ]
}
```

Respuesta (201):

```json
{
  "ok": true,
  "message": "Draft valido",
  "data": {
    "numeroDeDraft": 1,
    "winrateMedio": 52.26,
    "favorito": { "rol": "soporte", "campeon": "Lulu", "winrate": 52.9 },
    "cuotaSobre50": 100
  }
}
```

Entrada invalida (400):

```json
{ "ok": false, "message": "El rol top esta repetido en el draft." }
```

## Reglas de validacion

| Regla | Si falla |
|---|---|
| picks debe ser un arreglo | 400 |
| Exactamente 5 picks, uno por rol | 400 |
| Sin roles repetidos | 400 |
| El campeon debe existir en ese rol | 400 |
| Rol y campeon no distinguen mayusculas | - |

## Pruebas

```bash
npm test
```

```text
ℹ tests 31
ℹ suites 12
ℹ pass 31
ℹ fail 0
```

- **Normal**: draft completo, winrate medio, favorito, ordenacion por rol,
  normalizacion de mayusculas y numeracion via modulo cacheado.
- **Limite**: draft con todos por encima del 50 (100 por ciento) y draft con los
  campeones mas flojos (40 por ciento). No existe un draft con 0 por ciento
  porque top y soporte no tienen ningun campeon por debajo de 50.
- **Invalido**: sin argumentos, picks que no es arreglo, draft incompleto o
  con picks de mas, rol repetido, campeon que no juega ese rol.

Ademas se comprueban las dos formas de exportar y el cache de require.

## Estructura

```text
basico/ejercicio-03/resoluciones/jeshua-perez/
├── package.json                      # "type": "commonjs"
├── README.md
├── scripts/demo-cache.js             # demo por consola del cache
├── src/
│   ├── app.js
│   ├── server.js                     # abre el puerto solo si require.main === module
│   ├── lib/
│   │   ├── contador.js               # module.exports = {...}, estado cacheado
│   │   └── formato.js                # exports.x = ...
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── draft.service.js          # reglas del dominio MOBA
│       └── module-info.service.js    # __dirname, require.resolve, require.cache
└── tests/
    ├── draft.service.test.js
    ├── module-info.service.test.js
    └── ejercicio.routes.test.js
```
