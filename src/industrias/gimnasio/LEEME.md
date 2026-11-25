# Gimnasio

Para trabajar con esta industria:

```
npm run industria gimnasio
npm run probar
```

## Los datos

**`clases.json`** — el catálogo (12 clases)

| Campo | Qué es |
| --- | --- |
| `id` | Identificador de la clase |
| `nombre`, `categoria`, `precio` | Datos generales |
| `cupos` | Lugares disponibles para hoy. |
| `etiquetas` | Palabras clave para buscar |

**`reservas.json`** — reservas de la última semana

| Campo | Qué es |
| --- | --- |
| `id` | Identificador |
| `clase_id` | A qué clase corresponde |
| `cantidad` | Lugares reservados |
| `fecha`, `hora` | Cuándo ocurrió (`AAAA-MM-DD`, `HH:MM`) |
| `total` | Importe en pesos |

Todo se consulta desde `datos.ts`: `clases`, `reservas()`, `reservasConClase()`, `clasePorId(id)`, `cuposDisponibles(clase)` y `guardarReserva(...)`.

## Capa 2 · Ideas de tools de lectura

Parte de `tools/plantilla_lectura.ts`. Elige una o inventa la tuya.

| Dificultad | Tool | Pregunta que debe poder responder el modelo |
| --- | --- | --- |
| Fácil | `reservas_del_dia` | ¿Cuántos lugares se reservaron el lunes? |
| Media | `clases_mas_reservadas` | ¿Cuáles son las clases favoritas? |
| Media | `ingreso_por_categoria` | ¿Qué tipo de clase deja más dinero? |
| Difícil | `hora_pico` | ¿A qué horas se llena el gimnasio? |
| Difícil | `reservas_por_dia_semana` | ¿Qué día está más vacío y qué clase lo salva? |

En estos datos hay patrones escondidos. Una buena tool ayuda a encontrarlos.

## Capa 3 · Tu tool de escritura

Completa `tools/reservar_clase.ts`. Es el equivalente a `registrar_pedido` de la cafetería.

## Capa 4 · Para probar con Claude

- "¿Qué clase debería abrir otro horario y a qué hora?"
- "Resérvame 2 lugares en yoga y dime cuántos quedan."
- "Soy principiante y solo puedo en la tarde, ¿qué me recomiendas?"
