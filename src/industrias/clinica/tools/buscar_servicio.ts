import * as z from 'zod';
import { definirTool } from '../../../lib/tool.ts';
import { normalizar } from '../../../lib/utilidades.ts';
import { CATEGORIAS, servicios, cuposDisponibles } from '../datos.ts';

export default definirTool({
  nombre: 'buscar_servicio',
  descripcion:
    'Busca servicios de la clínica por nombre, categoría o etiqueta (por ejemplo "laboratorio"). ' +
    'Úsala para conocer el id, el precio y cuántos lugares quedan.',
  entrada: z.object({
    texto: z.string().min(2).describe('Palabra a buscar. No importan mayúsculas ni acentos.'),
  }),
  soloLectura: true,

  ejecutar({ texto }) {
    const buscado = normalizar(texto);
    const encontrados = servicios
      .filter((servicio) =>
        [servicio.nombre, servicio.categoria, ...servicio.etiquetas].some((campo) => normalizar(campo).includes(buscado)),
      )
      .map((servicio) => ({
        id: servicio.id,
        nombre: servicio.nombre,
        categoria: servicio.categoria,
        precio: servicio.precio,
        disponibles: cuposDisponibles(servicio),
        etiquetas: servicio.etiquetas,
      }));

    if (encontrados.length === 0) {
      return {
        encontrados: 0,
        sugerencia: `No hay nada con "${texto}". Prueba con una categoría: ${CATEGORIAS.join(', ')}.`,
      };
    }
    return { encontrados: encontrados.length, servicios: encontrados };
  },
});
