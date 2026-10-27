/* ==========================================================================
   UPCT Racing Team — Equipo
   --------------------------------------------------------------------------
   Pinta los departamentos y sus integrantes desde data/team.js, y se encarga de:
   · el índice de departamentos (columna fija en escritorio / barra en móvil)
   · marcar la sección visible mientras se hace scroll
   · resaltar la sección al llegar desde un ancla (equipo.html#aerodinamica)
   · avatares de emergencia si falta el archivo de una foto
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var data = UPCT.team;
  var root = document.getElementById('team-root');
  var indexList = document.getElementById('team-index-list');
  var meta = document.getElementById('team-meta');
  if (!data || !root || !indexList) { return; }

  var esc = UPCT.esc;
  var pad = UPCT.pad;
  var dir = data.carpetaFotos || 'assets/img/team/';
  /* Departamentos por orden alfabético (la Directiva va siempre arriba, aparte) */
  var depts = (data.departamentos || []).slice().sort(function (a, b) { return String(a.nombre).localeCompare(String(b.nombre), 'es', { sensitivity: 'base' }); });
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var total = 0;
  var seenNames = {};
  /* Total de personas: quien está en varios sitios (p. ej. Directiva y su departamento) cuenta una sola vez; los huecos provisionales cuentan todos */
  function countPeople(list) {
    list.forEach(function (p) {
      var key = String(p.nombre || "").trim().toLowerCase();
      if (!key || /^nombre apellido/.test(key)) { total += 1; return; }
      if (!seenNames[key]) { seenNames[key] = true; total += 1; }
    });
  }
  var anyLinkedin = false;

  /* ---------- Avatar de emergencia (SVG en línea) ---------- */
  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    var letters = (parts[0] ? parts[0].charAt(0) : '') + (parts[1] ? parts[1].charAt(0) : '');
    return (letters || '?').toUpperCase();
  }
  function fallbackAvatar(name) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#d3e5f5"/>' +
      '<line x1="110" y1="520" x2="306" y2="-20" stroke="#0054a0" stroke-width="1.5"/>' +
      '<text x="200" y="278" text-anchor="middle" font-family="Arial Narrow,Arial,sans-serif" font-size="170" font-weight="700" fill="#08203d">' +
      esc(initials(name)) + '</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------- Una persona ---------- */
  function member(person, dept, i, role) {
    var name = person.nombre || '';
    var hasLink = !!person.linkedin;
    if (hasLink) { anyLinkedin = true; }

    var img = '<img src="' + esc(dir + person.foto) + '" alt="Retrato de ' + esc(name) + ', ' + esc(dept.nombre) + '"' +
      ' width="' + (person.original ? '1086' : '400') + '" height="' + (person.original ? '1448' : '500') + '" loading="lazy" decoding="async" data-name="' + esc(name) + '">';

    /* original: true → la foto se muestra tal cual (proporción propia, sin recorte ni filtro de color) */
    var cls = 'member__photo' + (person.original ? ' member__photo--original' : '');
    var media = hasLink
      ? '<a class="' + cls + '" href="' + esc(person.linkedin) + '" target="_blank" rel="noopener noreferrer"' +
          ' aria-label="' + esc(name) + ': abrir perfil de LinkedIn (se abre en una pestaña nueva)">' +
          img + '<span class="member__in" aria-hidden="true">' + UPCT.icon('linkedin') + '</span></a>'
      : '<div class="' + cls + '">' + img + '</div>';

    /* El primer miembro de cada departamento es el coordinador */
    return '<li class="member" data-reveal style="--reveal-delay:' + ((i % 4) * 70) + 'ms">' + media +
      '<p class="member__name">' + esc(name) + '</p>' +
      (role ? '<p class="member__role">' + esc(role) + '</p>' : ((person.coordinador || (i === 0 && person.coordinador !== false)) ? '<p class="member__role">Coordinador</p>' : '')) +
    '</li>';
  }

  /* ---------- Un departamento ---------- */
  function department(dept, index) {
    var people = dept.miembros || [];
    countPeople(people);
    var id = esc(dept.ancla);
    return '<section class="dept" id="' + id + '" aria-labelledby="' + id + '-titulo">' +
      '<header class="dept__head" data-reveal>' +
        '<span class="dept__num" aria-hidden="true">' + pad(index + 1) + '</span>' +
        '<div><h2 class="dept__title" id="' + id + '-titulo">' + esc(dept.nombre) + '</h2>' +
          (dept.descripcion ? '<p class="dept__desc">' + esc(dept.descripcion) + '</p>' : '') + '</div>' +
        '<span class="dept__count">' + people.length + (people.length === 1 ? ' persona' : ' personas') + '</span>' +
      '</header>' +
      '<ul class="team-grid" role="list">' +
        people.map(function (p, i) { return member(p, dept, i); }).join('') +
      '</ul>' +
    '</section>';
  }

  /* ---------- Directiva: bloque aparte, arriba del todo (data.directiva en data/team.js) ----------
     Cada persona lleva su cargo en "rol" (p. ej. «Team leader»). */
  function board(group) {
    var people = (group && group.miembros) || [];
    if (!people.length) { return ''; }
    countPeople(people);
    var title = group.titulo || 'Directiva';
    return '<section class="dept dept--directiva" id="directiva" aria-labelledby="directiva-titulo">' +
      '<header class="dept__head" data-reveal>' +
        '<span class="dept__num" aria-hidden="true"></span>' +
        '<div><h2 class="dept__title" id="directiva-titulo">' + esc(title) + '</h2></div>' +
        '<span class="dept__count">' + people.length + (people.length === 1 ? ' persona' : ' personas') + '</span>' +
      '</header>' +
      '<ul class="team-grid" role="list">' +
        people.map(function (p, i) { return member(p, { nombre: title }, i, p.rol || title); }).join('') +
      '</ul>' +
    '</section>';
  }

  root.innerHTML = board(data.directiva) + depts.map(department).join('');

  indexList.innerHTML = depts.map(function (dept, i) {
    return '<li><a class="team-index__link" href="#' + esc(dept.ancla) + '" data-id="' + esc(dept.ancla) + '">' +
      '<span aria-hidden="true">' + pad(i + 1) + '</span>' + esc(dept.nombre) + '</a></li>';
  }).join('');

  if (meta) {
    meta.innerHTML = '<span>' + depts.length + ' departamentos</span><span>' + total + ' personas</span>';
  }
  var hint = document.getElementById('team-hint');
  if (hint && anyLinkedin) { hint.hidden = false; }

  /* Si una foto no existe, se muestra un avatar con las iniciales (nunca una imagen rota) */
  root.addEventListener('error', function (e) {
    var img = e.target;
    if (img && img.tagName === 'IMG' && !img.getAttribute('data-fallback')) {
      img.setAttribute('data-fallback', '1');
      img.src = fallbackAvatar(img.getAttribute('data-name'));
    }
  }, true);

  UPCT.reveal(root);

  /* ---------- Sección activa en el índice ---------- */
  var sections = Array.prototype.slice.call(root.querySelectorAll('.dept'));
  var links = {};
  Array.prototype.forEach.call(indexList.querySelectorAll('a'), function (a) { links[a.getAttribute('data-id')] = a; });
  var current = null;
  var ticking = false;

  function setCurrent(id) {
    if (id === current) { return; }
    current = id;
    Object.keys(links).forEach(function (key) {
      if (key === id) { links[key].setAttribute('aria-current', 'true'); }
      else { links[key].removeAttribute('aria-current'); }
    });
    /* En móvil el índice es una barra con scroll horizontal: mantener visible el activo */
    var active = links[id];
    if (active && indexList.scrollWidth > indexList.clientWidth) {
      var a = active.getBoundingClientRect();
      var l = indexList.getBoundingClientRect();
      indexList.scrollTo({ left: indexList.scrollLeft + (a.left - l.left) - (l.width - a.width) / 2, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  function spy() {
    ticking = false;
    var header = document.querySelector('.site-header');
    var line = (header ? header.offsetHeight : 72) + 140;
    var found = sections.length ? sections[0].id : null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top <= line) { found = s.id; } });
    if (found) { setCurrent(found); }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(spy); }
  }, { passive: true });
  window.addEventListener('resize', spy);
  spy();

  /* ---------- Resalte al llegar desde un ancla ---------- */
  var timer = null;
  function sectionFromHash() {
    var id = location.hash.slice(1);
    try { id = decodeURIComponent(id); } catch (err) { /* se usa tal cual */ }
    var el = id ? document.getElementById(id) : null;
    return el && el.classList.contains('dept') ? el : null;
  }
  function highlight(el) {
    el.classList.remove('is-targeted');
    void el.offsetWidth;                                  /* reinicia la animación */
    el.classList.add('is-targeted');
    window.clearTimeout(timer);
    timer = window.setTimeout(function () { el.classList.remove('is-targeted'); }, 3300);
  }
  function jumpTo(el) {
    var html = document.documentElement;
    html.style.scrollBehavior = 'auto';                   /* llegada directa, sin animar el scroll */
    el.scrollIntoView({ block: 'start' });                /* respeta scroll-margin-top (menú fijo) */
    html.style.scrollBehavior = '';
  }

  var initial = sectionFromHash();
  if (initial) {
    /* El navegador no pudo saltar al ancla al cargar (el contenido no existía aún): lo hacemos aquí */
    jumpTo(initial);
    window.setTimeout(function () { highlight(initial); }, 350);

    /* Si al cargarse la tipografía cambia la altura, recolocamos (solo si aún no se ha tocado el scroll) */
    var moved = false;
    ['wheel', 'touchmove', 'keydown', 'mousedown'].forEach(function (ev) {
      window.addEventListener(ev, function () { moved = true; }, { passive: true, once: true });
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { if (!moved) { jumpTo(initial); } });
    }
  }

  /* Desde el índice u otros enlaces de esta misma página */
  window.addEventListener('hashchange', function () {
    var el = sectionFromHash();
    if (el) { highlight(el); }
  });
})();
