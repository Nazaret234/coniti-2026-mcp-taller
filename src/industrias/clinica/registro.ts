// La lista de tools que el servidor ofrece para la clínica.
// Cuando tu equipo termine una tool: quita las // de su import y de su línea en la lista.

import buscar_servicio from './tools/buscar_servicio.ts';
// import mi_tool from './tools/mi_tool.ts';
// import agendar_cita from './tools/agendar_cita.ts';
import type { ToolCualquiera } from '../../lib/tool.ts';

export const tools: ToolCualquiera[] = [
  buscar_servicio,

  // Capa 2 · Construir: las tools de lectura de tu equipo
  // mi_tool,

  // Capa 3 · Escribir
  // agendar_cita,
];
