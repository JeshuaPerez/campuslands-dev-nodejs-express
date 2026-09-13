# Basico 05 - fs para leer archivos (Jeshua Perez)

Tematica: futbol y futbol sala.

## Que resuelve

Una API que no inventa sus datos: los lee del disco. En `datos/` hay un JSON con
los equipos de la liga y un CSV con los goleadores, y la aplicacion los lee,
parsea, valida y cruza para construir la tabla de posiciones y el ranking.

Toda la entrada/salida esta aislada en `archivos.service.js`. El servicio de
dominio recibe datos ya parseados y no sabe que existe un disco, por eso se
puede probar sin montar archivos de prueba.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm start          # API en http://localhost:3000
npm run dev        # con recarga
npm run informe    # informe de la liga por consola
npm test           # 39 pruebas
```

## Lo que demuestra sobre fs

### 1. La API con promesas, no la sincrona

Se usa `node:fs/promises`. La version sincrona (`readFileSync`) bloquea el bucle
de eventos, que es justo lo que un servidor no se puede permitir: mientras lee,
no atiende a nadie mas.

### 2. Rutas resueltas contra el modulo, no contra el cwd

```js
const CARPETA_DATOS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'datos',
);
```

Si se usara una ruta relativa a secas, la app solo funcionaria cuando se lanza
desde la carpeta exacta del proyecto.

### 3. El salto de carpeta, bloqueado

Cuando el nombre del archivo llega del cliente hay que comprobar que la ruta
resuelta sigue colgando de la carpeta de datos:

```js
if (rutaFinal !== CARPETA_DATOS && !rutaFinal.startsWith(CARPETA_DATOS + path.sep)) {
  throw new ArchivoNoEncontradoError(nombre);
}
```

Sin eso, pedir `../../../../.env` leeria archivos de fuera del proyecto. Es la
trampa clasica al mezclar `fs` con entrada del usuario, y hay pruebas que la
cubren.

### 4. ENOENT distinguido de un fallo real

Node marca con `error.code === 'ENOENT'` el caso de archivo inexistente. La
entrega lo traduce a un 404 y deja subir cualquier otro error, en vez de
tragarse todo en un `catch` mudo.

### 5. Tres tipos de error, tres status

| Error | Cuando | Status |
|---|---|---:|
| `ArchivoNoEncontradoError` | el archivo no existe o la ruta escapa | 404 |
| `ArchivoInvalidoError` | existe pero no se puede interpretar | 422 |
| `ValidacionError` | la consulta del cliente es incorrecta | 400 |

## Los datos

`datos/equipos.json` - 6 equipos, 3 de futbol y 3 de futsal.
`datos/goleadores.csv` - 10 jugadores con goles, asistencias y partidos.

El parser de CSV es deliberadamente simple: usa la primera fila como cabecera y
convierte a numero solo las celdas que lo son enteras. No cubre comillas ni
comas escapadas, para eso se usaria una libreria.

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-05` | 200 | Respuesta del enunciado + resumen de la liga. |
| GET | `/basico/ejercicio-05/archivos` | 200 | Lista la carpeta de datos con tamanos. |
| GET | `/basico/ejercicio-05/archivos/:nombre` | 200 / 404 | Lee un archivo en crudo. |
| GET | `/basico/ejercicio-05/tabla` | 200 / 400 | Tabla de posiciones. Acepta `?modalidad=`. |
| GET | `/basico/ejercicio-05/goleadores` | 200 / 400 | Ranking. Acepta `?limite=`. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

### GET /basico/ejercicio-05

```json
{
  "ok": true,
  "message": "Ejercicio ejecutado correctamente",
  "topic": "fs para leer archivos",
  "liga": {
    "lider": "Sala Giron",
    "colista": "Sala Provenza",
    "equipos": 6,
    "maximoGoleador": { "jugador": "Mateo Ruiz", "goles": 31, "golesPorPartido": 1.72 },
    "totalGoles": 257,
    "mediaGolesPorPartido": 4.76
  }
}
```

### Tabla y ranking

```bash
curl "http://localhost:3000/basico/ejercicio-05/tabla?modalidad=futsal"
curl "http://localhost:3000/basico/ejercicio-05/goleadores?limite=3"
```

La tabla ordena por puntos, luego diferencia de goles, luego goles a favor.
Se aplican 3 puntos por victoria y 1 por empate.

### Los errores

```bash
curl http://localhost:3000/basico/ejercicio-05/archivos/plantillas.json
# 404 {"ok":false,"message":"No existe el archivo de datos: plantillas.json"}

curl "http://localhost:3000/basico/ejercicio-05/tabla?modalidad=rugby"
# 400 {"ok":false,"message":"La modalidad debe ser una de: futbol, futsal."}

curl "http://localhost:3000/basico/ejercicio-05/archivos/..%2Fpackage.json"
# 404 el salto de carpeta queda bloqueado
```

## Pruebas

```bash
npm test
```

```text
ℹ tests 39
ℹ suites 15
ℹ pass 39
ℹ fail 0
```

- **Normal**: lectura del JSON y del CSV, conversion de celdas numericas,
  listado de la carpeta, puntos y diferencia de goles, orden de la tabla,
  filtro por modalidad, ranking y sus promedios.
- **Limite**: tabla vacia, equipo sin partidos jugados (sin dividir por cero),
  limite mayor que el total de goleadores, liga vacia en el resumen.
- **Invalido**: archivo inexistente (404), nombre vacio, salto de carpeta,
  JSON mal formado (422), CSV descuadrado, modalidad inexistente y limite
  cero, negativo o no numerico (400).

## Estructura

```text
basico/ejercicio-05/resoluciones/jeshua-perez/
├── package.json
├── README.md
├── datos/
│   ├── equipos.json                  # 6 equipos de la liga
│   └── goleadores.csv                # 10 jugadores
├── scripts/informe-liga.js           # informe por consola, con caso de error
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── archivos.service.js       # todo el fs: lectura, rutas seguras, errores
│       └── liga.service.js           # calculo puro, sin tocar disco
└── tests/
    ├── archivos.service.test.js
    ├── liga.service.test.js
    └── ejercicio.routes.test.js
```
