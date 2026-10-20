# UPCT Racing Team — Web del equipo

Web profesional del equipo de Formula Student de la Universidad Politécnica de Cartagena.
Siete páginas independientes, **HTML + CSS + JavaScript sin frameworks ni paso de compilación**.

> **Estado:** web completa con el diseño «Duotono» (blanco + azul UPCT) y el coche en 3D en Inicio.
> **Coche 3D:** se gira con el ratón desde todos los ángulos. Es el **CAD real de SolidWorks** simplificado (`assets/models/coche.glb`); la réplica a ojo
> (`js/coche3d.js`) queda solo como código de reserva (ver `assets/models/README.md`).
> **Pendiente (más adelante):** modelo exacto del coche y zonas pinchables por departamento.

---

## 1. Cómo arrancarla

Abre una terminal en esta carpeta y ejecuta **una** de estas opciones; después entra en <http://localhost:8000>.

```bash
# macOS / Linux
python3 -m http.server 8000

# Windows con Python instalado
python -m http.server 8000      # o bien:  py -m http.server 8000
```

**Windows sin Python:** haz doble clic en `iniciar-servidor.bat`. Usa PowerShell (ya incluido en Windows),
no instala nada y abre el navegador en <http://localhost:8000>. Para pararlo, `Ctrl + C`.
`iniciar-servidor.bat` y `servidor-local.ps1` son solo ayudas de desarrollo: **no hay que subirlos al hosting**.

> Los datos son scripts normales (no módulos), así que la web usa solo rutas relativas y no necesita configuración en el servidor.

---

## 2. Estructura

```
index.html · quienes-somos.html · equipo.html · competicion.html · garaje.html · patrocinadores.html · contacto.html

css/
  variables.css   ← TODOS los colores, tipografías y espaciados clave (un único archivo)
  styles.css      ← estilos globales y de cada página
js/
  components.js   ← <site-header> y <site-footer>: definidos UNA vez y reutilizados en las 7 páginas
  main.js         ← menú móvil, sombra de la cabecera al hacer scroll, apariciones al hacer scroll, fundido entre páginas
  visor.js        ← visor 3D del coche de Inicio (Three.js desde CDN): girar, acercar; respaldo con fotos si no hay WebGL
  coche3d.js      ← réplica 3D del coche construida con geometría de Three.js a partir de las fotos (logos de patrocinadores incluidos)
  home.js · quienes-somos.js · equipo.js · garaje.js · patrocinadores.js · contacto.js · blog.js   ← un archivo por página
  posts.js        ← utilidades del blog compartidas por Inicio y Blog (tarjetas, fechas)
data/             ← lo único que hay que tocar para cambiar contenido
  site.js                 nombre, logos, menú, misión, valores, contacto (+ formulario), redes, Instagram, ubicaciones
  blog.js                 noticias del blog (hoy vacío: la página muestra «Aún no hay noticias» y la portada no enseña el bloque)
  team.js                 9 departamentos y sus 47 integrantes (foto y LinkedIn)
  departments-garage.js   los 9 departamentos del Garaje (+ campo «zonaCoche» para la fase 2)
  sponsors.js             patrocinadores (nombre, URL, logo, nivel): alimenta la página Patrocinadores y el pie
  coche.js                ruta del modelo 3D real (.glb, hoy vacía) y fotos del coche (respaldo del visor)
assets/
  img/logo/       logo del equipo (en color para la web clara; también la versión para fondo oscuro y el original), emblema de la UPCT en blanco
  img/coche/      fotos reales del coche (referencia del modelo 3D y respaldo del visor)
  img/team/       avatares provisionales en SVG (uno por persona)
  img/hero/       imágenes provisionales del coche (Competición y Garaje) y del equipo
  img/sponsors/   logos de los 17 patrocinadores, en blanco sobre transparente
  img/og/         imagen provisional para redes sociales (Open Graph)
  models/         coche.glb: modelo 3D real del coche (CAD simplificado; ver su README)
```

---

## 3. Cómo cambiar el contenido

### Una persona del equipo → `data/team.js`
Cada departamento tiene su lista `miembros`. **El primer miembro de cada departamento es el coordinador** y la web
escribe «Coordinador» bajo su nombre.

```js
{ nombre: "Ana López", foto: "marketing-01.jpg", linkedin: "https://www.linkedin.com/in/ana-lopez/" },
```

* **Foto:** suelta el archivo en `assets/img/team/` y escribe su nombre en `foto`. Proporción **4:5** (p. ej. 800 × 1000 px),
  JPG o WebP. Las fotos reales se muestran en blanco y negro y al pasar el ratón reciben el filtro azul.
