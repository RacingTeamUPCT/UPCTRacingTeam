/* ==========================================================================
   UPCT Racing Team — El coche (visor 3D de Inicio)
   --------------------------------------------------------------------------
   · modelo   Ruta de un modelo 3D real (.glb) del coche, p. ej. "assets/models/coche.glb".
              Mientras esté vacío ("") el visor muestra la réplica 3D de js/coche3d.js, hecha
              a ojo a partir de las fotos del coche (no es un escaneo ni el CAD). Cuando exista
              el .glb (exportado de SolidWorks o escaneado), escribe aquí su ruta: el visor lo
              usa en lugar de la réplica, y si el archivo falla vuelve a la réplica.
              [PENDIENTE: modelo 3D exacto del coche (.glb); ver assets/models/README.md]
   · vistas   Fotos reales del coche. Solo se usan como RESPALDO si el navegador no puede
              mostrar 3D (sin WebGL o sin conexión con el CDN de Three.js): entonces el visor
              recorre estas fotos al arrastrar. Cada una: id, etiqueta, src, ancho/alto (px) y alt.
   Este archivo debe cargarse ANTES que js/visor.js.
   ========================================================================== */

window.UPCT = window.UPCT || {};

UPCT.coche = {
  /* modo: "foto" → el coche de Inicio es la foto recortada de abajo, integrada en el panel azul (hoy).
           "3d"   → visor 3D que se gira con el ratón (réplica de js/coche3d.js o el .glb de "modelo"). */
  modo: "3d",
  foto: {
    src: "assets/img/coche/recorte.png", ancho: 1200, alto: 663,
    alt: "Monoplaza del UPCT Racing Team, número 261, visto por el costado izquierdo"
  },

  modelo: "assets/models/coche.glb",

  vistas: [
    {
      id: "frontal", etiqueta: "Frontal",
      src: "assets/img/coche/frontal.jpg", ancho: 699, alto: 453,
      alt: "Monoplaza del UPCT Racing Team visto de frente, en la línea de salida del circuito"
    },
    {
      id: "delantera-izquierda", etiqueta: "Delantera izquierda",
      src: "assets/img/coche/delantera-izquierda.jpg", ancho: 576, alto: 323,
      alt: "Monoplaza visto desde arriba, por delante y a la izquierda, con la bandera de España delante"
    },
    {
      id: "lateral-izquierdo", etiqueta: "Lateral izquierdo",
      src: "assets/img/coche/lateral-izquierdo.jpg", ancho: 699, alto: 454,
      alt: "Costado izquierdo del monoplaza, número 261, junto a los boxes del circuito"
    },
    {
      id: "con-el-equipo", etiqueta: "Con el equipo",
      src: "assets/img/coche/con-el-equipo.jpg", ancho: 576, alto: 323,
      alt: "El equipo del UPCT Racing Team posando junto al monoplaza en la línea de salida"
    },
    {
      id: "trasera-derecha", etiqueta: "Trasera derecha",
      src: "assets/img/coche/trasera-derecha.jpg", ancho: 700, alto: 453,
      alt: "Parte trasera y costado derecho del monoplaza, con el motor y el depósito a la vista"
    },
    {
      id: "lateral-derecho", etiqueta: "Lateral derecho",
      src: "assets/img/coche/lateral-derecho.jpg", ancho: 700, alto: 454,
      alt: "Costado derecho del monoplaza, con los logos de los patrocinadores en la carrocería"
    }
  ]
};
