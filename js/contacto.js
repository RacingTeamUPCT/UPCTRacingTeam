/* ==========================================================================
   UPCT Racing Team — Contacto
   · Pinta correo, redes y dirección desde data/site.js (lo que falte → [PENDIENTE: …])
   · Incrusta el mapa de Google Maps (iframe de embed, sin API key)
   · Formulario con validación accesible: «Enviar mensaje» (directo desde la web) y «Abrir en mi app de correo» (mailto)
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

  /* ---------- Formulario ----------
     Dos formas de enviar el mismo mensaje:
       · «Enviar mensaje»            → se envía desde la web, sin salir de ella, al correo del equipo (Web3Forms, o el
                                       servicio de data/site.js → contacto.formulario).
       · «Abrir en mi app de correo» → abre la aplicación de correo del visitante con el mensaje preparado (mailto).
     Antispam invisible: campo trampa («sitio_web») que una persona no ve; si llega relleno, el mensaje se descarta. */
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
  var sendBtn = document.getElementById('cf-send');
  var mailBtn = document.getElementById('cf-mailto');
  var honeypot = form.elements.sitio_web;
  var webKey = ((site.contacto || {}).web3formsKey || '').trim();
  var endpoint = ((site.contacto || {}).formulario || '').trim();
  var canSend = !!webKey || /^https:\/\//.test(endpoint);
  var sending = false;

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

  /* Valida los cuatro campos; devuelve sus valores, o null si alguno falla (y deja el foco en el primero) */
  function readValid() {
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
      return null;
    }
    if (!email) {
      say('Todavía no hay un correo de destino configurado ' + UPCT.pendiente('correo del equipo') +
        '. Cuando se añada en data/site.js, este formulario podrá enviar el mensaje.', true);
      return null;
    }
    return values;
  }

  function setSending(on) {
    sending = on;
    [sendBtn, mailBtn].forEach(function (b) { if (b) { b.disabled = on; } });
    if (sendBtn) { if (on) { sendBtn.setAttribute('aria-busy', 'true'); } else { sendBtn.removeAttribute('aria-busy'); } }
  }

  /* «Enviar mensaje»: envío directo desde la web */
  function sendDirect(values) {
    var url, payload;
    if (webKey) {
      url = 'https://api.web3forms.com/submit';
      payload = {
        access_key: webKey,
        subject: values.asunto.trim(),
        from_name: 'Web UPCT Racing Team',
        name: values.nombre.trim(),
        email: values.correo.trim(),
        message: values.mensaje.trim()
      };
    } else {
      url = endpoint;
      payload = { nombre: values.nombre.trim(), email: values.correo.trim(), _replyto: values.correo.trim(), asunto: values.asunto.trim(), mensaje: values.mensaje.trim() };
    }
    setSending(true);
    say('Enviando…', false);
    var timer = null, opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    };
    if (window.AbortController) {                 /* si el servicio no responde en 20 s, se avisa del error */
      var ctl = new AbortController();
      opts.signal = ctl.signal;
      timer = window.setTimeout(function () { ctl.abort(); }, 20000);
    }
    window.fetch(url, opts).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (!res.ok || json.success === false) { throw new Error('HTTP ' + res.status); }
      });
    }).then(function () {
      form.reset();
      say('✓ Mensaje enviado. Te responderemos lo antes posible.', false);
    }).catch(function () {
      say('No hemos podido enviar el mensaje. Prueba otra vez o escríbenos directamente a ' + esc(email) + '.', true);
    }).then(function () {
      if (timer) { window.clearTimeout(timer); }
      setSending(false);
    });
  }

  /* «Abrir en mi app de correo»: el comportamiento de siempre (mailto) */
  function openMailApp(values) {
    say('Abriendo tu aplicación de correo… Si no se abre, escríbenos directamente a ' + esc(email) + '.', false);
    window.location.href = buildMailto(email, values);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) { return; }
    var values = readValid();
    if (!values) { return; }
    if (honeypot && honeypot.value) {             /* robot: se finge el envío y no se manda nada */
      form.reset();
      say('✓ Mensaje enviado. Te responderemos lo antes posible.', false);
      return;
    }
    if (!canSend || !window.fetch) {
      say('El envío directo aún no está activado ' + UPCT.pendiente('clave del formulario en data/site.js') +
        '. Mientras tanto, usa «Abrir en mi app de correo» o escríbenos a ' + esc(email) + '.', true);
      return;
    }
    sendDirect(values);
  });

  if (mailBtn) {
    mailBtn.addEventListener('click', function () {
      if (sending) { return; }
      var values = readValid();
      if (values) { openMailApp(values); }
    });
  }
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
