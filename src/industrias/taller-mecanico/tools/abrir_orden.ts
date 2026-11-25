// CAPA 3 · ESCRIBIR en el taller mecánico.
//
// Es la misma idea que registrar_pedido en la cafetería, ahora con tus datos.
// Regla de oro: el modelo solo manda QUÉ quiere. El total, la fecha y el id los decide tu código.
//
//   1. Completa los TODO.
//   2. Actívala en ../registro.ts.
//   3. Pruébala:  npm run probar abrir_orden servicio_id=1
//                 npm run probar abrir_orden servicio_id=99     (debe fallar con un mensaje claro)
//   4. Revisa el efecto:  npm run probar buscar_servicio texto=frenos
//   5. Para borrar lo que registraste:  npm run reiniciar

import * as z from 'zod';
import { definirTool, ErrorDeTool } from '../../../lib/tool.ts';
import { guardarOrden, servicioPorId, cuposDisponibles } from '../datos.ts';

export default definirTool({
  nombre: 'abrir_orden',

  // TODO 1: describe qué hace y qué necesita. Recuerda decirle al modelo de dónde saca el id.
  descripcion: 'TODO: describe esta tool',

  entrada: z.object({
    servicio_id: z.number().int().describe('Id del servicio, tal como lo regresa buscar_servicio.'),
  }),
  soloLectura: false,

  ejecutar({ servicio_id }) {
    const servicio = servicioPorId(servicio_id);

    // TODO 2: si no existe, lanza un ErrorDeTool con un mensaje que le sirva al modelo para corregir.
    if (!servicio) {
      throw new ErrorDeTool('TODO: escribe un mensaje útil para el modelo');
    }

    // TODO 3: si ya no hay lugares suficientes, lanza otro ErrorDeTool que diga cuántos quedan.
    const disponibles = cuposDisponibles(servicio);

    // TODO 4: guarda con guardarOrden(servicio) y regresa una confirmación clara.
    return { mensaje: 'TODO: todavía no se guarda nada' };
  },
});
