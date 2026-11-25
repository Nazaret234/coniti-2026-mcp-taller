// CAPA 2 · CONSTRUIR — tu primera tool.
//
// Meta: que el modelo pueda responder "¿cuánto dinero entró por desayunos?" o
// "¿qué categoría deja más ingreso?".
//
// Pasos:
//   1. Completa los tres TODO de abajo.
//   2. Actívala en src/cafeteria/registro.ts (quita las // de su línea).
//   3. Pruébala:  npm run probar ingreso_por_categoria
//                 npm run probar ingreso_por_categoria fecha=2026-11-20
//   4. Reinicia el Inspector y llámala desde ahí.
//
// Si te atoras, la respuesta está en ingreso_por_categoria.solucion.ts

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { pedidosConPlatillo } from '../../datos.ts';

export default definirTool({
  nombre: 'ingreso_por_categoria',

  // TODO 1: escribe una descripción que le diga al modelo QUÉ regresa la tool y CUÁNDO usarla.
  descripcion: 'TODO: describe esta tool',

  entrada: z.object({
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
      .optional()
      .describe('Día a consultar, en formato AAAA-MM-DD. Si se omite, toma todos los días.'),
  }),
  soloLectura: true,

  ejecutar({ fecha }) {
    // Cada pedido ya trae su platillo: pedido.platillo.categoria, pedido.total, pedido.fecha...
    const pedidos = pedidosConPlatillo();

    // TODO 2: si llegó una fecha, quédate solo con los pedidos de ese día.
    //         Pista: pedidos.filter((pedido) => ...)
    const delDia = pedidos;

    // TODO 3: suma el total de cada pedido en su categoría.
    //         Pista: ingresos[categoria] = (ingresos[categoria] ?? 0) + pedido.total
    const ingresos: Record<string, number> = {};
    for (const pedido of delDia) {
      // tu código aquí
    }

    // Convertimos { desayuno: 1200, ... } en una lista ordenada de mayor a menor ingreso.
    return Object.entries(ingresos)
      .map(([categoria, ingreso]) => ({ categoria, ingreso }))
      .sort((a, b) => b.ingreso - a.ingreso);
  },
});
