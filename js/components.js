/* ==========================================================================
   UPCT Racing Team — Componentes comunes
   --------------------------------------------------------------------------
   Define <site-header current="..."> y <site-footer> UNA sola vez; las siete
   páginas los reutilizan. Se carga en el <head> sin "defer" para que la
   cabecera exista desde el primer pintado. Requiere data/site.js antes.
   También expone utilidades compartidas en window.UPCT (esc, pendiente, icon…).
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = (window.UPCT = window.UPCT || {});
  var root = document.documentElement;
  var site = UPCT.site || {};

  /* La clase .js activa las animaciones de aparición. Si main.js no llegase a
     cargar, la quitamos para no dejar contenido oculto. */
  root.classList.add('js');
  window.setTimeout(function () { if (!UPCT.ready) { root.classList.remove('js'); } }, 4000);

  /* ---------- Utilidades ---------- */
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  UPCT.esc = esc;
  UPCT.pad = pad;

  /* Marcador visible de dato pendiente: [PENDIENTE: …] */
  UPCT.pendiente = function (label) {
    return '<span class="pendiente">[PENDIENTE: ' + esc(label) + ']</span>';
  };

  /* ---------- Iconos (trazo sencillo, 24×24) ---------- */
  var ICONS = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevl: '<path d="m15 5-7 7 7 7"/>',
    chevr: '<path d="m9 5 7 7-7 7"/>',
    chevd: '<path d="m5 9 7 7 7-7"/>',
    orbit: '<path d="M4 12a8 8 0 0 1 14-5.3"/><path d="M18.5 3v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3"/><path d="M5.5 21v-4h4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".7" fill="currentColor"/>',
    youtube: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9.2 5 2.8-5 2.8z" fill="currentColor"/>',
    x: '<path d="M4.5 4.5l15 15M19.5 4.5l-15 15"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="4.5"/><g fill="currentColor" stroke="none" transform="translate(-.6 .3)"><rect x="7" y="10.2" width="2.2" height="6.6"/><circle cx="8.1" cy="7.8" r="1.3"/><path d="M11.2 10.2h2.1v.95c.4-.6 1.1-1.1 2.2-1.1 2.2 0 2.7 1.4 2.7 3.3v3.45h-2.2v-3.1c0-.9-.2-1.6-1.1-1.6s-1.4.7-1.4 1.6v3.1h-2.2z"/></g>'
  };
  UPCT.icon = function (name) {
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[name] || ICONS.link) + '</svg>';
  };

  /* Redes sociales. showMissing = true → muestra también las que aún no tienen URL. */
  UPCT.socialsMarkup = function (showMissing) {
    var redes = site.redes || [];
    var items = redes.map(function (r) {
      if (r.url) {
        return '<li><a class="social" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(r.nombre) + '">' +
          UPCT.icon(r.id) + '<span class="visually-hidden">' + esc(r.nombre) + ' (se abre en una pestaña nueva)</span></a></li>';
      }
      if (!showMissing) { return ''; }
      return '<li><span class="social social--off" role="img" aria-label="' + esc(r.nombre) + ': [PENDIENTE: URL]" title="[PENDIENTE: URL de ' + esc(r.nombre) + ']">' + UPCT.icon(r.id) + '</span></li>';
    }).join('');
    return items ? '<ul class="socials" role="list">' + items + '</ul>' : '';
  };
  UPCT.hasSocials = function () {
    return (site.redes || []).some(function (r) { return !!r.url; });
  };

  /* ---------- <site-header> ---------- */
  function brandMarkup() {
    var logo = site.logo || {};
    var name = site.nombre || 'UPCT Racing Team';
    var words = name.split(' ');
    var first = words.shift();
    var wordmark = '<span class="brand__name">' + esc(first) + (words.length ? ' <span>' + esc(words.join(' ')) + '</span>' : '') + '</span>';

    if (logo.src) {
      var dims = (logo.ancho && logo.alto) ? ' width="' + esc(logo.ancho) + '" height="' + esc(logo.alto) + '"' : ' height="40"';
      return '<img class="brand__img" src="' + esc(logo.src) + '" alt="' + esc(logo.alt || name) + '"' + dims + '>' +
        (logo.mostrarNombre === false ? '' : '<span class="brand__text">' + wordmark + '</span>');
    }
    /* [PENDIENTE: logo] */
    return '<span class="brand__text">' + wordmark + '<span class="brand__pending">[PENDIENTE: logo]</span></span>';
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      if (this.getAttribute('data-ready')) { return; }
      this.setAttribute('data-ready', '1');

      var current = this.getAttribute('current') || '';
      var name = site.nombre || 'UPCT Racing Team';
      var links = (site.menu || []).map(function (item, i) {
        var active = item.id === current;
        return '<li' + (item.boton ? ' class="nav__item--cta"' : '') + '><a class="nav__link' + (item.boton ? ' nav__link--cta' : '') + '" href="' + esc(item.href) + '" style="--i:' + i + '"' + (active ? ' aria-current="page"' : '') + '>' +
          esc(item.etiqueta) + '</a></li>';
      }).join('');
      /* Iconos de Instagram y LinkedIn en el menú (solo las redes que tienen URL) */
      var socialIcons = (site.redes || []).filter(function (r) { return r.url; }).map(function (r) {
        return '<a class="nav__social-link" href="' + esc(r.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(r.nombre) + '">' +
          UPCT.icon(r.id) + '<span class="visually-hidden">' + esc(r.nombre) + ' (se abre en una pestaña nueva)</span></a>';
      }).join('');
      var social = socialIcons ? '<li class="nav__social">' + socialIcons + '</li>' : '';

      this.innerHTML =
        '<a class="skip-link" href="#contenido">Saltar al contenido</a>' +
        '<header class="site-header">' +
          '<div class="site-header__inner">' +
            '<a class="brand" href="index.html" aria-label="' + esc(name) + ': ir a Inicio">' + brandMarkup() + '</a>' +
            '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Abrir menú">' +
              '<span class="nav-toggle__bar"></span><span class="nav-toggle__bar"></span>' +
            '</button>' +
            '<nav class="nav" id="site-nav" aria-label="Principal"><ul class="nav__list" role="list">' + links + social + langSwitcher() + '</ul></nav>' +
          '</div>' +
        '</header>';
      bindLang(this);
    }
  }

  /* ---------- Selector de idioma (ES / EN) ---------- */
  function flag(code) {
    var body = code === 'en'
      ? '<rect width="60" height="40" fill="#012169"/>' +
        '<path d="M0 0 60 40M60 0 0 40" stroke="#fff" stroke-width="8"/>' +
        '<path d="M0 0 60 40M60 0 0 40" stroke="#c8102e" stroke-width="3"/>' +
        '<path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="13"/>' +
        '<path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="8"/>'
      : '<rect width="60" height="40" fill="#aa151b"/><rect y="10" width="60" height="20" fill="#f1bf00"/>';
    return '<svg class="flag" viewBox="0 0 60 40" width="24" height="16" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="flag-' + code + '"><rect width="60" height="40" rx="3"/></clipPath></defs>' +
      '<g clip-path="url(#flag-' + code + ')">' + body + '</g></svg>';
  }
  function currentLang() { return (UPCT.i18n && UPCT.i18n.lang) || 'es'; }
  function langSwitcher() {
    var cur = currentLang();
    return '<li class="nav__lang" data-no-i18n>' +
      '<button class="lang__btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="lang-menu" aria-label="Idioma / Language">' +
        '<span class="lang__flag">' + flag(cur) + '</span><span class="lang__code">' + cur.toUpperCase() + '</span>' +
        '<svg class="lang__caret" viewBox="0 0 12 8" width="10" height="7" aria-hidden="true"><path d="m1 1 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>' +
      '<ul class="lang__menu" id="lang-menu" role="listbox" aria-label="Idioma / Language">' +
        ['es', 'en'].map(function (c) {
          return '<li role="presentation"><button class="lang__opt" type="button" role="option" data-lang="' + c + '" aria-selected="' + (c === cur) + '" lang="' + c + '">' +
            flag(c) + '<span class="lang__code">' + c.toUpperCase() + '</span><span class="lang__name">' + (c === 'es' ? 'Español' : 'English') + '</span></button></li>';
        }).join('') +
      '</ul></li>';
  }
  function bindLang(host) {
    var box = host.querySelector('.nav__lang');
    if (!box) { return; }
    var btn = box.querySelector('.lang__btn');
    function setOpen(open) { box.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open)); }
    function refresh() {
      var cur = currentLang();
      btn.querySelector('.lang__flag').innerHTML = flag(cur).replace(/flag-/g, 'flagb-');
      btn.querySelector('.lang__code').textContent = cur.toUpperCase();
      Array.prototype.forEach.call(box.querySelectorAll('.lang__opt'), function (o) { o.setAttribute('aria-selected', String(o.getAttribute('data-lang') === cur)); });
    }
    btn.addEventListener('click', function () { setOpen(!box.classList.contains('is-open')); });
    box.addEventListener('click', function (e) {
      var opt = e.target.closest && e.target.closest('.lang__opt');
      if (!opt) { return; }
      if (UPCT.i18n) { UPCT.i18n.setLang(opt.getAttribute('data-lang')); }
      refresh();
      setOpen(false);
      btn.focus();
    });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) { setOpen(false); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('is-open')) { setOpen(false); btn.focus(); } });
    document.addEventListener('upct:lang', refresh);
  }

  /* ---------- Piezas del pie ---------- */

  /* Logo de la universidad (en blanco), enlazado a su web */
  function universityLogo() {
    var u = site.logoUniversidad;
    if (!u || !u.src) { return ''; }
    var img = '<img src="' + esc(u.src) + '" alt="' + esc(u.alt || site.universidad || '') + '"' +
      (u.ancho && u.alto ? ' width="' + esc(u.ancho) + '" height="' + esc(u.alto) + '"' : '') + ' loading="lazy" decoding="async">';
    return u.url
      ? '<a class="footer__upct" href="' + esc(u.url) + '" target="_blank" rel="noopener noreferrer">' + img +
          '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>'
      : '<div class="footer__upct">' + img + '</div>';
  }

  /* Logo del equipo + emblema de la universidad, juntos y separados por una línea fina */
  function footerMarks() {
    var t = site.logoEquipoPie;
    var team = (t && t.src)
      ? '<a class="footer__team" href="index.html" aria-label="' + esc(t.alt || site.nombre || '') + ': ir a Inicio">' +
          '<img src="' + esc(t.src) + '" alt="' + esc(t.alt || site.nombre || '') + '"' +
          (t.ancho && t.alto ? ' width="' + esc(t.ancho) + '" height="' + esc(t.alto) + '"' : '') + ' loading="lazy" decoding="async"></a>'
      : '';
    var uni = universityLogo();
    if (!team && !uni) { return ''; }
    return '<div class="footer__marks">' + team + (team && uni ? '<span class="footer__sep" aria-hidden="true"></span>' : '') + uni + '</div>';
  }

  /* Franja de logos de patrocinadores (en blanco). Los datos salen de data/sponsors.js.
     Tamaño visual equilibrado: los logos muy anchos se muestran menos altos y los más
     cuadrados, más altos (misma "área" aparente para todos). */
  var LOGO_AREA = 9;
  function sponsorStrip() {
    var list = (UPCT.sponsors && UPCT.sponsors.lista) || [];
    if (!list.length) { return ''; }
    var items = list.map(function (s) {
      var name = s.nombre || 'Patrocinador';
      var inner;
      if (s.logo) {
        var aspect = (s.ancho && s.alto) ? s.ancho / s.alto : 2.5;
        var h = Math.max(1.1, Math.min(3.1, Math.sqrt(LOGO_AREA / aspect)));
        inner = '<img src="' + esc(s.logo) + '" alt="' + esc(name) + '" data-h="' + h.toFixed(2) + '"' +
          (s.ancho && s.alto ? ' width="' + esc(s.ancho) + '" height="' + esc(s.alto) + '"' : '') + ' loading="lazy" decoding="async">';
      } else {
        inner = '<span class="footer__logo-text">' + esc(name) + '</span>';
      }
      if (s.url) {
        inner = '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer" title="' + esc(name) + '">' + inner +
          '<span class="visually-hidden"> (se abre en una pestaña nueva)</span></a>';
      }
      return '<li>' + inner + '</li>';
    }).join('');
    return '<section class="footer__sponsors" aria-labelledby="footer-sponsors-title">' +
      '<p class="label" id="footer-sponsors-title">Patrocinadores</p>' +
      '<ul class="footer__logos" role="list">' + items + '</ul></section>';
  }

  /* ---------- <site-footer> ---------- */
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      if (this.getAttribute('data-ready')) { return; }
      this.setAttribute('data-ready', '1');

      var name = site.nombre || 'UPCT Racing Team';
      var words = name.split(' ');
      var first = words.shift();
      var email = (site.contacto || {}).email;
      var mail = email
        ? '<a class="footer__mail" href="mailto:' + esc(email) + '">' + esc(email) + '</a>'
        : UPCT.pendiente('correo del equipo');
      var socials = UPCT.hasSocials()
        ? UPCT.socialsMarkup(false)
        : UPCT.pendiente('redes sociales');
      /* <site-footer sin-patrocinadores> oculta la franja (la portada ya tiene su propio bloque) */
      var strip = this.hasAttribute('sin-patrocinadores') ? '' : sponsorStrip();

      /* Orden del pie: nombre + logo de la UPCT → franja de patrocinadores (si toca) →
         una sola fila pequeña con el contacto y lo legal */
      this.innerHTML =
        '<footer class="site-footer">' +
          '<div class="container">' +
            '<div class="footer__top">' +
              '<div class="footer__brand">' +
                '<p class="footer__name">' + esc(first) + (words.length ? ' <span>' + esc(words.join(' ')) + '</span>' : '') + '</p>' +
                '<p class="footer__tagline">Equipo de ' + esc(site.competicion || 'Formula Student') + ' de la ' + esc(site.universidad || 'Universidad Politécnica de Cartagena') + '.</p>' +
              '</div>' +
              footerMarks() +
            '</div>' +
            strip +
            '<div class="footer__bottom">' +
              '<div class="footer__contact"><span class="label">Contacto</span>' + mail + socials + '</div>' +
              '<p class="footer__copy">© ' + new Date().getFullYear() + ' ' + esc(name) + ' · ' + esc(site.universidad || '') + '</p>' +
            '</div>' +
          '</div>' +
        '</footer>';

      /* El tamaño de cada logo se aplica por código, con una variable CSS */
      Array.prototype.forEach.call(this.querySelectorAll('.footer__logos img[data-h]'), function (img) {
        img.style.setProperty('--h', img.getAttribute('data-h'));
      });
    }
  }

  if (window.customElements) {
    if (!customElements.get('site-header')) { customElements.define('site-header', SiteHeader); }
    if (!customElements.get('site-footer')) { customElements.define('site-footer', SiteFooter); }
  }
})();
