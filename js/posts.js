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

  /* Texto con enlaces: «[texto](url)» → <a>. El resto del texto se escapa. */
  UPCT.richText = function (t) {
    return esc(t).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (all, label, url) {
      return '<a class="link-line" href="' + url + '" target="_blank" rel="noopener noreferrer">' + label +
        '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>';
    });
  };

  /* Vídeo de una noticia (con controles). preload="metadata" + #t=0.1 muestra un fotograma sin descargarlo entero. */
  UPCT.postVideo = function (p) {
    if (!p.video) { return ''; }
    return '<video class="post__video" controls playsinline preload="metadata" src="' + esc(p.video) + '#t=0.1"' +
      ' aria-label="' + esc(p.videoAlt || p.titulo) + '"></video>';
  };

  /* Comienzo del cuerpo: el resumen, o el primer párrafo cortado en una palabra */
  UPCT.postExcerpt = function (p, max) {
    if (p.resumen) { return p.resumen; }
    var t = String((p.cuerpo || [])[0] || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    max = max || 210;
    if (t.length <= max) { return t; }
    var cut = t.slice(0, max);
    return cut.slice(0, Math.max(cut.lastIndexOf(' '), 0)).replace(/[\s,.;:]+$/, '') + '…';
  };

  /* Tarjeta de una noticia: título, vídeo (o foto), comienzo del texto y «Leer más» (lleva a blog.html#id) */
  UPCT.postCard = function (p, wide) {
    var href = 'blog.html#' + esc(p.id);
    var media = p.video
      ? UPCT.postVideo(p)
      : (p.foto ? '<a class="post__media" href="' + href + '" tabindex="-1" aria-hidden="true"><img src="' + esc(p.foto) + '" alt="' + esc(p.fotoAlt || '') + '" loading="lazy" decoding="async"></a>' : '');
    var excerpt = UPCT.postExcerpt(p);
    return '<li class="post' + (wide ? ' post--wide' : '') + '" data-reveal>' +
      '<div class="post__meta"><span class="post__cat">' + esc(p.categoria || '') + '</span><span>' + esc(UPCT.formatDate(p.fecha)) + '</span></div>' +
      '<h3><a href="' + href + '">' + esc(p.titulo) + '</a></h3>' +
      media +
      (excerpt ? '<p>' + esc(excerpt) + '</p>' : '') +
      '<a class="link-line post__more" href="' + href + '">Leer más<span class="visually-hidden"> sobre «' + esc(p.titulo) + '»</span></a>' +
    '</li>';
  };
})();
