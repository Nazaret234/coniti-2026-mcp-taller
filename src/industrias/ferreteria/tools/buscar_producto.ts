import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { normalizar } from '../../../lib/utilidades.ts';
import { CATEGORIAS, productos, stockDisponible } from '../datos.ts';

export default definirTool({
  nombre: 'buscar_producto',
  descripcion:
    'Busca productos de la ferretería por nombre, categoría o etiqueta (por ejemplo "plomería"). ' +
    'Úsala para conocer el id, el precio y cuántas piezas quedan.',
  entrada: z.object({
    texto: z.string().min(2).describe('Palabra a buscar. No importan mayúsculas ni acentos.'),
  }),
  soloLectura: true,

  ejecutar({ texto }) {
    const buscado = normalizar(texto);
    const encontrados = productos
      .filter((producto) =>
        [producto.nombre, producto.categoria, ...producto.etiquetas].some((campo) => normalizar(campo).includes(buscado)),
      )
      .map((producto) => ({
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precio: producto.precio,
        disponibles: stockDisponible(producto),
        etiquetas: producto.etiquetas,
      }));

    if (encontrados.length === 0) {
      return {
        encontrados: 0,
        sugerencia: `No hay nada con "${texto}". Prueba con una categoría: ${CATEGORIAS.join(', ')}.`,
      };
    }
    return { encontrados: encontrados.length, productos: encontrados };
  },
});
