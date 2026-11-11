# Cómo publicar una noticia

Una noticia es **un archivo `.md` en esta carpeta**. Al publicarlo, la web crea sola su página (`/blog/<nombre>.html` y `/en/blog/<nombre>.html`),
la añade al listado del Blog, la pone como «Última noticia» en la portada (si es la más reciente) y la incluye en el `sitemap.xml`.

## Pasos

1. Sube las fotos a `assets/img/blog/` (mejor `.jpg`, unos 2000 px de ancho).
2. Copia una noticia existente de esta carpeta (por ejemplo `semana-de-la-ciencia-murcia.md`) y renómbrala.
   **El nombre del archivo es la dirección de la noticia**: solo minúsculas, números y guiones, sin tildes ni espacios
   (`nuevo-morro-aerodinamico.md` → `/blog/nuevo-morro-aerodinamico.html`).
3. Cambia la cabecera (lo de entre las dos líneas `---`) y el texto.
4. Sube los cambios a GitHub. Vercel genera la web y, en un par de minutos, la noticia está publicada.
   (Si la subes en una rama, Vercel te da una *preview* para revisarla antes.)

## Formato del archivo

```markdown
---
titulo: Título de la noticia
fecha: 2026-11-20            # AAAA-MM-DD (las más recientes salen primero)
categoria: Taller            # Taller, Competición, Patrocinadores, Equipo o Eventos (una nueva se añade sola)
autor: Departamento de Aerodinámica   # opcional
resumen: Una o dos frases para la tarjeta y para Google.   # opcional (si falta, se usa el principio del texto)
imagen: assets/img/blog/nuevo-morro.jpg          # una foto (opcional)
imagenAlt: Descripción de la foto                # obligatorio si hay imagen
# o varias fotos (la primera sale en la tarjeta y al compartir en redes):
fotos:
  - src: assets/img/blog/foto-1.jpg
    alt: Descripción de la foto 1
    en: Description of photo 1                    # opcional
# o un vídeo:
video: assets/video/mi-video.mp4
poster: assets/img/blog/portada-video.jpg
videoAlt: Descripción del vídeo
en:                           # versión en inglés (opcional)
  titulo: Title of the news
  resumen: One or two sentences.
---

Primer párrafo del texto.

Segundo párrafo: los párrafos se separan con una línea en blanco. Los enlaces se escriben así: [texto del enlace](https://ejemplo.com).

---EN---

First paragraph in English (opcional: si no hay, la versión inglesa muestra el texto en español).

Second paragraph.
```

## Para probarlo en tu ordenador

```bash
npm install     # solo la primera vez
npm run dev     # http://localhost:5173
```

Si algo falta o está mal escrito (fecha, imagen sin descripción, nombre del archivo…), el build lo dice claramente y no publica a medias.
