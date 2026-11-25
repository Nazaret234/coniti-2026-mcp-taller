import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { pedidosConPlatillo } from '../../datos.ts';

export default definirTool({
  nombre: 'mas_vendidos',
  // Capa 4: esta descripción es pobre a propósito. Ahí la vas a mejorar y verás la diferencia.
  descripcion: 'Regresa los más vendidos.',
  entrada: z.object({
    limite: z.number().int().min(1).max(25).default(5).describe('Cuántos platillos regresar.'),
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
      .optional()
      .describe('Día a consultar, en formato AAAA-MM-DD. Si se omite, toma todos los días.'),
  }),
  soloLectura: true,

  ejecutar({ limite, fecha }) {
    const pedidos = pedidosConPlatillo().filter((pedido) => !fecha || pedido.fecha === fecha);

    // Sumamos unidades e ingreso por platillo.
    const porPlatillo = new Map<number, { platillo: string; categoria: string; unidades: number; ingreso: number }>();
    for (const pedido of pedidos) {
      const acumulado = porPlatillo.get(pedido.platillo_id) ?? {
        platillo: pedido.platillo.nombre,
        categoria: pedido.platillo.categoria,
        unidades: 0,
        ingreso: 0,
      };
      acumulado.unidades += pedido.cantidad;
      acumulado.ingreso += pedido.total;
      porPlatillo.set(pedido.platillo_id, acumulado);
    }

    return [...porPlatillo.values()].sort((a, b) => b.unidades - a.unidades).slice(0, limite);
  },
});
