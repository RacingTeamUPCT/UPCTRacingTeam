/* ==========================================================================
   UPCT Racing Team — Blog
   Lista de noticias con filtros por tema y noticia abierta (blog.html#id).
   Datos: data/blog.js. Si no hay noticias, muestra un aviso de «próximamente».
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var data = UPCT.blog || { categorias: [], posts: [] };
  var esc = UPCT.esc;
  var d = document;
  var list = d.getElementById('lista');
  var listRoot = d.getElementById('blog-root');
  var artSec = d.getElementById('articulo');
  var artRoot = d.getElementById('articulo-root');
  if (!listRoot || !artRoot) { return; }

  var posts = (data.posts || []).slice().sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); });
  var redes = ((UPCT.site || {}).redes || []).filter(function (r) { return r.url; });
  var filter = 'Todo';

  function byId(id) { return posts.filter(function (p) { return p.id === id; })[0] || null; }

  /* ---------- Lista ---------- */
  function emptyState() {
    var social = redes.length ? '<div class="blog-vacio__redes">' + redes.map(function (r, i) {
      return '<a class="btn' + (i ? ' btn--ghost' : '') + '" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + esc(r.nombre) +
        '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>';
    }).join('') + '</div>' : '';
    return '<div class="blog-vacio" data-reveal>' +
      '<h2>Aún no hay noticias</h2>' +
      '<p>Estamos preparando las primeras: piezas nuevas, crónicas de competición y novedades del equipo. Mientras tanto, puedes seguirnos en redes.</p>' +
      social + '</div>';
  }

  function featured(p) {
    var img = p.foto ? '<img src="' + esc(p.foto) + '" alt="' + esc(p.fotoAlt || '') + '" decoding="async">' : '';
    return '<a class="blog-destacado" href="#' + esc(p.id) + '" data-reveal>' + img + '<div>' +
      '<div class="post__meta"><span class="post__cat">' + esc(p.categoria || '') + '</span><span>' + esc(UPCT.formatDate(p.fecha)) + '</span></div>' +
      '<h2>' + esc(p.titulo) + '</h2>' + (p.resumen ? '<p>' + esc(p.resumen) + '</p>' : '') + '</div></a>';
  }

  function renderList() {
    if (!posts.length) { listRoot.innerHTML = emptyState(); UPCT.reveal(listRoot); return; }

    var cats = (data.categorias || []).filter(function (c) {
      return posts.some(function (p) { return p.categoria === c; });
    });
    var visible = posts.filter(function (p) { return filter === 'Todo' || p.categoria === filter; });

    var filters = cats.length > 1
      ? '<ul class="blog-filtros" aria-label="Temas">' + ['Todo'].concat(cats).map(function (c) {
          return '<li><button type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === filter) + '">' + esc(c) + '</button></li>';
        }).join('') + '</ul>'
      : '';

    /* Todas las noticias son tarjetas (título, vídeo o foto, comienzo del texto y «Leer más»); la más reciente, más ancha */
    listRoot.innerHTML = filters +
      '<ul class="posts" role="list">' + visible.map(function (p, i) { return UPCT.postCard(p, i === 0); }).join('') + '</ul>';
    UPCT.reveal(listRoot);
  }

  listRoot.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-cat]');
    if (!b) { return; }
    filter = b.getAttribute('data-cat');
    renderList();
  });

  /* ---------- Noticia abierta ---------- */
  function renderArticle(p) {
    p = UPCT.loc(p);
    /* Orden: vídeo (o foto) arriba del todo, luego título y cuerpo */
    var media = p.video
      ? '<figure>' + UPCT.postVideo(p) + '</figure>'
      : (p.foto ? '<figure><img src="' + esc(p.foto) + '" alt="' + esc(p.fotoAlt || '') + '" decoding="async"></figure>' : '');
    artRoot.innerHTML = '<div class="blog-articulo">' +
      '<p><a class="link-line" href="blog.html">Volver al blog</a></p>' +
      media +
      '<div class="post__meta"><span class="post__cat">' + esc(p.categoria || '') + '</span><span>' + esc(UPCT.formatDate(p.fecha)) + '</span>' +
        (p.autor ? '<span>' + esc(p.autor) + '</span>' : '') + '</div>' +
      '<h1>' + esc(p.titulo) + '</h1>' +
      (p.cuerpo || []).map(function (t) { return '<p>' + UPCT.richText(t) + '</p>'; }).join('') +
    '</div>';
    d.title = p.titulo + ' · UPCT Racing Team';   /* p ya está en el idioma actual */
  }

  function route(keepScroll) {
    var id = decodeURIComponent((location.hash || '').slice(1));
    var p = id ? byId(id) : null;
    if (p) {
      list.hidden = true; artSec.hidden = false; renderArticle(p);
      if (!keepScroll) { window.scrollTo(0, 0); }
    } else {
      artSec.hidden = true; list.hidden = false; d.title = 'Blog · UPCT Racing Team';
    }
  }

  renderList();
  route();
  window.addEventListener('hashchange', function () { route(); });
  /* Al cambiar de idioma se vuelven a pintar las noticias (lista y artículo) en el idioma elegido */
  document.addEventListener('upct:lang', function () { renderList(); route(true); });
})();
