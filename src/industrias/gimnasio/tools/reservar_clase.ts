// CAPA 3 · ESCRIBIR en el gimnasio.
//
// Es la misma idea que registrar_pedido en la cafetería, ahora con tus datos.
// Regla de oro: el modelo solo manda QUÉ quiere. El total, la fecha y el id los decide tu código.
//
//   1. Completa los TODO.
//   2. Actívala en ../registro.ts.
//   3. Pruébala:  npm run probar reservar_clase clase_id=1 cantidad=1
//                 npm run probar reservar_clase clase_id=99 cantidad=1     (debe fallar con un mensaje claro)
//   4. Revisa el efecto:  npm run probar buscar_clase texto=principiante
//   5. Para borrar lo que registraste:  npm run reiniciar

import * as z from 'zod';
import { definirTool, ErrorDeTool } from '../../../lib/tool.ts';
import { guardarReserva, clasePorId, cuposDisponibles } from '../datos.ts';

export default definirTool({
  nombre: 'reservar_clase',

  // TODO 1: describe qué hace y qué necesita. Recuerda decirle al modelo de dónde saca el id.
  descripcion: 'TODO: describe esta tool',

  entrada: z.object({
    clase_id: z.number().int().describe('Id de la clase, tal como lo regresa buscar_clase.'),
    cantidad: z.number().int().min(1).max(10).describe('Lugares a reservar, de 1 a 10.'),
  }),
  soloLectura: false,

  ejecutar({ clase_id, cantidad }) {
    const clase = clasePorId(clase_id);

    // TODO 2: si no existe, lanza un ErrorDeTool con un mensaje que le sirva al modelo para corregir.
    if (!clase) {
      throw new ErrorDeTool('TODO: escribe un mensaje útil para el modelo');
    }

    // TODO 3: si ya no hay lugares suficientes, lanza otro ErrorDeTool que diga cuántos quedan.
    const disponibles = cuposDisponibles(clase);

    // TODO 4: guarda con guardarReserva(clase, cantidad) y regresa una confirmación clara.
    return { mensaje: 'TODO: todavía no se guarda nada' };
  },
});
