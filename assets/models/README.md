# Modelo 3D del coche

`coche.glb` es el **CAD real del coche** (SolidWorks, «Ensamblaje con carrocería»), exportado a glTF y simplificado para la web
(≈548 000 triángulos, ≈30 MB, sin perder la forma: la reducción se hizo soldando vértices y con un error geométrico mínimo).

## Cómo se usa

* `data/coche.js` → `modo: "3d"` y `modelo: "assets/models/coche.glb"`.
* `js/visor.js` lo carga con Three.js, lo apoya en el suelo, le pone sombras y reflejos y permite girarlo con el ratón o el dedo.
* Si el `.glb` no carga o el navegador no soporta WebGL, el visor muestra las fotos reales del coche.
* Para volver a la foto recortada en el panel azul: `modo: "foto"`.

## Cómo actualizarlo si cambia el CAD

1. En SolidWorks: Guardar como → `.glb` (o `.gltf`).
2. Simplificar a ~0,5–1 M de triángulos (por ejemplo con meshoptimizer: soldar vértices por posición y simplificar sin bloquear bordes).
3. Sustituir `assets/models/coche.glb`.

## Pendiente

* Los materiales del CAD son genéricos (neumáticos y casi toda la carrocería salen en blanco/gris claro): para un aspecto más
  fotográfico hay que asignar materiales reales (neumático negro mate, carbono, pintura) en el CAD o en Blender.
* Las zonas pinchables por departamento (`zonaCoche` en `data/departments-garage.js`) necesitan mallas con nombres claros.
