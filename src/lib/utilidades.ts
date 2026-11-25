import { appendFileSync, existsSync, readFileSync } from 'node:fs';

/** Lee un archivo JSON completo. */
export function leerJson<T>(ruta: string): T {
  return JSON.parse(readFileSync(ruta, 'utf8')) as T;
}

/**
 * Lee un archivo con un registro JSON por línea (.jsonl).
 * Si el archivo todavía no existe, regresa una lista vacía.
 */
export function leerLineas<T>(ruta: string): T[] {
  if (!existsSync(ruta)) return [];
  return readFileSync(ruta, 'utf8')
    .split('\n')
    .filter((linea) => linea.trim() !== '')
    .map((linea) => JSON.parse(linea) as T);
}

/** Agrega un registro al final del archivo, sin tocar lo que ya había. */
export function agregarLinea(ruta: string, registro: object): void {
  appendFileSync(ruta, JSON.stringify(registro) + '\n', 'utf8');
}

const dosDigitos = (n: number): string => String(n).padStart(2, '0');

/** Fecha de hoy en hora local, con formato AAAA-MM-DD. */
export function fechaDeHoy(): string {
  const ahora = new Date();
  return `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}`;
}

/** Hora actual en hora local, con formato HH:MM. */
export function horaActual(): string {
  const ahora = new Date();
  return `${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}`;
}

/** Minúsculas y sin acentos, para comparar textos: "Café" y "cafe" quedan iguales. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
