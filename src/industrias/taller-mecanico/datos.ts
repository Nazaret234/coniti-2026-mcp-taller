// Los datos del taller mecánico y las funciones para consultarlos.
// Tus tools importan desde aquí; no necesitan leer archivos directamente.

import { join } from 'node:path';
import { agregarLinea, fechaDeHoy, horaActual, leerJson, leerLineas } from '../../lib/utilidades.ts';

export interface Servicio {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  /** Lugares disponibles para hoy. */
  cupos: number;
  etiquetas: string[];
}

export interface Orden {
  id: number;
  servicio_id: number;
  /** AAAA-MM-DD */
  fecha: string;
  /** HH:MM */
  hora: string;
  total: number;
}

/** Una orden con los datos del servicio ya unidos. */
export interface OrdenConServicio extends Orden {
  servicio: Servicio;
}

const CARPETA = import.meta.dirname;
const ARCHIVO_NUEVOS = join(CARPETA, 'ordenes-nuevas.jsonl');

/** El catálogo completo. */
export const servicios: Servicio[] = leerJson(join(CARPETA, 'servicios.json'));

/** Las categorías que existen en el catálogo. */
export const CATEGORIAS: string[] = [...new Set(servicios.map((servicio) => servicio.categoria))];

const historial: Orden[] = leerJson(join(CARPETA, 'ordenes.json'));

/** Todo: el historial de la semana más lo que se registre hoy. */
export function ordenes(): Orden[] {
  return [...historial, ...leerLineas<Orden>(ARCHIVO_NUEVOS)];
}

export function servicioPorId(id: number): Servicio | undefined {
  return servicios.find((servicio) => servicio.id === id);
}

/** Cada orden junto con su servicio: así puedes usar orden.servicio.categoria, etc. */
export function ordenesConServicio(): OrdenConServicio[] {
  const resultado: OrdenConServicio[] = [];
  for (const orden of ordenes()) {
    const servicio = servicioPorId(orden.servicio_id);
    if (servicio) resultado.push({ ...orden, servicio });
  }
  return resultado;
}

/** Lugares que quedan hoy: cupos menos lo que ya se registró hoy. */
export function cuposDisponibles(servicio: Servicio): number {
  const usados = leerLineas<Orden>(ARCHIVO_NUEVOS)
    .filter((orden) => orden.servicio_id === servicio.id)
    .reduce((suma) => suma + 1, 0);
  return servicio.cupos - usados;
}

/**
 * Guarda una orden. El id, la fecha, la hora y el total los pone el servidor:
 * nunca se le piden al modelo, porque podría inventarlos.
 */
export function guardarOrden(servicio: Servicio): Orden {
  const orden: Orden = {
    id: Math.max(0, ...ordenes().map((m) => m.id)) + 1,
    servicio_id: servicio.id,
    fecha: fechaDeHoy(),
    hora: horaActual(),
    total: servicio.precio,
  };
  agregarLinea(ARCHIVO_NUEVOS, orden);
  return orden;
}
