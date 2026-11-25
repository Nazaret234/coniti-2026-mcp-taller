// RETO — esta tool ya está hecha; actívala en registro.ts para compararla.
//
// Pregúntale a Claude "tengo $90, ¿qué combo de comida y bebida me alcanza?"
//   1. Primero SIN esta tool. Abre los bloques de las tools que llamó: ¿cuántas fueron y cuántos datos leyó?
//   2. Después CON esta tool. ¿Qué cambió en el camino, aunque la respuesta sea la misma?

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { menu, stockDisponible } from '../../datos.ts';

export default definirTool({
  nombre: 'combos_con_presupuesto',
  descripcion:
    'Arma combos de la cafetería (un platillo fuerte + una bebida, y postre si se pide) que cuestan ' +
    'como máximo el presupuesto indicado. Solo usa platillos con porciones disponibles. ' +
    'Regresa los combos que mejor aprovechan el presupuesto, con su total exacto y lo que sobra.',
  entrada: z.object({
    presupuesto: z.number().positive().describe('Dinero disponible, en pesos.'),
    con_postre: z.boolean().default(false).describe('true para incluir un postre en cada combo.'),
  }),
  soloLectura: true,

  ejecutar({ presupuesto, con_postre }) {
    const disponibles = menu.filter((platillo) => stockDisponible(platillo) > 0);
    const fuertes = disponibles.filter((p) => p.categoria !== 'bebida' && p.categoria !== 'postre');
    const bebidas = disponibles.filter((p) => p.categoria === 'bebida');
    const postres = con_postre ? disponibles.filter((p) => p.categoria === 'postre') : [undefined];

    const combos: { platillos: string[]; total: number; sobra: number }[] = [];
    for (const fuerte of fuertes) {
      for (const bebida of bebidas) {
        for (const postre of postres) {
          const total = fuerte.precio + bebida.precio + (postre?.precio ?? 0);
          if (total > presupuesto) continue;
          combos.push({
            platillos: [fuerte.nombre, bebida.nombre, ...(postre ? [postre.nombre] : [])],
            total,
            sobra: presupuesto - total,
          });
        }
      }
    }

    if (combos.length === 0) {
      return { combos: [], mensaje: `Con $${presupuesto} no alcanza para ningún combo.` };
    }
    return { combos: combos.sort((a, b) => a.sobra - b.sobra).slice(0, 5) };
  },
});
