import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { normalizar } from '../../../lib/utilidades.ts';
import { CATEGORIAS, clases, cuposDisponibles } from '../datos.ts';

export default definirTool({
  nombre: 'buscar_clase',
  descripcion:
    'Busca clases del gimnasio por nombre, categoría o etiqueta (por ejemplo "principiante"). ' +
    'Úsala para conocer el id, el precio y cuántos lugares quedan.',
  entrada: z.object({
    texto: z.string().min(2).describe('Palabra a buscar. No importan mayúsculas ni acentos.'),
  }),
  soloLectura: true,

  ejecutar({ texto }) {
    const buscado = normalizar(texto);
    const encontrados = clases
      .filter((clase) =>
        [clase.nombre, clase.categoria, ...clase.etiquetas].some((campo) => normalizar(campo).includes(buscado)),
      )
      .map((clase) => ({
        id: clase.id,
        nombre: clase.nombre,
        categoria: clase.categoria,
        precio: clase.precio,
        disponibles: cuposDisponibles(clase),
        etiquetas: clase.etiquetas,
      }));

    if (encontrados.length === 0) {
      return {
        encontrados: 0,
        sugerencia: `No hay nada con "${texto}". Prueba con una categoría: ${CATEGORIAS.join(', ')}.`,
      };
    }
    return { encontrados: encontrados.length, clases: encontrados };
  },
});
