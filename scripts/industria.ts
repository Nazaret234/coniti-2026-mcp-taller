// Cambia la industria con la que trabaja tu equipo.
//
//   npm run industria                 muestra la actual
//   npm run industria ferreteria      cambia a ferretería

import { esIndustria, guardarIndustria, industriaActiva, INDUSTRIAS } from '../src/lib/industria.ts';

const elegida = process.argv[2];

if (!elegida) {
  console.log(`\nIndustria activa: ${industriaActiva()}`);
  console.log(`Opciones: ${INDUSTRIAS.join(', ')}`);
  console.log('Para cambiar:  npm run industria <nombre>\n');
  process.exit(0);
}

if (!esIndustria(elegida)) {
  console.error(`\nNo conozco la industria "${elegida}". Opciones: ${INDUSTRIAS.join(', ')}\n`);
  process.exit(1);
}

guardarIndustria(elegida);
const carpeta = elegida === 'cafeteria' ? 'src/cafeteria' : `src/industrias/${elegida}`;
console.log(`\nListo: ahora el servidor usa "${elegida}".`);
console.log(`Tu código está en ${carpeta}${elegida === 'cafeteria' ? '' : ' (empieza por LEEME.md)'}`);
console.log('Reinicia el Inspector o Claude Desktop para que tomen el cambio.\n');
