// La lista de tools que el servidor ofrece para la ferretería.
// Cuando tu equipo termine una tool: quita las // de su import y de su línea en la lista.

import buscar_producto from './tools/buscar_producto.ts';
// import mi_tool from './tools/mi_tool.ts';
// import registrar_venta from './tools/registrar_venta.ts';
import type { ToolCualquiera } from '../../lib/tool.ts';

export const tools: ToolCualquiera[] = [
  buscar_producto,

  // Capa 2 · Construir: las tools de lectura de tu equipo
  // mi_tool,

  // Capa 3 · Escribir
  // registrar_venta,
];
