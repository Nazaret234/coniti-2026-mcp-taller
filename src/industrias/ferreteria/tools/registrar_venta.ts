// CAPA 3 · ESCRIBIR en la ferretería.
//
// Es la misma idea que registrar_pedido en la cafetería, ahora con tus datos.
// Regla de oro: el modelo solo manda QUÉ quiere. El total, la fecha y el id los decide tu código.
//
//   1. Completa los TODO.
//   2. Actívala en ../registro.ts.
//   3. Pruébala:  npm run probar registrar_venta producto_id=1 cantidad=1
//                 npm run probar registrar_venta producto_id=99 cantidad=1     (debe fallar con un mensaje claro)
//   4. Revisa el efecto:  npm run probar buscar_producto texto=plomería
//   5. Para borrar lo que registraste:  npm run reiniciar

import * as z from 'zod';
import { definirTool, ErrorDeTool } from '../../../lib/tool.ts';
import { guardarVenta, productoPorId, stockDisponible } from '../datos.ts';

export default definirTool({
  nombre: 'registrar_venta',

  // TODO 1: describe qué hace y qué necesita. Recuerda decirle al modelo de dónde saca el id.
  descripcion: 'TODO: describe esta tool',

  entrada: z.object({
    producto_id: z.number().int().describe('Id del producto, tal como lo regresa buscar_producto.'),
    cantidad: z.number().int().min(1).max(10).describe('Piezas a vender, de 1 a 10.'),
  }),
  soloLectura: false,

  ejecutar({ producto_id, cantidad }) {
    const producto = productoPorId(producto_id);

    // TODO 2: si no existe, lanza un ErrorDeTool con un mensaje que le sirva al modelo para corregir.
    if (!producto) {
      throw new ErrorDeTool('TODO: escribe un mensaje útil para el modelo');
    }

    // TODO 3: si ya no hay piezas suficientes, lanza otro ErrorDeTool que diga cuántas quedan.
    const disponibles = stockDisponible(producto);

    // TODO 4: guarda con guardarVenta(producto, cantidad) y regresa una confirmación clara.
    return { mensaje: 'TODO: todavía no se guarda nada' };
  },
});
