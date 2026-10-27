/* ==========================================================================
   UPCT Racing Team — Inicio
   Pinta, a partir de los datos del equipo (data/*.js):
   · «Síguenos» del héroe, cinta de patrocinadores, cifras del equipo
   · bloque de misión y valores
   · Instagram (widget automático si está configurado; si no, fotos que llevan al perfil)
   · últimas noticias (solo si hay alguna en data/blog.js)
   · patrocinadores y llamada a patrocinar
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var site = UPCT.site;
  if (!site) { return; }

  var esc = UPCT.esc;
  var d = document;
  var sponsors = (UPCT.sponsors && UPCT.sponsors.lista) || [];
  var redes = (site.redes || []).filter(function (r) { return r.url; });
  var insta = site.instagram || {};
  var instaUrl = insta.url || ((redes.filter(function (r) { return r.id === 'instagram'; })[0] || {}).url) || '';

  function $(id) { return d.getElementById(id); }

  /* ---------- «Síguenos» en el héroe ---------- */
  var follow = $('follow');
  if (follow && redes.length) {
    follow.innerHTML = '<span class="follow__label">Síguenos</span>' + redes.map(function (r) {
      return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' + UPCT.icon(r.id) + esc(r.nombre) +
        '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>';
    }).join('');
    follow.hidden = false;
  }

  /* ---------- Cinta de patrocinadores (la lista va duplicada para que el movimiento sea continuo) ---------- */
  var track = $('cinta-track');
  if (track && sponsors.length) {
    var items = sponsors.filter(function (s) { return s.logo; }).map(function (s) {
      return '<li><img src="' + esc(s.logo) + '" alt="' + esc(s.nombre) + '"' +
        (s.ancho && s.alto ? ' width="' + esc(s.ancho) + '" height="' + esc(s.alto) + '"' : '') + ' loading="lazy" decoding="async"></li>';
    }).join('');
    track.innerHTML = items + items.replace(/ alt="[^"]*"/g, ' alt="" aria-hidden="true"');
    $('cinta').hidden = false;
  }

  /* ---------- Cifras (se calculan con los datos, para que no se queden anticuadas) ---------- */
  var grid = $('cifras-grid');
  if (grid) {
    var team = (UPCT.team && UPCT.team.departamentos) || [];
    /* Si data/site.js define cifras.personas, manda ese número; si no, se cuentan los miembros de data/team.js */
    var people = (site.cifras && site.cifras.personas) ||
      team.reduce(function (n, dep) { return n + (dep.miembros || []).length; }, 0);
    var years = new Date().getFullYear() - (site.fundacion || 2008);
    var cifras = [
      { n: years,           t: 'años de experiencia' },
      { n: people,          t: 'estudiantes de la UPCT en el equipo' },
      { n: team.length,     t: 'departamentos, del motor al marketing' },
      { n: sponsors.length, t: 'empresas e instituciones que nos apoyan' }
    ].filter(function (c) { return c.n > 0; });
    grid.innerHTML = cifras.map(function (c) {
      return '<li><span class="cifra__num" data-final="' + esc(c.n) + '">' + esc(c.n) + '</span><span class="cifra__txt">' + esc(c.t) + '</span></li>';
    }).join('');
    if (!cifras.length) { $('cifras').hidden = true; }

    /* Entrada de los números: cambian rápido al azar (~1,3 s) y se paran en la cifra real, una tras otra */
    var nums = Array.prototype.slice.call(grid.querySelectorAll('.cifra__num'));
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function spin(el, delay) {
      var finalText = el.getAttribute('data-final');
      var len = finalText.length;
      var DURATION = 1150;
      el.setAttribute('aria-label', finalText);
      /* Con temporizadores (no con requestAnimationFrame) para que termine siempre a tiempo, aunque la pestaña vaya lenta */
      window.setTimeout(function () {
        var begin = Date.now();
        el.setAttribute('aria-hidden', 'true');
        var iv = window.setInterval(function () {
          if (Date.now() - begin >= DURATION) {
            window.clearInterval(iv);
            el.textContent = finalText;
            el.removeAttribute('aria-hidden');
            return;
          }
          var s = '';
          for (var i = 0; i < len; i++) { s += Math.floor(Math.random() * 10); }
          el.textContent = s;   /* un número nuevo cada ~55 ms */
        }, 55);
      }, delay);
    }
    if (nums.length && !calm && 'IntersectionObserver' in window) {
      /* Arranca en cuanto se ve un poco la franja (o, si ya está a la vista al cargar, al instante); los números reales
         están siempre en el HTML, así que nunca se queda ningún cero a medias */
      var seen = false;
      function run() {
        if (seen) { return; }
        seen = true;
        nums.forEach(function (el, i) { spin(el, i * 90); });
      }
      new IntersectionObserver(function (entries, obs) {
        if (entries.some(function (e) { return e.isIntersecting; })) { obs.disconnect(); run(); }
      }, { threshold: 0, rootMargin: '0px 0px -8% 0px' }).observe($('cifras'));
    }
  }

  /* ---------- Misión y valores ---------- */
  var root = $('mv-root');
  if (root) {
    var mision = site.mision;
    var text = mision ? String(mision.texto || '') : '';
    var cut = text.indexOf('. ');
    var html = cut > 0 ? '<strong>' + esc(text.slice(0, cut + 1)) + '</strong> ' + esc(text.slice(cut + 1).trim()) : esc(text);
    var statement = mision
      ? '<article class="statement" data-reveal>' +
          '<h3 class="label">' + esc(mision.titulo) + '</h3>' +
          '<p class="statement__text">' + html + '</p>' +
        '</article>'
      : '';

    var values = (site.valores || []).map(function (v, i) {
      return '<li class="value" data-reveal style="--reveal-delay:' + (i * 90) + 'ms">' +
        '<h3 class="value__title">' + esc(v.titulo) + '</h3>' +
        '<p class="value__text">' + esc(v.texto) + '</p>' +
      '</li>';
    }).join('');

    root.innerHTML =
      '<div class="mv__grid">' +
        '<div class="mv__intro" data-reveal>' +
          '<h2 class="t-section" id="mv-title">' + esc(site.inicioTitulo || 'Lo que nos mueve') + '</h2>' +
        '</div>' +
        '<div class="mv__statements">' + statement + '</div>' +
      '</div>' +
      '<h3 class="visually-hidden">Valores</h3>' +
      '<ul class="values" role="list">' + values + '</ul>';
  }

  /* ---------- Instagram ---------- */
  var handle = $('insta-handle');
  if (handle && instaUrl) {
    handle.href = instaUrl;
    handle.innerHTML = UPCT.icon('instagram') + '@' + esc(insta.usuario || 'upctracing') +
      '<span class="visually-hidden"> (se abre en una pestaña nueva)</span>';
  }

  /* Widget de Instagram (automático): solo se carga el servicio si hay proveedor e identificador válidos */
  function instagramWidget(host, widget) {
    var id = String(widget.id || '');
    if (!/^[A-Za-z0-9_-]{4,64}$/.test(id)) { return false; }
    function script(src, attrs) {
      var s = d.createElement('script');
      s.src = src;
      Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
      d.body.appendChild(s);
    }
    switch (widget.proveedor) {
      case 'behold':
        host.innerHTML = '<behold-widget feed-id="' + esc(id) + '"></behold-widget>';
        script('https://w.behold.so/widget.js', { type: 'module' });
        return true;
      case 'elfsight':
        host.innerHTML = '<div class="elfsight-app-' + esc(id) + '" data-elfsight-app-lazy></div>';
        script('https://static.elfsight.com/platform/platform.js', { async: '', 'data-use-service-core': '' });
        return true;
      case 'lightwidget':
        host.innerHTML = '<iframe class="insta__lightwidget" src="https://cdn.lightwidget.com/widgets/' + esc(id) + '.html" ' +
          'title="Últimas publicaciones de Instagram" scrolling="no" loading="lazy"></iframe>';
        return true;
      default:
        return false;
    }
  }

  var feed = $('insta-feed');
  if (feed) {
    if (!instagramWidget(feed, insta.widget || {})) {
      /* Sin widget: fotos del equipo que llevan al perfil (no se presentan como publicaciones concretas) */
      var fotos = [
        ['assets/img/coche/frontal.jpg', 699, 454],
        ['assets/img/competicion/pista-14.jpg', 1022, 689],
        ['assets/img/competicion/pista-17.jpg', 766, 1018],
        ['assets/img/coche/con-el-equipo.jpg', 699, 454],
        ['assets/img/competicion/pista-18.jpg', 1064, 721],
        ['assets/img/coche/trasera-derecha.jpg', 699, 454]
      ];
      feed.innerHTML = '<ul class="insta__grid" role="list">' + fotos.map(function (f) {
        return '<li><a href="' + esc(instaUrl) + '" target="_blank" rel="noopener noreferrer" aria-label="Ver el perfil de Instagram del equipo (se abre en una pestaña nueva)">' +
          '<img src="' + esc(f[0]) + '" width="' + f[1] + '" height="' + f[2] + '" alt="" loading="lazy" decoding="async"></a></li>';
      }).join('') + '</ul>';
    }
  }
  var foot = $('insta-foot');
  if (foot && redes.length) {
    foot.innerHTML = redes.map(function (r, i) {
      return '<a class="btn' + (i ? ' btn--ghost' : '') + '" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer">' +
        (i ? '' : 'Seguir en ') + esc(r.nombre) + (i ? '' : ' <span data-icon="arrow"></span>') +
        '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>';
    }).join('');
    Array.prototype.forEach.call(foot.querySelectorAll('[data-icon]'), function (el) {
      el.innerHTML = UPCT.icon(el.getAttribute('data-icon'));
      el.setAttribute('aria-hidden', 'true');
    });
  } else if (!redes.length && $('insta')) {
    $('insta').hidden = true;
  }

  /* ---------- Últimas noticias (solo si hay) ---------- */
  var posts = ((UPCT.blog && UPCT.blog.posts) || []).slice().sort(function (a, b) { return String(b.fecha).localeCompare(String(a.fecha)); }).slice(0, 1);
  var noticias = $('noticias');
  function paintNews() {
    $('noticias-list').innerHTML = posts.map(function (p, i) { return UPCT.postCard ? UPCT.postCard(p, i === 0) : ''; }).join('');
    UPCT.reveal($('noticias-list'));
  }
  if (noticias && posts.length) {
    paintNews();
    noticias.hidden = false;
    document.addEventListener('upct:lang', paintNews);   /* las noticias se vuelven a pintar en el idioma elegido */
  }

  /* ---------- Patrocinadores y llamada a patrocinar ---------- */
  var patro = $('patro');
  var logos = $('patro-logos');
  if (patro && logos && sponsors.length) {
    logos.innerHTML = sponsors.filter(function (s) { return s.logo; }).map(function (s) {
      var img = '<img src="' + esc(s.logo) + '" alt="' + esc(s.nombre) + '"' +
        (s.ancho && s.alto ? ' width="' + esc(s.ancho) + '" height="' + esc(s.alto) + '"' : '') + ' loading="lazy" decoding="async">';
      return '<li>' + (s.url
        ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(s.nombre) + '">' + img +
          '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>'
        : '<span>' + img + '</span>') + '</li>';
    }).join('');
    patro.hidden = false;
  }
  Array.prototype.forEach.call(d.querySelectorAll('#patro [data-icon]'), function (el) {
    el.innerHTML = UPCT.icon(el.getAttribute('data-icon'));
    el.setAttribute('aria-hidden', 'true');
  });

  UPCT.reveal(d);
})();
