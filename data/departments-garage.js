/* ==========================================================================
   UPCT Racing Team — Garaje: los 9 departamentos
   --------------------------------------------------------------------------
   Alimenta la lista de la página Garaje. Cada elemento:

   · id            identificador del departamento (coincide con "ancla" en data/team.js)
   · nombre        nombre que se muestra
   · descripcion   una frase de a qué se dedica el departamento.
                   PROPUESTA editable (propuesta: true).
   · url           enlace «Ver al equipo del departamento» (la sección en equipo.html), dentro del desplegable
   · detalle       EXPLICACIÓN A FONDO que se ve al abrir el departamento en Garaje: una lista de
                   párrafos, p. ej. ["Primer párrafo.", "Segundo párrafo."]. Vacío = se muestra [PENDIENTE].
   · fotos         (poner null en una posición deja ese hueco en blanco) fotos del desplegable: [{ src: "assets/img/garaje/motor-1.jpg", alt: "Descripción" }, …].
                   Vacío = se muestran tres huecos en blanco hasta que lleguen las fotos.
   · zonaCoche     FASE 2 — VACÍO a propósito. Cuando exista el modelo 3D (coche.glb),
                   aquí se escribirá el nombre de la malla / zona del coche que se
                   asocia a este departamento (clic en la zona → ir a su departamento).
                   La fase 1 no lo usa.

   Mantén los nombres y anclas alineados con data/team.js.
   ========================================================================== */
window.UPCT = window.UPCT || {};

