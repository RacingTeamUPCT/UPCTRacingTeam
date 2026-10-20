/* ==========================================================================
   UPCT Racing Team — Blog
   --------------------------------------------------------------------------
   Alimenta la página Blog y el bloque «Últimas noticias» de la portada.
   De momento NO hay ninguna noticia: la página muestra un aviso de «próximamente»
   y el bloque de la portada no aparece. Cuando añadas la primera, ambos se activan solos.

   Para añadir una noticia, copia este bloque dentro de "posts" y rellénalo (la más nueva, primero):

     {
       id: "nuevo-morro",                       // identificador sin espacios ni tildes (sirve para el enlace: blog.html#nuevo-morro)
       titulo: "Título de la noticia",
       fecha: "2026-10-12",                      // año-mes-día
       categoria: "Taller",                      // una de "categorias"
       autor: "Departamento de Aerodinámica",    // opcional
       resumen: "Una o dos frases para la tarjeta.",
       foto: "assets/img/blog/nuevo-morro.jpg",  // opcional; mejor apaisada (3:2)
       fotoAlt: "Descripción de la foto",        // obligatorio si hay foto
       cuerpo: [                                  // un párrafo por línea
         "Primer párrafo.",
         "Segundo párrafo."
       ]
     }
   ========================================================================== */
window.UPCT = window.UPCT || {};

UPCT.blog = {
  categorias: ["Taller", "Competición", "Patrocinadores", "Equipo", "Eventos"],
  posts: []
};