* **LinkedIn:** URL completa. Se abre en pestaña nueva. Si está vacía (`""`) la foto simplemente no es clicable.
* Si un archivo de foto no existe, la web muestra un avatar con las iniciales (nunca una imagen rota).
* Para añadir o quitar a alguien, añade o borra su línea. Los departamentos se muestran en el orden del archivo.
* Los avatares SVG actuales llevan el mismo nombre base que usarán las fotos (`marketing-01`…). Para sustituir uno,
  guarda `marketing-01.jpg` y cambia `.svg` por `.jpg` en esa línea.

### Patrocinadores → `data/sponsors.js`
```js
{ nombre: "Empresa", url: "https://www.empresa.com", logo: "assets/img/sponsors/empresa.png", ancho: 400, alto: 120, nivel: 2 },
```
* La lista alimenta **dos sitios**: la página Patrocinadores y la franja de logos del **pie de página** (en todas las páginas
  **menos Inicio**, que ya tiene su propio bloque de patrocinadores: allí el pie lleva `<site-footer sin-patrocinadores>`).
  El pie se compone de: nombre + logos del equipo y de la UPCT (`logoEquipoPie` y `logoUniversidad` en `data/site.js`), la franja de patrocinadores (salvo en Inicio) y una sola fila pequeña con el
  contacto (correo y redes) y el copyright. Ya no lleva columna de navegación.
* Hoy hay **17 logos** en blanco sobre transparente, recortados de las capturas del equipo. En el pie (azul marino) se ven en blanco
  y en la página Patrocinadores la hoja de estilos los pasa a gris oscuro. Si tienes los originales (SVG o PNG con fondo
  transparente), sustitúyelos: se verán mejor (y se podrán mostrar a color).
* `ancho` y `alto` son el tamaño en píxeles del archivo; sirven para equilibrar el tamaño visual de cada logo en el pie.
* `url` está vacía en todos: con ella el logo enlaza a la web del patrocinador en pestaña nueva; sin ella no es clicable.
* `nivel` define el tamaño de la celda en la página Patrocinadores: **1** grande · **2** media · **3** pequeña
  (se ordenan por prioridad). Hoy todos están en el nivel 2.
* **Color al pasar el ratón (página Patrocinadores):** cada logo tiene una versión en su color original en
  `assets/img/sponsors/color/<mismo nombre>.png` (mismas medidas que la gris). Un patrocinador nuevo necesita las dos; si falta la de
  color, se queda la gris. Se pueden indicar otra ruta con el campo opcional `logoColor`.
* Sin logo → se muestra el nombre en texto. Con la lista vacía, la página muestra 6 celdas `[PENDIENTE: patrocinador]` y el pie no
  muestra la franja.

### Textos generales, logos, contacto y redes → `data/site.js`
* **Eslogan:** se ha quitado el hueco bajo el nombre del equipo. Si algún día hay eslogan, habrá que volver a añadir el párrafo
  en `index.html` (`<p class="lede hero__slogan" data-site="eslogan">`).
* **Instagram automático:** `instagram.widget` (`proveedor` + `id`). La portada muestra las últimas publicaciones con un servicio de
  «widget de Instagram» (Behold, Elfsight o LightWidget): se crea la cuenta en el servicio, se conecta Instagram y se pega aquí el
  identificador. Mientras esté vacío se ve una cuadrícula de fotos del equipo que lleva al perfil. En la web de pruebas publicada
  como Artifact no funciona (bloquea servicios externos); sí en un hosting normal.
* **Formulario de contacto que envía de verdad:** `contacto.formulario` (dirección de un servicio como Formspree). Mientras esté
  vacío, el formulario abre el correo del visitante (mailto) como antes. Con la dirección, envía el mensaje al correo del equipo y
  muestra «Mensaje enviado».
* **Blog:** añade cada noticia en `data/blog.js` (la plantilla está en el propio archivo).
* **Misión y valores:** `mision` y `valores`. Los textos con `propuesta: false` los ha escrito el equipo; el resto son propuesta editable.
* **Logos:** `logo` (cabecera, versión en color sobre transparente en `assets/img/logo/`) y `logoUniversidad` (emblema de la UPCT en el pie,
  enlazado a upct.es). Para cambiarlos, guarda el archivo nuevo y actualiza `src`, `ancho` y `alto`.
* **Contacto y redes:** `contacto.email` y `redes` (Instagram y LinkedIn con icono en blanco y negro). Para añadir otra red, copia una
  línea de `redes` y pon su URL.

