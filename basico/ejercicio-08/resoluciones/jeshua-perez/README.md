# Basico 08 - variables de entorno (Jeshua Perez)

Tematica: hiperdeportivos.

## Que resuelve

Una API cuya configuracion entera vive en el entorno: puerto, entorno de
ejecucion, nivel de log, una clave secreta y hasta **una regla de negocio**
(el tope de velocidad admitido al registrar un auto).

La entrega no usa `dotenv`: Node trae `--env-file` desde la 20.6.

## Requisitos

- Node.js 20.6 o superior (probado en v24.15.0), por `--env-file`.

## Como ejecutar

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run verificar         # diagnostica el entorno sin arrancar nada
npm start                 # API en el puerto configurado
npm test                  # 46 pruebas
```

## Lo que demuestra sobre process.env

### 1. En process.env solo hay strings

Esta es la trampa que se lleva a todo el mundo por delante:

```js
if (process.env.TELEMETRIA_ACTIVA) { /* ... */ }
```

Eso es **cierto incluso cuando la variable vale exactamente `"false"`**, porque
`"false"` es un string no vacio y todo string no vacio es truthy. Hay una prueba
que lo deja escrito:

```js
assert.equal(Boolean('false'), true);
assert.equal(Boolean('0'), true);
```

Por eso cada valor se convierte de forma explicita segun su tipo declarado.

### 2. Un esquema, no `process.env` salpicado por el codigo

`src/config/esquema.js` declara cada variable: tipo, si es obligatoria, valor
por defecto, rangos y si es secreta. La alternativa habitual es ir escribiendo
`process.env.LO_QUE_SEA || 'algo'` por ahi, y entonces nadie sabe ya que se
puede configurar ni que pasa si falta.

### 3. Fallar al arrancar, y con todos los problemas de golpe

```bash
node src/server.js      # sin .env
```

```text
No se puede arrancar.

Configuracion invalida:
  - APP_NOMBRE es obligatoria y no esta definida.
  - API_CLAVE es obligatoria y no esta definida.

Revisa .env.example y crea tu .env a partir de ahi.
```

Sale con codigo 1. Arrancar a medias y reventar tres horas despues con un
`undefined is not a function` es mucho peor que no arrancar.

Se enumeran **todos** los problemas, no solo el primero: arreglar la
configuracion de una vez es mejor que descubrir los errores uno a uno.

### 4. Los secretos nunca se imprimen enteros

```text
│ API_CLAVE  │ 'cla********34' │
```

Se deja ver el principio y el final para poder reconocer cual clave es sin
revelarla. Todo lo que se imprime o se devuelve por HTTP pasa por
`ocultarSecretos`, y hay una prueba que afirma que el endpoint de configuracion
no filtra el valor real.

### 5. La configuracion se inyecta, no se lee

`crearApp(configuracion)` la recibe como parametro. Ningun archivo bajo `src/`
lee `process.env` salvo `server.js`, que es el unico punto de entrada real.

Eso es lo que permite que las pruebas levanten la app con un entorno inventado:

```js
const configuracion = cargarConfiguracion({ APP_NOMBRE: '...', MAX_VELOCIDAD_KMH: '420' });
crearApp(configuracion).listen(0);
```

Sin tocar el entorno del proceso de pruebas.

### 6. El entorno cambia el comportamiento de verdad

`MAX_VELOCIDAD_KMH` no es decorado: define que entradas se aceptan.

```js
const auto = { marca: 'X', modelo: 'Y', velocidadMaxima: 450 };

assert.throws(() => registrarAuto(auto, config({ MAX_VELOCIDAD_KMH: '400' })));
assert.ok(registrarAuto(auto, config({ MAX_VELOCIDAD_KMH: '500' })));
```

El mismo auto pasa o no segun la configuracion. Ademas, en produccion el
manejador de errores deja de exponer el detalle interno.

### 7. El .env.example si se versiona, el .env no

El `.gitignore` de la raiz del repositorio ignora `.env.*`, lo que de paso tapa
el ejemplo. Este ejercicio trae su propio `.gitignore` con una negacion:

```gitignore
!.env.example
.env
```

Comprobado: `git add --dry-run .env.example` lo acepta y `.env` queda rechazado.
Sin el ejemplo versionado, quien clone el repositorio no tiene forma de saber
que variables necesita.

## Variables

| Variable | Tipo | Obligatoria | Por defecto |
|---|---|---|---|
| `APP_NOMBRE` | texto | si | - |
| `API_CLAVE` | texto (secreto, min 16) | si | - |
| `NODE_ENV` | development / test / production | no | `development` |
| `PORT` | entero 1-65535 | no | `3000` |
| `LOG_NIVEL` | error / warn / info / debug | no | `info` |
| `MAX_VELOCIDAD_KMH` | entero positivo | no | `400` |
| `TELEMETRIA_ACTIVA` | booleano | no | `true` |
| `FACTOR_CONVERSION_MILLAS` | decimal | no | `0.621371` |

Los booleanos aceptan `true/1/si/yes/on` y `false/0/no/off`, sin distinguir
mayusculas.

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Estado y entorno activo. |
| GET | `/basico/ejercicio-08` | 200 | Respuesta del enunciado + entorno. |
| GET | `/basico/ejercicio-08/config` | 200 | La configuracion, con secretos ocultos. |
| GET | `/basico/ejercicio-08/esquema` | 200 | Que se puede configurar y como. |
| GET | `/basico/ejercicio-08/autos` | 200 | Catalogo, marcado segun el tope. |
| POST | `/basico/ejercicio-08/autos` | 201 / 400 | Registra respetando el tope. |
| * | cualquier otra | 404 | Ruta no encontrada, en JSON. |

```bash
curl -X POST http://localhost:3000/basico/ejercicio-08/autos \
  -H "Content-Type: application/json" \
  -d '{"marca":"SSC","modelo":"Tuatara","velocidadMaxima":500}'
# 400 {"ok":false,"message":"La velocidad 500 km/h supera el tope configurado de 420 km/h."}
```

## Pruebas

```bash
npm test
```

```text
ℹ tests 46
ℹ suites 14
ℹ pass 46
ℹ fail 0
```

- **Normal**: valores por defecto, conversion de enteros, decimales, booleanos
  y enumerados, banderas derivadas de `NODE_ENV`, objeto congelado.
- **Limite**: cadena vacia tratada como no definida, puerto 1 y 65535, clave de
  exactamente 16 caracteres, velocidad justo igual al tope.
- **Invalido**: obligatorias ausentes, puerto fuera de rango o decimal,
  enumerado desconocido, booleano irreconocible, clave corta, y la comprobacion
  de que se reportan **los cuatro problemas a la vez**.
- **Secretos**: el endpoint de configuracion no filtra la clave real.

## Estructura

```text
basico/ejercicio-08/resoluciones/jeshua-perez/
├── .gitignore                        # negacion para versionar .env.example
├── .env.example                      # SI se sube: dice que hace falta
├── package.json                      # scripts con --env-file
├── README.md
├── scripts/verificar-entorno.js      # diagnostico sin arrancar el servidor
├── src/
│   ├── app.js                        # crearApp(configuracion)
│   ├── server.js                     # unico sitio que lee process.env
│   ├── config/
│   │   ├── esquema.js                # que variables existen y de que tipo
│   │   └── index.js                  # carga, valida, convierte, oculta secretos
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/autos.service.js     # el tope configurado es regla de negocio
└── tests/
    ├── config.test.js
    ├── autos.service.test.js
    └── ejercicio.routes.test.js
```
