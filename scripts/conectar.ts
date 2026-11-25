// Conecta tu servidor con Claude Desktop.
//
//   npm run conectar            agrega (o actualiza) el servidor en la configuración de Claude Desktop
//   npm run conectar quitar     lo quita
//
// Lo único que hace es editar el archivo claude_desktop_config.json por ti, con rutas completas.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import { industriaActiva, RAIZ } from '../src/lib/industria.ts';

const NOMBRE = 'taller-mcp';
const ARCHIVO = 'claude_desktop_config.json';
const quitar = process.argv[2] === 'quitar';

/** Carpetas donde Claude Desktop puede guardar su configuración, según el sistema. */
function carpetasDeClaude(): string[] {
  if (platform() === 'darwin') return [join(homedir(), 'Library', 'Application Support', 'Claude')];
  if (platform() === 'win32') {
    const carpetas = [join(process.env.APPDATA ?? join(homedir(), 'AppData', 'Roaming'), 'Claude')];
    // Si Claude se instaló desde Microsoft Store, su configuración vive en otra carpeta.
    const paquetes = join(process.env.LOCALAPPDATA ?? join(homedir(), 'AppData', 'Local'), 'Packages');
    if (existsSync(paquetes)) {
      for (const paquete of readdirSync(paquetes)) {
        if (paquete.toLowerCase().startsWith('claude')) {
          carpetas.push(join(paquetes, paquete, 'LocalCache', 'Roaming', 'Claude'));
        }
      }
    }
    return carpetas;
  }
  return [join(homedir(), '.config', 'Claude')];
}

const entrada = {
  command: process.execPath, // la ruta completa de tu Node: así Claude no depende del PATH
  // Las dos banderas permiten que cualquier Node 22.12 o superior ejecute TypeScript sin avisos.
  args: ['--experimental-strip-types', '--disable-warning=ExperimentalWarning', join(RAIZ, 'src', 'servidor.ts')],
};

const candidatas = carpetasDeClaude();
const existentes = candidatas.filter((carpeta) => existsSync(carpeta));
const destinos = existentes.length > 0 ? existentes : [candidatas[0]!];

if (existentes.length === 0) {
  console.log('\nNo encontré la carpeta de Claude Desktop. ¿Ya lo instalaste y lo abriste al menos una vez?');
  console.log(`Voy a crear la configuración de todos modos en:\n  ${destinos[0]}`);
}

for (const carpeta of destinos) {
  const ruta = join(carpeta, ARCHIVO);
  let config: { mcpServers?: Record<string, unknown>; [clave: string]: unknown } = {};

  if (existsSync(ruta)) {
    const contenido = readFileSync(ruta, 'utf8').trim();
    if (contenido !== '') {
      try {
        config = JSON.parse(contenido);
      } catch {
        console.error(`\nEl archivo ya existe pero no es JSON válido, así que no lo toqué:\n  ${ruta}`);
        console.error('Ábrelo, corrige el error (o bórralo) y vuelve a correr este comando.\n');
        process.exit(1);
      }
      copyFileSync(ruta, ruta + '.respaldo');
    }
  } else {
    mkdirSync(carpeta, { recursive: true });
  }

  config.mcpServers = { ...(config.mcpServers ?? {}) };
  if (quitar) delete config.mcpServers[NOMBRE];
  else config.mcpServers[NOMBRE] = entrada;

  writeFileSync(ruta, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log(`\n${quitar ? 'Quitado de' : 'Configurado en'}:\n  ${ruta}`);
}

if (quitar) {
  console.log('\nCierra Claude Desktop por completo y vuelve a abrirlo.\n');
} else {
  console.log('\nEsto es lo que se agregó dentro de "mcpServers":\n');
  console.log(JSON.stringify({ [NOMBRE]: entrada }, null, 2));
  console.log(`\nIndustria activa: ${industriaActiva()}  (se cambia con: npm run industria <nombre>)`);
  console.log('\nAhora:');
  console.log('  1. Cierra Claude Desktop POR COMPLETO (en Windows: clic derecho en el ícono junto al reloj > Salir;');
  console.log('     en Mac: Cmd + Q). Cerrar la ventana no basta.');
  console.log('  2. Ábrelo de nuevo. Tu servidor debe aparecer en el menú de herramientas del chat.');
  console.log('  3. Cada vez que cambies tu código o de industria, repite los pasos 1 y 2.\n');
}
