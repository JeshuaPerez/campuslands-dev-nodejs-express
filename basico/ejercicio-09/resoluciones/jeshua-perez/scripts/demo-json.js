/** Demuestra por consola los limites de JSON y la escritura atomica. */

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { crearRepositorioJson } from '../src/repositorios/json.repositorio.js';
import {
  analizarViajeDeIdaYVuelta,
  bigIntFalla,
  ocultarClaves,
  recuperarConFechas,
} from '../src/services/json.service.js';

console.log('\n=== Lo que sobrevive al viaje stringify -> parse ===\n');
console.table(analizarViajeDeIdaYVuelta().seMantienen);

console.log('\n=== Lo que se pierde ===\n');
console.table(analizarViajeDeIdaYVuelta().sePierden);

console.log(`\nBigInt ni siquiera serializa: ${bigIntFalla().mensaje}\n`);

console.log('=== El reviver recupera las fechas ===\n');
const recuperado = recuperarConFechas('{"debutEn":"2026-02-10T14:00:00.000Z"}');
console.log(`  Sin reviver: string`);
console.log(`  Con reviver: ${recuperado.debutEn.constructor.name} -> ${recuperado.debutEn.getUTCFullYear()}\n`);

console.log('=== El replacer oculta secretos ===\n');
console.log(ocultarClaves({ usuario: 'ana', token: 'secreto-real', rol: 'admin' }, ['token']));

console.log('\n=== La cola evita perder escrituras concurrentes ===\n');

const carpeta = await mkdtemp(path.join(tmpdir(), 'demo09-'));
const repo = crearRepositorioJson(path.join(carpeta, 'concurrente.json'), { ids: [] });

await Promise.all(
  Array.from({ length: 20 }, (valor, indice) =>
    repo.actualizar((estado) => {
      estado.ids.push(indice);
      return estado;
    }),
  ),
);

const guardado = await repo.leer();

console.log(`  20 escrituras lanzadas a la vez -> quedaron ${guardado.ids.length}.`);
console.log('  Sin la cola, todas leerian el mismo estado inicial y quedaria 1.\n');

await rm(carpeta, { recursive: true, force: true });
