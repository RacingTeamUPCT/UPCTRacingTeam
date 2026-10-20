/* ==========================================================================
   UPCT Racing Team — Patrocinadores
   --------------------------------------------------------------------------
   Esta lista alimenta DOS sitios: la página Patrocinadores y la franja de
   logos del pie de página (que aparece en todas las páginas).

   Cada patrocinador es un objeto dentro de "lista":

   · nombre   nombre de la empresa (se usa en alt, title y como texto si no hay logo)
   · url      web del patrocinador. El logo enlaza ahí en pestaña nueva; el enlace no se
              muestra como texto, solo se ve el logo. Si está vacía, el logo se muestra
              pero no es clicable.
   · logo     ruta del logo dentro de assets/img/sponsors/. Los actuales son versiones en
              BLANCO sobre transparente (recortadas de las capturas del equipo). Si tienes
              los archivos originales (SVG o PNG con fondo transparente), sustitúyelos:
              se verán mejor. Si está vacío, se muestra el nombre en texto.
   · ancho / alto   tamaño en píxeles del archivo de logo (evita saltos de maquetación y
              equilibra el tamaño visual de cada logo en el pie).
   · nivel    prioridad que define el tamaño de la celda en la página Patrocinadores:
                1 = máxima (celda grande) · 2 = media · 3 = pequeña
              Se ordenan por prioridad (el nivel 1 primero; dentro de cada nivel se
              respeta el orden de esta lista).
              [PENDIENTE: niveles de patrocinio] — por ahora todos están en el nivel 2.

   Ejemplo (copia, pega dentro de "lista" y rellena):
     { nombre: "Nombre de la empresa", url: "https://www.empresa.com", logo: "assets/img/sponsors/empresa.png", ancho: 400, alto: 120, nivel: 2 },
   ========================================================================== */
window.UPCT = window.UPCT || {};

UPCT.sponsors = {
  lista: [
    { nombre: "Laser Molina",                                  url: "https://www.lasermolina.com/",                          logo: "assets/img/sponsors/laser-molina.png",           ancho: 440, alto: 206, nivel: 2 },
    { nombre: "Global Composites",                             url: "https://www.globalcomposites.es/",                      logo: "assets/img/sponsors/global-composites.png",      ancho: 440, alto: 150, nivel: 2 },
    { nombre: "Smart Materials 3D",                            url: "https://www.smartmaterials3d.com/",                     logo: "assets/img/sponsors/smart-materials-3d.png",     ancho: 295, alto: 193, nivel: 2 },
    { nombre: "SRG",                                           url: "https://sinergiarg.com/es/",                            logo: "assets/img/sponsors/srg.png",                    ancho: 215, alto: 215, nivel: 2 },
    { nombre: "Ferronaval Suministros Industriales",           url: "https://www.instagram.com/ferronaval/",                 logo: "assets/img/sponsors/ferronaval.png",             ancho: 338, alto: 54,  nivel: 2 },
    { nombre: "Mecanizados JJ Celdrán",                        url: "https://jjceldran.com/",                                logo: "assets/img/sponsors/mecanizados-jj-celdran.png", ancho: 283, alto: 144, nivel: 2 },
    { nombre: "SolidWorks",                                    url: "https://www.solidworks.com/",                           logo: "assets/img/sponsors/solidworks.png",             ancho: 440, alto: 95,  nivel: 2 },
    { nombre: "MTorres",                                       url: "https://mtorres.es/es",                                 logo: "assets/img/sponsors/mtorres.png",                ancho: 440, alto: 152, nivel: 2 },
    { nombre: "Tecsumaga",                                     url: "https://tecsumaga.com/",                                logo: "assets/img/sponsors/tecsumaga.png",              ancho: 280, alto: 240, nivel: 2 },
    { nombre: "Makers",                                        url: "https://www.instagram.com/upctmakers/",                 logo: "assets/img/sponsors/makers.png",                 ancho: 214, alto: 215, nivel: 2 },
    { nombre: "Autoherramientas Ramón",                        url: "https://autoherramientasramon.com/",                    logo: "assets/img/sponsors/autoherramientas-ramon.png", ancho: 440, alto: 78,  nivel: 2 },
    { nombre: "Cartagena Circuito",                            url: "https://www.circuitocartagena.es/",                     logo: "assets/img/sponsors/circuito-cartagena.png",     ancho: 171, alto: 135, nivel: 2 },
    { nombre: "Universidad Politécnica de Cartagena (EUT+)",   url: "https://www.upct.es/",                                  logo: "assets/img/sponsors/upct-eut.png",               ancho: 440, alto: 53,  nivel: 2 },
    { nombre: "Industriales",                                  url: "https://industriales.upct.es/",                         logo: "assets/img/sponsors/industriales.png",           ancho: 351, alto: 240, nivel: 2 },
    { nombre: "IES Politécnico Cartagena",                     url: "https://elpolitecnico.es/",                             logo: "assets/img/sponsors/ies-politecnico.png",        ancho: 256, alto: 96,  nivel: 2 },
    { nombre: "Reciclajes Agumar",                             url: "https://www.desguacereciclajesagumar.es/",              logo: "assets/img/sponsors/reciclajes-agumar.png",      ancho: 419, alto: 98,  nivel: 2 },
    { nombre: "Talleres Daytona",                              url: "https://talleresdaytona.net/daytona-classic/",          logo: "assets/img/sponsors/talleres-daytona.png",       ancho: 331, alto: 94,  nivel: 2 }
  ]
};
