# Basico 01 - Node runtime y consola (Jeshua Perez)

Tematica: videojuegos RPG.

## Que resuelve

El ejercicio pide dominar el runtime de Node y la salida por consola. La entrega
lo cubre por dos caminos que comparten la misma logica de negocio:

- Un **CLI** (`src/cli.js`) que lee `process.argv`, imprime la informacion del
  runtime con `console.table` / `console.group` y marca el fallo con
  `process.exitCode`.
- Una **API Express** (`src/server.js`) que expone el endpoint
  `GET /basico/ejercicio-01` con el contrato del enunciado, mas un `POST` para
  crear personajes y practicar validacion y codigos de estado.

Los servicios no conocen HTTP ni consola, por eso los usan los dos entrypoints
sin duplicar reglas.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).
- Sin base de datos: los datos se calculan en memoria.

## Como ejecutar

```bash
npm install
npm start          # API en http://localhost:3000
npm run dev        # API con recarga (node --watch)
npm run cli        # version consola
npm test           # 24 pruebas con el runner nativo de Node
```

El puerto se puede cambiar con la variable `PORT`:

```bash
PORT=3210 npm start
```

## El CLI

```bash
node src/cli.js                 # personaje por defecto: Aldric, guerrero, nivel 1
node src/cli.js Lyra mago 12    # nombre, clase y nivel por argumento
node src/cli.js Al              # entrada invalida -> mensaje de error y exit code 1
```

Salida del caso valido:

```text
Runtime de Node
  ┌────────────────┬────────────┐
  │ nodeVersion    │ 'v24.15.0' │
  │ plataforma     │ 'win32'    │
  │ arquitectura   │ 'x64'      │
  │ pid            │ 11996      │
  │ uptimeSegundos │ 0.029      │
  │ memoriaHeapMb  │ 4.08       │
  └────────────────┴────────────┘
  Version soportada (>= 20).

Personaje creado
  ┌─────────┬────────┐
  │ nombre  │ 'Lyra' │
  │ clase   │ 'mago' │
  │ nivel   │ 12     │
  │ hp      │ 104    │
  │ mp      │ 190    │
  │ ataque  │ 108    │
  │ defensa │ 36     │
  │ poder   │ 173    │
  └─────────┴────────┘
```

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-01` | 200 | Respuesta del enunciado + info del runtime. |
| POST | `/basico/ejercicio-01/personajes` | 201 / 400 | Crea un personaje RPG validando la entrada. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

### GET /basico/ejercicio-01

```bash
curl http://localhost:3000/basico/ejercicio-01
```

```json
{
  "ok": true,
  "message": "Ejercicio ejecutado correctamente",
  "topic": "Node runtime y consola",
  "runtime": {
    "nodeVersion": "v24.15.0",
    "plataforma": "win32",
    "arquitectura": "x64",
    "pid": 25476,
    "uptimeSegundos": 2.084,
    "memoriaHeapMb": 8.93
  },
  "clasesDisponibles": ["guerrero", "mago", "arquero", "clerigo"]
}
```

### POST /basico/ejercicio-01/personajes

Caso valido (201):

```bash
curl -X POST http://localhost:3000/basico/ejercicio-01/personajes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Lyra","clase":"mago","nivel":10}'
```

```json
{
  "ok": true,
  "message": "Personaje creado correctamente",
  "data": {
    "nombre": "Lyra", "clase": "mago", "nivel": 10,
    "hp": 90, "mp": 160, "ataque": 90, "defensa": 30, "poder": 145
  }
}
```

Caso invalido (400):

```bash
curl -X POST http://localhost:3000/basico/ejercicio-01/personajes \
  -H "Content-Type: application/json" \
  -d '{"clase":"mago"}'
```

```json
{ "ok": false, "message": "El nombre del personaje es obligatorio." }
```

## Reglas de validacion

| Campo | Regla | Si falla |
|---|---|---|
| `nombre` | obligatorio, 3 a 20 caracteres, se recorta | 400 |
| `clase` | opcional, una de las 4 clases, no distingue mayusculas | 400 |
| `nivel` | opcional, entero entre 1 y 99, por defecto 1 | 400 |

Las estadisticas son deterministas (`base + modificador * nivel`) en lugar de
aleatorias, para que las pruebas puedan afirmar valores exactos.

## Pruebas

```bash
npm test
```

```text
ℹ tests 24
ℹ suites 9
ℹ pass 24
ℹ fail 0
```

Cubren los tres tipos de caso que pide la rubrica:

- **Normal**: creacion con valores por defecto, calculo de estadisticas, las 4
  clases, normalizacion de espacios y mayusculas.
- **Limite**: nivel 1 y 99, nombre de 3 y de 20 caracteres.
- **Invalido**: sin argumentos, nombre vacio o fuera de rango, clase inexistente,
  nivel 0, 100 y decimal; y por HTTP, los 400 y el 404.

Las pruebas de ruta levantan la app en el puerto 0 (efimero), asi no chocan con
un servidor abierto a mano.

## Estructura

```text
basico/ejercicio-01/resoluciones/jeshua-perez/
├── package.json
├── README.md
├── src/
│   ├── app.js                        # monta Express, 404 y manejador de errores
│   ├── server.js                     # abre el puerto
│   ├── cli.js                        # entrypoint de consola
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── runtime.service.js        # lectura de process
│       └── character.service.js      # reglas del dominio RPG
└── tests/
    ├── runtime.service.test.js
    ├── character.service.test.js
    └── ejercicio.routes.test.js
```

`app.js` y `server.js` estan separados a proposito: la app se puede montar en las
pruebas sin dejar un servidor escuchando.
