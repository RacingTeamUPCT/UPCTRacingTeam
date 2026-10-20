/* ==========================================================================
   UPCT Racing Team — Utilidades del blog (compartidas por Inicio y Blog)
   Se carga antes de js/home.js y js/blog.js. Datos: data/blog.js
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = (window.UPCT = window.UPCT || {});
  var esc = UPCT.esc || function (v) { return String(v == null ? '' : v); };
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  /* «2026-10-12» → «12 oct 2026» */
  UPCT.formatDate = function (iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) { return ''; }
    return parseInt(m[3], 10) + ' ' + MESES[parseInt(m[2], 10) - 1] + ' ' + m[1];
  };

  /* Tarjeta de una noticia (lleva a blog.html#id) */
  UPCT.postCard = function (p) {
    var img = p.foto
      ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.fotoAlt || '') + '" loading="lazy" decoding="async">'
      : '';
    return '<li class="post" data-reveal><a href="blog.html#' + esc(p.id) + '">' + img +
      '<div class="post__meta"><span class="post__cat">' + esc(p.categoria || '') + '</span><span>' + esc(UPCT.formatDate(p.fecha)) + '</span></div>' +
      '<h3>' + esc(p.titulo) + '</h3>' +
      (p.resumen ? '<p>' + esc(p.resumen) + '</p>' : '') +
    '</a></li>';
  };
})();
