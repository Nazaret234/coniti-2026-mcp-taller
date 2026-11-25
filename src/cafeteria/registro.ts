// La lista de tools que el servidor ofrece para la cafetería.
// Para activar una tool, quita las dos diagonales del inicio de su línea y reinicia el servidor.

import buscar_platillo from './tools/explorar/buscar_platillo.ts';
import menu_del_dia from './tools/explorar/menu_del_dia.ts';
import mas_vendidos from './tools/explorar/mas_vendidos.ts';
import ingreso_por_categoria from './tools/construir/ingreso_por_categoria.ts';
import registrar_pedido from './tools/escribir/registrar_pedido.ts';
import hora_pico from './tools/conectar/hora_pico.ts';
import combos_con_presupuesto from './tools/conectar/combos_con_presupuesto.ts';
import type { ToolCualquiera } from '../lib/tool.ts';

export const tools: ToolCualquiera[] = [
  // Capa 1 · Explorar
  buscar_platillo,
  menu_del_dia,
  mas_vendidos,

  // Capa 2 · Construir
  // ingreso_por_categoria,

  // Capa 3 · Escribir
  // registrar_pedido,

  // Capa 4 · Conectar
  // hora_pico,

  // Reto
  // combos_con_presupuesto,
];
