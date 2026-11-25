// Los datos de la ferretería y las funciones para consultarlos.
// Tus tools importan desde aquí; no necesitan leer archivos directamente.

import { join } from 'node:path';
import { agregarLinea, fechaDeHoy, horaActual, leerJson, leerLineas } from '../../lib/utilidades.ts';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  /** Piezas en existencia. */
  stock: number;
  etiquetas: string[];
}

export interface Venta {
  id: number;
  producto_id: number;
  cantidad: number;
  /** AAAA-MM-DD */
  fecha: string;
  /** HH:MM */
  hora: string;
  total: number;
}

/** Una venta con los datos del producto ya unidos. */
export interface VentaConProducto extends Venta {
  producto: Producto;
}

const CARPETA = import.meta.dirname;
const ARCHIVO_NUEVOS = join(CARPETA, 'ventas-nuevas.jsonl');

/** El catálogo completo. */
export const productos: Producto[] = leerJson(join(CARPETA, 'productos.json'));

/** Las categorías que existen en el catálogo. */
export const CATEGORIAS: string[] = [...new Set(productos.map((producto) => producto.categoria))];

const historial: Venta[] = leerJson(join(CARPETA, 'ventas.json'));

/** Todo: el historial de la semana más lo que se registre hoy. */
export function ventas(): Venta[] {
  return [...historial, ...leerLineas<Venta>(ARCHIVO_NUEVOS)];
}

export function productoPorId(id: number): Producto | undefined {
  return productos.find((producto) => producto.id === id);
}

/** Cada venta junto con su producto: así puedes usar venta.producto.categoria, etc. */
export function ventasConProducto(): VentaConProducto[] {
  const resultado: VentaConProducto[] = [];
  for (const venta of ventas()) {
    const producto = productoPorId(venta.producto_id);
    if (producto) resultado.push({ ...venta, producto });
  }
  return resultado;
}

/** Piezas que quedan hoy: stock menos lo que ya se registró hoy. */
export function stockDisponible(producto: Producto): number {
  const usados = leerLineas<Venta>(ARCHIVO_NUEVOS)
    .filter((venta) => venta.producto_id === producto.id)
    .reduce((suma, venta) => suma + venta.cantidad, 0);
  return producto.stock - usados;
}

/**
 * Guarda una venta. El id, la fecha, la hora y el total los pone el servidor:
 * nunca se le piden al modelo, porque podría inventarlos.
 */
export function guardarVenta(producto: Producto, cantidad: number): Venta {
  const venta: Venta = {
    id: Math.max(0, ...ventas().map((m) => m.id)) + 1,
    producto_id: producto.id,
    cantidad,
    fecha: fechaDeHoy(),
    hora: horaActual(),
    total: producto.precio * cantidad,
  };
  agregarLinea(ARCHIVO_NUEVOS, venta);
  return venta;
}
