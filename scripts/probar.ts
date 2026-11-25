// Llama una tool desde la terminal, sin Inspector y sin modelo.
//
//   npm run probar                                   lista las tools activas
//   npm run probar buscar_platillo texto=torta       llama una tool
//   npm run probar mas_vendidos limite=3 fecha=2026-11-20

import * as z from 'zod';
import { cargarTools, industriaActiva } from '../src/lib/industria.ts';
import { ErrorDeTool } from '../src/lib/tool.ts';

z.config(z.locales.es());

const industria = industriaActiva();
const tools = await cargarTools(industria);
const [nombre, ...pares] = process.argv.slice(2);

function describirEntrada(esquema: z.ZodObject): string {
  const propiedades = (z.toJSONSchema(esquema, { io: 'input' }).properties ?? {}) as Record<string, { type?: string }>;
  const nombres = Object.keys(propiedades);
  return nombres.length ? nombres.map((n) => `${n}=<${propiedades[n]?.type ?? 'valor'}>`).join(' ') : '(sin parámetros)';
}

if (!nombre) {
  console.log(`\nIndustria activa: ${industria} · ${tools.length} tools\n`);
  for (const tool of tools) {
    console.log(`  ${tool.nombre}  ${describirEntrada(tool.entrada)}`);
    console.log(`      ${tool.descripcion}\n`);
  }
  console.log('Para llamar una:  npm run probar <tool> parametro=valor\n');
  process.exit(0);
}

const tool = tools.find((t) => t.nombre === nombre);
if (!tool) {
  console.error(`\nNo hay una tool activa llamada "${nombre}" en ${industria}.`);
  console.error(`Activas: ${tools.map((t) => t.nombre).join(', ')}`);
  console.error('Si la acabas de crear, revisa que esté en el registro.ts de tu industria.\n');
  process.exit(1);
}

// Convierte  limite=3 texto=torta con_postre=true  en  { limite: 3, texto: 'torta', con_postre: true }
const args: Record<string, unknown> = {};
for (const par of pares) {
  const corte = par.indexOf('=');
  if (corte === -1) {
    console.error(`\nNo entendí "${par}". Los parámetros se escriben así: nombre=valor\n`);
    process.exit(1);
  }
  const valor = par.slice(corte + 1);
  args[par.slice(0, corte)] =
    valor === 'true' ? true : valor === 'false' ? false : /^-?\d+(\.\d+)?$/.test(valor) ? Number(valor) : valor;
}

// Igual que hace el servidor: primero se valida la entrada contra el esquema.
const validacion = tool.entrada.safeParse(args);
if (!validacion.success) {
  console.error('\nLa entrada no cumple el esquema de la tool:');
  for (const problema of validacion.error.issues) {
    console.error(`  - ${problema.path.join('.') || '(entrada)'}: ${problema.message}`);
  }
  console.error(`\nEsperaba:  ${describirEntrada(tool.entrada)}\n`);
  process.exit(1);
}

try {
  const resultado = await tool.ejecutar(validacion.data);
  console.log(typeof resultado === 'string' ? resultado : JSON.stringify(resultado, null, 2));
} catch (error) {
  if (error instanceof ErrorDeTool) {
    console.error(`\nLa tool respondió con un error (esto es lo que leería el modelo):\n  ${error.message}\n`);
    process.exit(1);
  }
  throw error;
}
