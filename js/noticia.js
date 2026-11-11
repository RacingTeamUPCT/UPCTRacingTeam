/* ==========================================================================
   UPCT Racing Team — Página de una noticia (blog/<id>.html)
   El identificador sale del nombre de la página. Datos: data/blog.js (generado desde content/blog/*.md).
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var root = document.getElementById('articulo-root');
  if (!root || !UPCT.blog || !UPCT.postArticle) { return; }

  var id = decodeURIComponent((location.pathname.split('/').pop() || '').replace(/\.html$/, ''));
  var post = (UPCT.blog.posts || []).filter(function (p) { return p.id === id; })[0];

  function paint() {
    if (!post) {
      root.innerHTML = '<div class="blog-articulo"><p><a class="link-line" href="blog.html">Volver al blog</a></p>' +
        '<h1>Esta noticia no existe</h1></div>';
      return;
    }
    root.innerHTML = UPCT.postArticle(post);
    document.title = UPCT.loc(post).titulo + ' · UPCT Racing Team';   /* post ya está en el idioma actual */
  }

  paint();
  document.addEventListener('upct:lang', paint);   /* modo sin build: se vuelve a pintar en el idioma elegido */
  UPCT.reveal(document);
})();
