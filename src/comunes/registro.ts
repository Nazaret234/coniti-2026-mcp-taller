// Tools comunes: funcionan con cualquier industria.
// Lo que actives aquí aparece junto a las tools de tu industria, aunque la cambies.
// Para activar una tool, quita las dos diagonales del inicio de su línea y reinicia el servidor.

import clima from "./tools/clima.ts";
import type { ToolCualquiera } from "../lib/tool.ts";

export const tools: ToolCualquiera[] = [
  // Consulta el clima de una ciudad en internet
  // clima,
];
