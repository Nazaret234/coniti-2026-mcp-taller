// CAPA 3 · ESCRIBIR — tu primera tool que modifica datos.
//
// Hasta ahora tus tools solo consultaban. Esta guarda un pedido nuevo.
//
// Regla de oro: el modelo solo manda QUÉ quiere (platillo y cantidad).
// El precio, el total, la fecha y el id los decide tu código. Nunca se los pidas al modelo.
//
// Pasos:
//   1. Completa los tres TODO de abajo.
//   2. Actívala en src/cafeteria/registro.ts.
//   3. Pruébala:  npm run probar registrar_pedido platillo_id=11 cantidad=2
//                 npm run probar registrar_pedido platillo_id=99 cantidad=1     (debe fallar con un mensaje claro)
//                 npm run probar registrar_pedido platillo_id=11 cantidad=9     (debe fallar: no alcanza)
//   4. Revisa el efecto:  npm run probar buscar_platillo texto=milanesa
//   5. Para borrar lo que registraste:  npm run reiniciar
//
// Si te atoras, la respuesta está en registrar_pedido.solucion.ts

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

    // TODO 1: si el platillo no existe, lanza un ErrorDeTool.
    //         El mensaje lo va a leer el modelo: dile qué salió mal y qué puede hacer.
    //         Ejemplo: throw new ErrorDeTool('No existe ... Usa buscar_platillo para ...');
    if (!platillo) {
      throw new ErrorDeTool('TODO: escribe un mensaje útil para el modelo');
    }

    // TODO 2: si no alcanzan las porciones, lanza otro ErrorDeTool que diga cuántas quedan.
    const disponibles = stockDisponible(platillo);

    // TODO 3: guarda el pedido con guardarPedido(platillo, cantidad) y regresa una confirmación.
    //         Una buena confirmación incluye el pedido guardado y cuántas porciones quedan.
    return { mensaje: 'TODO: todavía no se guarda nada' };
  },
});
