/* ==========================================================================
   UPCT Racing Team — Equipo (47 personas en 9 departamentos)
   --------------------------------------------------------------------------
   Para añadir, quitar o cambiar a una persona edita SOLO este archivo.

   · El PRIMER miembro de cada departamento es el coordinador: la web escribe
     "Coordinador" debajo de su nombre.
   · nombre:   los actuales ("Nombre Apellido 1"…) son PROVISIONALES.
   · foto:     nombre del archivo dentro de assets/img/team/. Ahora son avatares
               SVG provisionales. Para usar una foto real, suéltala en esa carpeta
               y cambia aquí el nombre (p. ej. "marketing-01.jpg"). Proporción
               recomendada 4:5 (por ejemplo 800 × 1000 px).
   · linkedin: URL completa del perfil. Si está vacío ("") la foto no es clicable.
   · descripcion: una línea por departamento. Es una PROPUESTA editable.
   · El orden de los departamentos es el orden en que aparecen en la página.
   ========================================================================== */
window.UPCT = window.UPCT || {};

UPCT.team = {
  carpetaFotos: "assets/img/team/",

  /* Directiva: bloque aparte, arriba del todo de la página Equipo. Cada persona lleva su cargo en "rol".
     (Suelta la foto en assets/img/team/ y cambia "foto"; con original: true se muestra tal cual, sin recorte.) */
  directiva: {
    titulo: "Directiva",
    miembros: [
      { nombre: "Nicole Lengrand", rol: "Team leader",               foto: "lider.svg", linkedin: "" },
      { nombre: "Sergio García",   rol: "Coordinador business plan", foto: "directiva-sergio-garcia.png", original: true, linkedin: "" },
      { nombre: "Vasile Catalin",  rol: "Secretario",                foto: "motor-vasile-catalin.png",    original: true, linkedin: "" }   // también está en Motor
    ]
  },

  departamentos: [
    {
      nombre: "Marketing",
      ancla: "marketing",                    // -> equipo.html#marketing
      descripcion: "Comunicación, imagen de marca, redes sociales y relación con patrocinadores.",
      descripcionPropuesta: true,
      miembros: [
        /* coordinador: true → lleva la etiqueta «Coordinador» (Marketing tiene dos coordinadores) */
        { nombre: "Iván Sabater",     foto: "marketing-ivan-sabater.png",    original: true, coordinador: true, linkedin: "https://www.linkedin.com/in/iv%C3%A1n-sabater-122244442/" },
        { nombre: "Miren Andollo",    foto: "marketing-miren-andollo.png",   original: true, coordinador: true, linkedin: "" },
        { nombre: "Jorge Perea",      foto: "marketing-jorge-perea.png",     original: true, linkedin: "https://www.linkedin.com/in/jorge-perea-l%C3%B3pez-59389b390/" },
        { nombre: "Álvaro Prieto",    foto: "marketing-alvaro-prieto.png",   original: true, linkedin: "" },
        { nombre: "Joaquín Párraga",  foto: "marketing-joaquin-parraga.png", original: true, linkedin: "" },
        { nombre: "Nombre Apellido 6", foto: "marketing-06.svg", linkedin: "" },
        { nombre: "Nombre Apellido 7", foto: "marketing-07.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Motor",
      ancla: "motor",                    // -> equipo.html#motor
      descripcion: "Diseño, preparación y puesta a punto de la unidad de potencia del monoplaza.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Pablo Alba",        foto: "motor-pablo-alba.png",        original: true, linkedin: "" },   // coordinador
        { nombre: "Alejandro Sánchez", foto: "motor-alejandro-sanchez.png", original: true, linkedin: "" },
        { nombre: "Vasile Catalin",    foto: "motor-vasile-catalin.png",    original: true, linkedin: "" },
        { nombre: "Nombre Apellido 4", foto: "motor-04.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Aerodinámica",
      ancla: "aerodinamica",                    // -> equipo.html#aerodinamica
      descripcion: "Alerones y paquete aerodinámico: generar carga y reducir la resistencia al avance.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Adrián López",        foto: "aerodinamica-adrian-lopez.png", original: true, linkedin: "https://www.linkedin.com/in/adri%C3%A1n-l%C3%B3pez-ram%C3%ADrez-48415a36a/" },   // coordinador (sin foto todavía)
        { nombre: "Javier Marín",        foto: "aerodinamica-javier-marin.png",        original: true, linkedin: "https://www.linkedin.com/in/javier-mar%C3%ADn-higuera-576b10330/" },
        { nombre: "Rocío Cascales",      foto: "aerodinamica-rocio-cascales.png",      original: true, linkedin: "https://www.linkedin.com/in/roc%C3%ADo-cascales-l%C3%B3pez-2381a1446/" },
        { nombre: "Carlos Aroca",        foto: "aerodinamica-carlos-aroca.png",        original: true, linkedin: "https://www.linkedin.com/in/carlos-aroca-p%C3%A9rez-b35a6a386/" },
        { nombre: "Mario Pardo",         foto: "aerodinamica-mario-pardo.png",         original: true, linkedin: "" },
        { nombre: "José Juan Carrasco",  foto: "aerodinamica-jose-juan-carrasco.png",  original: true, linkedin: "https://www.linkedin.com/in/jose-juan-carrasco-molina-693922445/" },
        { nombre: "Adrián Martínez",     foto: "aerodinamica-adrian-martinez.png",     original: true, linkedin: "" },
        { nombre: "Kamila Serrano",      foto: "aerodinamica-kamila-serrano.png",      original: true, linkedin: "https://www.linkedin.com/in/kamila-serrano-005578434/" },
        { nombre: "Mohammed Tamadahte",  foto: "aerodinamica-mohammed-tamadahte.png",  original: true, linkedin: "https://www.linkedin.com/in/mohammed-tamadahte-bachiri-009362446/" }
      ]
    },

    {
      nombre: "Chasis",
      ancla: "chasis",                    // -> equipo.html#chasis
      descripcion: "La estructura del coche: rígida, segura y lo más ligera posible.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Guillermo Galván",        foto: "chasis-guillermo-galvan.png", original: true, linkedin: "" },   // coordinador
        { nombre: "Jaime Franco",            foto: "chasis-jaime-franco.png", original: true, linkedin: "" },
        { nombre: "Jose Francisco Martínez", foto: "chasis-jose-francisco-martinez.png", original: true, linkedin: "" },
        { nombre: "Miguel Tudela",           foto: "chasis-miguel-tudela.png", original: true, linkedin: "" },
        { nombre: "Francisco Guardiola",     foto: "chasis-05.svg", linkedin: "" },
        { nombre: "Carlos Sánchez",          foto: "chasis-carlos-sanchez.png", original: true, linkedin: "" },
        { nombre: "José Manuel Picazo",      foto: "chasis-07.svg", linkedin: "" },
        { nombre: "Sandra Martínez-Cabeza de Vaca",         foto: "chasis-sandra-martinez-cabeza-de-vaca.png", original: true, linkedin: "" },
        { nombre: "Ginés Conesa",            foto: "chasis-gines-conesa.png", original: true, linkedin: "" }
      ]
    },

    {
      nombre: "Transmisión y frenos",
      ancla: "transmision-frenos",                    // -> equipo.html#transmision-frenos
      descripcion: "Llevar la potencia a las ruedas y detener el coche con precisión.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Sergio Múgica",  foto: "transmision-frenos-01.svg", linkedin: "" },   // coordinador
        { nombre: "Antonio Arias",  foto: "transmision-frenos-02.svg", linkedin: "" },
        { nombre: "Jose Francisco", foto: "transmision-frenos-03.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Eléctrica",
      ancla: "electrica",                    // -> equipo.html#electrica
      descripcion: "Cableado, electrónica de control, sensores y adquisición de datos.",
      descripcionPropuesta: true,
      miembros: [
        /* Fotos reales (3:4), tal cual: sin recorte ni cambio de color (original: true). Nombre y primer apellido. */
        { nombre: "Pablo Ubero",  foto: "electrica-pablo.png",        original: true, linkedin: "https://www.linkedin.com/in/pablo-ubero-ram%C3%B3n-/" },   // coordinador
        { nombre: "Miguel Ángel Mota", foto: "electrica-miguel-angel.png", original: true, linkedin: "https://www.linkedin.com/in/miguel-%C3%A1ngel-mota-tom%C3%A1s-201254429/" },
        { nombre: "Moisés Martínez", foto: "electrica-moises.png",       original: true, linkedin: "" },
        { nombre: "Izan González", foto: "electrica-izan.png",         original: true, linkedin: "" },
        { nombre: "Alejandro Hita", foto: "electrica-alejandro.png",    original: true, linkedin: "" },
        { nombre: "Pedro Lucas", foto: "electrica-pedro.png",        original: true, linkedin: "" },
        { nombre: "Cloe Fernández", foto: "electrica-cloe.png",         original: true, linkedin: "" },
        { nombre: "Álvaro Mulero", foto: "electrica-alvaro.png",       original: true, linkedin: "" },
        { nombre: "Irene Calatrava", foto: "electrica-irene.png",        original: true, linkedin: "" },
        { nombre: "Jesús Buitrago", foto: "electrica-jesus.png",        original: true, linkedin: "" }
      ]
    },

    {
      nombre: "Dinámica",
      ancla: "dinamica",                    // -> equipo.html#dinamica
      descripcion: "Suspensión, dirección y neumáticos: el comportamiento del coche en pista.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Alejandro Montoya", foto: "dinamica-01.svg", linkedin: "" },   // coordinador
        { nombre: "Rafael Ramírez",    foto: "dinamica-02.svg", linkedin: "" },
        { nombre: "Sergio Alcaraz",    foto: "dinamica-03.svg", linkedin: "" },
        { nombre: "Sergio de Haro",    foto: "dinamica-04.svg", linkedin: "" },
        { nombre: "Sofia Orenes",      foto: "dinamica-05.svg", linkedin: "" },
        { nombre: "Salsabi Raissouni", foto: "dinamica-06.svg", linkedin: "" },
        { nombre: "Vicente Morales",   foto: "dinamica-07.svg", linkedin: "" },
        { nombre: "Mario Serrano",     foto: "dinamica-08.svg", linkedin: "" },
        { nombre: "Jaime Jover",       foto: "dinamica-09.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Cockpit",
      ancla: "cockpit",                    // -> equipo.html#cockpit
      descripcion: "El puesto del piloto: asiento, volante, pedales, ergonomía y seguridad.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Samuel Poveda",     foto: "cockpit-05.jpg", original: true, linkedin: "https://www.linkedin.com/in/samuel-poveda-gonz%C3%A1lez-9789a0396/" },   // coordinador
        { nombre: "Javier Ortuño",     foto: "cockpit-02.jpg", original: true, linkedin: "" },
        { nombre: "Francisco Peñaranda", foto: "cockpit-03.jpg", original: true, linkedin: "" },
        { nombre: "Laura Martínez",    foto: "cockpit-04.jpg", original: true, linkedin: "" },
        { nombre: "Jorge Fernández",    foto: "cockpit-05.svg", linkedin: "" },   // sin foto todavía
        { nombre: "Laura Escribano",    foto: "cockpit-06.svg", linkedin: "" },
        { nombre: "María Ortín",        foto: "cockpit-07.svg", linkedin: "" },
        { nombre: "Aitor Martín",       foto: "cockpit-08.svg", linkedin: "" },
        { nombre: "Izan Roselló",       foto: "cockpit-09.svg", linkedin: "" }
      ]
    },

    {
      nombre: "I+D",
      ancla: "id",                    // -> equipo.html#id
      descripcion: "Investigación y desarrollo: explorar ideas para futuras evoluciones del coche.",
      descripcionPropuesta: true,
      miembros: [
        /* I+D no tiene coordinador: coordinador: false quita la etiqueta al primer miembro */
        { nombre: "Ginés Cerón",       foto: "id-02.svg", coordinador: false, linkedin: "" },   // sin foto todavía
        { nombre: "Gonzalo Sánchez",   foto: "id-03.svg", linkedin: "" }
      ]
    }
  ]
};
