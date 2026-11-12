/* ==========================================================================
   UPCT Racing Team — Garaje
   Pinta la lista de departamentos desde data/departments-garage.js.
   Cada fila es un desplegable (acordeón): al abrirla se ve la explicación a fondo
   del departamento (campo "detalle"), sus fotos (solo si las hay) y un
   enlace a las personas del departamento en equipo.html#ancla.
   · Solo hay uno abierto a la vez. garaje.html#motor abre «Motor» directamente.

   FASE 2: cada fila lleva data-dept (id) y data-zona (zonaCoche). El visor 3D
   podrá usarlos para resaltar la zona del coche al pasar sobre la fila y
   viceversa, sin tocar este archivo.
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var data = UPCT.garaje;
  var list = document.getElementById('garage-list');
  if (!data || !list) { return; }

  var esc = UPCT.esc;

  function photosMarkup(dept) {
    /* Fotos del departamento: primero las de la carpeta assets/img/garaje/<id-del-departamento>/ (las detecta el build y las deja
       en data/garaje-fotos.js) y después las de «fotos» en data/departments-garage.js. Solo se muestran fotos reales: sin fotos
       no aparece ninguna galería y nunca hay huecos en blanco. */
    var fotos = ((UPCT.garajeFotos && UPCT.garajeFotos[dept.id]) || []).concat(dept.fotos || []).filter(Boolean);
    if (!fotos.length) { return ''; }
    return '<ul class="garage-photos" role="list">' + fotos.map(function (f) {
      /* ancho/alto opcionales: con ellos el marco toma la proporción de la foto (sin recorte) */
      var dims = (f.ancho && f.alto) ? ' width="' + esc(f.ancho) + '" height="' + esc(f.alto) + '"' : '';
      var alt = (UPCT.i18n && UPCT.i18n.lang === 'en' && f.en) ? f.en : (f.alt || '');   /* «en»: descripción en inglés (opcional) */
      return '<li class="garage-photos__item"><img src="' + esc(f.src) + '" alt="' + esc(alt) + '"' + dims + ' loading="lazy" decoding="async"></li>';
    }).join('') + '</ul>';
  }

  function panelMarkup(dept, i) {
    var paras = (dept.detalle || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    if (!paras) { paras = '<p>' + UPCT.pendiente('explicación detallada del departamento') + '</p>'; }
    return '<div class="garage-panel" id="gp-' + esc(dept.id) + '" role="region" aria-labelledby="gb-' + esc(dept.id) + '">' +
      '<div class="garage-panel__clip"><div class="garage-panel__body">' +
        '<div class="garage-panel__text">' + paras + '</div>' +
        photosMarkup(dept) +
        '<a class="link-line garage-panel__team" href="' + esc(dept.url) + '">Ver al equipo del departamento</a>' +
      '</div></div>' +
    '</div>';
  }

  /* Departamentos por orden alfabético */
  var ordered = (data.departamentos || []).slice().sort(function (a, b) { return String(a.nombre).localeCompare(String(b.nombre), 'es', { sensitivity: 'base' }); });

  list.innerHTML = ordered.map(function (dept, i) {
    return '<li class="garage-entry" data-reveal style="--reveal-delay:' + (i * 45) + 'ms">' +
      '<button class="garage-item" type="button" id="gb-' + esc(dept.id) + '" aria-expanded="false" aria-controls="gp-' + esc(dept.id) + '"' +
        ' data-dept="' + esc(dept.id) + '" data-zona="' + esc(dept.zonaCoche || '') + '">' +
        '<span class="garage-item__num" aria-hidden="true">' + UPCT.pad(i + 1) + '</span>' +
        '<span class="garage-item__name">' + esc(dept.nombre) + '</span>' +
        '<span class="garage-item__arrow" aria-hidden="true">' + UPCT.icon('chevd') + '</span>' +
        '<span class="garage-item__desc">' + esc(dept.descripcion) + '</span>' +
      '</button>' +
      panelMarkup(dept, i) +
    '</li>';
  }).join('');

  function setOpen(btn, open) {
    btn.setAttribute('aria-expanded', String(open));
    btn.parentNode.classList.toggle('is-open', open);
  }
  function closeAll(except) {
    Array.prototype.forEach.call(list.querySelectorAll('.garage-item[aria-expanded="true"]'), function (b) {
      if (b !== except) { setOpen(b, false); }
    });
  }
  function openById(id, scroll) {
    var btn = id && list.querySelector('.garage-item[data-dept="' + id.replace(/[^\w-]/g, '') + '"]');
    if (!btn) { return false; }
    closeAll(btn);
    setOpen(btn, true);
    if (scroll) { btn.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
    return true;
  }

  list.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.garage-item');
    if (!btn) { return; }
    var open = btn.getAttribute('aria-expanded') !== 'true';
    closeAll(btn);
    setOpen(btn, open);
    if (open && window.history && history.replaceState) { history.replaceState(null, '', '#' + btn.getAttribute('data-dept')); }
  });

  /* Enlace directo: garaje.html#motor */
  if (location.hash.length > 1) { openById(decodeURIComponent(location.hash.slice(1)), true); }
  window.addEventListener('hashchange', function () { openById(decodeURIComponent(location.hash.slice(1)), true); });

  UPCT.reveal(list);
})();
