/* ==========================================================================
   UPCT Racing Team — Visor 3D del coche
   --------------------------------------------------------------------------
   Convierte cada <div class="stage" data-visor="inicio"> en un visor 3D que se mueve con el
   ratón (o el dedo): arrastrar para girar el coche desde cualquier ángulo, rueda o pellizco
   para acercar. Usa Three.js (desde un CDN) con OrbitControls.

   · Por defecto monta el modelo de js/coche3d.js, construido a partir de las fotos del coche real.
   · Si data/coche.js → modelo apunta a un archivo .glb que existe (p. ej. exportado del CAD o
     escaneado), carga ese archivo en su lugar.
   · Si el navegador no puede con WebGL o no hay conexión con el CDN, muestra las fotos reales del
     coche (data/coche.js → vistas): se recorren arrastrando, con flechas, botones o teclado.

   Se carga con "defer" después de components.js, data/coche.js y js/coche3d.js.
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = window.UPCT || {};
  var C = UPCT.coche;
  var d = document;
  var esc = UPCT.esc || function (v) { return String(v); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!C) { return; }

  function icon(name) { return UPCT.icon ? UPCT.icon(name) : ''; }

  /* ---------- Respaldo: fotos reales ---------- */
  function photoViewer(stage, host) {
    var vistas = C.vistas || [];
    var n = vistas.length;
    if (!n) { return; }
    var cur = 0;
    var timer = null;
    var used = false;

    var visor = d.createElement('div');
    visor.className = 'visor';
    visor.tabIndex = 0;
    visor.setAttribute('role', 'group');
    visor.setAttribute('aria-roledescription', 'visor del coche');
    visor.setAttribute('aria-label', 'Fotos del coche: arrastra a un lado y a otro, o usa las flechas del teclado, para verlo desde distintos ángulos');

    visor.innerHTML =
      vistas.map(function (v, i) {
        return '<figure class="visor__slide' + (i === 0 ? ' is-current' : '') + '" style="margin:0">' +
          '<img src="' + esc(v.src) + '" width="' + esc(v.ancho) + '" height="' + esc(v.alto) + '" alt="' + esc(v.alt) + '"' +
          ' decoding="async" draggable="false"></figure>';
      }).join('') +
      '<span class="visor__hint">' + icon('orbit') + 'Arrastra para girar</span>' +
      '<div class="visor__bar">' +
        '<button class="visor__step" type="button" data-step="-1" aria-label="Vista anterior">' + icon('chevl') + '</button>' +
        '<span class="visor__label" aria-live="polite"></span>' +
        '<span class="visor__dots">' + vistas.map(function (v, i) {
          return '<button class="visor__dot" type="button" data-go="' + i + '" aria-label="Ver: ' + esc(v.etiqueta) + '"></button>';
        }).join('') + '</span>' +
        '<button class="visor__step" type="button" data-step="1" aria-label="Vista siguiente">' + icon('chevr') + '</button>' +
      '</div>';

    var slides = visor.querySelectorAll('.visor__slide');
    var dots = visor.querySelectorAll('.visor__dot');
    var label = visor.querySelector('.visor__label');

    function go(i) {
      cur = ((i % n) + n) % n;
      Array.prototype.forEach.call(slides, function (s, k) { s.classList.toggle('is-current', k === cur); });
      Array.prototype.forEach.call(dots, function (b, k) { b.setAttribute('aria-current', String(k === cur)); });
      label.textContent = vistas[cur].etiqueta;
    }
    function stopAuto() { if (timer) { window.clearInterval(timer); timer = null; } }
    function startAuto() {
      if (used || timer || reduceMotion.matches) { return; }
      timer = window.setInterval(function () { go(cur + 1); }, 3400);
    }
    function touched() { used = true; visor.classList.add('is-used'); stopAuto(); }
    go(0);

    var startX = 0, startIdx = 0, dragging = false;
    visor.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) { return; }
      if (e.target.closest && e.target.closest('.visor__bar')) { return; }
      dragging = true; startX = e.clientX; startIdx = cur;
      try { visor.setPointerCapture(e.pointerId); } catch (err) { /* sin captura */ }
      visor.classList.add('is-dragging');
      touched();
    });
    visor.addEventListener('pointermove', function (e) {
      if (!dragging) { return; }
      var step = Math.max(56, visor.clientWidth / (n * 1.15));
      go(startIdx - Math.round((e.clientX - startX) / step));
    });
    function endDrag() { dragging = false; visor.classList.remove('is-dragging'); }
    visor.addEventListener('pointerup', endDrag);
    visor.addEventListener('pointercancel', endDrag);
    visor.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); touched(); go(cur - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); touched(); go(cur + 1); }
    });
    visor.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button');
      if (!b) { return; }
      touched();
      if (b.hasAttribute('data-step')) { go(cur + Number(b.getAttribute('data-step'))); }
      else if (b.hasAttribute('data-go')) { go(Number(b.getAttribute('data-go'))); }
    });
    visor.addEventListener('pointerenter', stopAuto);
    visor.addEventListener('pointerleave', function () { if (!dragging) { startAuto(); } });
    visor.addEventListener('focusin', stopAuto);

    host.appendChild(visor);
    startAuto();
  }

  /* ---------- Visor 3D ---------- */
  var CDN = 'https://cdn.jsdelivr.net/npm/three@0.160.0';

  /* Pantalla de carga: barra con porcentaje (si el servidor no informa del tamaño, la barra va en modo indeterminado) */
  function loadingMarkup() {
    return '<div class="visor__loading" role="status" aria-live="polite">' +
      '<span class="visor__ltxt">Cargando el coche en 3D</span>' +
      '<span class="visor__lbar is-indet"><i></i></span>' +
      '<span class="visor__lpct" aria-hidden="true"></span></div>';
  }
  function setProgress(host, frac) {
    var bar = host.querySelector('.visor__lbar');
    var pct = host.querySelector('.visor__lpct');
    if (!bar || !pct) { return; }
    if (frac == null) { bar.classList.add('is-indet'); pct.textContent = ''; return; }
    var p = Math.max(0, Math.min(1, frac));
    bar.classList.remove('is-indet');
    bar.firstChild.style.width = Math.round(p * 100) + '%';
    pct.textContent = Math.round(p * 100) + ' %';
  }

  function start3D(stage, host) {
    var libs = [
      import(CDN + '/+esm'),
      import(CDN + '/examples/jsm/controls/OrbitControls.js/+esm'),
      import(CDN + '/examples/jsm/environments/RoomEnvironment.js/+esm')
    ];
    if (C.modelo) {
      libs.push(import(CDN + '/examples/jsm/loaders/GLTFLoader.js/+esm'));
      libs.push(import(CDN + '/examples/jsm/utils/BufferGeometryUtils.js/+esm'));
    }

    return Promise.all(libs).then(function (m) {
      var THREE = m[0];
      setProgress(host, 0.06);
      var procedural = function () { return UPCT.coche3d.build(THREE, { base: '' }); };
      var getModel;
      if (C.modelo) {
        getModel = new Promise(function (resolve, reject) {
          new m[3].GLTFLoader().load(C.modelo, function (g) {
            /* el .glb va sin normales (pesa menos): se calculan aquí, con aristas vivas a partir de 30° */
            g.scene.traverse(function (o) {
              if (o.isMesh && !o.geometry.attributes.normal) { o.geometry = m[4].toCreasedNormals(o.geometry, Math.PI / 6); }
            });
            setProgress(host, 0.98);
            resolve(g.scene);
          }, function (e) {
            if (e && e.lengthComputable && e.total) { setProgress(host, 0.06 + 0.9 * (e.loaded / e.total)); }
            else { setProgress(host, null); }
          }, reject);
        });                                                      // si el .glb falla, el catch general muestra las fotos reales
      } else {
        getModel = Promise.resolve(procedural());
      }
      return getModel.then(function (model) { return mount(THREE, m[1].OrbitControls, m[2].RoomEnvironment, model, stage, host, !!C.modelo); });
    });
  }

  function mount(THREE, OrbitControls, RoomEnvironment, model, stage, host, isCad) {
    var wrap = d.createElement('div');
    wrap.className = 'visor visor--3d';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-roledescription', 'visor 3D del coche');
    /* En Inicio el coche solo gira: sin zoom con la rueda ni con el pellizco, para no estorbar al bajar por la página */
    var fixedZoom = !!stage.closest('.hero');
    wrap.setAttribute('aria-label', fixedZoom
      ? 'Coche en 3D: arrastra para girarlo desde cualquier ángulo'
      : 'Coche en 3D: arrastra para girarlo desde cualquier ángulo y usa la rueda del ratón o el pellizco para acercar');
    wrap.innerHTML = '<span class="visor__hint">' + icon('orbit') + (fixedZoom ? 'Arrastra para girar' : 'Arrastra para girar · rueda para acercar') + '</span>';
    host.appendChild(wrap);

    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.touchAction = 'pan-y';        // el scroll vertical de la página sigue funcionando sobre el coche
    wrap.insertBefore(renderer.domElement, wrap.firstChild);

    var scene = new THREE.Scene();
    var pmrem = new THREE.PMREMGenerator(renderer);
    /* Reflejos de un exterior despejado (cielo, horizonte claro, suelo de asfalto y un par de cajas de luz) */
    var ec = d.createElement('canvas'); ec.width = 1024; ec.height = 512;
    var eg = ec.getContext('2d');
    var sky = eg.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, '#6f9fd6'); sky.addColorStop(0.42, '#dbe8f5'); sky.addColorStop(0.5, '#f4f6f8'); sky.addColorStop(0.52, '#8d9299'); sky.addColorStop(1, '#4a4e54');
    eg.fillStyle = sky; eg.fillRect(0, 0, 1024, 512);
    eg.fillStyle = '#ffffff'; eg.shadowColor = '#ffffff'; eg.shadowBlur = 60;
    eg.fillRect(120, 40, 220, 70); eg.fillRect(620, 55, 260, 60);            // cajas de luz
    eg.beginPath(); eg.arc(470, 95, 38, 0, 7); eg.fill();                      // sol
    var envTex = new THREE.CanvasTexture(ec);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = pmrem.fromEquirectangular(envTex).texture;
    var key = new THREE.DirectionalLight(0xfff4e6, 2.4);        // sol: da la sombra real
    key.position.set(2.6, 4.2, 2.2);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -2.6; key.shadow.camera.right = 2.6; key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -2.6;
    key.shadow.camera.near = 0.5; key.shadow.camera.far = 14;
    key.shadow.bias = -0.0004; key.shadow.normalBias = 0.015; key.shadow.radius = 5;
    scene.add(key);
    var fill = new THREE.DirectionalLight(0xdbe9ff, 0.6);       // relleno suave del lado contrario
    fill.position.set(-3, 2.5, -3);
    scene.add(fill);
    scene.add(model);

    /* Modelo del CAD: centrado sobre el suelo, con sombras propias y sombra proyectada en el asfalto */
    if (isCad) {
      var b0 = new THREE.Box3().setFromObject(model);
      var c0 = b0.getCenter(new THREE.Vector3());
      model.position.set(model.position.x - c0.x, model.position.y - b0.min.y, model.position.z - c0.z);
      /* Materiales: el CAD solo trae colores planos; aquí se convierten en pintura con barniz, acero, carbono y goma */
      var cache = {};
      var steel = function () { return new THREE.MeshPhysicalMaterial({ color: 0xb9bec6, metalness: 1, roughness: 0.34 }); };
      var upgrade = function (mt) {
        if (cache[mt.uuid]) { return cache[mt.uuid]; }
        var hex = mt.color.getHex(), out;
        if (mt.name === 'neumatico') {
          out = new THREE.MeshPhysicalMaterial({ color: 0x0d0d0e, roughness: 0.78, metalness: 0, clearcoat: 0.05, clearcoatRoughness: 0.9 });
        } else if (mt.name === 'llanta') {
          out = new THREE.MeshPhysicalMaterial({ color: 0x15161a, roughness: 0.28, metalness: 0.9, clearcoat: 0.6, clearcoatRoughness: 0.2 });
        } else if (mt.map) {                                                    // fibra de carbono (el tejido a esta escala solo daba ruido)
          out = new THREE.MeshPhysicalMaterial({ color: 0x14161b, roughness: 0.32, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.06 });
        } else if (hex === 0x00ff00 || hex === 0x00ffff || hex === 0xbed5ec) {  // tornillería: el CAD la marca en verde/cian
          out = steel();
        } else if (mt.metalness > 0.9 && mt.roughness > 0.9) {                  // metal negro/blanco sin pulir
          out = new THREE.MeshPhysicalMaterial({ color: mt.color, metalness: 0.9, roughness: 0.42 });
        } else if (mt.metalness > 0.9) {                                         // metales y pinturas metalizadas (rojo, azul)
          var paint = hex === 0xff0000 || hex === 0x0097d5;
          out = new THREE.MeshPhysicalMaterial({ color: mt.color, metalness: paint ? 0.55 : 1, roughness: paint ? 0.3 : Math.max(mt.roughness, 0.22), clearcoat: paint ? 1 : 0, clearcoatRoughness: 0.04 });
        } else {                                                                 // carrocería y piezas pintadas: barniz brillante
          out = new THREE.MeshPhysicalMaterial({ color: mt.color, metalness: 0, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.05 });
        }
        out.name = mt.name; out.envMapIntensity = 1;
        cache[mt.uuid] = out;
        return out;
      };
      model.traverse(function (o) {
        if (o.isMesh) {
          o.castShadow = true; o.receiveShadow = true;
          if (o.material) { o.material = upgrade(o.material); }
        }
      });
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;   // reflejos de estudio: se ven en el barniz
      key.intensity = 1.9;
      fill.intensity = 1.0;
      renderer.toneMappingExposure = 1.18;
      if (Math.min(wrap.clientWidth, window.innerWidth) > 600) { key.shadow.mapSize.set(4096, 4096); }
      var floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.28 }));
      floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
      scene.add(floor);
      key.shadow.camera.left = -2.4; key.shadow.camera.right = 2.4; key.shadow.camera.top = 2.4; key.shadow.camera.bottom = -2.4;
      key.shadow.bias = -0.0008;
    }

    var camera = new THREE.PerspectiveCamera(30, 1, 0.05, 200);
    var box = new THREE.Box3().setFromObject(model);
    var size = box.getSize(new THREE.Vector3()).length() || 1;
    var center = box.getCenter(new THREE.Vector3());
    var k = isCad ? (stage.closest('.hero') ? (window.innerWidth < 600 ? 2.2 : (window.innerWidth < 900 ? 2.1 : 1.9)) : 1.9) : 1;   /* en Inicio el lienzo no tiene marco: el coche entero cabe con margen al girar */                                 // el coche del CAD mide ~3 m: la cámara parte más lejos
    camera.position.copy(center).add(new THREE.Vector3(size * 0.58 * k, size * 0.22 * k, size * 0.55 * k));

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(center);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = size * 0.45;
    controls.maxDistance = size * 2.2;
    controls.maxPolarAngle = Math.PI * 0.495;                 // no baja del suelo
    if (isCad) {
      /* Inicio, sin marco: se limita la vista cenital y el acercamiento para que girando el coche no toque nunca los bordes del lienzo */
      controls.minPolarAngle = Math.PI * 0.36;
      controls.minDistance = size * 1.1;
    }
    if (fixedZoom) {
      /* Distancia media fija; la rueda desplaza la página y en táctil el deslizamiento vertical también */
      controls.enableZoom = false;
      renderer.domElement.style.touchAction = 'pan-y';
    }
    controls.autoRotate = !reduceMotion.matches;
    controls.autoRotateSpeed = 0.8;
    /* Al tocar el coche el giro se detiene y se reanuda solo a los 5 s sin tocarlo; el aviso se desvanece a los 8 s */
    var resumeTimer = null;
    controls.addEventListener('start', function () {
      controls.autoRotate = false; wrap.classList.add('is-used');
      if (resumeTimer) { window.clearTimeout(resumeTimer); resumeTimer = null; }
    });
    controls.addEventListener('end', function () {
      if (reduceMotion.matches) { return; }
      if (resumeTimer) { window.clearTimeout(resumeTimer); }
      resumeTimer = window.setTimeout(function () { controls.autoRotate = true; resumeTimer = null; }, 5000);
    });
    window.setTimeout(function () { wrap.classList.add('is-used'); }, 8000);
    /* Para revisar el modelo: index.html#cam=x,y,z coloca la cámara en ese punto (sin giro automático) */
    var cam = /[#&]cam=(-?[\d.]+),(-?[\d.]+),(-?[\d.]+)/.exec(window.location.hash);
    if (cam) {
      camera.position.set(Number(cam[1]), Number(cam[2]), Number(cam[3]));
      controls.autoRotate = false;
      controls.minDistance = 0.3;
    }
    controls.update();

    function resize() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) { return; }
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    if (window.ResizeObserver) { new ResizeObserver(resize).observe(wrap); } else { window.addEventListener('resize', resize); }

    var visible = true;
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(wrap);
    }
    (function loop() {
      window.requestAnimationFrame(loop);
      if (!visible || d.hidden) { return; }
      controls.update();
      renderer.render(scene, camera);
    })();

    stage.setAttribute('data-modo', '3d');
    UPCT.visor = { camera: camera, controls: controls, scene: scene, renderer: renderer, model: model };   // para depurar desde la consola
  }

  /* ---------- Arranque ---------- */
  Array.prototype.forEach.call(d.querySelectorAll('.stage[data-visor="inicio"], .stage[data-visor="garaje"]'), function (stage) {
    var host = stage.querySelector('.stage__viewer');
    if (!host) { host = d.createElement('div'); host.className = 'stage__viewer'; stage.appendChild(host); }
    host.innerHTML = loadingMarkup();
    stage.setAttribute('aria-busy', 'true');

    /* Modo foto: el coche recortado se integra en el panel azul (sin marco) */
    if (C.modo === 'foto' && C.foto && C.foto.src) {
      host.innerHTML = '<img class="stage__cutout" src="' + esc(C.foto.src) + '" width="' + esc(C.foto.ancho) + '" height="' + esc(C.foto.alto) +
        '" alt="' + esc(C.foto.alt) + '" fetchpriority="high" decoding="async">';
      stage.removeAttribute('aria-busy');
      stage.setAttribute('data-modo', 'foto');
      return;
    }

    var ok = !!(window.WebGLRenderingContext && UPCT.coche3d);
    var done = function () { stage.removeAttribute('aria-busy'); var l = host.querySelector('.visor__loading'); if (l) { l.remove(); } };
    if (!ok) { done(); photoViewer(stage, host); return; }

    start3D(stage, host).then(done).catch(function (err) {
      if (window.console) { console.warn('Visor 3D no disponible, se muestran las fotos del coche:', err); }
      done();
      photoViewer(stage, host);
    });
  });
})();
