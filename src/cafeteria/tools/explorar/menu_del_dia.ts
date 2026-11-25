import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { CATEGORIAS, menu, stockDisponible } from '../../datos.ts';

export default definirTool({
  nombre: 'menu_del_dia',
  descripcion:
    'Muestra lo que la cafetería tiene disponible hoy, con precio y porciones restantes. ' +
    'Solo incluye platillos que todavía no se agotan. Se puede limitar a una categoría.',
  entrada: z.object({
    categoria: z.enum(CATEGORIAS).optional().describe('Si se omite, regresa todas las categorías.'),
  }),
  soloLectura: true,

  ejecutar({ categoria }) {
    return menu
      .filter((platillo) => !categoria || platillo.categoria === categoria)
      .map((platillo) => ({
        id: platillo.id,
        nombre: platillo.nombre,
        categoria: platillo.categoria,
        precio: platillo.precio,
        disponibles: stockDisponible(platillo),
      }))
      .filter((platillo) => platillo.disponibles > 0);
  },
});
