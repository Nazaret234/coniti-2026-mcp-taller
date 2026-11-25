// Solución de la Capa 2. Para usarla sin escribirla, cambia en src/cafeteria/registro.ts
// el import de ingreso_por_categoria.ts por ingreso_por_categoria.solucion.ts

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { pedidosConPlatillo } from '../../datos.ts';

export default definirTool({
  nombre: 'ingreso_por_categoria',
  descripcion:
    'Calcula cuánto dinero (en pesos) ingresó a la cafetería por cada categoría del menú: ' +
    'desayuno, comida, antojito, bebida y postre. Regresa la lista ordenada de mayor a menor ingreso. ' +
    'Úsala para preguntas sobre ventas en dinero por tipo de producto, de un día o de toda la semana.',
  entrada: z.object({
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
      .optional()
      .describe('Día a consultar, en formato AAAA-MM-DD. Si se omite, toma todos los días.'),
  }),
  soloLectura: true,

  ejecutar({ fecha }) {
    const pedidos = pedidosConPlatillo();

    const delDia = fecha ? pedidos.filter((pedido) => pedido.fecha === fecha) : pedidos;

    const ingresos: Record<string, number> = {};
    for (const pedido of delDia) {
      const categoria = pedido.platillo.categoria;
      ingresos[categoria] = (ingresos[categoria] ?? 0) + pedido.total;
    }

    return Object.entries(ingresos)
      .map(([categoria, ingreso]) => ({ categoria, ingreso }))
      .sort((a, b) => b.ingreso - a.ingreso);
  },
});
