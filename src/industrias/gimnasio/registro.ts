// La lista de tools que el servidor ofrece para el gimnasio.
// Cuando tu equipo termine una tool: quita las // de su import y de su línea en la lista.

import buscar_clase from './tools/buscar_clase.ts';
// import mi_tool from './tools/mi_tool.ts';
// import reservar_clase from './tools/reservar_clase.ts';
import type { ToolCualquiera } from '../../lib/tool.ts';

export const tools: ToolCualquiera[] = [
  buscar_clase,

  // Capa 2 · Construir: las tools de lectura de tu equipo
  // mi_tool,

  // Capa 3 · Escribir
  // reservar_clase,
];
