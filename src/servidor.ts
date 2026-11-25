import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod';
import { cargarTools, industriaActiva } from './lib/industria.ts';
import { ErrorDeTool } from './lib/tool.ts';

// Mensajes de validación en español (los lee el modelo cuando manda datos incorrectos).
z.config(z.locales.es());

const industria = industriaActiva();
const tools = await cargarTools(industria);

// 1. El servidor: así se presenta ante Claude, el Inspector o cualquier otro cliente MCP.
const servidor = new McpServer({ name: industria, version: '1.0.0' });

// 2. Las tools: cada definición del registro se convierte en una tool de MCP.
for (const tool of tools) {
  servidor.registerTool(
    tool.nombre,
    {
      description: tool.descripcion,
      inputSchema: tool.entrada,
      annotations: { readOnlyHint: tool.soloLectura },
    },
    async (args: unknown) => {
      try {
        const resultado = await tool.ejecutar(args);
        const texto = typeof resultado === 'string' ? resultado : JSON.stringify(resultado, null, 2);
        return { content: [{ type: 'text' as const, text: texto }] };
      } catch (error) {
        // Un error también es una respuesta: el modelo la lee y decide qué hacer.
        const mensaje =
          error instanceof ErrorDeTool
            ? error.message
            : `Error interno en ${tool.nombre}: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[${tool.nombre}] ${mensaje}`);
        return { content: [{ type: 'text' as const, text: mensaje }], isError: true };
      }
    },
  );
}

// 3. El transporte: stdio significa que el cliente lanza este programa y le habla por la terminal.
//    Por eso aquí NUNCA se usa console.log: rompería la conversación. Para avisos, console.error.
await servidor.connect(new StdioServerTransport());
console.error(`Servidor MCP "${industria}" listo con ${tools.length} tools: ${tools.map((t) => t.nombre).join(', ')}`);
