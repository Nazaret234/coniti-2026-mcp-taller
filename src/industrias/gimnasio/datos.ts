// Los datos del gimnasio y las funciones para consultarlos.
// Tus tools importan desde aquí; no necesitan leer archivos directamente.

import { join } from 'node:path';
import { agregarLinea, fechaDeHoy, horaActual, leerJson, leerLineas } from '../../lib/utilidades.ts';

export interface Clase {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  /** Lugares disponibles para hoy. */
  cupos: number;
  etiquetas: string[];
}

export interface Reserva {
  id: number;
  clase_id: number;
  cantidad: number;
  /** AAAA-MM-DD */
  fecha: string;
  /** HH:MM */
  hora: string;
  total: number;
}

/** Una reserva con los datos de la clase ya unidos. */
export interface ReservaConClase extends Reserva {
  clase: Clase;
}

const CARPETA = import.meta.dirname;
const ARCHIVO_NUEVOS = join(CARPETA, 'reservas-nuevas.jsonl');

/** El catálogo completo. */
export const clases: Clase[] = leerJson(join(CARPETA, 'clases.json'));

/** Las categorías que existen en el catálogo. */
export const CATEGORIAS: string[] = [...new Set(clases.map((clase) => clase.categoria))];

const historial: Reserva[] = leerJson(join(CARPETA, 'reservas.json'));

/** Todo: el historial de la semana más lo que se registre hoy. */
export function reservas(): Reserva[] {
  return [...historial, ...leerLineas<Reserva>(ARCHIVO_NUEVOS)];
}

export function clasePorId(id: number): Clase | undefined {
  return clases.find((clase) => clase.id === id);
}

/** Cada reserva junto con su clase: así puedes usar reserva.clase.categoria, etc. */
export function reservasConClase(): ReservaConClase[] {
  const resultado: ReservaConClase[] = [];
  for (const reserva of reservas()) {
    const clase = clasePorId(reserva.clase_id);
    if (clase) resultado.push({ ...reserva, clase });
  }
  return resultado;
}

/** Lugares que quedan hoy: cupos menos lo que ya se registró hoy. */
export function cuposDisponibles(clase: Clase): number {
  const usados = leerLineas<Reserva>(ARCHIVO_NUEVOS)
    .filter((reserva) => reserva.clase_id === clase.id)
    .reduce((suma, reserva) => suma + reserva.cantidad, 0);
  return clase.cupos - usados;
}

/**
 * Guarda una reserva. El id, la fecha, la hora y el total los pone el servidor:
 * nunca se le piden al modelo, porque podría inventarlos.
 */
export function guardarReserva(clase: Clase, cantidad: number): Reserva {
  const reserva: Reserva = {
    id: Math.max(0, ...reservas().map((m) => m.id)) + 1,
    clase_id: clase.id,
    cantidad,
    fecha: fechaDeHoy(),
    hora: horaActual(),
    total: clase.precio * cantidad,
  };
  agregarLinea(ARCHIVO_NUEVOS, reserva);
  return reserva;
}
