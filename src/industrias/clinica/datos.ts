// Los datos de la clínica y las funciones para consultarlos.
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

export interface Cita {
  id: number;
  servicio_id: number;
  /** AAAA-MM-DD */
  fecha: string;
  /** HH:MM */
  hora: string;
  total: number;
}

/** Una cita con los datos del servicio ya unidos. */
export interface CitaConServicio extends Cita {
  servicio: Servicio;
}

const CARPETA = import.meta.dirname;
const ARCHIVO_NUEVOS = join(CARPETA, 'citas-nuevas.jsonl');

/** El catálogo completo. */
export const servicios: Servicio[] = leerJson(join(CARPETA, 'servicios.json'));

/** Las categorías que existen en el catálogo. */
export const CATEGORIAS: string[] = [...new Set(servicios.map((servicio) => servicio.categoria))];

const historial: Cita[] = leerJson(join(CARPETA, 'citas.json'));

/** Todo: el historial de la semana más lo que se registre hoy. */
export function citas(): Cita[] {
  return [...historial, ...leerLineas<Cita>(ARCHIVO_NUEVOS)];
}

export function servicioPorId(id: number): Servicio | undefined {
  return servicios.find((servicio) => servicio.id === id);
}

/** Cada cita junto con su servicio: así puedes usar cita.servicio.categoria, etc. */
export function citasConServicio(): CitaConServicio[] {
  const resultado: CitaConServicio[] = [];
  for (const cita of citas()) {
    const servicio = servicioPorId(cita.servicio_id);
    if (servicio) resultado.push({ ...cita, servicio });
  }
  return resultado;
}

/** Lugares que quedan hoy: cupos menos lo que ya se registró hoy. */
export function cuposDisponibles(servicio: Servicio): number {
  const usados = leerLineas<Cita>(ARCHIVO_NUEVOS)
    .filter((cita) => cita.servicio_id === servicio.id)
    .reduce((suma) => suma + 1, 0);
  return servicio.cupos - usados;
}

/**
 * Guarda una cita. El id, la fecha, la hora y el total los pone el servidor:
 * nunca se le piden al modelo, porque podría inventarlos.
 */
export function guardarCita(servicio: Servicio): Cita {
  const cita: Cita = {
    id: Math.max(0, ...citas().map((m) => m.id)) + 1,
    servicio_id: servicio.id,
    fecha: fechaDeHoy(),
    hora: horaActual(),
    total: servicio.precio,
  };
  agregarLinea(ARCHIVO_NUEVOS, cita);
  return cita;
}
