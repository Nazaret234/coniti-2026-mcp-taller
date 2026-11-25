# Taller MCP · CONITI 2026

**Más allá del prompt: construye herramientas de IA con MCP para cualquier industria**

Este repositorio es un servidor MCP que funciona desde el primer minuto. Durante el taller lo vas a explorar, ampliar con tus propias tools y conectar a un modelo de IA.

Todo corre en tu laptop: no necesitas internet ni llaves de API para construir y probar.

## Antes de empezar

1. Coloca esta carpeta en una ruta corta y sin acentos, por ejemplo `C:\taller-mcp` o `~/taller-mcp`. Evita el Escritorio y Documentos si se sincronizan con OneDrive.
2. Abre la carpeta en VS Code y abre una terminal ahí (`Terminal > Nueva terminal`).
3. Si la carpeta no trae `node_modules`, corre `npm install`.
4. Corre la verificación:

```
npm run check
```

Si termina con `LISTO PARA EL TALLER`, ya está. Si marca una falla, el mismo mensaje dice cómo resolverla.

Necesitas **Node.js 22.12 o superior** (recomendado: la versión LTS de https://nodejs.org).

## Comandos

| Comando | Para qué sirve |
| --- | --- |
| `npm run check` | Verifica que tu laptop está lista |
| `npm run inspector` | Abre el MCP Inspector para llamar tus tools a mano |
| `npm run probar` | Lista las tools activas |
| `npm run probar <tool> parametro=valor` | Llama una tool desde la terminal |
| `npm run industria <nombre>` | Cambia a los datos de tu industria |
| `npm run reiniciar` | Borra lo que guardaron las tools de escritura |
| `npm run conectar` | Conecta el servidor con Claude Desktop |

## Mapa del repositorio

```
src/
├── servidor.ts              El servidor MCP: registra las tools y espera llamadas
├── lib/                     Piezas compartidas (no necesitas modificarlas)
├── cafeteria/               El ejemplo base
│   ├── menu.json            25 platillos
│   ├── pedidos.json         Los pedidos de una semana
│   ├── datos.ts             Funciones para consultar y guardar
│   ├── registro.ts          La lista de tools activas
│   └── tools/
│       ├── explorar/        Capa 1: tools ya hechas
│       ├── construir/       Capa 2: tu primera tool
│       ├── escribir/        Capa 3: una tool que modifica datos
│       └── conectar/        Capa 4: experimento con el modelo
└── industrias/              Ferretería, clínica, gimnasio y taller mecánico
```

Una tool tiene cuatro partes, y las cuatro están en un solo archivo:

| Parte | Quién la lee | Para qué |
| --- | --- | --- |
| `nombre` | El modelo | Identificarla |
| `descripcion` | El modelo | Decidir si la usa y cuándo |
| `entrada` | El modelo y tu código | El contrato: qué datos debe mandar |
| `ejecutar` | Solo tu código | Hacer el trabajo y regresar el resultado |

## Capa 1 · Explorar

Meta: entender qué es una tool viéndola funcionar.

1. Corre `npm run inspector`. Se abre el navegador; pulsa **Connect**.
2. Ve a la pestaña **Tools** y pulsa **List Tools**. Deben aparecer tres.
3. Llama `buscar_platillo` con el texto `torta`. Luego prueba `menu_del_dia` y `mas_vendidos`.
4. Abre `src/cafeteria/tools/explorar/buscar_platillo.ts` y ubica las cuatro partes.

Responde con tu equipo:

- ¿Cuál es el platillo más vendido de la semana? ¿Y el del viernes 20 de noviembre?
- ¿Qué pasa si pides `mas_vendidos` con `limite` igual a 100? ¿Quién detuvo esa llamada?
- ¿Qué responde `buscar_platillo` si buscas `sushi`? ¿Por qué no regresa simplemente una lista vacía?

Cada vez que cambies código, pulsa **Restart** (o **Reconnect**) en el Inspector: el servidor no se recarga solo.

## Capa 2 · Construir

### Tool guiada: `ingreso_por_categoria`

1. Abre `src/cafeteria/tools/construir/ingreso_por_categoria.ts` y completa los tres `TODO`.
2. Actívala en `src/cafeteria/registro.ts` quitando las `//` de su línea.
3. Pruébala:

```
npm run probar ingreso_por_categoria
npm run probar ingreso_por_categoria fecha=2026-11-20
```

4. Reinicia el Inspector y llámala desde ahí.

### Con tu equipo: tu industria

```
npm run industria ferreteria
```

Opciones: `ferreteria`, `clinica`, `gimnasio`, `taller-mecanico`. Después abre `src/industrias/<tu industria>/LEEME.md`: ahí están los datos, ideas de tools y la plantilla para empezar.

Para volver al ejemplo base: `npm run industria cafeteria`.

## Capa 3 · Escribir

Meta: construir una tool que modifica datos, y descubrir por qué eso exige más cuidado.

1. Completa `src/cafeteria/tools/escribir/registrar_pedido.ts` y actívala en el registro.
2. Pruébala con un caso bueno y dos malos:

```
npm run probar registrar_pedido platillo_id=11 cantidad=2
npm run probar registrar_pedido platillo_id=99 cantidad=1
npm run probar registrar_pedido platillo_id=11 cantidad=9
```

3. Comprueba el efecto: `npm run probar buscar_platillo texto=milanesa`
4. Hazlo ahora en tu industria: el archivo ya está en la carpeta `tools/` de tu industria.

Lo que guardas va a un archivo aparte (`pedidos-nuevos.jsonl`); los datos originales no se tocan. Para empezar de cero: `npm run reiniciar`.

## Capa 4 · Conectar

Meta: que un modelo use tus tools.

### Claude Desktop

1. Corre `npm run conectar`.
2. Cierra Claude Desktop por completo (en Windows: clic derecho en el ícono junto al reloj y **Salir**; en Mac: `Cmd + Q`) y ábrelo de nuevo.
3. En un chat nuevo, pregunta: *¿Qué hay de desayuno en la cafetería y qué me alcanza con $60?*

Cuando Claude pida permiso para usar una tool, elige permitir solo una vez: así verás cada llamada.

Experimentos. En cada uno, anota qué esperabas y qué pasó:

- **Una pregunta sobre ventas.** Pregunta *¿Qué se le antoja más a la gente en la cafetería?* Fíjate en cómo describe los datos: ¿de qué periodo dice que son? ¿De dónde sacó eso? Abre `mas_vendidos.ts`, lee su descripción como si fueras el modelo y complétala con lo que le faltó saber. Reinicia Claude Desktop y pregunta de nuevo.
- **Un pedido.** Pide *Apártame dos tortas de milanesa*. Observa qué tools llama, en qué orden y cuándo te pide permiso.
- **El mismo pedido.** Repite exactamente la misma petición y después corre `npm run probar buscar_platillo texto=milanesa`. ¿Era lo que querías? ¿A quién le toca resolverlo: al modelo o a la tool?
- **Una pregunta sin tool.** Pregunta *¿A qué hora se junta más gente en la cafetería?* ¿Qué respondió y con qué datos? Luego activa `hora_pico` en el registro, reinicia y repite. ¿Qué cambió?

Si cambias de industria o de código, cierra y abre Claude Desktop otra vez.

### Plan B: VS Code con GitHub Copilot

El archivo `.vscode/mcp.json` ya viene configurado. Ábrelo, inicia el servidor `taller-mcp` desde ahí y usa el chat de Copilot en modo agente.

## Retos

Para quien termine antes.

- **`agotarse_pronto`**: compara las porciones de hoy con lo que se vende en un día promedio. ¿Qué platillo no va a alcanzar? No hay plantilla: parte de `mas_vendidos.ts`.
- **`combos_con_presupuesto`**: ya está hecha. Pregunta a Claude *Tengo $90, ¿qué combo de comida y bebida me alcanza?* sin ella y después activándola en el registro. Compara cuántas tools llamó y cuántos datos leyó en cada caso. ¿Qué pasaría con un menú de 5,000 platillos?

## Problemas comunes

| Síntoma | Qué hacer |
| --- | --- |
| `npm run check` dice que Node es viejo | Instala la versión LTS de Node, cierra la terminal y abre otra |
| El Inspector no abre el navegador | Copia en el navegador la dirección `http://localhost:6274/...` que aparece en la terminal, completa |
| Mi tool no aparece | Revisa que esté sin `//` en `registro.ts` y reinicia el Inspector |
| El Inspector dice que el puerto está ocupado | Ya hay otro Inspector abierto: ciérralo con `Ctrl + C` en su terminal |
| El servidor deja de responder | Busca un `console.log` en tu código y cámbialo por `console.error` |
| Claude Desktop no muestra el servidor | Ciérralo por completo y ábrelo; si sigue igual, revisa en Configuración > Desarrollador qué error marca |
| Quiero borrar lo que registré | `npm run reiniciar` |
