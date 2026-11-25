# Clínica

Para trabajar con esta industria:

```
npm run industria clinica
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

**`citas.json`** — citas de la última semana

| Campo | Qué es |
| --- | --- |
| `id` | Identificador |
| `servicio_id` | A qué servicio corresponde |
| `fecha`, `hora` | Cuándo ocurrió (`AAAA-MM-DD`, `HH:MM`) |
| `total` | Importe en pesos |

Todo se consulta desde `datos.ts`: `servicios`, `citas()`, `citasConServicio()`, `servicioPorId(id)`, `cuposDisponibles(servicio)` y `guardarCita(...)`.

## Capa 2 · Ideas de tools de lectura

Parte de `tools/plantilla_lectura.ts`. Elige una o inventa la tuya.

| Dificultad | Tool | Pregunta que debe poder responder el modelo |
| --- | --- | --- |
| Fácil | `citas_del_dia` | ¿Cuántas citas hubo el lunes y cuánto ingresó? |
| Media | `servicios_mas_solicitados` | ¿Qué servicios pide más la gente? |
| Media | `ingreso_por_categoria` | ¿Qué área de la clínica deja más dinero? |
| Difícil | `hora_pico` | ¿A qué hora hay más pacientes y de qué área son? |
| Difícil | `citas_por_dia_semana` | ¿Qué día conviene tener un médico extra? |

En estos datos hay patrones escondidos. Una buena tool ayuda a encontrarlos.

## Capa 3 · Tu tool de escritura

Completa `tools/agendar_cita.ts`. Es el equivalente a `registrar_pedido` de la cafetería.

## Capa 4 · Para probar con Claude

- "¿A qué hora conviene abrir otro consultorio?"
- "Agéndame una limpieza dental y dime cuántos lugares quedan."
- "¿Hay algún tipo de servicio que se concentre en un horario? ¿Por qué crees que pasa?"
