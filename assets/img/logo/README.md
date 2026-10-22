# Logos de marca

| Archivo | Qué es | Dónde se usa |
|---|---|---|
| `upct-racing-team-color.png` | Logo del equipo en su color (texto negro y azul) sobre fondo transparente, 1000 × 334 px | Cabecera de todas las páginas (`logo` en `data/site.js`) |
| `upct-racing-team.png` | Logo del equipo **para fondo oscuro**: el texto pasa a blanco y el azul se conserva, 1000 × 334 px | Pie de página, junto al emblema de la UPCT (`logoEquipoPie`) |
| `upct-racing-team-original.webp` | Logo original del equipo en alta calidad (2000 × 667 px, fondo blanco) | Referencia; de aquí salen las dos versiones anteriores |
| `upct-racing-team-original.jpg` | Logo antiguo del equipo (baja resolución) | Solo referencia |
| `upct-blanco.png` | Emblema de la UPCT en blanco sobre transparente | Pie de página (enlaza a upct.es) |
| `upct-original.jpg` | Emblema original de la UPCT (negro sobre blanco) | Solo referencia |

Las versiones del logo del equipo se generaron a partir de `upct-racing-team-original.webp`. Si el equipo tiene el logo en vectorial (SVG),
conviene sustituirlas: se verán todavía más nítidas. Después actualiza `src`, `ancho` y `alto` en `data/site.js`.

El emblema de la UPCT en blanco viene de un original de baja resolución (179 px).