UPCT.garaje = {
  departamentos: [
    {
      id: "marketing",
      nombre: "Marketing",
      descripcion: "Da voz al equipo: comunicación, redes sociales, imagen de marca y relación con patrocinadores.",
      propuesta: true,
      url: "equipo.html#marketing",
      zonaCoche: "",
      detalle: ["Es la voz del equipo hacia el exterior. Lleva las redes sociales y la comunicación, mantiene el contacto con las empresas e instituciones que nos apoyan y se ocupa de la gestión de patrocinadores y de los presupuestos. También organiza los eventos del equipo, para que el proyecto llegue a más gente y pueda seguir creciendo temporada tras temporada."],
      fotos: []
    },
    {
      id: "motor",
      nombre: "Motor",
      descripcion: "Diseña, prepara y pone a punto la unidad de potencia para ganar rendimiento sin perder fiabilidad.",
      propuesta: true,
      url: "equipo.html#motor",
      zonaCoche: "",
      detalle: ["Se encarga de la unidad de potencia del coche, el corazón que mueve al monoplaza. Estudia cómo obtener el mejor rendimiento sin perder fiabilidad, prepara el motor y lo pone a punto para cada prueba, y trabaja de la mano de transmisión, chasis y electrónica para que todo encaje en el coche."],
      fotos: []
    },
    {
      id: "aerodinamica",
      nombre: "Aerodinámica",
      descripcion: "Esculpe el flujo de aire alrededor del coche para generar carga con la mínima resistencia.",
      propuesta: true,
      url: "equipo.html#aerodinamica",
      zonaCoche: "",
      detalle: ["Estudia todos los fluidos que pasan por el monoplaza, tanto el aire que lo rodea como el que circula por sus conductos, y diseña los elementos aerodinámicos del coche: alerones y el resto del paquete aerodinámico. Busca generar carga con la mínima resistencia, y también trabaja con materiales compuestos, ligeros y resistentes."],
      fotos: []
    },
    {
      id: "chasis",
      nombre: "Chasis",
      descripcion: "Diseña y fabrica la estructura del monoplaza: rígida, segura y ligera.",
      propuesta: true,
      url: "equipo.html#chasis",
      zonaCoche: "",
      detalle: ["Se ocupa de todo lo relacionado con la estructura primaria del vehículo, la base sobre la que se construye el coche. La diseña para que sea rígida, segura y lo más ligera posible, y define cómo se fijan a ella el resto de partes del monoplaza, de modo que cada departamento tenga su sitio y todo trabaje como un conjunto."],
      fotos: []
    },
    {
      id: "transmision-frenos",
      nombre: "Transmisión y frenos",
      descripcion: "Lleva la potencia a las ruedas y consigue frenadas potentes y estables.",
      propuesta: true,
      url: "equipo.html#transmision-frenos",
      zonaCoche: "",
      detalle: ["Lleva la potencia del motor hasta las ruedas y consigue que el coche frene con precisión. Diseña y pone a punto la transmisión y el sistema de frenos, buscando que la potencia se aproveche bien y que las frenadas sean potentes y estables, en estrecha relación con motor, dinámica y chasis."],
      fotos: []
    },
    {
      id: "electrica",
      nombre: "Eléctrica",
      descripcion: "Es el sistema nervioso del coche: cableado, electrónica, sensores y datos.",
      propuesta: true,
      url: "equipo.html#electrica",
      zonaCoche: "",
      detalle: ["Se encarga de todo lo que tiene parte eléctrica y electrónica del coche: el cableado, la electrónica de control, los sensores y la adquisición de datos. Es el sistema nervioso del monoplaza, que conecta al resto de departamentos y permite analizar cómo se comporta el coche en pista."],
      fotos: [
        { src: "assets/img/garaje/electrica-equipo.jpg",   ancho: 2000, alto: 1500, alt: "El equipo de Eléctrica posando en el taller" },
        { src: "assets/img/garaje/electrica-taller-1.jpg", ancho: 1500, alto: 2000, alt: "Integrantes de Eléctrica trabajando con el cableado del coche y un portátil" },
        { src: "assets/img/garaje/electrica-taller-2.jpg", ancho: 1500, alto: 2000, alt: "Integrantes de Eléctrica reunidos alrededor de la mesa de trabajo del taller" }
      ]
    },
    {
      id: "dinamica",
      nombre: "Dinámica",
      descripcion: "Suspensión, dirección y neumáticos: afina cómo se comporta el coche en cada curva.",
      propuesta: true,
      url: "equipo.html#dinamica",
      zonaCoche: "",
      detalle: ["Trabaja en las suspensiones, la dirección y en todo lo que tiene que ver con la dinámica vehicular. Su misión es lograr que el coche sea predecible y rápido en cada curva, ajustando cómo se apoya el monoplaza sobre el asfalto y cómo responde a las órdenes del piloto."],
      fotos: []
    },
    {
      id: "cockpit",
      nombre: "Cockpit",
      descripcion: "Diseña el puesto de conducción: ergonomía, seguridad y confort del piloto.",
      propuesta: true,
      url: "equipo.html#cockpit",
      zonaCoche: "",
      detalle: ["Se encarga de la seguridad y de la ergonomía del habitáculo del piloto. Diseña el puesto de conducción para que sea seguro y cómodo, y para que asiento, volante y pedales queden al alcance justo del piloto, que así puede concentrarse en conducir de principio a fin."],
      fotos: [
        null,   // hueco grande de arriba: en blanco hasta que llegue la foto
        { src: "assets/img/garaje/cockpit-taller-1.jpg", ancho: 1500, alto: 2000, alt: "Integrantes del equipo trabajando en la estructura del monoplaza en el taller" },
        { src: "assets/img/garaje/cockpit-taller-2.jpg", ancho: 1500, alto: 2000, alt: "Integrantes del equipo montando piezas en el chasis del monoplaza" }
      ]
    },
    {
      id: "id",
      nombre: "I+D",
      descripcion: "Investiga y prueba ideas nuevas para las próximas evoluciones del monoplaza.",
      propuesta: true,
      url: "equipo.html#id",
      zonaCoche: "",
      detalle: ["Es el departamento de investigación y desarrollo: explora ideas nuevas y las prueba antes de llevarlas al coche. Estudia mejoras para las próximas evoluciones del monoplaza, apoya a los demás departamentos con análisis y propuestas, y ayuda a que el equipo siga avanzando de una temporada a otra."],
      fotos: []
    }
  ]
};
