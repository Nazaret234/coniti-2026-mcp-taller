// Solución de la Capa 3. Para usarla sin escribirla, cambia en src/cafeteria/registro.ts
// el import de registrar_pedido.ts por registrar_pedido.solucion.ts

import * as z from 'zod';
import { definirTool, ErrorDeTool } from '../../../lib/tool.ts';
import { guardarPedido, platilloPorId, stockDisponible } from '../../datos.ts';

export default definirTool({
  nombre: 'registrar_pedido',
  descripcion:
    'Registra un pedido nuevo en la cafetería y descuenta las porciones. ' +
    'Necesita el id del platillo: si solo tienes el nombre, primero usa buscar_platillo.',
  entrada: z.object({
    platillo_id: z.number().int().describe('Id del platillo, tal como lo regresa buscar_platillo.'),
    cantidad: z.number().int().min(1).max(10).describe('Porciones a pedir, de 1 a 10.'),
  }),
  soloLectura: false,

  ejecutar({ platillo_id, cantidad }) {
    const platillo = platilloPorId(platillo_id);
    if (!platillo) {
      throw new ErrorDeTool(
        `No existe un platillo con id ${platillo_id}. Usa buscar_platillo para encontrar el id correcto.`,
      );
    }

    const disponibles = stockDisponible(platillo);
    if (cantidad > disponibles) {
      throw new ErrorDeTool(
        `No alcanza: de "${platillo.nombre}" quedan ${disponibles} porciones y se pidieron ${cantidad}. ` +
          'Ofrece una cantidad menor u otro platillo.',
      );
    }

    // Para pensar en la Capa 4: ¿qué pasa si el modelo llama esta tool dos veces con lo mismo?
    const pedido = guardarPedido(platillo, cantidad);
    return {
      mensaje: `Pedido #${pedido.id} registrado: ${cantidad} × ${platillo.nombre} por $${pedido.total}.`,
      pedido,
      porciones_restantes: disponibles - cantidad,
    };
  },
});
