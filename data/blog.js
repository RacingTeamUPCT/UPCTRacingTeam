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
  posts: [
    {
      id: "crea-corre-y-gana",
      titulo: "Crea, corre y gana: estrenamos juego",
      fecha: "2026-10-22",
      categoria: "Eventos",
      video: "assets/video/trailer-juego.mp4",
      poster: "assets/img/juego/portada-juego.jpg",
      videoAlt: "Tráiler del juego interactivo «Ingeniero por un día» del UPCT Racing Team",
      cuerpo: [
        "Este año queríamos que nuestro puesto en la Semana de la Ciencia fuera aún más interactivo: queríamos que la gente pudiera ser ingeniera por un rato. Por eso hemos creado un juego interactivo en el que cualquiera, especialmente los más pequeños, puede diseñar su propio monoplaza partiendo de nuestro prototipo.",
        "Elige las piezas, el motor y el circuito, pon a prueba tu diseño en el túnel de viento y compite en carreras para colarte en la clasificación del día. Es una forma sencilla y divertida de descubrir lo que hacemos cada temporada: aerodinámica, compromisos de diseño y mucho trabajo en equipo.",
        "Pero hay un reto más: el presupuesto. Igual que en la competición real, no puedes ponerle a tu coche todo lo que quieras. Tendrás un presupuesto limitado y tendrás que decidir en qué merece la pena gastarlo para construir el mejor coche posible. ¿Más potencia o mejor aerodinámica? ¿Piezas ligeras o fiables? Cada decisión cuenta.",
        "Os dejamos el tráiler para que veáis cómo funciona, y si queréis probarlo, podéis jugar aquí: [Jugar a «Ingeniero por un día»](assets/juego/ingeniero-por-un-dia.html)",
        "¡Os esperamos en nuestro puesto para ver quién marca el mejor tiempo! 🏁"
      ],
      /* Versión en inglés (se muestra al cambiar el idioma de la web a EN) */
      en: {
        titulo: "Create, race and win: we're launching a game",
        videoAlt: "Trailer of the UPCT Racing Team interactive game “Ingeniero por un día”",
        cuerpo: [
          "This year we wanted our stand at Science Week to be even more interactive: we wanted people to be able to be engineers for a while. That's why we've created an interactive game where anyone, especially the little ones, can design their own single-seater starting from our prototype.",
          "Choose the parts, the engine and the circuit, test your design in the wind tunnel and compete in races to make it onto the day's leaderboard. It's a simple and fun way to discover what we do every season: aerodynamics, design trade-offs and a lot of teamwork.",
          "But there's one more challenge: the budget. Just like in the real competition, you can't put everything you want on your car. You'll have a limited budget and will have to decide what's worth spending it on to build the best car possible. More power or better aerodynamics? Lightweight parts or reliable ones? Every decision counts.",
          "We're leaving you the trailer so you can see how it works, and if you want to try it, you can play here: [Play “Ingeniero por un día” (in Spanish)](assets/juego/ingeniero-por-un-dia.html)",
          "We look forward to seeing you at our stand to find out who sets the best time! 🏁"
        ]
      }
    },
    {
      id: "semana-de-la-ciencia-murcia",
      titulo: "El equipo en la Semana de la Ciencia de Murcia",
      fecha: "2026-10-25",
      categoria: "Eventos",
      /* varias fotos: la primera sale en la tarjeta; todas, arriba del artículo */
      fotos: [
        { src: "assets/img/blog/semana-ciencia-1.jpg", ancho: 2000, alto: 1125, alt: "Pantalla del stand con la portada del juego «Ingeniero por un día», junto a un casco y una camiseta del equipo", en: "Stand screen showing the title screen of the game “Ingeniero por un día”, next to a helmet and a team T-shirt" },
        { src: "assets/img/blog/semana-ciencia-2.jpg", ancho: 2000, alto: 1125, alt: "Un niño juega a «Ingeniero por un día» mientras un integrante del equipo le explica el juego", en: "A child plays “Ingeniero por un día” while a team member explains the game" },
        { src: "assets/img/blog/semana-ciencia-3.jpg", ancho: 2000, alto: 1500, alt: "Dos integrantes del equipo atienden a los visitantes junto a la mesa del taller de coches con piezas impresas en 3D", en: "Two team members welcome visitors next to the table of the 3D-printed cars workshop" },
      ],
      cuerpo: [
        "El pasado sábado participamos en la Semana de la Ciencia con un stand de actividades dirigidas al público más joven.",
        "En él presentamos «Ingeniero por un día», un videojuego desarrollado por el propio equipo que ya está disponible en nuestra web.",
        "Además, organizamos dos talleres: uno en el que explicamos el funcionamiento de un motor eléctrico y otro en el que los niños podían montar coches con piezas impresas en 3D.",
        "Acercar la ingeniería a las nuevas generaciones es uno de los objetivos de UPCT Racing Team, y esta jornada nos permitió hacerlo de una forma práctica y cercana.",
        "Gracias a todas las personas que se acercaron a nuestro stand. Esperamos volver a encontrarnos en próximos eventos."
      ],
      en: {
        titulo: "The team at the Science Week in Murcia",
        cuerpo: [
          "Last Saturday we took part in Science Week with a stand of activities aimed at young audiences.",
          "There we presented “Ingeniero por un día”, a video game developed by the team itself that is now available on our website.",
          "We also ran two workshops: one explaining how an electric motor works and another where children could build cars from 3D-printed parts.",
          "Bringing engineering closer to new generations is one of UPCT Racing Team's goals, and this day let us do it in a practical, hands-on way.",
          "Thank you to everyone who came by our stand. We hope to meet again at upcoming events."
        ]
      }
    }
  ]
};
