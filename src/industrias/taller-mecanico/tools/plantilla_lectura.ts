// PLANTILLA · tool de lectura para el taller mecánico (Capa 2).
//
//   1. Copia este archivo dentro de esta misma carpeta con el nombre de tu tool (por ejemplo mi_tool.ts).
//   2. Cambia el nombre, la descripción, la entrada y el código de ejecutar.
//   3. Actívala en ../registro.ts.
//   4. Pruébala:  npm run probar mi_tool limite=3
//
// ¿No sabes qué construir? Hay ideas en ../LEEME.md

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { ordenesConServicio } from '../datos.ts';

export default definirTool({
  nombre: 'mi_tool',
  descripcion: 'TODO: qué regresa esta tool y cuándo debe usarla el modelo.',
  entrada: z.object({
    limite: z.number().int().min(1).max(20).default(5).describe('Cuántos resultados regresar.'),
  }),
  soloLectura: true,

  ejecutar({ limite }) {
    // Cada orden ya trae su servicio:
    //   orden.servicio.nombre, orden.servicio.categoria, orden.servicio.precio
    //   orden.fecha, orden.hora, orden.total
    const ordenes = ordenesConServicio();

    // Este ejemplo ya funciona: regresa los registros más recientes. Cámbialo por tu lógica.
    return ordenes
      .slice(-limite)
      .reverse()
      .map((orden) => ({
        servicio: orden.servicio.nombre,
        fecha: orden.fecha,
        hora: orden.hora,
        total: orden.total,
      }));
  },
});
