/* ==========================================================================
   UPCT Racing Team — Contacto
   · Pinta correo, redes y dirección desde data/site.js (lo que falte → [PENDIENTE: …])
   · Incrusta el mapa de Google Maps (iframe de embed, sin API key)
   · Formulario con validación accesible; al enviar abre el cliente de correo (mailto)
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var site = UPCT.site || {};
  var esc = UPCT.esc;
  var info = document.getElementById('contact-info');
  var mapBox = document.getElementById('contact-map');
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');
  if (!info || !form) { return; }

  var email = (site.contacto && site.contacto.email) || '';
  var places = site.ubicaciones || [];
  var mapUrl = function (p) { return 'https://www.google.com/maps/search/?api=1&amp;query=' + encodeURIComponent(p.mapaBusqueda); };

  /* ---------- Datos de contacto ---------- */
  var mail = email
    ? '<a href="mailto:' + esc(email) + '">' + esc(email) + '</a> ' +
      '<button class="copy-btn" type="button" id="copy-mail" data-copy="' + esc(email) + '">Copiar</button>' +
      '<span class="copy-msg" id="copy-msg" role="status" aria-live="polite"></span>'
    : UPCT.pendiente('correo del equipo');

  var redes = site.redes || [];
  var missingSocials = redes.some(function (r) { return !r.url; });
  var socials = UPCT.socialsMarkup(true) +
    (missingSocials || !redes.length ? '<p class="mt-sm">' + UPCT.pendiente('URLs de redes sociales') + '</p>' : '');

  /* Cada ubicación (UPCT / taller) con su título claro, su dirección y su botón a Google Maps */
  var addresses = places.map(function (p) {
    return '<div class="place place--' + esc(p.id) + '"><p class="place__tag">' + esc(p.etiqueta) + '</p>' +
      '<address><strong>' + esc(p.nombre) + '</strong>' + (p.lineas || []).map(esc).join('<br>') + '</address>' +
      '<p class="mt-sm"><a class="btn btn--link" href="' + mapUrl(p) + '" target="_blank" rel="noopener noreferrer">Abrir en Google Maps <span data-icon="arrow"></span>' +
      '<span class="visually-hidden">(' + esc(p.etiqueta) + '; se abre en una pestaña nueva)</span></a></p></div>';
  }).join('');

  info.innerHTML =
    '<div class="contact-block"><h2 class="label">Correo</h2><p class="contact-block__value">' + mail + '</p></div>' +
    '<div class="contact-block"><h2 class="label">Redes sociales</h2>' + socials + '</div>' +
    '<div class="contact-block"><h2 class="label">Dónde estamos</h2>' + addresses + '</div>';

  Array.prototype.forEach.call(info.querySelectorAll('[data-icon]'), function (el) {
    el.innerHTML = UPCT.icon(el.getAttribute('data-icon'));
    el.setAttribute('aria-hidden', 'true');
  });

  /* ---------- Mapa ---------- */
  if (mapBox && places.length) {
    /* Si el entorno no permite incrustar el mapa (p. ej. una política CSP o un visor con
       marcos bloqueados), se ocultan los recuadros vacíos y quedan los enlaces «Abrir en Google Maps». */
    document.addEventListener('securitypolicyviolation', function (e) {
      if (/google\./.test(e.blockedURI || '')) { mapBox.hidden = true; }
    });
    mapBox.innerHTML = places.map(function (p) {
      return '<figure class="map-card"><figcaption class="place__tag">' + esc(p.etiqueta) + '</figcaption>' +
        '<div class="map"><iframe title="Mapa de Google Maps: ' + esc(p.etiqueta) + '"' +
        ' src="https://www.google.com/maps?q=' + encodeURIComponent(p.mapaBusqueda) + '&amp;output=embed"' +
        ' loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '<a class="map__open" href="' + mapUrl(p) + '" target="_blank" rel="noopener noreferrer">Abrir en Google Maps <span class="visually-hidden">(' + esc(p.etiqueta) + ')</span></a></div></figure>';
    }).join('');
  } else if (mapBox) {
    mapBox.hidden = true;
  }

  /* ---------- Formulario ---------- */
  var fields = {
    nombre:  { el: form.elements.nombre,  msg: 'Escribe tu nombre.',
               ok: function (v) { return v.trim().length >= 2; } },
    correo:  { el: form.elements.correo,  msg: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
               ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
    asunto:  { el: form.elements.asunto,  msg: 'Indica el asunto de tu mensaje.',
               ok: function (v) { return v.trim().length >= 3; } },
    mensaje: { el: form.elements.mensaje, msg: 'Escribe tu mensaje (mínimo 10 caracteres).',
               ok: function (v) { return v.trim().length >= 10; } }
  };

  /* Desde Patrocinadores llega ?asunto=… para rellenar el asunto */
  try {
    var preset = new URLSearchParams(window.location.search).get('asunto');
    if (preset && !fields.asunto.el.value) { fields.asunto.el.value = preset.slice(0, 120); }
  } catch (err) { /* navegadores sin URLSearchParams: se ignora */ }

  function setError(key, message) {
    var f = fields[key];
    var out = document.getElementById('cf-' + key + '-error');
    if (message) {
      f.el.setAttribute('aria-invalid', 'true');
      out.textContent = message;
      out.hidden = false;
    } else {
      f.el.removeAttribute('aria-invalid');
      out.textContent = '';
      out.hidden = true;
    }
  }

  function say(html, isError) {
    statusEl.className = 'form-status' + (isError ? ' form-status--error' : '');
    statusEl.innerHTML = html;
  }

  /* mailto: asunto y cuerpo codificados; el cuerpo incluye nombre y correo de quien escribe */
  function buildMailto(to, values) {
    var message = values.mensaje.trim().replace(/\r?\n/g, '\r\n');
    var body = message + '\r\n\r\n— ' + values.nombre.trim() + ' (' + values.correo.trim() + ')';
    return 'mailto:' + encodeURI(to) + '?subject=' + encodeURIComponent(values.asunto.trim()) + '&body=' + encodeURIComponent(body);
  }
  UPCT.buildMailto = buildMailto;     /* expuesto para pruebas */

  Object.keys(fields).forEach(function (key) {
    var f = fields[key];
    f.el.addEventListener('blur', function () {
      if (f.el.value !== '' || f.el.hasAttribute('aria-invalid')) { setError(key, f.ok(f.el.value) ? '' : f.msg); }
    });
    f.el.addEventListener('input', function () {
      if (f.el.hasAttribute('aria-invalid') && f.ok(f.el.value)) { setError(key, ''); }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    var values = {};

    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      values[key] = f.el.value;
      var valid = f.ok(f.el.value);
      setError(key, valid ? '' : f.msg);
      if (!valid && !firstInvalid) { firstInvalid = f.el; }
    });

    if (firstInvalid) {
      say('Revisa los campos marcados antes de enviar.', true);
      firstInvalid.focus();
      return;
    }
    if (!email) {
      say('Todavía no hay un correo de destino configurado ' + UPCT.pendiente('correo del equipo') +
        '. Cuando se añada en data/site.js, este formulario abrirá tu aplicación de correo con el mensaje preparado.', true);
      return;
    }
    /* Con un servicio de formularios configurado (data/site.js → contacto.formulario) el mensaje se ENVÍA desde aquí */
    var endpoint = ((site.contacto || {}).formulario || '').trim();
    if (/^https:\/\//.test(endpoint) && window.fetch) {
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; }
      say('Enviando…', false);
      window.fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nombre: values.nombre.trim(), email: values.correo.trim(), _replyto: values.correo.trim(), asunto: values.asunto.trim(), mensaje: values.mensaje.trim() })
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        form.reset();
        say('✓ Mensaje enviado. Te responderemos lo antes posible.', false);
      }).catch(function () {
        say('No hemos podido enviar el mensaje. Prueba otra vez o escríbenos directamente a ' + esc(email) + '.', true);
      }).then(function () { if (submitBtn) { submitBtn.disabled = false; } });
      return;
    }

    say('Abriendo tu aplicación de correo… Si no se abre, escríbenos directamente a ' + esc(email) + '.', false);
    window.location.href = buildMailto(email, values);
  });

  /* Si el formulario envía por sí solo, el aviso de «se abrirá tu aplicación de correo» sobra */
  (function () {
    var ep = ((site.contacto || {}).formulario || '').trim();
    var hint = form.querySelector('.form__hint');
    if (hint && /^https:\/\//.test(ep)) { hint.textContent = 'Todos los campos son obligatorios.'; }
  })();

  /* Botón «Copiar» del correo */
  var copyBtn = document.getElementById('copy-mail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy');
      var msg = document.getElementById('copy-msg');
      function done(ok) { if (msg) { msg.textContent = ok ? 'Copiado' : 'Selecciona y copia el correo'; window.setTimeout(function () { msg.textContent = ''; }, 2200); } }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); }
        else { done(false); }
      } catch (err) { done(false); }
    });
  }

  UPCT.reveal(document);
})();
