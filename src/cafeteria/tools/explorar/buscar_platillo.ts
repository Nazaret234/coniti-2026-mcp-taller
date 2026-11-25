import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { normalizar } from '../../../lib/utilidades.ts';
import { CATEGORIAS, menu, stockDisponible } from '../../datos.ts';

export default definirTool({
  nombre: 'buscar_platillo',
  descripcion:
    'Busca platillos y bebidas en el menú de la cafetería del campus. ' +
    'Compara el texto contra el nombre, la categoría y las etiquetas (por ejemplo "torta", "bebida" o "vegetariano"). ' +
    'Úsala para conocer el id, el precio y cuántas porciones quedan de un platillo.',
  entrada: z.object({
    texto: z.string().min(2).describe('Palabra a buscar. No importan mayúsculas ni acentos.'),
  }),
  soloLectura: true,

  ejecutar({ texto }) {
    const buscado = normalizar(texto);
    const platillos = menu
      .filter((platillo) =>
        [platillo.nombre, platillo.categoria, ...platillo.etiquetas].some((campo) =>
          normalizar(campo).includes(buscado),
        ),
      )
      .map((platillo) => ({
        id: platillo.id,
        nombre: platillo.nombre,
        categoria: platillo.categoria,
        precio: platillo.precio,
        disponibles: stockDisponible(platillo),
        etiquetas: platillo.etiquetas,
      }));

    if (platillos.length === 0) {
      return {
        encontrados: 0,
        sugerencia: `No hay nada con "${texto}". Prueba con una categoría: ${CATEGORIAS.join(', ')}.`,
      };
    }
    return { encontrados: platillos.length, platillos };
  },
});