### Descripción de cada departamento
`data/team.js` (página Equipo) y `data/departments-garage.js` (página Garaje). Ambas son propuestas editables.

### Quiénes somos y Competición
Su texto está directamente en `quienes-somos.html` y `competicion.html`.

### Imágenes del coche y del equipo → `assets/img/hero/`
| Archivo provisional | Dónde se usa | Recomendación |
|---|---|---|
| `coche-hero.svg` | (ya no se usa: Inicio tiene el visor con las fotos de `assets/img/coche/`) | — |
| `coche-competicion.svg` | Competición | PNG/WebP con el coche centrado y fondo transparente (se ve sobre el panel azul) |
| `coche-garaje.svg` | Garaje | PNG/WebP con el coche centrado y fondo transparente (se ve sobre el panel azul) |
| `equipo-01.svg`, `equipo-02.svg` | Quiénes somos | fotos del equipo, 3:2 (p. ej. 1200 × 800) |

Para sustituirlas: guarda la imagen y cambia el `src` (y el `alt`) de la etiqueta `<img>` correspondiente en el HTML.

### Idiomas (ES / EN) → `data/i18n-en.js` + `js/i18n.js`
El menú tiene un desplegable ES / EN con banderas. Español por defecto; al elegir EN toda la web se traduce y al volver a ES se
restaura el texto original. La elección se recuerda en el navegador (y se puede forzar con `?lang=en`).
Las traducciones están en `data/i18n-en.js`: cada texto español exacto → su traducción (`dict`), párrafos con negritas (`rich`) y
marcadores `[PENDIENTE: …]` (`pend`). **Si cambias un texto en español, actualiza también su clave ahí**; un texto sin traducción se
queda en español. Las palabras iguales en los dos idiomas (Formula Student, Team, Marketing…) se dejan tal cual.

### Fotos del coche → `assets/img/coche/` + `data/coche.js`
Las 6 fotos actuales (frontal, delantera izquierda, lateral izquierdo, con el equipo, trasera derecha y lateral derecho) están
sin retocar. Son la referencia de la réplica 3D y el **respaldo** del visor si el navegador no puede mostrar 3D (se recorren
arrastrando). Para cambiar ese respaldo edita la lista `vistas` de `data/coche.js`. Tienen ~700 px de ancho.

### Redes sociales: imagen y dominio
`assets/img/og/og-default.png` (1200 × 630) es provisional. Al publicar la web, usa una **URL absoluta** en `og:image` y añade `og:url`
en el `<head>` de cada página.

---

## 4. Diseño

Diseño «Duotono»: blanco y azul oficial de la UPCT, con un panel azul oblicuo para el coche y el pie en azul marino.

* **Paleta (colores oficiales de la UPCT):** azul UPCT `#0054A0` (Pantone 2945 C) como acento y botones, azul medio `#75B2DD`
  (Pantone 292 C) para detalles y franjas, azul marino `#00294F` para el pie, texto `#08203D` y fondos `#FFFFFF` / `#F3F7FB`.
  El rojo del escudo (`#DA291C`, Pantone 485 C) solo se usa en los mensajes de error del formulario.
  Contraste del azul sobre blanco: 7,6 : 1 (AAA). Para cambiar la paleta, edita `css/variables.css`.
* **Tipografía:** *Barlow Condensed* en cursiva (títulos, mayúsculas) e *IBM Plex Sans* (texto), desde Google Fonts con alternativa del sistema.
  Si se prefiere no depender de Google, se pueden autohospedar los archivos y cambiar el enlace del `<head>`.
* **Recurso gráfico único:** el **corte oblicuo de 20°** en azul: paralelogramo del visor con sus franjas (Inicio, Garaje, Competición),
  franja a la derecha de las cabeceras interiores y línea en las etiquetas de sección. Nada más.
* **Composición del coche (`.stage`):** panel azul en paralelogramo con foco de luz tenue; es la misma en Inicio, Competición y Garaje.
  En Inicio contiene el visor (`js/visor.js`).
* **Responsive:** de 375 px a pantallas grandes, sin scroll horizontal. Menú hamburguesa accesible (teclado, `Esc`).
* **Accesibilidad:** HTML semántico, enlace «Saltar al contenido», foco visible, `aria-current` en el menú, formulario con errores
  asociados a cada campo, `alt` en todas las imágenes, `prefers-reduced-motion` respetado (el visor no gira solo).

---

## 5. El visor del coche (Inicio) y el modelo 3D

