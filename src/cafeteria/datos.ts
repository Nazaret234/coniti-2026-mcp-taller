// Los datos de la cafetería y las funciones para consultarlos.
// Tus tools importan desde aquí; no necesitan leer archivos directamente.

import { join } from 'node:path';
import { agregarLinea, fechaDeHoy, horaActual, leerJson, leerLineas } from '../lib/utilidades.ts';

export const CATEGORIAS = ['desayuno', 'comida', 'antojito', 'bebida', 'postre'] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export interface Platillo {
  id: number;
  nombre: string;
  categoria: Categoria;
  precio: number;
  /** Porciones preparadas para hoy. */
  stock: number;
  etiquetas: string[];
}

export interface Pedido {
  id: number;
  platillo_id: number;
  cantidad: number;
  /** AAAA-MM-DD */
  fecha: string;
  /** HH:MM */
  hora: string;
  total: number;
}

/** Un pedido con los datos de su platillo ya unidos. */
export interface PedidoConPlatillo extends Pedido {
  platillo: Platillo;
}

const CARPETA = import.meta.dirname;
const ARCHIVO_NUEVOS = join(CARPETA, 'pedidos-nuevos.jsonl');

/** El menú completo. */
export const menu: Platillo[] = leerJson(join(CARPETA, 'menu.json'));

const pedidosHistoricos: Pedido[] = leerJson(join(CARPETA, 'pedidos.json'));

/** Todos los pedidos: el historial de la semana más los que se registren hoy. */
export function pedidos(): Pedido[] {
  return [...pedidosHistoricos, ...leerLineas<Pedido>(ARCHIVO_NUEVOS)];
}

export function platilloPorId(id: number): Platillo | undefined {
  return menu.find((platillo) => platillo.id === id);
}

/** Cada pedido junto con su platillo: así puedes usar pedido.platillo.categoria, etc. */
export function pedidosConPlatillo(): PedidoConPlatillo[] {
  const resultado: PedidoConPlatillo[] = [];
  for (const pedido of pedidos()) {
    const platillo = platilloPorId(pedido.platillo_id);
    if (platillo) resultado.push({ ...pedido, platillo });
  }
  return resultado;
}

/** Porciones que quedan hoy: el stock menos lo que ya se pidió hoy. */
export function stockDisponible(platillo: Platillo): number {
  const pedidasHoy = leerLineas<Pedido>(ARCHIVO_NUEVOS)
    .filter((pedido) => pedido.platillo_id === platillo.id)
    .reduce((suma, pedido) => suma + pedido.cantidad, 0);
  return platillo.stock - pedidasHoy;
}

/**
 * Guarda un pedido nuevo. El id, la fecha, la hora y el total los pone el servidor:
 * nunca se le piden al modelo, porque podría inventarlos.
 */
export function guardarPedido(platillo: Platillo, cantidad: number): Pedido {
  const pedido: Pedido = {
    id: Math.max(0, ...pedidos().map((p) => p.id)) + 1,
    platillo_id: platillo.id,
    cantidad,
    fecha: fechaDeHoy(),
    hora: horaActual(),
    total: platillo.precio * cantidad,
  };
  agregarLinea(ARCHIVO_NUEVOS, pedido);
  return pedido;
}
