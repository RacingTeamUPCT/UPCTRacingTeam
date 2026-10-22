/* ==========================================================================
   UPCT Racing Team — Datos generales del sitio
   --------------------------------------------------------------------------
   Aquí viven: nombre, eslogan, logos, menú, misión, valores, contacto,
   redes sociales y dirección.

   · Los textos marcados con  propuesta: true  son una PROPUESTA EDITABLE
     redactada para empezar; cámbialos libremente. Los que llevan
     propuesta: false los ha escrito el equipo.
   · Los datos que faltan se dejan vacíos ("") y la web muestra
     automáticamente un marcador visible  [PENDIENTE: …].
   · Este archivo debe cargarse ANTES que js/components.js.
   ========================================================================== */

window.UPCT = window.UPCT || {};

UPCT.site = {
  nombre: "UPCT Racing Team",
  universidad: "Universidad Politécnica de Cartagena",
  competicion: "Formula Student",

  /* Eslogan — VACÍO a propósito.  [PENDIENTE: eslogan]
     El Inicio deja libre el hueco bajo el nombre del equipo. Cuando haya un eslogan
     nuevo, escríbelo aquí y aparecerá en ese hueco. */
  eslogan: "",

  /* Logo del equipo (cabecera). La web es clara, así que se usa la versión en su color
     original (texto negro y azul) sobre fondo transparente. La versión para fondo oscuro
     (upct-racing-team.png) y el original se guardan en esa misma carpeta.
     ancho / alto = tamaño en píxeles del archivo (evita saltos de maquetación).
     Si el logo ya incluye el nombre del equipo, deja mostrarNombre: false. */
  logo: {
    src: "assets/img/logo/upct-racing-team-color.png",
    alt: "UPCT Racing Team · Formula Student",
    ancho: 1000,
    alto: 334,
    mostrarNombre: false
  },

  /* Logo de la universidad (pie de página, en blanco, enlazado a su web). */
  logoUniversidad: {
    src: "assets/img/logo/upct-blanco.png",
    alt: "Universidad Politécnica de Cartagena",
    url: "https://www.upct.es/",
    ancho: 179,
    alto: 179
  },

  /* Logo del equipo para el pie (versión clara, sobre el azul marino), junto al emblema de la universidad. */
  logoEquipoPie: {
    src: "assets/img/logo/upct-racing-team.png",
    alt: "UPCT Racing Team",
    ancho: 1000,
    alto: 334
  },

  /* Menú principal (el orden es el que aparece en la web). El "id" debe coincidir
     con el atributo current="" de <site-header> en cada página. */
  menu: [
    { id: "inicio",         etiqueta: "Inicio",         href: "index.html" },
    { id: "quienes-somos",  etiqueta: "Nosotros",       href: "quienes-somos.html" },
    { id: "equipo",         etiqueta: "Equipo",         href: "equipo.html" },
    { id: "competicion",    etiqueta: "Competición",    href: "competicion.html" },
    { id: "garaje",         etiqueta: "Garaje",         href: "garaje.html" },
    { id: "blog",           etiqueta: "Blog",           href: "blog.html" },
    { id: "contacto",       etiqueta: "Contacto",       href: "contacto.html" },
    { id: "patrocinadores", etiqueta: "Patrocinadores", href: "patrocinadores.html", boton: true }   /* botón al final del menú */
  ],

  /* Misión y valores (bloque del Inicio). */
  inicioTitulo: "Lo que nos mueve",

  /* Misión — texto escrito por el equipo. */
  mision: {
    propuesta: false,
    titulo: "Misión",
    texto: "Llevar la ingeniería del aula a la pista. Diseñamos, construimos y perfeccionamos un monoplaza propio que participe en competiciones de Formula Student y lleve el nombre de la Universidad Politécnica de Cartagena a lo más alto."
  },

  /* Máximo 3 o 4 valores. Cada uno: título corto + una frase.
     «Trabajo en equipo» y «Compromiso» los ha escrito el equipo; los otros dos son propuesta. */
  valores: [
    {
      propuesta: true,
      titulo: "Pasión y esfuerzo",
      texto: "Nos mueve el motorsport y lo demostramos con cada hora de taller, de simulación y de pista."
    },
    {
      propuesta: false,
      titulo: "Trabajo en equipo",
      texto: "Coordinamos cada departamento para empujar todos en la misma dirección."
    },
    {
      propuesta: true,
      titulo: "Innovación y excelencia",
      texto: "Probamos, medimos y mejoramos hasta encontrar la mejor solución técnica posible."
    },
    {
      propuesta: false,
      titulo: "Compromiso",
      texto: "Con la universidad que nos impulsa y con los patrocinadores que nos apoyan y nos permiten seguir adelante con el proyecto."
    }
  ],

  /* Contacto.
     · email: dirección que se muestra en la web (con botón para copiarla).
     · formulario: dirección (endpoint) de un servicio de formularios, p. ej. Formspree: "https://formspree.io/f/xxxxxxxx".
       Con ella, el formulario ENVÍA el mensaje al correo del equipo y muestra «Mensaje enviado».
       Mientras esté vacía ("") el formulario abre la aplicación de correo del visitante (mailto), como antes.
       [PENDIENTE: crear el formulario en el servicio elegido y pegar aquí su dirección] */
  contacto: {
    email: "upctracingteam@gmail.com",
    formulario: ""
  },

  /* Instagram.
     · usuario: nombre de la cuenta (sin @).
     · widget: para que la portada muestre SOLO las últimas publicaciones de la cuenta, hay que conectar la cuenta en un servicio
       de «widget de Instagram» y pegar aquí su identificador:
         proveedor: "behold"      → id = el «Feed ID» de behold.so (tiene plan gratis)
         proveedor: "elfsight"    → id = el código de la app de elfsight.com
         proveedor: "lightwidget" → id = el código del widget de lightwidget.com
       Mientras proveedor o id estén vacíos, se muestra una cuadrícula de fotos del equipo que lleva al perfil.
       [PENDIENTE: elegir proveedor, conectar la cuenta de Instagram y pegar el identificador] */
  instagram: {
    usuario: "upct_racing_team",
    url: "https://www.instagram.com/upct_racing_team/",
    widget: { proveedor: "", id: "" }
  },

  /* Año de fundación del equipo: la portada calcula «años de experiencia» con él. */
  fundacion: 2008,

  /* Cifras de la portada. «personas» fija el número de estudiantes del equipo (si lo quitas, se cuentan los de data/team.js). */
  cifras: { personas: 60 },

  /* Redes sociales (se abren en pestaña nueva), con icono en blanco.
     Para añadir otra, copia una línea y escribe su URL completa.
     Iconos disponibles: instagram, linkedin, youtube, x. Cualquier otro id usa un icono genérico.
     Las que tengan la URL vacía se muestran como pendientes en Contacto. */
  redes: [
    { id: "instagram", nombre: "Instagram", url: "https://www.instagram.com/upct_racing_team?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw==" },
    { id: "linkedin",  nombre: "LinkedIn",  url: "https://www.linkedin.com/company/upctracingteam/" }
  ],

  /* Ubicaciones (se muestran en Contacto, cada una con su mapa y su botón a Google Maps).
     · UPCT: dirección oficial publicada en upct.es (Rectorado).
     · Taller: edificio ELDI de la UPCT (Calle del Ángel, s/n, según la propia web de la UPCT).
       [PENDIENTE: confirmar el número/planta exacta del taller dentro del ELDI]
     "mapaBusqueda" es el texto que se busca en Google Maps (sin API key). */
  ubicaciones: [
    {
      id: "upct",
      etiqueta: "Ubicación de la UPCT",
      nombre: "Universidad Politécnica de Cartagena",
      lineas: [
        "Pza. del Cronista Isidoro Valverde, Edif. La Milagrosa",
        "30202 Cartagena (Murcia)"
      ],
      mapaBusqueda: "Universidad Politécnica de Cartagena, Plaza del Cronista Isidoro Valverde, 30202 Cartagena"
    },
    {
      id: "taller",
      etiqueta: "Ubicación del taller del equipo",
      nombre: "Edificio ELDI · UPCT",
      lineas: [
        "Calle del Ángel, s/n",
        "30202 Cartagena (Murcia)"
      ],
      mapaBusqueda: "Edificio ELDI, Universidad Politécnica de Cartagena, Calle del Ángel, 30202 Cartagena"
    }
  ]
};
