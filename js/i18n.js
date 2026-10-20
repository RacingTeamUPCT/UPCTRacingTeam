/* ==========================================================================
   UPCT Racing Team — Idioma (ES / EN)
   --------------------------------------------------------------------------
   · Español por defecto. El selector del menú (ES / EN con banderas) llama a UPCT.i18n.setLang().
   · En EN recorre la página y cambia cada texto, alt, title, aria-label y los metadatos por su
     traducción de data/i18n-en.js. Al volver a ES restaura exactamente el texto original.
   · Vigila los cambios del DOM: lo que otros scripts pinten después (equipo, garaje, contacto…)
     también se traduce.
   · La elección se recuerda en este navegador (localStorage) y también se puede forzar con ?lang=en.
   Se carga en el <head> (sin defer) ANTES de components.js.
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = (window.UPCT = window.UPCT || {});
  var root = document.documentElement;
  var KEY = 'upct-lang';

  function readStored() { try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { window.localStorage.setItem(KEY, v); } catch (e) { /* sin almacenamiento: se usa solo en esta página */ } }

  var lang = 'es';
  try {
    var q = new URLSearchParams(window.location.search).get('lang');
    if (q === 'en' || q === 'es') { lang = q; store(q); }
    else if (readStored() === 'en') { lang = 'en'; }
  } catch (e) { if (readStored() === 'en') { lang = 'en'; } }

  root.setAttribute('lang', lang);
  if (lang === 'en') {                       // evita ver un instante la página en español
    root.classList.add('i18n-wait');
    window.setTimeout(function () { root.classList.remove('i18n-wait'); }, 2500);
  }

  var records = [];                          // lo que se ha traducido, para poder restaurarlo
  var observer = null;
  var started = false;

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  /* ---------- Traducción de una cadena ---------- */
  var SUFFIX = ' (se abre en una pestaña nueva)';
  function tr(raw) {
    var data = UPCT.i18nEN;
    if (!data) { return null; }
    var s = norm(raw);
    if (!s) { return null; }
    var hit = data.dict[s];
    if (hit) { return hit; }
    var m;
    if ((m = /^\[PENDIENTE: (.+)\]$/.exec(s))) {
      var inner = data.pend[m[1]];
      return '[PENDING: ' + (inner || data.dict[m[1]] || m[1]) + ']';
    }
    if ((m = /^(\d+) personas?$/.exec(s))) { return m[1] + (m[1] === '1' ? ' person' : ' people'); }
    if ((m = /^(\d+) departamentos$/.exec(s))) { return m[1] + ' departments'; }
    if ((m = /^Retrato de (.+), (.+)$/.exec(s))) { return 'Portrait of ' + (tr(m[1]) || m[1]) + ', ' + (tr(m[2]) || m[2]); }
    if ((m = /^Mapa de Google Maps: (.+)$/.exec(s))) { return 'Google Maps map: ' + (tr(m[1]) || m[1]); }
    if ((m = /^(.+): ir a Inicio$/.exec(s))) { return m[1] + ': go to Home'; }
    if ((m = /^No hemos podido enviar el mensaje\. Prueba otra vez o escríbenos directamente a (.+)\.$/.exec(s))) {
      return 'We could not send the message. Try again or write to us directly at ' + m[1] + '.';
    }
    if ((m = /^(.+): abrir perfil de LinkedIn \(se abre en una pestaña nueva\)$/.exec(s))) { return m[1] + ': open LinkedIn profile (opens in a new tab)'; }
    if ((m = /^Abriendo tu aplicación de correo… Si no se abre, escríbenos directamente a (.+)\.$/.exec(s))) {
      return 'Opening your email app… If it does not open, write to us directly at ' + m[1] + '.';
    }
    if (s.length > SUFFIX.length && s.slice(-SUFFIX.length) === SUFFIX) {
      var head = s.slice(0, -SUFFIX.length);
      return (tr(head) || head) + ' (opens in a new tab)';
    }
    if (s.indexOf(' · ') > -1) {             // títulos de página: «Equipo · UPCT Racing Team»
      var parts = s.split(' · '), changed = false;
      var out = parts.map(function (p) { var t = data.dict[p]; if (t) { changed = true; return t; } return p; });
      if (changed) { return out.join(' · '); }
    }
    return null;
  }

  function keepSpaces(original, translated) {
    var lead = /^\s*/.exec(original)[0], trail = /\s*$/.exec(original)[0];
    return lead + translated + trail;
  }

  /* ---------- Recorrido ---------- */
  var ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, SVG: 1, svg: 1 };

  function translateTree(node) {
    if (!node) { return; }
    if (node.nodeType === 3) { translateText(node); return; }
    if (node.nodeType !== 1 || SKIP[node.nodeName] || node.hasAttribute('data-no-i18n')) { return; }

    /* 1) párrafos con negritas o enlaces dentro: se traducen enteros */
    var rich = (UPCT.i18nEN && UPCT.i18nEN.rich) || {};
    var all = [node].concat(Array.prototype.slice.call(node.querySelectorAll('*')));
    all.forEach(function (el) {
      if (el.hasAttribute('data-i18n-done') || !el.children.length || SKIP[el.nodeName]) { return; }
      if (el.closest('[data-i18n-done]')) { return; }
      var key = norm(el.textContent);
      if (key.length > 12 && rich[key]) {
        records.push({ k: 'rich', el: el, es: el.innerHTML });
        el.innerHTML = rich[key];
        el.setAttribute('data-i18n-done', '1');
      }
    });

    /* 2) nodos de texto sueltos */
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    var texts = [], n;
    while ((n = walker.nextNode())) { texts.push(n); }
    texts.forEach(translateText);

    /* 3) atributos */
    var els = [node].concat(Array.prototype.slice.call(node.querySelectorAll('[alt],[title],[aria-label],[placeholder]')));
    els.forEach(function (el) {
      if (!el.getAttribute || el.closest('[data-no-i18n]')) { return; }
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) { return; }
        var cur = el.getAttribute(a), t = tr(cur);
        if (t && t !== cur) { records.push({ k: 'attr', el: el, name: a, es: cur }); el.setAttribute(a, t); }
      });
    });
  }

  function translateText(textNode) {
    var p = textNode.parentNode;
    if (!p || SKIP[p.nodeName] || (p.closest && (p.closest('[data-i18n-done]') || p.closest('[data-no-i18n]')))) { return; }
    var cur = textNode.nodeValue;
    var t = tr(cur);
    if (t && norm(cur) !== t) {
      records.push({ k: 'text', node: textNode, es: cur });
      textNode.nodeValue = keepSpaces(cur, t);
    }
  }

  /* ---------- Título y metadatos ---------- */
  var METAS = ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image:alt"]'];
  function translateHead() {
    var t = tr(document.title);
    if (t) { records.push({ k: 'title', es: document.title }); document.title = t; }
    METAS.forEach(function (sel) {
      var m = document.querySelector(sel);
      if (!m) { return; }
      var cur = m.getAttribute('content'), tt = tr(cur);
      if (tt) { records.push({ k: 'meta', el: m, es: cur }); m.setAttribute('content', tt); }
    });
    var loc = document.querySelector('meta[property="og:locale"]');
    if (loc) { records.push({ k: 'meta', el: loc, es: loc.getAttribute('content') }); loc.setAttribute('content', 'en_GB'); }
  }

  function restoreAll() {
    for (var i = records.length - 1; i >= 0; i--) {
      var r = records[i];
      try {
        if (r.k === 'text') { r.node.nodeValue = r.es; }
        else if (r.k === 'attr') { r.el.setAttribute(r.name, r.es); }
        else if (r.k === 'rich') { r.el.innerHTML = r.es; r.el.removeAttribute('data-i18n-done'); }
        else if (r.k === 'title') { document.title = r.es; }
        else if (r.k === 'meta') { r.el.setAttribute('content', r.es); }
      } catch (e) { /* nodo ya eliminado */ }
    }
    records = [];
  }

  /* ---------- Vigilante del DOM ---------- */
  function observe() {
    if (!observer) {
      observer = new MutationObserver(function (list) {
        observer.disconnect();
        list.forEach(function (m) {
          if (m.type === 'childList') { Array.prototype.forEach.call(m.addedNodes, translateTree); }
          else if (m.type === 'characterData') { translateText(m.target); }
          else if (m.type === 'attributes') { translateTree(m.target); }
        });
        connect();
      });
    }
    connect();
  }
  function connect() {
    if (lang === 'en' && observer) {
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }
  }

  /* ---------- API ---------- */
  function apply() {
    restoreAll();
    if (observer) { observer.disconnect(); }
    root.setAttribute('lang', lang);
    if (lang === 'en') {
      translateHead();
      translateTree(document.body);
      observe();
    }
    root.classList.remove('i18n-wait');
    var btns = document.querySelectorAll('[data-lang-current]');
    Array.prototype.forEach.call(btns, function (b) { b.setAttribute('data-lang-current', lang); });
    document.dispatchEvent(new CustomEvent('upct:lang', { detail: { lang: lang } }));
  }

  UPCT.i18n = {
    get lang() { return lang; },
    t: function (s) { return lang === 'en' ? (tr(s) || s) : s; },
    setLang: function (next) {
      if (next !== 'es' && next !== 'en') { return; }
      if (next === lang) { return; }
      lang = next;
      store(next);
      apply();
    }
  };

  function start() {
    if (started) { return; }
    started = true;
    if (lang === 'en') { apply(); }
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();
