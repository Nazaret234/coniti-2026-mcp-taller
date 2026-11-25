// Borra todo lo que las tools de escritura guardaron durante el taller:  npm run reiniciar
// Los datos originales (los .json) no se tocan.

import { readdirSync, unlinkSync } from 'node:fs';
import { join, relative } from 'node:path';
import { RAIZ } from '../src/lib/industria.ts';

let borrados = 0;
for (const archivo of readdirSync(join(RAIZ, 'src'), { recursive: true, encoding: 'utf8' })) {
  if (!archivo.endsWith('.jsonl')) continue;
  const ruta = join(RAIZ, 'src', archivo);
  unlinkSync(ruta);
  console.log(`Borrado: ${relative(RAIZ, ruta)}`);
  borrados++;
}
console.log(borrados === 0 ? 'No había nada que borrar.' : 'Listo: los datos volvieron a su estado original.');
