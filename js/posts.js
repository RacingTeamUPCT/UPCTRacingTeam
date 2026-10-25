/* ==========================================================================
   UPCT Racing Team — Utilidades del blog (compartidas por Inicio y Blog)
   Se carga antes de js/home.js y js/blog.js. Datos: data/blog.js
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = (window.UPCT = window.UPCT || {});
  var esc = UPCT.esc || function (v) { return String(v == null ? '' : v); };
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function isEN() { return !!(UPCT.i18n && UPCT.i18n.lang === 'en'); }

  /* Noticia en el idioma actual: si tiene versión «en» y la web está en inglés, sus campos la sustituyen */
  UPCT.loc = function (p) {
    if (!isEN() || !p.en) { return p; }
    var o = {}, k;
    for (k in p) { o[k] = p[k]; }
    for (k in p.en) { o[k] = p.en[k]; }
    return o;
  };

  /* «2026-10-12» → «12 oct 2026» */
  UPCT.formatDate = function (iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) { return ''; }
    return parseInt(m[3], 10) + ' ' + (isEN() ? MONTHS : MESES)[parseInt(m[2], 10) - 1] + ' ' + m[1];
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
    return '<video class="post__video" controls playsinline preload="metadata"' + (p.poster ? ' poster="' + esc(p.poster) + '"' : '') + ' src="' + esc(p.video) + (p.poster ? '' : '#t=0.1') + '"' +
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

  /* Alt de una foto de la galería (con versión en inglés si la hay) */
  function photoAlt(f) { return (isEN() && f.en) ? f.en : (f.alt || ''); }

  /* Foto principal de una noticia: «foto» suelta o la primera de «fotos» */
  UPCT.postCover = function (p) {
    if (p.fotos && p.fotos.length) { return { src: p.fotos[0].src, alt: photoAlt(p.fotos[0]) }; }
    if (p.foto) { return { src: p.foto, alt: p.fotoAlt || '' }; }
    return null;
  };

  /* Galería de varias fotos para el artículo: una grande y el resto debajo, sin recortar las proporciones al cargar */
  UPCT.postGallery = function (p) {
    var list = p.fotos || [];
    if (!list.length) { return ''; }
    return '<ul class="post-gallery post-gallery--' + Math.min(list.length, 4) + '" role="list">' + list.map(function (f) {
      return '<li><img src="' + esc(f.src) + '" alt="' + esc(photoAlt(f)) + '"' +
        (f.ancho && f.alto ? ' width="' + esc(f.ancho) + '" height="' + esc(f.alto) + '"' : '') + ' loading="lazy" decoding="async"></li>';
    }).join('') + '</ul>';
  };

  /* Tarjeta de una noticia: título, vídeo (o foto), comienzo del texto y «Leer más» (lleva a blog.html#id) */
  UPCT.postCard = function (p, wide) {
    p = UPCT.loc(p);
    var href = 'blog.html#' + esc(p.id);
    var cover = UPCT.postCover(p);
    var media = p.video
      ? UPCT.postVideo(p)
      : (cover ? '<a class="post__media" href="' + href + '" tabindex="-1" aria-hidden="true"><img src="' + esc(cover.src) + '" alt="' + esc(cover.alt) + '" loading="lazy" decoding="async"></a>' : '');
    var excerpt = UPCT.postExcerpt(p);
    return '<li class="post' + (wide ? ' post--wide' : '') + '" data-reveal>' +
      '<div class="post__meta"><span class="post__cat">' + esc(p.categoria || '') + '</span><span>' + esc(UPCT.formatDate(p.fecha)) + '</span></div>' +
      '<h3><a href="' + href + '">' + esc(p.titulo) + '</a></h3>' +
      media +
      (excerpt ? '<p>' + esc(excerpt) + '</p>' : '') +
      '<a class="link-line post__more" href="' + href + '">' + (isEN() ? 'Read more' : 'Leer más') + '<span class="visually-hidden">' + (isEN() ? ' about “' + esc(p.titulo) + '”' : ' sobre «' + esc(p.titulo) + '»') + '</span></a>' +
    '</li>';
  };
})();
