/* ==========================================================================
   UPCT Racing Team — Comportamientos comunes a todas las páginas
   --------------------------------------------------------------------------
   · Cabecera: transparente arriba, sólida en negro al hacer scroll
   · Menú móvil accesible (teclado, Esc, foco atrapado, scroll bloqueado)
   · Aparición suave al hacer scroll  (UPCT.reveal)
   · Transición entre páginas: fundido breve, con precarga al pasar el ratón
   · Textos enlazados a data/site.js mediante data-site="ruta.del.dato"
   Se carga con "defer" después de components.js.
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = (window.UPCT = window.UPCT || {});
  var d = document;
  var root = d.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 0. Cada página empieza arriba ----------
     Al cambiar de página con el menú, la nueva página se abre desde el principio y no a la altura
     en la que estaba la anterior (el navegador, o el marco donde se muestra la web, podían conservarla).
     scrollIntoView también sube el marco contenedor. Si la dirección lleva #ancla, se respeta. */
  var userScrolled = false;
  ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(function (ev) {
    window.addEventListener(ev, function () { userScrolled = true; }, { passive: true, once: true });
  });
  function toTop() {
    if (location.hash || userScrolled) { return; }
    try { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); } catch (err) { window.scrollTo(0, 0); }
    try { root.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (err) { /* sin soporte */ }
  }
  if ('scrollRestoration' in window.history) { window.history.scrollRestoration = 'manual'; }
  toTop();
  window.addEventListener('load', toTop);
  window.addEventListener('pageshow', function (e) { if (e.persisted) { userScrolled = false; toTop(); } });

  /* ---------- 1. Cabecera: transparente → sólida ---------- */
  var header = d.querySelector('.site-header');
  var ticking = false;

  function updateHeader() {
    ticking = false;
    if (header) { header.classList.toggle('is-solid', window.scrollY > 24); }
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateHeader); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();

  /* ---------- 2. Menú móvil ---------- */
  var toggle = header && header.querySelector('.nav-toggle');
  var nav = header && header.querySelector('.nav');
  var menuOpen = false;
  var inertTargets = [d.querySelector('main'), d.querySelector('.site-footer')].filter(Boolean);

  function setMenu(open, returnFocus) {
    if (!toggle || open === menuOpen) { return; }
    menuOpen = open;
    header.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    var label = open ? 'Cerrar menú' : 'Abrir menú';
    toggle.setAttribute('aria-label', UPCT.i18n ? UPCT.i18n.t(label) : label);
    inertTargets.forEach(function (el) {
      if (open) { el.setAttribute('inert', ''); } else { el.removeAttribute('inert'); }
    });
    if (open) {
      var first = nav.querySelector('a');
      if (first) { window.setTimeout(function () { first.focus({ preventScroll: true }); }, 60); }
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(!menuOpen, true); });

    d.addEventListener('keydown', function (e) {
      if (!menuOpen) { return; }
      if (e.key === 'Escape') { setMenu(false, true); return; }
      if (e.key === 'Tab') {                       /* el foco no sale del menú abierto */
        var items = Array.prototype.slice.call(header.querySelectorAll('a[href], button'));
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && d.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && d.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) { setMenu(false, false); }
    });

    var desktop = window.matchMedia('(min-width: 1081px)');
    var onBreakpoint = function (e) { if (e.matches) { setMenu(false, false); } };
    if (desktop.addEventListener) { desktop.addEventListener('change', onBreakpoint); }
    else if (desktop.addListener) { desktop.addListener(onBreakpoint); }
  }

  /* ---------- 3. Aparición al hacer scroll ---------- */
  var observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 14% 0px', threshold: 0 });     /* aparece un poco ANTES de entrar en pantalla: nunca se ve llegar tarde */
  }

  /* UPCT.reveal(contenedor): activa la aparición de los [data-reveal] de un
     contenedor. Las páginas que generan contenido con JS lo llaman al terminar. */
  UPCT.reveal = function (scope) {
    var nodes = (scope || d).querySelectorAll('[data-reveal]');
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.getAttribute('data-reveal-bound')) { return; }
      el.setAttribute('data-reveal-bound', '1');
      if (!observer || reduceMotion.matches) { el.classList.add('is-visible'); return; }
      /* Lo que ya está a la vista al cargar (o dentro de una pantalla de distancia) se muestra de golpe, sin animación ni parpadeo */
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) { el.classList.add('is-instant', 'is-visible'); return; }
      observer.observe(el);
    });
  };

  /* Marcador: los años de «Hitos destacados» ruedan durante 0,35 s al entrar en pantalla */
  function rollYear(el) {
    var to = parseInt(el.textContent, 10);
    if (!to) { return; }
    var from = to - 40, t0 = window.performance.now(), dur = 350;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? String(Math.round(from + (to - from) * e)) : String(to);
      if (p < 1) { window.requestAnimationFrame(step); }
    })(t0);
  }
  var years = d.querySelectorAll('.hito__year');
  if (years.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
    var yearObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        yearObs.unobserve(entry.target);
        rollYear(entry.target);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(years, function (el) { yearObs.observe(el); });
  }

  /* ---------- 4. Textos enlazados a data/site.js ---------- */
  function lookup(path) {
    return path.split('.').reduce(function (obj, key) { return obj == null ? obj : obj[key]; }, UPCT.site);
  }
  Array.prototype.forEach.call(d.querySelectorAll('[data-site]'), function (el) {
    var value = lookup(el.getAttribute('data-site'));
    if (value) { el.textContent = value; }
  });

  /* Iconos: <span data-icon="arrow"></span> */
  Array.prototype.forEach.call(d.querySelectorAll('[data-icon]'), function (el) {
    el.innerHTML = UPCT.icon(el.getAttribute('data-icon'));
    el.setAttribute('aria-hidden', 'true');
  });

  /* ---------- 5. Transición entre páginas (fundido breve) ---------- */
  var prefetched = {};

  function internalTarget(a) {
    if (!a || !a.href || a.hasAttribute('download')) { return null; }
    if (a.target && a.target !== '_self') { return null; }
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return null; }
    if (url.protocol !== location.protocol || url.host !== location.host) { return null; }
    if (url.pathname === location.pathname && url.search === location.search) { return null; }  /* ancla en la misma página */
    return url;
  }

  function prefetch(url) {
    if (prefetched[url.pathname] || location.protocol === 'file:') { return; }
    prefetched[url.pathname] = true;
    var link = d.createElement('link');
    link.rel = 'prefetch';
    link.href = url.pathname + url.search;
    d.head.appendChild(link);
  }

  d.addEventListener('pointerover', function (e) {
    var url = internalTarget(e.target.closest && e.target.closest('a[href]'));
    if (url) { prefetch(url); }
  }, { passive: true });
  d.addEventListener('focusin', function (e) {
    var url = internalTarget(e.target.closest && e.target.closest('a[href]'));
    if (url) { prefetch(url); }
  });

  d.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
    if (reduceMotion.matches) { return; }
    var url = internalTarget(e.target.closest && e.target.closest('a[href]'));
    if (!url) { return; }
    e.preventDefault();
    root.classList.add('is-leaving');
    window.setTimeout(function () { location.href = url.href; }, 140);
  });

  /* Al volver con "atrás" el navegador puede restaurar la página con el fundido a medias */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { root.classList.remove('is-leaving'); }
  });

  /* ---------- 6. Enlaces externos seguros ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('a[target="_blank"]'), function (a) {
    if (!/noopener/.test(a.rel)) { a.rel = (a.rel + ' noopener noreferrer').trim(); }
  });

  UPCT.reveal(d);
  UPCT.ready = true;
})();
