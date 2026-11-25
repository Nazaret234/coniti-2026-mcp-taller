// Verifica que tu laptop está lista para el taller:  npm run check
// Está escrito en JavaScript sencillo a propósito: debe poder correr aunque tu Node sea viejo.

import { spawn } from 'node:child_process';
import { existsSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir, platform, arch } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const RUTA_SUGERIDA = platform() === 'win32' ? 'C:\\taller-mcp' : '~/taller-mcp';
let fallas = 0;
let avisos = 0;

function ok(texto) {
  console.log('  [OK]     ' + texto);
}
function falla(texto, solucion) {
  fallas++;
  console.log('  [FALLA]  ' + texto);
  console.log('           -> ' + solucion);
}
function aviso(texto, solucion) {
  avisos++;
  console.log('  [AVISO]  ' + texto);
  console.log('           -> ' + solucion);
}

console.log('');
console.log('Taller MCP · CONITI 2026 — verificación');
console.log('');

// 1. Versión de Node: desde la 22.12 puede ejecutar TypeScript con la bandera de abajo;
//    desde la 22.18 ya lo hace sola y la bandera no estorba.
const BANDERAS = ['--experimental-strip-types', '--disable-warning=ExperimentalWarning'];
const [mayor, menor] = process.versions.node.split('.').map(Number);
const nodeOk = mayor > 22 || (mayor === 22 && menor >= 12);
if (nodeOk) {
  ok('Node ' + process.version);
} else {
  falla(
    'Tienes Node ' + process.version + ' y se necesita la 22.12 o superior',
    'Instala la versión LTS desde https://nodejs.org (o con el instalador del USB), cierra la terminal y vuelve a intentar.',
  );
}

// 2. Dependencias.
const paquetes = ['@modelcontextprotocol/server', 'zod', '@modelcontextprotocol/inspector'];
const faltantes = paquetes.filter((p) => !existsSync(join(RAIZ, 'node_modules', p, 'package.json')));
if (faltantes.length === 0) {
  ok('Dependencias instaladas');
} else {
  falla('Faltan dependencias: ' + faltantes.join(', '), 'Corre "npm install" en esta carpeta (o copia node_modules del USB).');
}

// 3. Carpeta: rutas con espacios, acentos o OneDrive dan problemas.
if (/onedrive/i.test(RAIZ)) {
  aviso('El proyecto está dentro de OneDrive: ' + RAIZ, 'Muévelo a una carpeta corta, por ejemplo ' + RUTA_SUGERIDA);
} else if (/[^\x20-\x7e]/.test(RAIZ) || RAIZ.includes(' ')) {
  aviso('La ruta tiene espacios o acentos: ' + RAIZ, 'Si algo falla, mueve el proyecto a una ruta corta, por ejemplo ' + RUTA_SUGERIDA);
} else {
  ok('Ruta del proyecto: ' + RAIZ);
}

// 4. Permiso de escritura (lo necesita la Capa 3).
try {
  const prueba = join(RAIZ, 'src', '.prueba-de-escritura');
  writeFileSync(prueba, 'ok');
  unlinkSync(prueba);
  ok('Se puede escribir en la carpeta del proyecto');
} catch (error) {
  falla('No se puede escribir en la carpeta del proyecto', 'Mueve el proyecto a una carpeta tuya, por ejemplo ' + RUTA_SUGERIDA);
}

// 5. El servidor arranca y responde por MCP.
function probarServidor() {
  return new Promise((resolve) => {
    const hijo = spawn(process.execPath, [...BANDERAS, join(RAIZ, 'src', 'servidor.ts')], {
      cwd: RAIZ,
      env: Object.assign({}, process.env, { INDUSTRIA: 'cafeteria' }),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let salida = '';
    let errores = '';
    let terminado = false;
    const terminar = (resultado) => {
      if (terminado) return;
      terminado = true;
      clearTimeout(reloj);
      hijo.kill();
      resolve(resultado);
    };
    const reloj = setTimeout(() => terminar({ error: 'No respondió en 10 segundos. ' + errores.trim() }), 10000);

    hijo.stderr.on('data', (d) => (errores += d));
    hijo.on('error', (e) => terminar({ error: e.message }));
    hijo.on('exit', () => terminar({ error: 'El servidor se cerró. ' + errores.trim().split('\n').slice(0, 3).join(' ') }));
    hijo.stdout.on('data', (d) => {
      salida += d;
      for (const linea of salida.split('\n')) {
        try {
          const mensaje = JSON.parse(linea);
          if (mensaje.id === 2 && mensaje.result) terminar({ tools: mensaje.result.tools.map((t) => t.name) });
        } catch (e) {
          // línea incompleta: esperamos más datos
        }
      }
    });

    const enviar = (mensaje) => hijo.stdin.write(JSON.stringify(mensaje) + '\n');
    enviar({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'check', version: '1.0.0' } },
    });
    enviar({ jsonrpc: '2.0', method: 'notifications/initialized' });
    enviar({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  });
}

let resumenTools = '';
if (nodeOk && faltantes.length === 0) {
  const resultado = await probarServidor();
  if (resultado.tools && resultado.tools.length >= 3) {
    resumenTools = resultado.tools.length + ' tools';
    ok('El servidor MCP responde con ' + resultado.tools.length + ' tools: ' + resultado.tools.join(', '));
  } else {
    falla('El servidor MCP no respondió bien', resultado.error || 'Avísale al instructor y enséñale este mensaje.');
  }
} else {
  console.log('  [ -- ]   Servidor MCP: se probará cuando lo de arriba esté resuelto');
}

// 6. Claude Desktop (solo informativo; se usa hasta la Capa 4).
function hayClaudeDesktop() {
  if (platform() === 'darwin') return existsSync(join(homedir(), 'Library', 'Application Support', 'Claude'));
  if (platform() === 'win32') {
    if (existsSync(join(process.env.APPDATA || '', 'Claude'))) return true;
    // Instalado desde Microsoft Store
    const paquetes = join(process.env.LOCALAPPDATA || '', 'Packages');
    return existsSync(paquetes) && readdirSync(paquetes).some((p) => p.toLowerCase().startsWith('claude'));
  }
  return existsSync(join(homedir(), '.config', 'Claude'));
}
if (hayClaudeDesktop()) {
  ok('Claude Desktop detectado');
} else {
  aviso(
    'No encontré Claude Desktop',
    'Instálalo desde https://claude.ai/download e inicia sesión. Si usas Linux, usarás VS Code + Copilot.',
  );
}

console.log('');
if (fallas === 0) {
  console.log('LISTO PARA EL TALLER · Node ' + process.version + ' · ' + platform() + '-' + arch() + (resumenTools ? ' · ' + resumenTools : ''));
  if (avisos > 0) console.log('(Revisa los avisos de arriba, no son urgentes.)');
} else {
  console.log('TODAVÍA NO: hay ' + fallas + ' punto(s) por resolver. Corrige y vuelve a correr "npm run check".');
}
console.log('');
process.exit(fallas === 0 ? 0 : 1);
