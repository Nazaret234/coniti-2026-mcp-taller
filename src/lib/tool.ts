import type * as z from 'zod';

/**
 * Una tool es un contrato con el modelo:
 *  - nombre y descripcion: lo que el modelo lee para decidir si la usa.
 *  - entrada: los datos que el modelo debe mandar (esquema de Zod).
 *  - ejecutar: tu código. Recibe la entrada ya validada y regresa el resultado.
 */
export interface DefinicionTool<Entrada extends z.ZodObject = z.ZodObject> {
  nombre: string;
  descripcion: string;
  entrada: Entrada;
  /** true si la tool solo consulta; false si modifica datos. */
  soloLectura: boolean;
  ejecutar(args: z.infer<Entrada>): unknown;
}

export type ToolCualquiera = DefinicionTool<any>;

/** Solo sirve para que el editor te autocomplete y revise los tipos de tu tool. */
export function definirTool<Entrada extends z.ZodObject>(
  definicion: DefinicionTool<Entrada>,
): DefinicionTool<Entrada> {
  return definicion;
}

/**
 * Error pensado para que lo lea el modelo.
 * Escribe el mensaje como una instrucción: qué salió mal y qué puede hacer para corregirlo.
 */
export class ErrorDeTool extends Error {}
