# Basico 07 - process.argv y CLI (Jeshua Perez)

Tematica: autos de lujo.

## Que resuelve

Un inventario de concesionario con **dos frentes sobre el mismo dominio**: una
herramienta de consola y una API HTTP. El servicio de inventario no sabe cual de
las dos lo esta llamando; solo cambia de donde vienen los criterios.

El foco del ejercicio es `process.argv`: como se lee, como se parsea y como se
convierte en algo que el dominio entienda.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm run cli -- ayuda     # el CLI
npm start                # la API en http://localhost:3000
npm test                 # 58 pruebas
```

## El CLI

```bash
node src/cli/index.js ayuda
node src/cli/index.js listar
node src/cli/index.js buscar --marca Ferrari
node src/cli/index.js buscar -m Porsche -o cv --desc
node src/cli/index.js buscar --precio-max=1000000000 --disponibles
node src/cli/index.js resumen
```

```text
┌─────────┬───────────┬────────────────┬──────┬─────┬───────┬───────────────┐
│ (index) │ marca     │ modelo         │ anio │ cv  │ stock │ precio        │
├─────────┼───────────┼────────────────┼──────┼─────┼───────┼───────────────┤
│ 0       │ 'Porsche' │ '911 Turbo S'  │ 2025 │ 650 │ 4     │ '980.000.000' │
│ 1       │ 'Porsche' │ 'Taycan Turbo' │ 2025 │ 625 │ 6     │ '720.000.000' │
└─────────┴───────────┴────────────────┴──────┴─────┴───────┴───────────────┘
2 resultado(s).
```

## Lo que demuestra sobre process.argv

### 1. argv es un arreglo de strings, nada mas

```text
process.argv[0]   ruta del ejecutable de node
process.argv[1]   ruta del script
process.argv[2..] lo que escribio la persona
```

Por eso todo parseo empieza en el indice 2. La constante
`INDICE_PRIMER_ARGUMENTO` lo deja escrito en vez de sembrar un `2` suelto.

### 2. Dos parsers, a proposito

`src/cli/argumentos.js` trae los dos:

- **`parsearManual`** recorre el arreglo a mano. Entiende `--opcion=valor`,
  `--opcion valor`, banderas sueltas y el separador `--`. Esta para ver el
  mecanismo: no hay magia debajo.
- **`parsearConUtil`** usa `util.parseArgs`, que Node trae desde la 18. Es el
  que usa la aplicacion de verdad.

Una prueba comprueba que **los dos coinciden** en las entradas normales.

### 3. El modo strict avisa de los errores de escritura

```bash
node src/cli/index.js buscar --color rojo
# Error en los argumentos: Unknown option '--color'.
# exit 1
```

Sin `strict: true`, un `--makra Ferrari` mal escrito se colaria en silencio y el
filtro no se aplicaria, sin que nadie se entere.

### 4. Codigos de salida que significan algo

| Codigo | Cuando |
|---:|---|
| 0 | todo bien |
| 1 | argumentos invalidos |
| 2 | comando desconocido |

Importan porque un CLI se encadena: `comando && otro` solo sigue si el primero
devolvio 0.

### 5. `ejecutar()` devuelve el codigo, no llama a process.exit

```js
export function ejecutar(argv = process.argv) { /* ... */ return SALIDA_OK; }
```

Asi las pruebas pueden invocar el CLI entero sin matar el proceso de pruebas.
El `process.exit` real solo ocurre en el arranque, y solo cuando el archivo es
el punto de entrada:

```js
const esEntrada = fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
```

### 6. Pasar argumentos a traves de npm

`npm run` se queda con las opciones, hay que separarlas con `--`:

```bash
npm run cli -- buscar --marca Ferrari
```

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-07` | 200 | Respuesta del enunciado + descripcion del CLI. |
| GET | `/basico/ejercicio-07/ayuda` | 200 | El mismo texto que imprime `--ayuda`. |
| GET | `/basico/ejercicio-07/autos` | 200 / 400 | Catalogo con los filtros del CLI. |
| GET | `/basico/ejercicio-07/inventario` | 200 | Lo mismo que el comando `resumen`. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

Las opciones del CLI y los parametros de query apuntan al mismo servicio:

```bash
node src/cli/index.js buscar --marca Porsche --ordenar cv --desc
curl "http://localhost:3000/basico/ejercicio-07/autos?marca=Porsche&ordenar=cv&desc=true"
```

## Opciones

| Corta | Larga | Tipo | Que hace |
|---|---|---|---|
| `-m` | `--marca` | texto | Filtra por marca. |
| `-p` | `--precio-max` | numero | Precio maximo. |
| `-a` | `--anio-min` | numero | Anio minimo. |
| `-d` | `--disponibles` | bandera | Solo con stock. |
| `-o` | `--ordenar` | texto | precio, anio, cv, stock o marca. |
| | `--desc` | bandera | Orden descendente. |
| `-l` | `--limite` | numero | Maximo de resultados. |
| | `--json` | bandera | Salida JSON en vez de tabla. |
| `-h` | `--ayuda` | bandera | Muestra la ayuda. |

## Pruebas

```bash
npm test
```

```text
ℹ tests 58
ℹ suites 17
ℹ pass 58
ℹ fail 0
```

- **Normal**: las tres formas de escribir opciones, alias cortos, banderas con
  valor por defecto, subcomandos, los dos parsers coincidiendo, filtros y orden.
- **Limite**: sin argumentos (muestra ayuda), busqueda sin resultados (avisa y
  sale con 0), limite 1 y limite mayor que el total, precio maximo exacto,
  separador `--` que convierte todo en texto suelto.
- **Invalido**: opcion desconocida, opcion de texto sin valor, comando
  desconocido, campo de orden inexistente, limite cero o negativo, marca vacia,
  numeros no numericos. Cada uno con su codigo de salida comprobado.

## Estructura

```text
basico/ejercicio-07/resoluciones/jeshua-perez/
├── package.json                      # incluye "bin" para instalarlo como comando
├── README.md
├── src/
│   ├── app.js
│   ├── server.js
│   ├── cli/
│   │   ├── index.js                  # ejecutar(argv) -> codigo de salida
│   │   ├── argumentos.js             # los dos parsers y la traduccion a criterios
│   │   └── ayuda.js                  # texto de --ayuda
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/inventario.service.js
└── tests/
    ├── argumentos.test.js
    ├── inventario.service.test.js
    ├── cli.test.js
    └── ejercicio.routes.test.js
```
