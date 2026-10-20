/* ==========================================================================
   UPCT Racing Team — Patrocinadores
   Pinta la cuadrícula desde data/sponsors.js.
   · Cada logo enlaza a la web del patrocinador en pestaña nueva (alt y title con el nombre).
   · Sin logo → se muestra el nombre en texto. Sin URL → la celda no es clicable.
   · Sin patrocinadores en los datos → 6 celdas provisionales [PENDIENTE: patrocinador].
   · El tamaño de la celda depende del campo "nivel" (1 grande · 2 media · 3 pequeña).
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var grid = document.getElementById('sponsor-grid');
  var note = document.getElementById('sponsor-note');
  if (!grid) { return; }

  var esc = UPCT.esc;
  var list = (UPCT.sponsors && UPCT.sponsors.lista) || [];

  function level(n) {
    n = parseInt(n, 10);
    return n >= 1 && n <= 3 ? n : 2;
  }

  function content(s) {
    var name = s.nombre || 'Patrocinador';
    if (!s.logo) { return '<span class="sponsor__name">' + esc(name) + '</span>'; }
    var dims = (s.ancho && s.alto ? ' width="' + esc(s.ancho) + '" height="' + esc(s.alto) + '"' : '');
    /* Versión en color: assets/img/sponsors/color/<mismo nombre>.png (o el campo "logoColor"). Aparece al pasar el ratón. */
    var color = s.logoColor || s.logo.replace(/sponsors\/([^\/]+)$/, 'sponsors/color/$1');
    return '<span class="sponsor__logo">' +
      '<img class="sponsor__mono" src="' + esc(s.logo) + '" alt="' + esc(name) + '" title="' + esc(name) + '"' + dims +
        ' loading="lazy" decoding="async" data-name="' + esc(name) + '">' +
      '<img class="sponsor__color" src="' + esc(color) + '" alt=""' + dims + ' loading="lazy" decoding="async" aria-hidden="true">' +
    '</span>';
  }

  function cell(s, i) {
    var name = s.nombre || 'Patrocinador';
    var inner = s.url
      ? '<a class="sponsor__link" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(name) + '"' +
          ' aria-label="' + esc(name) + ' (se abre en una pestaña nueva)">' + content(s) + '</a>'
      : '<div class="sponsor__link" title="' + esc(name) + '">' + content(s) + '</div>';
    return '<li class="sponsor sponsor--' + level(s.nivel) + '" data-reveal style="--reveal-delay:' + ((i % 4) * 70) + 'ms">' + inner + '</li>';
  }

  if (list.length) {
    /* Orden por prioridad (nivel 1 primero); dentro de cada nivel se respeta el orden de la lista.
       Cada nivel empieza en una fila nueva para que las filas queden completas. */
    var sorted = list
      .map(function (s, i) { return { s: s, i: i, n: level(s.nivel) }; })
      .sort(function (a, b) { return a.n - b.n || a.i - b.i; });
    var html = '';
    sorted.forEach(function (item, idx) {
      if (idx > 0 && item.n !== sorted[idx - 1].n) { html += '<li class="sponsor-break" role="presentation" aria-hidden="true"></li>'; }
      html += cell(item.s, idx);
    });
    grid.innerHTML = html;
  } else {
    /* [PENDIENTE: patrocinador] × 6 */
    var cells = '';
    for (var i = 0; i < 6; i++) {
      cells += '<li class="sponsor sponsor--2 sponsor--empty" data-reveal style="--reveal-delay:' + ((i % 3) * 70) + 'ms">' +
        '<div class="sponsor__link">' + UPCT.pendiente('patrocinador') + '</div></li>';
    }
    grid.innerHTML = cells;
    if (note) {
      note.innerHTML = UPCT.pendiente('niveles de patrocinio') + ' Cuando se definan, el tamaño de cada celda se ajustará según su prioridad.';
      note.hidden = false;
    }
  }

  /* Si un logo no carga, se muestra el nombre de la empresa en texto */
  grid.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG') {
      if (img.classList.contains('sponsor__color')) { img.remove(); return; }   /* sin versión en color: se queda la gris */
      var label = document.createElement('span');
      label.className = 'sponsor__name';
      label.textContent = img.getAttribute('data-name') || 'Patrocinador';
      img.replaceWith(label);
    }
  }, true);

  UPCT.reveal(grid);
})();
