# Basico 09 - JSON y persistencia simple (Jeshua Perez)

Tematica: kickboxing.

## Que resuelve

Un registro de peleadores que **sobrevive al reinicio**: un CRUD completo cuyo
almacen es un archivo JSON. El ejercicio 05 leia del disco; este ademas escribe,
y escribir es donde aparecen los problemas de verdad.

## Requisitos

- Node.js 20 o superior (probado en v24.15.0).

## Como ejecutar

```bash
npm install
npm start          # API en http://localhost:3000
npm run json       # demo por consola de los limites de JSON
npm test           # 59 pruebas
```

## Los dos problemas de escribir en disco

### 1. Escritura a medias

Si el proceso muere en mitad de un `writeFile`, el archivo queda truncado y se
pierde **todo**, no solo el ultimo cambio. La solucion es no escribir nunca
encima del archivo bueno:

```js
await writeFile(temporal, contenido, 'utf8');
await rename(temporal, rutaArchivo);
```

El renombrado es atomico dentro del mismo sistema de archivos: o esta el archivo
viejo entero, o el nuevo entero. Nunca una mezcla. Si algo falla, el temporal se
borra para no dejar basura.

### 2. Escrituras concurrentes

Dos peticiones que guarden a la vez leen el mismo estado, y la segunda pisa el
cambio de la primera. Es el *lost update*, y con un archivo JSON aparece
enseguida. La solucion es encadenar las escrituras en una cola:

```js
function actualizar(transformar) {
  const resultado = cola.then(async () => {
    const datos = await leer();          // la lectura tambien va dentro
    const nuevos = transformar(structuredClone(datos));
    await escribirAtomico(nuevos);
    return nuevos;
  });

  cola = resultado.catch(() => {});      // un fallo no bloquea a los demas
  return resultado;
}
```

Que la **lectura** ocurra dentro de la cola es lo que de verdad evita el
problema: si se leyera fuera, dos operaciones partirian del mismo estado viejo.

Hay una prueba que lo demuestra lanzando 20 escrituras a la vez:

```text
20 escrituras lanzadas a la vez -> quedaron 20.
Sin la cola, todas leerian el mismo estado inicial y quedaria 1.
```

## Lo que JSON pierde por el camino

JSON es un formato mas pobre que los valores de JavaScript. El viaje de ida y
vuelta no devuelve siempre lo que entro:

| Valor original | Tras stringify + parse |
|---|---|
| `undefined` | la clave **desaparece** |
| funcion | la clave **desaparece** |
| `Date` | string ISO, ya no es Date |
| `NaN` | `null` |
| `Infinity` | `null` |
| `Set` | `{}` |
| `Map` | `{}` |
| `BigInt` | **lanza**, ni siquiera serializa |

```bash
npm run json
```

### El reviver reconstruye

`JSON.parse` acepta un segundo argumento que se ejecuta sobre cada valor:

```js
export function reviverDeFechas(clave, valor) {
  const esIso = typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(valor);

  return esIso ? new Date(valor) : valor;
}
```

### El replacer filtra

`JSON.stringify` acepta el equivalente, util para no volcar secretos a un
archivo ni a un log:

```json
{ "usuario": "ana", "token": "[oculto]", "rol": "admin" }
```

## Endpoints

| Metodo | Ruta | Status | Descripcion |
|---|---|---:|---|
| GET | `/health` | 200 | Comprueba que el servidor responde. |
| GET | `/basico/ejercicio-09` | 200 | Respuesta del enunciado + estado del gimnasio. |
| GET | `/basico/ejercicio-09/json` | 200 | Que conserva y que pierde JSON. |
| GET | `/basico/ejercicio-09/replacer` | 200 | El replacer ocultando un token. |
| GET | `/basico/ejercicio-09/peleadores` | 200 / 400 | Lista. Acepta `?categoria=`. |
| POST | `/basico/ejercicio-09/peleadores` | 201 / 400 | Alta, persistida en el archivo. |
| GET | `/basico/ejercicio-09/peleadores/:id` | 200 / 404 | Uno por id. |
| DELETE | `/basico/ejercicio-09/peleadores/:id` | 200 / 404 | Baja, persistida. |
| POST | `/basico/ejercicio-09/peleadores/:id/combates` | 200 / 400 / 404 | Registra un resultado. |

```bash
curl -X POST http://localhost:3000/basico/ejercicio-09/peleadores/1/combates \
  -H "Content-Type: application/json" -d '{"resultado":"ko"}'
# 200, victorias 19 y ko 12, y el archivo queda actualizado
```

```bash
curl -X POST http://localhost:3000/basico/ejercicio-09/peleadores \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Malo Peso","apodo":"Pesado","categoria":"pluma","pesoKg":90}'
# 400 {"ok":false,"message":"Para la categoria pluma el peso debe estar entre 50 y 57 kg."}
```

## Reglas de validacion

| Campo | Regla |
|---|---|
| `nombre` | 3 a 40 caracteres |
| `apodo` | 2 a 40 caracteres |
| `categoria` | pluma, ligero, medio o pesado |
| `pesoKg` | dentro del rango de su categoria |
| contadores | enteros no negativos |
| `ko` | no puede superar a `victorias` |

Rangos de peso: pluma 50-57, ligero 57-65, medio 65-84, pesado 84-120 kg.

## Pruebas

```bash
npm test
```

```text
ℹ tests 59
ℹ suites 18
ℹ pass 59
ℹ fail 0
```

Las pruebas que escriben usan un archivo **temporal por prueba**, nunca
`datos/peleadores.json`. Eso es lo que permite ejecutarlas mil veces sin que el
repositorio acumule basura.

- **Normal**: CRUD completo releyendo del disco para comprobar que persistio,
  estadisticas derivadas, filtro por categoria, los cuatro resultados de combate.
- **Limite**: archivo inexistente (valor inicial), peso justo en los bordes del
  rango, debutante sin combates sin dividir por cero, 20 escrituras concurrentes.
- **Invalido**: JSON corrupto en disco, categoria y resultado desconocidos, id
  no entero, peso fuera de rango, KO por encima de victorias, contadores
  negativos o decimales, 404 en todas las operaciones por id.

## Estructura

```text
basico/ejercicio-09/resoluciones/jeshua-perez/
├── package.json
├── README.md
├── datos/peleadores.json             # el almacen, versionado como semilla
├── scripts/demo-json.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── repositorios/
│   │   └── json.repositorio.js       # escritura atomica + cola de escrituras
│   ├── routes/ejercicio.routes.js
│   ├── controllers/ejercicio.controller.js
│   └── services/
│       ├── json.service.js           # que pierde JSON, reviver y replacer
│       └── peleadores.service.js     # reglas del dominio
└── tests/
    ├── json.repositorio.test.js
    ├── json.service.test.js
    ├── peleadores.service.test.js
    └── ejercicio.routes.test.js
```

El servicio recibe el repositorio por inyeccion, y el repositorio recibe la ruta
del archivo. Por eso las pruebas pueden apuntarlo a un temporal sin tocar nada.
