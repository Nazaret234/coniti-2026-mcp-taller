import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ToolCualquiera } from './tool.ts';

export const INDUSTRIAS = ['cafeteria', 'ferreteria', 'clinica', 'gimnasio', 'taller-mecanico'] as const;
export type Industria = (typeof INDUSTRIAS)[number];

/** Carpeta raíz del repositorio, sin importar desde dónde se lance el servidor. */
export const RAIZ = join(import.meta.dirname, '..', '..');
const ARCHIVO = join(RAIZ, '.industria');

export function esIndustria(nombre: string): nombre is Industria {
  return (INDUSTRIAS as readonly string[]).includes(nombre);
}

/** Industria con la que trabaja este equipo. Se cambia con: npm run industria <nombre> */
export function industriaActiva(): Industria {
  const elegida = (
    process.env.INDUSTRIA ?? (existsSync(ARCHIVO) ? readFileSync(ARCHIVO, 'utf8') : 'cafeteria')
  ).trim();
  if (!esIndustria(elegida)) {
    throw new Error(`No conozco la industria "${elegida}". Opciones: ${INDUSTRIAS.join(', ')}`);
  }
  return elegida;
}

export function guardarIndustria(nombre: Industria): void {
  writeFileSync(ARCHIVO, nombre + '\n', 'utf8');
}

/** Carga la lista de tools del registro.ts de la industria. */
export async function cargarTools(industria: Industria): Promise<ToolCualquiera[]> {
  const ruta =
    industria === 'cafeteria' ? '../cafeteria/registro.ts' : `../industrias/${industria}/registro.ts`;
  const modulo = (await import(ruta)) as { tools: ToolCualquiera[] };
  return modulo.tools;
}
