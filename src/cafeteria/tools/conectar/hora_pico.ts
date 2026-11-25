// CAPA 4 · CONECTAR — esta tool ya está hecha; actívala en registro.ts cuando llegues al experimento.
//
// Experimento: pregúntale a Claude "¿a qué hora se junta más gente en la cafetería?"
//   1. Primero SIN esta tool. ¿Qué respondió? ¿Con qué datos?
//   2. Después CON esta tool. ¿Qué cambió?

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { pedidos } from '../../datos.ts';

export default definirTool({
  nombre: 'hora_pico',
  descripcion:
    'Cuenta los pedidos de la cafetería por hora del día y los regresa ordenados de la hora con más pedidos a la de menos. ' +
    'Úsala para preguntas sobre horas pico, horarios con más gente o cuándo conviene ir. Se puede limitar a un día.',
  entrada: z.object({
    fecha: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Usa el formato AAAA-MM-DD')
      .optional()
      .describe('Día a consultar, en formato AAAA-MM-DD. Si se omite, toma todos los días.'),
  }),
  soloLectura: true,

  ejecutar({ fecha }) {
    const delDia = pedidos().filter((pedido) => !fecha || pedido.fecha === fecha);

    // De "13:42" nos quedamos con "13" y contamos cuántos pedidos hubo en cada hora.
    const porHora: Record<string, number> = {};
    for (const pedido of delDia) {
      const hora = pedido.hora.slice(0, 2);
      porHora[hora] = (porHora[hora] ?? 0) + 1;
    }

    return Object.entries(porHora)
      .map(([hora, cantidad]) => ({ hora: `${hora}:00`, pedidos: cantidad }))
      .sort((a, b) => b.pedidos - a.pedidos);
  },
});
