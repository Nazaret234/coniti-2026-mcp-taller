// PLANTILLA · tool de lectura para la clínica (Capa 2).
//
//   1. Copia este archivo dentro de esta misma carpeta con el nombre de tu tool (por ejemplo mi_tool.ts).
//   2. Cambia el nombre, la descripción, la entrada y el código de ejecutar.
//   3. Actívala en ../registro.ts.
//   4. Pruébala:  npm run probar mi_tool limite=3
//
// ¿No sabes qué construir? Hay ideas en ../LEEME.md

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { citasConServicio } from '../datos.ts';

export default definirTool({
  nombre: 'mi_tool',
  descripcion: 'TODO: qué regresa esta tool y cuándo debe usarla el modelo.',
  entrada: z.object({
    limite: z.number().int().min(1).max(20).default(5).describe('Cuántos resultados regresar.'),
  }),
  soloLectura: true,

  ejecutar({ limite }) {
    // Cada cita ya trae su servicio:
    //   cita.servicio.nombre, cita.servicio.categoria, cita.servicio.precio
    //   cita.fecha, cita.hora, cita.total
    const citas = citasConServicio();

    // Este ejemplo ya funciona: regresa los registros más recientes. Cámbialo por tu lógica.
    return citas
      .slice(-limite)
      .reverse()
      .map((cita) => ({
        servicio: cita.servicio.nombre,
        fecha: cita.fecha,
        hora: cita.hora,
        total: cita.total,
      }));
  },
});
