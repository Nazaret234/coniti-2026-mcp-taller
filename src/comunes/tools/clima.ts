// Una tool que no lee archivos: consulta una API pública en internet.
// Funciona igual en cualquier industria. Se activa en src/comunes/registro.ts
//
// Usa Open-Meteo (https://open-meteo.com), que es gratis y no pide llave. Hace dos consultas:
//   1. Busca la ciudad para obtener su latitud y longitud.
//   2. Pide el clima de esas coordenadas.
//
// Pruébala:  npm run probar clima ciudad=Monterrey

import * as z from 'zod';
import { definirTool, ErrorDeTool } from '../../lib/tool.ts';

/** Hace una consulta a internet y regresa el JSON. Si algo falla, lanza un error que el modelo entienda. */
async function consultar(url: string): Promise<any> {
  let respuesta: Response;
  try {
    // Si el servicio no contesta en 8 segundos, nos rendimos.
    respuesta = await fetch(url, { signal: AbortSignal.timeout(8000) });
  } catch {
    throw new ErrorDeTool(
      'No se pudo consultar el clima: no hay conexión a internet o el servicio no respondió a tiempo. ' +
        'Dile a la persona que por ahora no tienes el dato y no lo inventes.',
    );
  }
  if (!respuesta.ok) {
    throw new ErrorDeTool(`El servicio del clima respondió con un error (${respuesta.status}). Intenta de nuevo en un momento.`);
  }
  return respuesta.json();
}

/** Open-Meteo describe el cielo con un número (código WMO). Lo traducimos a palabras. */
function describirCielo(codigo: number): string {
  if (codigo === 0) return 'despejado';
  if (codigo <= 3) return 'parcialmente nublado';
  if (codigo <= 48) return 'niebla';
  if (codigo <= 57) return 'llovizna';
  if (codigo <= 67) return 'lluvia';
  if (codigo <= 77) return 'nieve';
  if (codigo <= 82) return 'chubascos';
  if (codigo <= 86) return 'nevadas';
  return 'tormenta eléctrica';
}

export default definirTool({
  nombre: 'clima',
  descripcion:
    'Consulta en internet el clima actual de una ciudad: temperatura, cómo está el cielo, ' +
    'y la máxima, mínima y probabilidad de lluvia de hoy. Necesita conexión a internet. ' +
    'La respuesta dice qué lugar encontró: si no es el que se pidió, vuelve a llamarla con el nombre oficial completo.',
  entrada: z.object({
    ciudad: z
      .string()
      .min(2)
      .describe('Solo el nombre de la ciudad, sin estado ni país, por ejemplo "Monterrey". Si hay varias, se elige la más poblada de México.'),
  }),
  soloLectura: true,

  async ejecutar({ ciudad }) {
    // 1. ¿Dónde está la ciudad? Hay muchas con el mismo nombre: preferimos las de México y, de ellas, la más poblada.
    const busqueda = await consultar(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=10&language=es`,
    );
    const lugares: any[] = busqueda.results ?? [];
    const deMexico = lugares.filter((l) => l.country_code === 'MX');
    const candidatos = deMexico.length > 0 ? deMexico : lugares;
    const lugar = candidatos.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))[0];
    if (!lugar) {
      throw new ErrorDeTool(`No encontré la ciudad "${ciudad}". Pide a la persona el nombre completo, sin abreviaturas.`);
    }

    // 2. ¿Qué clima hay ahí?
    const clima = await consultar(
      `https://api.open-meteo.com/v1/forecast?latitude=${lugar.latitude}&longitude=${lugar.longitude}` +
        '&current=temperature_2m,weather_code' +
        '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
        '&forecast_days=1&timezone=auto',
    );

    return {
      lugar: [lugar.name, lugar.admin1, lugar.country].filter(Boolean).join(', '),
      ahora: {
        temperatura_c: clima.current.temperature_2m,
        cielo: describirCielo(clima.current.weather_code),
      },
      hoy: {
        maxima_c: clima.daily.temperature_2m_max[0],
        minima_c: clima.daily.temperature_2m_min[0],
        probabilidad_lluvia_pct: clima.daily.precipitation_probability_max[0],
      },
    };
  },
});
