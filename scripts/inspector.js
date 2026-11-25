// Abre el MCP Inspector conectado a tu servidor:  npm run inspector
// El Inspector es un cliente MCP con interfaz web: te deja llamar tus tools a mano, sin modelo y sin internet.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const inspector = join(RAIZ, 'node_modules', '@modelcontextprotocol', 'inspector', 'cli', 'build', 'cli.js');

if (!existsSync(inspector)) {
  console.error('No encontré el Inspector. Corre "npm install" (o copia node_modules del USB).');
  process.exit(1);
}

console.log('Abriendo el Inspector... (para cerrarlo: Ctrl + C)');
console.log('Cuando cambies tu código, usa el botón "Restart" o "Reconnect" del Inspector para recargar el servidor.\n');

// Le decimos al Inspector cómo lanzar el servidor desde la raíz del proyecto.
// Las dos banderas permiten que cualquier Node 22.12 o superior ejecute TypeScript sin avisos.
const servidor = ['node', '--experimental-strip-types', '--disable-warning=ExperimentalWarning', 'src/servidor.ts'];
const proceso = spawn(process.execPath, [inspector, '--', ...servidor], { cwd: RAIZ, stdio: 'inherit' });
proceso.on('exit', (codigo) => process.exit(codigo ?? 0));
