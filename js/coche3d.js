/* ==========================================================================
   UPCT Racing Team — Modelo 3D del coche (construido a partir de las fotos del coche real)
   --------------------------------------------------------------------------
   Reproduce el monoplaza que aparece en assets/img/coche/ con geometría de Three.js:
   · carrocería blanca de fibra: morro en forma de bala y laterales planos con «TU CARTAGENA» y el 261;
   · cuatro ruedas negras de 10 radios, con su neumático y su disco de freno;
   · aros de seguridad y estructura tubular, asiento azul, casco azul y blanco, volante;
   · motor con el depósito amarillo detrás del piloto y brazos de suspensión;
   · pegatinas con los logos reales de los patrocinadores (los de data/sponsors.js) y el emblema de la UPCT.
   Ejes: X hacia delante, Y arriba, Z hacia la derecha del coche. Unidades: metros.
   Es una réplica hecha a ojo desde fotografías, NO un escaneo ni el CAD: cuando exista coche.glb
   (data/coche.js → modelo) el visor usa ese archivo en su lugar.

   Uso: UPCT.coche3d.build(THREE, { base: "" }) → THREE.Group
   ========================================================================== */
(function () {
  'use strict';

  var UPCT = (window.UPCT = window.UPCT || {});
  UPCT.coche3d = { build: build };

  function build(THREE, opts) {
    opts = opts || {};
    var base = opts.base || '';
    var car = new THREE.Group();
    car.name = 'UPCT Racing Team';

    /* ---------- Materiales ---------- */
    var std = function (color, rough, metal) { return new THREE.MeshStandardMaterial({ color: color, roughness: rough, metalness: metal || 0 }); };
    /* Texturas procedurales (canvas): banda de rodadura, fibra de carbono, ligera irregularidad de la pintura y asfalto */
    function canvasTex(w, h, paint, repeatX, repeatY, srgb) {
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      paint(c.getContext('2d'), w, h);
      var t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX || 1, repeatY || 1);
      t.anisotropy = 8;
      if (srgb) { t.colorSpace = THREE.SRGBColorSpace; }
      return t;
    }
    function speckle(g, w, h, n, a, light) {
      for (var i = 0; i < n; i++) {
        var v = light ? 255 : 0;
        g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (Math.random() * a) + ')';
        g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2);
      }
    }
    var treadBump = canvasTex(512, 256, function (g, w, h) {
      g.fillStyle = '#9a9a9a'; g.fillRect(0, 0, w, h);                       // gris medio = nivel de la goma
      g.fillStyle = '#1e1e1e';
      [0.30, 0.42, 0.58, 0.70].forEach(function (y) { g.fillRect(0, h * y - 4, w, 8); });          // ranuras circunferenciales
      g.strokeStyle = '#2a2a2a'; g.lineWidth = 5;
      for (var x = 0; x < w; x += 32) {                                      // láminas transversales inclinadas
        g.beginPath(); g.moveTo(x, h * 0.30); g.lineTo(x + 14, h * 0.42); g.moveTo(x + 16, h * 0.58); g.lineTo(x + 2, h * 0.70); g.stroke();
      }
      speckle(g, w, h, 5000, 0.5, false);
    }, 36, 1, false);
    var rubberMap = canvasTex(256, 128, function (g, w, h) {
      g.fillStyle = '#1b1c1e'; g.fillRect(0, 0, w, h); speckle(g, w, h, 3000, 0.25, true);
    }, 36, 1, true);
    var carbonMap = canvasTex(128, 128, function (g, w, h) {
      g.fillStyle = '#0d0e10'; g.fillRect(0, 0, w, h);
      for (var y = 0; y < h; y += 8) for (var x = 0; x < w; x += 8) {
        g.fillStyle = ((x + y) / 8) % 2 ? '#1d1f23' : '#0a0b0d';
        g.fillRect(x, y, 8, 4); g.fillStyle = ((x + y) / 8) % 2 ? '#0a0b0d' : '#1d1f23'; g.fillRect(x, y + 4, 8, 4);
      }
    }, 6, 6, true);
    var paintBump = canvasTex(256, 256, function (g, w, h) {
      g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); speckle(g, w, h, 9000, 0.22, true); speckle(g, w, h, 9000, 0.22, false);
    }, 3, 3, false);
    var dirtMap = canvasTex(512, 256, function (g, w, h) {            // blanco de fibra algo usado: sombras de suciedad abajo y por el morro
      var gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f4f6f7'); gr.addColorStop(0.6, '#e8ebed'); gr.addColorStop(1, '#cfd3d6');
      g.fillStyle = gr; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 40; i++) { g.fillStyle = 'rgba(120,125,130,' + (Math.random() * 0.05) + ')'; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, 10 + Math.random() * 40, 0, 7); g.fill(); }
    }, 1, 1, true);

    var M = {
      white: new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: dirtMap, roughness: 0.42, metalness: 0, bumpMap: paintBump, bumpScale: 0.35, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.1, side: THREE.DoubleSide }),
      tube: std(0x1b1f25, 0.42, 0.7),
      arm: std(0x2b3037, 0.45, 0.65),
      rubber: new THREE.MeshStandardMaterial({ color: 0xffffff, map: rubberMap, bumpMap: treadBump, bumpScale: 2.2, roughness: 0.92, metalness: 0 }),
      rim: std(0x121316, 0.3, 0.85),
      silver: std(0xb9bfc7, 0.28, 0.92),
      disc: std(0x70757d, 0.4, 0.85),
      seat: std(0x2a63b8, 0.85, 0),
      carbon: new THREE.MeshStandardMaterial({ color: 0xffffff, map: carbonMap, roughness: 0.35, metalness: 0.25 }),
      belt: std(0xb3131b, 0.8, 0),
      yellow: std(0xe7b30f, 0.42, 0.1),
      dark: std(0x0b0c0e, 0.85, 0),
      engine: std(0x4b5058, 0.45, 0.75),
      blue: std(0x0054a0, 0.5, 0.3)
    };

    /* ---------- Utilidades ---------- */
    var V = function (p) { return new THREE.Vector3(p[0], p[1], p[2]); };
    var UP = new THREE.Vector3(0, 1, 0);

    function tube(a, b, r, mat) {
      var A = V(a), B = V(b);
      var len = A.distanceTo(B);
      var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 16), mat || M.tube);
      m.position.copy(A).add(B).multiplyScalar(0.5);
      m.quaternion.setFromUnitVectors(UP, B.clone().sub(A).normalize());
      return m;
    }
    function joint(p, r, mat) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), mat || M.tube);
      m.position.copy(V(p));
      return m;
    }
    function chain(points, r, mat, group) {
      for (var i = 0; i < points.length - 1; i++) { group.add(tube(points[i], points[i + 1], r, mat)); }
      for (var j = 1; j < points.length - 1; j++) { group.add(joint(points[j], r, mat)); }
    }
    function mirrorPt(p) { return [p[0], p[1], -p[2]]; }
    /* Dibuja una pieza a los dos lados (z y −z) */
    function both(fn) { fn(1); fn(-1); }

    /* ---------- Estructura tubular (aros y bastidor) ---------- */
    var frame = new THREE.Group();
    car.add(frame);
    var R = 0.0135;

    both(function (s) {
      var z = function (v) { return v * s; };
      /* aro principal (detrás del piloto) */
      chain([[-0.40, 0.14, z(0.25)], [-0.43, 0.55, z(0.235)], [-0.46, 0.99, z(0.19)]], R, M.tube, frame);
      /* aro delantero */
      chain([[0.42, 0.16, z(0.235)], [0.39, 0.40, z(0.20)], [0.36, 0.66, z(0.16)]], R, M.tube, frame);
      /* arriostramiento trasero del aro principal */
      chain([[-0.465, 0.97, z(0.185)], [-0.80, 0.62, z(0.21)], [-0.98, 0.30, z(0.27)]], R * 0.9, M.tube, frame);
      /* largueros bajos y laterales */
      frame.add(tube([-0.98, 0.20, z(0.28)], [-0.40, 0.14, z(0.25)], R, M.tube));
      frame.add(tube([-0.40, 0.14, z(0.25)], [0.60, 0.14, z(0.22)], R, M.tube));
      frame.add(tube([-0.98, 0.42, z(0.26)], [-0.43, 0.46, z(0.235)], R * 0.9, M.tube));
      frame.add(tube([-0.43, 0.46, z(0.235)], [0.39, 0.46, z(0.20)], R * 0.9, M.tube));
      /* montantes y diagonales traseras */
      frame.add(tube([-0.98, 0.20, z(0.28)], [-0.98, 0.42, z(0.26)], R * 0.9, M.tube));
      frame.add(tube([-0.98, 0.42, z(0.26)], [-0.62, 0.20, z(0.27)], R * 0.8, M.tube));
      frame.add(tube([-0.40, 0.40, z(0.24)], [-0.80, 0.30, z(0.27)], R * 0.8, M.tube));
    });
    frame.add(tube([-0.46, 0.99, 0.19], [-0.46, 0.99, -0.19], R, M.tube));       // barra superior del aro principal
    frame.add(tube([0.36, 0.66, 0.16], [0.36, 0.66, -0.16], R, M.tube));         // barra superior del aro delantero
    frame.add(tube([-0.98, 0.42, 0.26], [-0.98, 0.42, -0.26], R * 0.9, M.tube)); // travesaños traseros
    frame.add(tube([-0.98, 0.20, 0.28], [-0.98, 0.20, -0.28], R * 0.9, M.tube));
    frame.add(tube([-0.43, 0.46, 0.235], [-0.43, 0.46, -0.235], R * 0.9, M.tube));
    frame.add(joint([-0.46, 0.99, 0.19], R * 1.1)); frame.add(joint([-0.46, 0.99, -0.19], R * 1.1));
    frame.add(joint([0.36, 0.66, 0.16], R * 1.1)); frame.add(joint([0.36, 0.66, -0.16], R * 1.1));

    /* ---------- Carrocería blanca ---------- */
    var body = new THREE.Group();
    car.add(body);

    /* Morro y cubierta delantera: sólido de revolución «cuadrado redondeado» que se cierra en una punta roma */
    var X0 = 0.48, X1 = 1.425;
    function prof(u) {
      var c = Math.sqrt(Math.max(0, 1 - Math.pow(u, 2.3)));
      var top = 0.505 - 0.215 * Math.pow(u, 1.5);
      var bot = 0.115 + 0.05 * Math.pow(u, 1.8);
      return {
        x: X0 + (X1 - X0) * u,
        hw: 0.25 * (0.55 + 0.45 * (1 - u * u)) * c,
        yc: (top + bot) / 2,
        hh: (top - bot) / 2 * c,
        e: 2 / (2.4 + 1.1 * (1 - u))
      };
    }
    function spow(v, e) { return (v < 0 ? -1 : 1) * Math.pow(Math.abs(v), e); }
    var NU = 70, NT = 80, pos = [], idx = [], uvs = [];
    for (var i = 0; i <= NU; i++) {
      var p = prof(i / NU);
      for (var j = 0; j < NT; j++) {
        var t = (j / NT) * Math.PI * 2;
        pos.push(p.x, p.yc + p.hh * spow(Math.sin(t), p.e), p.hw * spow(Math.cos(t), p.e));
        uvs.push(i / NU, j / NT);
      }
    }
    for (var a = 0; a < NU; a++) {
      for (var b = 0; b < NT; b++) {
        var b2 = (b + 1) % NT;
        var i0 = a * NT + b, i1 = a * NT + b2, i2 = (a + 1) * NT + b, i3 = (a + 1) * NT + b2;
        idx.push(i0, i2, i1, i1, i2, i3);
      }
    }
    var noseGeo = new THREE.BufferGeometry();
    noseGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    noseGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    noseGeo.setIndex(idx);
    noseGeo.computeVertexNormals();
    var nose = new THREE.Mesh(noseGeo, M.white);
    body.add(nose);

    /* Tapa interior del morro (el «salpicadero», visible desde la cabina) */
    var capPos = [0.48, prof(0).yc, 0], capIdx = [];
    for (var k = 0; k < NT; k++) { capPos.push(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2]); }
    for (var q = 0; q < NT; q++) { capIdx.push(0, 1 + q, 1 + ((q + 1) % NT)); }
    var capGeo = new THREE.BufferGeometry();
    capGeo.setAttribute('position', new THREE.Float32BufferAttribute(capPos, 3));
    capGeo.setIndex(capIdx);
    capGeo.computeVertexNormals();
    body.add(new THREE.Mesh(capGeo, M.dark));

    /* Laterales planos de la cabina (con el nombre y el dorsal) y suelo */
    var shape = new THREE.Shape();
    shape.moveTo(-0.62, 0.10); shape.lineTo(0.48, 0.10); shape.lineTo(0.48, 0.495);
    shape.quadraticCurveTo(-0.05, 0.50, -0.62, 0.465); shape.lineTo(-0.62, 0.10);
    var panelGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.004, bevelSegments: 2 });
    both(function (s) {
      var m = new THREE.Mesh(panelGeo, M.white);
      m.position.z = s > 0 ? 0.236 : -0.248;
      body.add(m);
    });
    var floor = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.012, 0.5), M.carbon);
    floor.position.set(-0.07, 0.105, 0);
    body.add(floor);
    var floor2 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.01, 0.46), M.white);
    floor2.position.set(-0.07, 0.092, 0);
    body.add(floor2);

    /* ---------- Cabina: asiento, piloto, volante ---------- */
    var seat = new THREE.Group();
    var seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.50, 0.34), M.seat);
    seatBack.position.set(-0.40, 0.40, 0); seatBack.rotation.z = -0.28; seat.add(seatBack);
    var seatBase = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.04, 0.32), M.seat);
    seatBase.position.set(-0.20, 0.17, 0); seat.add(seatBase);
    car.add(seat);

    var helmetTex = (function () {
      var c = document.createElement('canvas'); c.width = 512; c.height = 256;
      var g = c.getContext('2d');
      g.fillStyle = '#f4f6f8'; g.fillRect(0, 0, 512, 256);
      g.fillStyle = '#1c5db8';
      g.beginPath(); g.moveTo(0, 60); g.bezierCurveTo(120, 20, 200, 120, 330, 70); g.bezierCurveTo(420, 40, 480, 90, 512, 70); g.lineTo(512, 190); g.bezierCurveTo(400, 230, 330, 150, 200, 190); g.bezierCurveTo(110, 215, 40, 170, 0, 190); g.closePath(); g.fill();
      g.fillStyle = '#7fb4e6';
      for (var n = 0; n < 40; n++) { g.beginPath(); g.arc(30 + Math.random() * 450, 30 + Math.random() * 200, 3 + Math.random() * 5, 0, 7); g.fill(); }
      var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    var helmet = new THREE.Group();
    helmet.add(new THREE.Mesh(new THREE.SphereGeometry(0.148, 28, 20), new THREE.MeshPhysicalMaterial({ map: helmetTex, roughness: 0.3, clearcoat: 0.8 })));
    /* visera oscura: casquete de esfera centrado hacia delante (+X) */
    var visor = new THREE.Mesh(new THREE.SphereGeometry(0.151, 24, 14, Math.PI - 0.95, 1.9, 1.0, 0.62), new THREE.MeshStandardMaterial({ color: 0x0d1117, roughness: 0.12, metalness: 0.6, side: THREE.DoubleSide }));
    helmet.add(visor);
    helmet.position.set(-0.12, 0.74, 0);
    car.add(helmet);

    var wheelSteer = new THREE.Group();
    var steerRing = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.013, 10, 32), M.dark);
    wheelSteer.add(steerRing);
    var steerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.03, 16), M.silver);
    steerHub.rotation.x = Math.PI / 2; wheelSteer.add(steerHub);
    wheelSteer.add((function () { var m = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.012), M.dark); return m; })());
    wheelSteer.position.set(0.30, 0.60, 0);
    wheelSteer.rotation.y = Math.PI / 2;           // el aro mira hacia atrás (hacia el piloto)
    wheelSteer.rotation.x = 0; wheelSteer.rotation.z = 0;
    var steerPivot = new THREE.Group();
    steerPivot.position.copy(wheelSteer.position);
    wheelSteer.position.set(0, 0, 0);
    steerPivot.add(wheelSteer);
    steerPivot.rotation.z = -0.35;                  // inclinado hacia el piloto
    car.add(steerPivot);
    car.add(tube([0.40, 0.46, 0], [0.30, 0.60, 0], 0.011, M.silver));   // columna de dirección

    /* ---------- Parte trasera: motor, depósito, cadena ---------- */
    var engine = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.30, 0.30), M.engine);
    engine.position.set(-0.82, 0.30, 0); car.add(engine);
    var head = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.18, 0.26), M.engine);
    head.position.set(-0.80, 0.50, 0); car.add(head);
    for (var f = 0; f < 4; f++) {
      var fin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.012, 0.28), M.silver);
      fin.position.set(-0.80, 0.43 + f * 0.04, 0); car.add(fin);
    }
    var tank = new THREE.Group();
    var tcyl = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.105, 0.2, 24), M.yellow);
    tank.add(tcyl);
    var top = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.yellow); top.position.y = 0.1; tank.add(top);
    var bot = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.yellow); bot.position.y = -0.1; tank.add(bot);
    tank.position.set(-0.66, 0.66, 0.0); tank.rotation.z = 0.2;
    car.add(tank);
    var sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.012, 24), M.silver);
    sprocket.rotation.x = Math.PI / 2; sprocket.position.set(-0.86, 0.26, 0.19); car.add(sprocket);
    var crown = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.012, 32), M.silver);
    crown.rotation.x = Math.PI / 2; crown.position.set(-0.775, 0.26, 0.19); car.add(crown);
    car.add(tube([-0.86, 0.335, 0.19], [-0.775, 0.375, 0.19], 0.006, M.dark));
    car.add(tube([-0.86, 0.185, 0.19], [-0.775, 0.145, 0.19], 0.006, M.dark));
    car.add(tube([-0.97, 0.52, 0.12], [-1.15, 0.50, 0.12], 0.026, M.silver));   // escape
    car.add(tube([-0.97, 0.52, 0.12], [-0.86, 0.52, 0.10], 0.026, M.silver));

    /* ---------- Ruedas ---------- */
    function makeWheel() {
      var g = new THREE.Group();
      var prof2 = [[0.165, -0.092], [0.205, -0.094], [0.24, -0.082], [0.258, -0.06], [0.262, -0.03], [0.262, 0.03], [0.258, 0.06], [0.24, 0.082], [0.205, 0.094], [0.165, 0.092]]
        .map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      var tire = new THREE.Mesh(new THREE.LatheGeometry(prof2, 56), M.rubber);
      tire.rotation.x = Math.PI / 2; g.add(tire);
      var barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.166, 0.166, 0.19, 40, 1, true), M.rim);
      barrel.material.side = THREE.DoubleSide; barrel.rotation.x = Math.PI / 2; g.add(barrel);
      var face = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.166, 40), M.rim);
      face.position.z = 0.07; g.add(face);
      for (var s = 0; s < 10; s++) {
        var sp = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.03, 0.02), M.rim);
        var ang = (s / 10) * Math.PI * 2;
        sp.position.set(Math.cos(ang) * 0.1, Math.sin(ang) * 0.1, 0.085);
        sp.rotation.z = ang + 0.12; g.add(sp);
      }
      var lip = new THREE.Mesh(new THREE.TorusGeometry(0.164, 0.008, 8, 48), M.silver);
      lip.position.z = 0.093; g.add(lip);
      var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.045, 20), M.silver);
      hub.rotation.x = Math.PI / 2; hub.position.z = 0.088; g.add(hub);
      var nut = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 6), M.dark);
      nut.rotation.x = Math.PI / 2; nut.position.z = 0.112; g.add(nut);
      var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.006, 40), M.disc);
      disc.rotation.x = Math.PI / 2; disc.position.z = 0.025; g.add(disc);
      var cal = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.04), M.blue);
      cal.position.set(0.1, 0.07, 0.025); g.add(cal);
      return g;
    }
    var wheels = { 'FL': [0.775, -0.60], 'FR': [0.775, 0.60], 'RL': [-0.775, -0.575], 'RR': [-0.775, 0.575] };
    Object.keys(wheels).forEach(function (k) {
      var w = makeWheel(), c = wheels[k];
      w.position.set(c[0], 0.262, c[1]);
      if (c[1] < 0) { w.rotation.y = Math.PI; }
      car.add(w);
    });

    /* ---------- Suspensión ---------- */
    both(function (s) {
      var z = function (v) { return v * s; };
      /* delantera */
      car.add(tube([0.775, 0.31, z(0.51)], [0.58, 0.34, z(0.23)], 0.009, M.arm));
      car.add(tube([0.775, 0.31, z(0.51)], [0.97, 0.33, z(0.20)], 0.009, M.arm));
      car.add(tube([0.775, 0.17, z(0.51)], [0.56, 0.17, z(0.23)], 0.009, M.arm));
      car.add(tube([0.775, 0.17, z(0.51)], [1.0, 0.18, z(0.18)], 0.009, M.arm));
      car.add(tube([0.78, 0.36, z(0.50)], [0.72, 0.50, z(0.20)], 0.008, M.blue));      // tirante de empuje
      car.add(tube([0.9, 0.26, z(0.50)], [0.92, 0.25, z(0.12)], 0.007, M.silver));     // barra de dirección
      /* trasera */
      car.add(tube([-0.775, 0.31, z(0.49)], [-0.62, 0.36, z(0.27)], 0.009, M.arm));
      car.add(tube([-0.775, 0.31, z(0.49)], [-0.93, 0.36, z(0.26)], 0.009, M.arm));
      car.add(tube([-0.775, 0.17, z(0.49)], [-0.60, 0.17, z(0.27)], 0.009, M.arm));
      car.add(tube([-0.775, 0.17, z(0.49)], [-0.95, 0.17, z(0.28)], 0.009, M.arm));
      car.add(tube([-0.78, 0.37, z(0.48)], [-0.70, 0.55, z(0.22)], 0.008, M.blue));
      /* amortiguadores */
      car.add(tube([0.72, 0.50, z(0.20)], [0.60, 0.46, z(0.08)], 0.016, M.yellow));
      car.add(tube([-0.70, 0.55, z(0.22)], [-0.74, 0.50, z(0.10)], 0.016, M.yellow));
    });

    /* ---------- Pegatinas (logos reales) ---------- */
    var fontsReady = (document.fonts && document.fonts.load) ? document.fonts.load("italic 800 80px 'Barlow Condensed'") : Promise.resolve();

    function decal(w, h, px, paint, matOpts) {
      var c = document.createElement('canvas');
      c.width = Math.round(w * px); c.height = Math.round(h * px);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      var mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({
        map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
        side: THREE.FrontSide
      }));
      mesh.renderOrder = 3;
      var redraw = function () {
        var g = c.getContext('2d');
        g.clearRect(0, 0, c.width, c.height);
        paint(g, c.width, c.height, mesh);
        tex.needsUpdate = true;
      };
      redraw();
      fontsReady.then(redraw);
      mesh.userData.redraw = redraw;
      return mesh;
    }

    var logoCache = {};
    function tinted(name, color, cb) {
      var key = name + color;
      if (logoCache[key]) { cb(logoCache[key]); return; }
      var img = new Image();
      img.onload = function () {
        var cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        var g = cv.getContext('2d');
        g.drawImage(img, 0, 0);
        g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, cv.width, cv.height);
        logoCache[key] = cv; cb(cv);
      };
      img.src = base + 'assets/img/sponsors/' + name + '.png';
    }
    function drawLogo(owner, name, color, x, y, w, h) {
      /* dibuja ahora (si ya está cargado) y siempre al terminar de cargar */
      tinted(name, color, function (cv) {
        owner.userData.extra = owner.userData.extra || [];
        owner.userData.extra.push({ cv: cv, x: x, y: y, w: w, h: h });
        owner.userData.redraw();
      });
    }
    function fit(cv, w, h) { var r = Math.min(w / cv.width, h / cv.height); return { w: cv.width * r, h: cv.height * r }; }
    function paintExtras(g, owner) {
      (owner.userData.extra || []).forEach(function (e) {
        var f = fit(e.cv, e.w, e.h);
        g.drawImage(e.cv, e.x + (e.w - f.w) / 2, e.y + (e.h - f.h) / 2, f.w, f.h);
      });
    }

    /* Texto con estilo «cartel» (Barlow Condensed cursiva, como la web) */
    function text(g, s, x, y, size, color, align) {
      g.font = "italic 800 " + size + "px 'Barlow Condensed','Arial Narrow',sans-serif";
      g.fillStyle = color; g.textAlign = align || 'left'; g.textBaseline = 'alphabetic';
      g.fillText(s, x, y);
    }

    /* Lateral derecho (+Z): nombre, dorsal, engranaje de Tecsumaga y Laser Molina */
    var sideR = decal(1.0, 0.36, 900, function (g, W, H, self) {
      text(g, 'TU·CARTAGENA', W * 0.17, H * 0.33, H * 0.2, '#15181c');
      text(g, '261', W * 0.07, H * 0.84, H * 0.58, '#15181c');
      paintExtras(g, self);
    });
    sideR.position.set(-0.07, 0.29, 0.2565);
    drawLogo(sideR, 'tecsumaga', '#2f9a4a', 900 * 0.07, 360 * 0.07, 900 * 0.075, 360 * 0.2);
    drawLogo(sideR, 'laser-molina', '#2a2f36', 900 * 0.5, 360 * 0.42, 900 * 0.2, 360 * 0.2);
    drawLogo(sideR, 'autoherramientas-ramon', '#c8321f', 900 * 0.05, 360 * 0.88, 900 * 0.1, 360 * 0.1);
    car.add(sideR);

    /* Lateral izquierdo (−Z): nombre, dorsal, Talleres Daytona (rojo) y Autoherramientas Ramón */
    var sideL = decal(1.0, 0.36, 900, function (g, W, H, self) {
      g.fillStyle = '#d6301f'; g.fillRect(W * 0.07, H * 0.5, W * 0.2, H * 0.28);
      text(g, 'TU·CARTAGENA', W * 0.32, H * 0.33, H * 0.2, '#15181c');
      text(g, '261', W * 0.7, H * 0.84, H * 0.58, '#15181c');
      paintExtras(g, self);
    });
    sideL.position.set(-0.07, 0.29, -0.2565);
    sideL.rotation.y = Math.PI;
    drawLogo(sideL, 'talleres-daytona', '#ffffff', 900 * 0.075, 360 * 0.53, 900 * 0.17, 360 * 0.22);
    drawLogo(sideL, 'autoherramientas-ramon', '#2a2f36', 900 * 0.32, 360 * 0.46, 900 * 0.26, 360 * 0.14);
    car.add(sideL);

    /* Morro: Ferronaval (derecha), emblema de la UPCT en ambos lados y dorsal arriba */
    var noseU = 0.42, np = prof(noseU);
    var noseR = decal(0.42, 0.14, 800, function (g, W, H, self) { paintExtras(g, self); });
    noseR.position.set(np.x - 0.12, np.yc - 0.02, np.hw + 0.004); noseR.rotation.y = 0;
    drawLogo(noseR, 'ferronaval', '#262b31', 0, 0, 800 * 0.42, 280 * 0.5);
    car.add(noseR);

    /* El emblema blanco de la UPCT (el del pie de la web) sobre un círculo azul, como en el morro del coche real */
    function roundelEmblem(sign, u) {
      var p = prof(u);
      var d = decal(0.13, 0.13, 600, function (g, W, H, self) {
        g.fillStyle = '#2f73c4'; g.beginPath(); g.arc(W / 2, H / 2, W * 0.48, 0, 7); g.fill();
        if (self.userData.emb) { g.drawImage(self.userData.emb, W * 0.16, H * 0.16, W * 0.68, H * 0.68); }
      });
      d.position.set(p.x, p.yc + 0.005, sign * (p.hw + 0.003));
      if (sign < 0) { d.rotation.y = Math.PI; }
      d.rotation.y += sign * (-0.2);
      var im = new Image();
      im.onload = function () { d.userData.emb = im; d.userData.redraw(); };
      im.src = base + 'assets/img/logo/upct-blanco.png';
      return d;
    }
    car.add(roundelEmblem(1, 0.74));
    car.add(roundelEmblem(-1, 0.74));

    var noseTop = decal(0.34, 0.12, 700, function (g, W, H) { text(g, '261', W * 0.5, H * 0.86, H * 0.95, '#15181c', 'center'); });
    var pt = prof(0.16);
    noseTop.position.set(pt.x + 0.02, pt.yc + pt.hh * 0.98 + 0.003, 0);
    noseTop.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    car.add(noseTop);

    /* ---------- Arneses, reposacabezas y detalles de cabina ---------- */
    both(function (s) {
      var z = function (v) { return v * s; };
      car.add(tube([-0.36, 0.78, z(0.07)], [-0.12, 0.40, z(0.10)], 0.017, M.belt));   // hombros
      car.add(tube([-0.20, 0.20, z(0.17)], [-0.20, 0.20, z(0.05)], 0.017, M.belt));   // cintura
    });
    var headrest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.17, 0.2), M.seat);
    headrest.position.set(-0.43, 0.78, 0); headrest.rotation.z = -0.28; car.add(headrest);
    var pedals = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 0.22), M.silver);
    pedals.position.set(0.40, 0.24, 0); pedals.rotation.z = 0.5; car.add(pedals);

    /* ---------- Asfalto bajo el coche (recibe la sombra real) ---------- */
    var asphalt = canvasTex(1024, 1024, function (g, w, h) {
      g.fillStyle = '#6a6f76'; g.fillRect(0, 0, w, h);
      for (var k = 0; k < 160000; k++) {                                  // grano fino del asfalto
        var l = 60 + Math.random() * 80;
        g.fillStyle = 'rgba(' + l + ',' + l + ',' + (l + 4) + ',0.55)';
        g.fillRect(Math.random() * w, Math.random() * h, 1.4, 1.4);
      }
      var m = g.createRadialGradient(w / 2, h / 2, w * 0.18, w / 2, h / 2, w * 0.5);       // se funde con el fondo en los bordes
      m.addColorStop(0, 'rgba(0,0,0,1)'); m.addColorStop(1, 'rgba(0,0,0,0)');
      g.globalCompositeOperation = 'destination-in'; g.fillStyle = m; g.fillRect(0, 0, w, h);
    }, 1, 1, true);
    var ground = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 5.0), new THREE.MeshStandardMaterial({ map: asphalt, transparent: true, roughness: 0.92, metalness: 0, depthWrite: false }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(0.1, 0.002, 0); ground.receiveShadow = true; ground.renderOrder = 0;
    ground.userData.ground = true;
    car.add(ground);

    /* Sombras reales: todo proyecta y recibe, salvo pegatinas y suelo */
    car.traverse(function (o) {
      if (!o.isMesh) { return; }
      var flat = o.material && o.material.transparent;
      o.castShadow = !flat && !o.userData.ground;
      o.receiveShadow = !flat || !!o.userData.ground;
    });

    return car;
  }
})();