* **Hoy (réplica 3D):** el coche se gira con el ratón o el dedo desde **todos los ángulos** (no baja del suelo) y se acerca con la rueda
  o el pellizco; gira solo despacio hasta que lo tocas (y no gira solo si el sistema pide menos movimiento). Three.js se carga desde un
  CDN (jsDelivr), así que hace falta conexión. El modelo (`js/coche3d.js`) está hecho **a ojo a partir de las 6 fotos**: carrocería
  blanca con morro en bala, 4 ruedas, aros y estructura tubular, asiento azul, casco, volante, depósito amarillo, motor, suspensión y
  pegatinas con los logos reales de los patrocinadores. No es un escaneo ni el CAD: las proporciones y los detalles son aproximados.
* **Modelo exacto (cuando exista `coche.glb`):** escribe su ruta en `data/coche.js` → `modelo` y el visor lo usa en lugar de la réplica
  (si el archivo falla, vuelve a la réplica). Ver `assets/models/README.md` (cómo conseguirlo y exportarlo).
* **Respaldo con fotos:** si el navegador no tiene WebGL o falla el CDN, el visor muestra las fotos reales (`data/coche.js` → `vistas`),
  que se recorren arrastrando, con las flechas del teclado o con los botones.
* **Competición y Garaje** conservan su contenedor `#visor-3d` con la imagen provisional `[PENDIENTE: foto del coche]`; se les puede
  dar el mismo visor cuando se quiera.
* **`data/departments-garage.js`**: los 9 departamentos con su URL de destino y un campo `zonaCoche` vacío, que se rellenará con la
  zona/malla del modelo (zonas pinchables, pendiente).
* La lista del Garaje ya es el **equivalente accesible** del visor: cada fila lleva `data-dept` y `data-zona`.
* **Cada departamento del Garaje es un desplegable** (uno abierto a la vez; `garaje.html#motor` abre «Motor»). Dentro: la explicación
  a fondo (`detalle`: lista de párrafos; vacío = `[PENDIENTE]`), las fotos (`fotos: [{ src, alt }]`; vacío = tres huecos en blanco)
  y el enlace «Ver al equipo del departamento» (`url`, a equipo.html).

---

## 6. Datos pendientes — `[PENDIENTE: …]`

| Qué falta | Dónde se rellena |
|---|---|
| Identificador del widget de Instagram (para que la portada se actualice sola) | `data/site.js` → `instagram.widget` |
| Dirección del servicio de formularios (para que el formulario envíe de verdad) | `data/site.js` → `contacto.formulario` |
| Primera noticia del blog | `data/blog.js` |
| Dominio definitivo (la imagen al compartir el enlace necesita URL absoluta) | `og:image` en cada `.html` |
| Ubicaciones de Contacto: UPCT y taller (edificio ELDI, Calle del Ángel s/n; falta confirmar planta/número) | `data/site.js` → `ubicaciones` |
| Historia del equipo | `quienes-somos.html` |
| Relación con la universidad y la escuela (apoyo institucional, tutor/a…) | `quienes-somos.html` |
| Competiciones, categoría y resultados del equipo | `competicion.html` |
| Nombres reales, fotos y LinkedIn de las 47 personas | `data/team.js` + `assets/img/team/` |
| Modelo 3D del coche (`coche.glb`) para girarlo desde todos los ángulos | `assets/models/` + `data/coche.js` |
| Fotos del coche para Competición y Garaje, fotos del equipo para Quiénes somos (2) | `assets/img/hero/` |
| Webs de los patrocinadores (para enlazar cada logo) y sus niveles de patrocinio | `data/sponsors.js` |
| Archivos originales de los logos (SVG/PNG transparente) y versión vectorial del logo del equipo | `assets/img/sponsors/`, `assets/img/logo/` |
| Dominio, `og:url`, URL absoluta de `og:image` e imagen Open Graph definitiva | `<head>` de cada página |

Propuestas de texto que conviene revisar: los valores «Pasión y esfuerzo» e «Innovación y excelencia» y las descripciones de
departamentos. No incluido (no se pidió): aviso legal y política de privacidad.

---

## 7. Fuentes sobre Formula Student (página Competición)

Texto redactado con palabras propias a partir de estas fuentes oficiales, consultadas en octubre de 2026:

* IMechE — Formula Student: <https://www.imeche.org/events/formula-student/about-formula-student>
* Formula Student Germany: <https://www.formulastudent.de/fsg/about>
* Formula Student Spain: <https://www.formulastudent.es/>

Dirección de la UPCT: <https://www.upct.es/contenido/barra_tareas/contacto.php>
