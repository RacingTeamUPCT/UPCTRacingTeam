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

  /* Team leader: bloque aparte, arriba del todo de la página Equipo. Rellena nombre y foto
     (suelta la foto en assets/img/team/ y cambia "foto"; con original: true se muestra tal cual, sin recorte). */
  lider: { titulo: "Team leader", nombre: "Nicole Lengrand", foto: "lider.svg", linkedin: "" },

  departamentos: [
    {
      nombre: "Marketing",
      ancla: "marketing",                    // -> equipo.html#marketing
      descripcion: "Comunicación, imagen de marca, redes sociales y relación con patrocinadores.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Nombre Apellido 1", foto: "marketing-01.svg", linkedin: "" },   // coordinador
        { nombre: "Nombre Apellido 2", foto: "marketing-02.svg", linkedin: "" },
        { nombre: "Nombre Apellido 3", foto: "marketing-03.svg", linkedin: "" },
        { nombre: "Nombre Apellido 4", foto: "marketing-04.svg", linkedin: "" },
        { nombre: "Nombre Apellido 5", foto: "marketing-05.svg", linkedin: "" },
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
        { nombre: "Nombre Apellido 1", foto: "motor-01.svg", linkedin: "" },   // coordinador
        { nombre: "Nombre Apellido 2", foto: "motor-02.svg", linkedin: "" },
        { nombre: "Nombre Apellido 3", foto: "motor-03.svg", linkedin: "" },
        { nombre: "Nombre Apellido 4", foto: "motor-04.svg", linkedin: "" },
        { nombre: "Nombre Apellido 5", foto: "motor-05.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Aerodinámica",
      ancla: "aerodinamica",                    // -> equipo.html#aerodinamica
      descripcion: "Alerones y paquete aerodinámico: generar carga y reducir la resistencia al avance.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Adrián López", foto: "aerodinamica-01.svg", linkedin: "" },   // coordinador
        { nombre: "Nombre Apellido 2", foto: "aerodinamica-02.svg", linkedin: "" },
        { nombre: "Nombre Apellido 3", foto: "aerodinamica-03.svg", linkedin: "" },
        { nombre: "Nombre Apellido 4", foto: "aerodinamica-04.svg", linkedin: "" },
        { nombre: "Nombre Apellido 5", foto: "aerodinamica-05.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Chasis",
      ancla: "chasis",                    // -> equipo.html#chasis
      descripcion: "La estructura del coche: rígida, segura y lo más ligera posible.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Guillermo Galván",        foto: "chasis-01.svg", linkedin: "" },   // coordinador
        { nombre: "Jaime Franco",            foto: "chasis-02.svg", linkedin: "" },
        { nombre: "José Francisco Martínez", foto: "chasis-03.svg", linkedin: "" },
        { nombre: "Miguel Tudela",           foto: "chasis-04.svg", linkedin: "" },
        { nombre: "Francisco Guardiola",     foto: "chasis-05.svg", linkedin: "" },
        { nombre: "Carlos Sánchez",          foto: "chasis-06.svg", linkedin: "" },
        { nombre: "José Manuel Picazo",      foto: "chasis-07.svg", linkedin: "" },
        { nombre: "Sandra Martínez",         foto: "chasis-08.svg", linkedin: "" },
        { nombre: "Ginés Conesa",            foto: "chasis-09.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Transmisión y frenos",
      ancla: "transmision-frenos",                    // -> equipo.html#transmision-frenos
      descripcion: "Llevar la potencia a las ruedas y detener el coche con precisión.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Nombre Apellido 1", foto: "transmision-frenos-01.svg", linkedin: "" },   // coordinador
        { nombre: "Nombre Apellido 2", foto: "transmision-frenos-02.svg", linkedin: "" }
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
        { nombre: "Nombre Apellido 1", foto: "dinamica-01.svg", linkedin: "" },   // coordinador
        { nombre: "Nombre Apellido 2", foto: "dinamica-02.svg", linkedin: "" },
        { nombre: "Nombre Apellido 3", foto: "dinamica-03.svg", linkedin: "" },
        { nombre: "Nombre Apellido 4", foto: "dinamica-04.svg", linkedin: "" },
        { nombre: "Nombre Apellido 5", foto: "dinamica-05.svg", linkedin: "" }
      ]
    },

    {
      nombre: "Cockpit",
      ancla: "cockpit",                    // -> equipo.html#cockpit
      descripcion: "El puesto del piloto: asiento, volante, pedales, ergonomía y seguridad.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Samuel Poveda",     foto: "cockpit-05.webp", original: true, linkedin: "https://www.linkedin.com/in/samuel-poveda-gonz%C3%A1lez-9789a0396/" },   // coordinador
        { nombre: "Javier Ortuño",     foto: "cockpit-02.webp", original: true, linkedin: "" },
        { nombre: "Francisco Peñaranda", foto: "cockpit-03.webp", original: true, linkedin: "" },
        { nombre: "Laura Martínez",    foto: "cockpit-04.webp", original: true, linkedin: "" },
        { nombre: "Nombre Apellido 5", foto: "cockpit-05.svg", linkedin: "" },
        { nombre: "Nombre Apellido 6", foto: "cockpit-06.svg", linkedin: "" }
      ]
    },

    {
      nombre: "I+D",
      ancla: "id",                    // -> equipo.html#id
      descripcion: "Investigación y desarrollo: explorar ideas para futuras evoluciones del coche.",
      descripcionPropuesta: true,
      miembros: [
        { nombre: "Nombre Apellido 1", foto: "id-01.svg", linkedin: "" },   // coordinador
        { nombre: "Nombre Apellido 2", foto: "id-02.svg", linkedin: "" }
      ]
    }
  ]
};
