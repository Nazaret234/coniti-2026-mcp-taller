# Ferretería

Para trabajar con esta industria:

```
npm run industria ferreteria
npm run probar
```

## Los datos

**`productos.json`** — el catálogo (15 productos)

| Campo | Qué es |
| --- | --- |
| `id` | Identificador del producto |
| `nombre`, `categoria`, `precio` | Datos generales |
| `stock` | Piezas en existencia. |
| `etiquetas` | Palabras clave para buscar |

**`ventas.json`** — ventas de la última semana

| Campo | Qué es |
| --- | --- |
| `id` | Identificador |
| `producto_id` | A qué producto corresponde |
| `cantidad` | Piezas vendidas |
| `fecha`, `hora` | Cuándo ocurrió (`AAAA-MM-DD`, `HH:MM`) |
| `total` | Importe en pesos |

Todo se consulta desde `datos.ts`: `productos`, `ventas()`, `ventasConProducto()`, `productoPorId(id)`, `stockDisponible(producto)` y `guardarVenta(...)`.

## Capa 2 · Ideas de tools de lectura

Parte de `tools/plantilla_lectura.ts`. Elige una o inventa la tuya.

| Dificultad | Tool | Pregunta que debe poder responder el modelo |
| --- | --- | --- |
| Fácil | `ventas_del_dia` | ¿Cuánto se vendió el sábado y en cuántas ventas? |
| Media | `productos_mas_vendidos` | ¿Qué productos salen más, en piezas y en dinero? |
| Media | `ingreso_por_categoria` | ¿Qué departamento deja más dinero? |
| Difícil | `por_agotarse` | ¿Qué se va a acabar pronto si se sigue vendiendo a este ritmo? |
| Difícil | `ventas_por_dia_semana` | ¿Qué día necesito más personal en mostrador? |

En estos datos hay patrones escondidos. Una buena tool ayuda a encontrarlos.

## Capa 3 · Tu tool de escritura

Completa `tools/registrar_venta.ts`. Es el equivalente a `registrar_pedido` de la cafetería.

## Capa 4 · Para probar con Claude

- "¿Qué debería resurtir esta semana y por qué?"
- "Véndeme 3 cintas de aislar y dime cuántas quedan."
- "¿Qué cambia en la tienda los sábados?"
