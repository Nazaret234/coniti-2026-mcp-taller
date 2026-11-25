// PLANTILLA · tool de lectura para el gimnasio (Capa 2).
//
//   1. Copia este archivo dentro de esta misma carpeta con el nombre de tu tool (por ejemplo mi_tool.ts).
//   2. Cambia el nombre, la descripción, la entrada y el código de ejecutar.
//   3. Actívala en ../registro.ts.
//   4. Pruébala:  npm run probar mi_tool limite=3
//
// ¿No sabes qué construir? Hay ideas en ../LEEME.md

import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { reservasConClase } from '../datos.ts';

export default definirTool({
  nombre: 'mi_tool',
  descripcion: 'TODO: qué regresa esta tool y cuándo debe usarla el modelo.',
  entrada: z.object({
    limite: z.number().int().min(1).max(20).default(5).describe('Cuántos resultados regresar.'),
  }),
  soloLectura: true,

  ejecutar({ limite }) {
    // Cada reserva ya trae su clase:
    //   reserva.clase.nombre, reserva.clase.categoria, reserva.clase.precio
    //   reserva.fecha, reserva.hora, reserva.total, reserva.cantidad
    const reservas = reservasConClase();

    // Este ejemplo ya funciona: regresa los registros más recientes. Cámbialo por tu lógica.
    return reservas
      .slice(-limite)
      .reverse()
      .map((reserva) => ({
        clase: reserva.clase.nombre,
        fecha: reserva.fecha,
        hora: reserva.hora,
        total: reserva.total,
      }));
  },
});
