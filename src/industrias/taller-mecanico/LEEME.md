# Taller mecánico

Para trabajar con esta industria:

```
npm run industria taller-mecanico
npm run probar
```

## Los datos

**`servicios.json`** — el catálogo (12 servicios)

| Campo | Qué es |
| --- | --- |
| `id` | Identificador del servicio |
| `nombre`, `categoria`, `precio` | Datos generales |
| `cupos` | Lugares disponibles para hoy. |
| `etiquetas` | Palabras clave para buscar |

**`ordenes.json`** — órdenes de servicio de la última semana

| Campo | Qué es |
| --- | --- |
| `id` | Identificador |
| `servicio_id` | A qué servicio corresponde |
| `fecha`, `hora` | Cuándo ocurrió (`AAAA-MM-DD`, `HH:MM`) |
| `total` | Importe en pesos |

Todo se consulta desde `datos.ts`: `servicios`, `ordenes()`, `ordenesConServicio()`, `servicioPorId(id)`, `cuposDisponibles(servicio)` y `guardarOrden(...)`.

## Capa 2 · Ideas de tools de lectura

Parte de `tools/plantilla_lectura.ts`. Elige una o inventa la tuya.

| Dificultad | Tool | Pregunta que debe poder responder el modelo |
| --- | --- | --- |
| Fácil | `ordenes_del_dia` | ¿Cuántos autos entraron el sábado y cuánto se facturó? |
| Media | `servicios_mas_frecuentes` | ¿Qué servicios se hacen más? |
| Media | `ingreso_por_categoria` | ¿Qué tipo de trabajo deja más dinero? |
| Difícil | `ticket_promedio` | ¿Cuánto gasta en promedio un cliente, por categoría? |
| Difícil | `ordenes_por_dia_semana` | ¿Qué día necesito más mecánicos y para qué? |

En estos datos hay patrones escondidos. Una buena tool ayuda a encontrarlos.

## Capa 3 · Tu tool de escritura

Completa `tools/abrir_orden.ts`. Es el equivalente a `registrar_pedido` de la cafetería.

## Capa 4 · Para probar con Claude

- "¿Qué día necesito más mecánicos y de qué especialidad?"
- "Ábreme una orden para cambio de aceite y dime cuántos lugares quedan hoy."
- "¿Qué pasa los lunes con los servicios eléctricos?"
