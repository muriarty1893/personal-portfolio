/**
 * 3D Gallery Room — Scroll-driven cinematic corridor
 * Full-screen sticky canvas, camera walks through the gallery as user scrolls.
 */
(function() {
  'use strict';

  // ============ PROJECT DATA ============
  var PROJECTS = [
    {
      num: '01', title: 'Rottector',
      tags: ['Python', 'YOLOv8', 'FastAPI'],
      desc: 'AI-powered fruit detection system using a hybrid of two models to classify fruits as fresh or rotten. End-to-end with Python backend and web UI.',
      url: 'https://github.com/muriarty1893/rottector'
    },
    {
      num: '02', title: 'Lavida',
      tags: ['Python', 'PyQt6', 'SQLite', 'BS4'],
      desc: 'Lightweight always-on-top desktop widget for managing saved video links with auto-fetched titles and global keyboard shortcuts.',
      url: 'https://github.com/muriarty1893/lavida'
    },
    {
      num: '03', title: 'RAG Tutorial v2',
      tags: ['Python', 'LangChain', 'ChromaDB', 'Llama 3.2'],
      desc: 'Advanced RAG system with conversational memory, PDF processing, multilingual support, and interactive feedback.',
      url: 'https://github.com/muriarty1893/rag-tutorial-v2'
    },
    {
      num: '04', title: 'GOPAK E-commerce',
      tags: ['PHP', 'MySQL', 'HTML5', 'JavaScript'],
      desc: 'Responsive e-commerce web application for official Gopak Corporation with 3D model viewer and admin panel.',
      url: 'https://github.com/muriarty1893/gopak.com.tr'
    },
    {
      num: '05', title: 'Heart Attack Prediction',
      tags: ['Python', 'Machine Learning', 'EDA'],
      desc: 'Comprehensive exploratory data analysis and machine learning model for heart attack prediction with data visualization.',
      url: 'https://github.com/muriarty1893/Heart-Attack-Prediction-and-EDA'
    },
    {
      num: '06', title: 'Modular Data Scraper',
      tags: ['Python', 'BeautifulSoup4', 'Pandas'],
      desc: 'A robust, CLI-based scraping tool built with a modular architecture. Features automated performance tracking and structured CSV export.',
      url: 'https://github.com/muriarty1893/dataPull'
    },
    {
      num: '07', title: 'JustZipIt',
      tags: ['Python', 'GUI', 'File Compression'],
      desc: 'File compression utility with user-friendly interface for efficient archiving and extraction.',
      url: 'https://github.com/muriarty1893/JustZipIt'
    },
    {
      num: '08', title: 'Circling Loader',
      tags: ['HTML', 'CSS', 'JavaScript'],
      desc: 'Lightweight and customizable circling loader animation for web applications.',
      url: 'https://github.com/muriarty1893/circling_loader'
    },
    {
      num: '09', title: 'Elasticsearch Integration',
      tags: ['Elasticsearch', 'Python', 'C#', 'Kibana'],
      desc: 'Migrated SQL-based search to high-performance Elasticsearch, integrating with C# .NET and managing indexes via Kibana.',
      url: 'https://github.com/muriarty1893/the-elastic-project'
    }
  ];

  // ============ DOM ============
  var section = document.getElementById('project-section');
  var sticky  = document.getElementById('gallery-sticky');
  var canvas  = document.getElementById('gallery-canvas');
  if (!section || !canvas) return;

  // Set scroll height: enough room per project + contact wall at end
  section.style.height = (PROJECTS.length * 80 + 120) + 'vh';

  // ============ HELPERS ============
  function getIsDark() { return document.body.classList.contains('dark-mode'); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smoothstep(t) { return t * t * (3 - 2 * t); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // ============ COLORS ============
  function getColors() {
    var d = getIsDark();
    return {
      bg:      d ? 0x0a0a0a : 0xe6e6e6,
      floor:   d ? 0x0e0e0e : 0xbcbcbc,
      wall:    d ? 0x161616 : 0xf0f0f0,
      ceiling: d ? 0x0c0c0c : 0xd8d8d8,
      frame:   d ? 0x3a3a3a : 0x1a1a1a
    };
  }
  var C = getColors();

  // ============ SCENE ============
  var scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.FogExp2(C.bg, 0.018);

  var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 1.8, 4);

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // ============ CORRIDOR ============
  var SPACING = 6;
  var OFFSET  = 6;     // first painting z offset
  var CW = 10;         // corridor width
  var CH = 6;          // corridor height
  var CL = (PROJECTS.length - 1) * SPACING + OFFSET * 2 + 10;

  // Floor
  var floorMat = new THREE.MeshStandardMaterial({ color: C.floor, roughness: 0.12, metalness: 0.4 });
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(CW, CL), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, -(CL / 2 - 4));
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  var ceilMat = new THREE.MeshStandardMaterial({ color: C.ceiling, roughness: 0.95 });
  var ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CW, CL), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, CH, -(CL / 2 - 4));
  scene.add(ceiling);

  // Walls
  var wallMat = new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.85 });

  var leftWall = new THREE.Mesh(new THREE.PlaneGeometry(CL, CH), wallMat);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-CW / 2, CH / 2, -(CL / 2 - 4));
  scene.add(leftWall);

  var rightWall = new THREE.Mesh(new THREE.PlaneGeometry(CL, CH), wallMat.clone());
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(CW / 2, CH / 2, -(CL / 2 - 4));
  scene.add(rightWall);

  // End wall (texture applied directly — no extra plane)
  var endWallZ = -(CL - 4);
  var endWallMat = wallMat.clone();
  var endWall = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), endWallMat);
  endWall.position.set(0, CH / 2, endWallZ);
  scene.add(endWall);

  // Entrance wall (behind camera start)
  var entranceWall = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), wallMat.clone());
  entranceWall.rotation.y = Math.PI;
  entranceWall.position.set(0, CH / 2, 5);
  scene.add(entranceWall);

  // ============ ARCHITECTURAL DETAILS ============
  var moldingColor = getIsDark() ? 0x1a1a1a : 0xd0d0d0;
  var moldingMat = new THREE.MeshStandardMaterial({ color: moldingColor, roughness: 0.2, metalness: 0.3 });
  var moldingMeshes = [];

  // Baseboard molding (floor-wall junction)
  var baseH = 0.12, baseD = 0.06;
  var baseL = new THREE.Mesh(new THREE.BoxGeometry(baseD, baseH, CL), moldingMat);
  baseL.position.set(-CW / 2 + baseD / 2, baseH / 2, -(CL / 2 - 4));
  scene.add(baseL);
  moldingMeshes.push(baseL);

  var baseR = new THREE.Mesh(new THREE.BoxGeometry(baseD, baseH, CL), moldingMat.clone());
  baseR.position.set(CW / 2 - baseD / 2, baseH / 2, -(CL / 2 - 4));
  scene.add(baseR);
  moldingMeshes.push(baseR);

  // Crown molding (ceiling-wall junction)
  var crownH = 0.15, crownD = 0.07;
  var crownL = new THREE.Mesh(new THREE.BoxGeometry(crownD, crownH, CL), moldingMat.clone());
  crownL.position.set(-CW / 2 + crownD / 2, CH - crownH / 2, -(CL / 2 - 4));
  scene.add(crownL);
  moldingMeshes.push(crownL);

  var crownR = new THREE.Mesh(new THREE.BoxGeometry(crownD, crownH, CL), moldingMat.clone());
  crownR.position.set(CW / 2 - crownD / 2, CH - crownH / 2, -(CL / 2 - 4));
  scene.add(crownR);
  moldingMeshes.push(crownR);

  // Subtle wall panel seams (vertical lines every ~8 units)
  var panelSeamMat = new THREE.MeshStandardMaterial({
    color: getIsDark() ? 0x1e1e1e : 0xe0e0e0,
    roughness: 0.4,
    metalness: 0.1
  });
  var panelSeams = [];
  var panelInterval = 8;
  for (var pi = 1; pi * panelInterval < CL; pi++) {
    var pz = -(pi * panelInterval) + 4;
    // Left wall seam
    var seamL = new THREE.Mesh(new THREE.BoxGeometry(0.005, CH - baseH - crownH, 0.01), panelSeamMat);
    seamL.position.set(-CW / 2 + 0.01, CH / 2, pz);
    scene.add(seamL);
    panelSeams.push(seamL);
    // Right wall seam
    var seamR = new THREE.Mesh(new THREE.BoxGeometry(0.005, CH - baseH - crownH, 0.01), panelSeamMat.clone());
    seamR.position.set(CW / 2 - 0.01, CH / 2, pz);
    scene.add(seamR);
    panelSeams.push(seamR);
  }

  // ============ LIGHTING ============
  var ambient = new THREE.AmbientLight(0xffffff, getIsDark() ? 0.15 : 0.45);
  scene.add(ambient);

  // Ceiling track rail
  var trackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.15, metalness: 0.85 });
  var trackRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, CL), trackMat);
  trackRail.position.set(0, CH - 0.02, -(CL / 2 - 4));
  scene.add(trackRail);

  // Ceiling strip lights with visible housings
  var stripLights = [];
  var trackHousings = [];
  for (var si = 0; si < Math.ceil(CL / 5); si++) {
    var slZ = -(si * 5) + 4;

    // Light housing (small cylinder hanging from rail)
    var housing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.05, 0.14, 8),
      trackMat.clone()
    );
    housing.position.set(0, CH - 0.11, slZ);
    scene.add(housing);
    trackHousings.push(housing);

    var sl = new THREE.PointLight(0xfff8ee, getIsDark() ? 0.1 : 0.18, 8);
    sl.position.set(0, CH - 0.2, slZ);
    scene.add(sl);
    stripLights.push(sl);
  }

  // Per-painting spotlights (warm gallery tint)
  var SPOT_COLOR = 0xfff5e6;
  var spotlights = [];
  var spotHousings = [];
  PROJECTS.forEach(function(_, i) {
    var z = -(i * SPACING + OFFSET);
    var isLeft = i % 2 === 0;
    var wallX = isLeft ? -CW / 2 : CW / 2;
    var spotX = isLeft ? wallX + 2.5 : wallX - 2.5;

    // Spot housing on ceiling
    var sHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.07, 0.16, 8),
      trackMat.clone()
    );
    sHousing.position.set(spotX, CH - 0.1, z + 1.2);
    // Tilt housing toward painting
    sHousing.rotation.z = isLeft ? 0.3 : -0.3;
    scene.add(sHousing);
    spotHousings.push(sHousing);

    var spot = new THREE.SpotLight(SPOT_COLOR, getIsDark() ? 2.2 : 1.8, 14, Math.PI / 5, 0.5, 1);
    spot.position.set(spotX, CH - 0.4, z + 1.2);
    spot.castShadow = true;
    spot.shadow.mapSize.width = 512;
    spot.shadow.mapSize.height = 512;

    var tgt = new THREE.Object3D();
    tgt.position.set(wallX + (isLeft ? 0.3 : -0.3), CH / 2, z);
    scene.add(tgt);
    spot.target = tgt;
    scene.add(spot);
    spotlights.push(spot);
  });

  // ============ PAINTING TEXTURES (Canvas 2D) ============
  function createPaintingTexture(project) {
    var c = document.createElement('canvas');
    var w = 1024, h = 768;
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var d = getIsDark();

    ctx.fillStyle = d ? '#1a1a1a' : '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Inner border
    ctx.strokeStyle = d ? '#282828' : '#eaeaea';
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 28, w - 56, h - 56);

    // Big faded number
    ctx.fillStyle = d ? '#222' : '#f0f0f0';
    ctx.font = 'bold 220px Poppins, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(project.num, w - 35, 5);

    // Title
    ctx.fillStyle = d ? '#f0f0f0' : '#111';
    ctx.font = 'bold 48px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(project.title, 50, 280);

    // Tags as pills
    var tagX = 50;
    ctx.font = 'bold 17px Poppins, sans-serif';
    project.tags.forEach(function(tag) {
      var tw = ctx.measureText(tag).width + 22;
      ctx.fillStyle = d ? '#282828' : '#f2f2f2';
      ctx.fillRect(tagX, 300, tw, 28);
      ctx.strokeStyle = d ? '#3a3a3a' : '#ccc';
      ctx.lineWidth = 1;
      ctx.strokeRect(tagX, 300, tw, 28);
      ctx.fillStyle = d ? '#999' : '#555';
      ctx.fillText(tag, tagX + 11, 320);
      tagX += tw + 8;
    });

    // Divider
    ctx.strokeStyle = d ? '#2a2a2a' : '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 355);
    ctx.lineTo(w - 50, 355);
    ctx.stroke();

    // Description
    ctx.fillStyle = d ? '#aaa' : '#444';
    ctx.font = '24px Poppins, sans-serif';
    wrapText(ctx, project.desc, 50, 400, w - 100, 34);

    // Bottom link hint
    ctx.fillStyle = d ? '#555' : '#aaa';
    ctx.font = 'bold 15px Poppins, sans-serif';
    ctx.fillText('CLICK TO VIEW ON GITHUB', 50, h - 48);

    var texture = new THREE.CanvasTexture(c);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' '), line = '', cy = y;
    for (var i = 0; i < words.length; i++) {
      var test = line + words[i] + ' ';
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, cy);
        line = words[i] + ' ';
        cy += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, cy);
  }

  // ============ PLACE PAINTINGS ============
  var paintingData = [];
  var PW = 3.6, PH = 2.7;
  var PAINT_Y = CH / 2 + 0.2;

  PROJECTS.forEach(function(project, i) {
    var isLeft = i % 2 === 0;
    var z = -(i * SPACING + OFFSET);
    var wallX = isLeft ? -CW / 2 : CW / 2;
    var outward = isLeft ? 0.08 : -0.08;

    // Frame (box)
    var frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, PH + 0.3, PW + 0.3),
      new THREE.MeshStandardMaterial({ color: C.frame, roughness: 0.2, metalness: 0.35 })
    );
    frame.position.set(wallX + outward, PAINT_Y, z);
    frame.castShadow = true;
    scene.add(frame);

    // Painting plane
    var tex = createPaintingTexture(project);
    var painting = new THREE.Mesh(
      new THREE.PlaneGeometry(PW, PH),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.65 })
    );
    painting.position.set(wallX + outward * 2.5, PAINT_Y, z);
    painting.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
    scene.add(painting);

    // Small title plate
    var plate = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.18),
      new THREE.MeshStandardMaterial({ color: getIsDark() ? 0x1e1e1e : 0xeeeeee, roughness: 0.5 })
    );
    plate.position.set(wallX + outward * 2.5, PAINT_Y - PH / 2 - 0.3, z);
    plate.rotation.y = isLeft ? Math.PI / 2 : -Math.PI / 2;
    scene.add(plate);

    paintingData.push({ project: project, isLeft: isLeft, z: z, wallX: wallX, painting: painting, frame: frame });
  });

  // ============ "PROJECTS" TITLE ON ENTRANCE WALL ============
  (function() {
    var c = document.createElement('canvas');
    var w = 1024, h = 512;
    c.width = w; c.height = h;
    var ctx = c.getContext('2d');
    var d = getIsDark();

    // Transparent-ish background matching wall
    ctx.fillStyle = d ? '#161616' : '#f0f0f0';
    ctx.fillRect(0, 0, w, h);

    // Big title
    ctx.fillStyle = d ? '#f0f0f0' : '#111';
    ctx.font = 'bold 80px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PROJECTS', w / 2, h / 2 - 30);

    // Subtitle
    ctx.fillStyle = d ? '#666' : '#999';
    ctx.font = '24px Poppins, sans-serif';
    ctx.fillText('Scroll to explore the gallery', w / 2, h / 2 + 40);

    var tex = new THREE.CanvasTexture(c);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    var titlePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 2.5),
      new THREE.MeshBasicMaterial({ map: tex })
    );
    // On entrance wall, facing inward (toward negative Z)
    titlePlane.position.set(0, CH / 2 + 0.2, 4.92);
    titlePlane.rotation.y = Math.PI;
    scene.add(titlePlane);

    // Store for dark mode
    window._galleryTitleRefs = {
      plane: titlePlane,
      createTexture: function() {
        var c2 = document.createElement('canvas');
        c2.width = w; c2.height = h;
        var ctx2 = c2.getContext('2d');
        var d2 = getIsDark();
        ctx2.fillStyle = d2 ? '#161616' : '#f0f0f0';
        ctx2.fillRect(0, 0, w, h);
        ctx2.fillStyle = d2 ? '#f0f0f0' : '#111';
        ctx2.font = 'bold 80px Poppins, sans-serif';
        ctx2.textAlign = 'center';
        ctx2.textBaseline = 'middle';
        ctx2.fillText('PROJECTS', w / 2, h / 2 - 30);
        ctx2.fillStyle = d2 ? '#666' : '#999';
        ctx2.font = '24px Poppins, sans-serif';
        ctx2.fillText('Scroll to explore the gallery', w / 2, h / 2 + 40);
        var t = new THREE.CanvasTexture(c2);
        t.minFilter = THREE.LinearMipmapLinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return t;
      }
    };
  })();

  // ============ CONTACT INFO — 3D TEXT BLOCKS ON END WALL ============
  var contactMeshes = [];
  (function() {
    var d = getIsDark();

    // Helper: create a canvas-textured box that extrudes from the wall
    function makeTextBlock(text, fontSize, bold, blockW, blockH, depth, color, bgColor) {
      var c = document.createElement('canvas');
      var res = 4; // resolution multiplier
      c.width = blockW * 128 * res;
      c.height = blockH * 128 * res;
      var ctx = c.getContext('2d');

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = color;
      ctx.font = (bold ? 'bold ' : '') + (fontSize * res) + 'px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, c.width / 2, c.height / 2);

      var tex = new THREE.CanvasTexture(c);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Box with texture on front face, solid sides
      var sideColor = new THREE.Color(bgColor);
      var materials = [
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.3, metalness: 0.2 }), // +x
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.3, metalness: 0.2 }), // -x
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.3, metalness: 0.2 }), // +y
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.3, metalness: 0.2 }), // -y
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.1 }),         // +z (front)
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.3, metalness: 0.2 })  // -z (back)
      ];

      var mesh = new THREE.Mesh(new THREE.BoxGeometry(blockW, blockH, depth), materials);
      mesh.castShadow = true;
      return mesh;
    }

    // Color palette — high contrast against wall
    var titleColor = d ? '#ffffff' : '#ffffff';
    var titleBg    = d ? '#1e1e1e' : '#111111';
    var labelColor = d ? '#e0e0e0' : '#ffffff';
    var labelBg    = d ? '#2a2a2a' : '#333333';
    var valueColor = d ? '#ffffff' : '#111111';
    var valueBg    = d ? '#1e1e1e' : '#ffffff';

    // --- "GET IN TOUCH" main title — big extruded block
    var title = makeTextBlock('GET IN TOUCH', 52, true, 6.5, 0.9, 0.35, titleColor, titleBg);
    title.position.set(0, CH - 1.0, endWallZ + 0.2);
    scene.add(title);
    contactMeshes.push({ mesh: title, role: 'title' });

    // Thin decorative line below title
    var lineDeco = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.02, 0.08),
      new THREE.MeshStandardMaterial({ color: d ? 0x444444 : 0x999999, roughness: 0.2, metalness: 0.5 })
    );
    lineDeco.position.set(0, CH - 1.6, endWallZ + 0.15);
    scene.add(lineDeco);
    contactMeshes.push({ mesh: lineDeco, role: 'line' });

    // --- Contact rows: label block + value block
    var rows = [
      { icon: 'GITHUB',   value: 'github.com/muriarty1893' },
      { icon: 'EMAIL',    value: 'ekermuratinfo@gmail.com' },
      { icon: 'LINKEDIN', value: 'linkedin.com/in/murat-eker' }
    ];

    rows.forEach(function(row, i) {
      var yPos = CH - 2.4 - i * 1.15;

      // Label — small extruded tag
      var label = makeTextBlock(row.icon, 18, true, 2.0, 0.4, 0.2, labelColor, labelBg);
      label.position.set(-2.2, yPos, endWallZ + 0.15);
      scene.add(label);
      contactMeshes.push({ mesh: label, role: 'label' });

      // Value — wider block, less depth
      var val = makeTextBlock(row.value, 18, false, 5.0, 0.4, 0.1, valueColor, valueBg);
      val.position.set(1.3, yPos, endWallZ + 0.1);
      scene.add(val);
      contactMeshes.push({ mesh: val, role: 'value' });
    });

    // Spotlight aimed at the end wall
    var contactSpot = new THREE.SpotLight(0xffffff, d ? 3.0 : 2.0, 25, Math.PI / 3, 0.3, 1);
    contactSpot.position.set(0, CH - 0.3, endWallZ + 8);
    contactSpot.castShadow = true;
    var contactTarget = new THREE.Object3D();
    contactTarget.position.set(0, CH / 2, endWallZ);
    scene.add(contactTarget);
    contactSpot.target = contactTarget;
    scene.add(contactSpot);
    contactMeshes.push({ mesh: contactSpot, role: 'spot' });

    // Store for dark mode
    window._galleryContactRefs = {
      spot: contactSpot,
      rebuild: function() {
        var d2 = getIsDark();
        var tc = d2 ? '#ffffff' : '#ffffff';
        var tb = d2 ? '#1e1e1e' : '#111111';
        var lc = d2 ? '#e0e0e0' : '#ffffff';
        var lb = d2 ? '#2a2a2a' : '#333333';
        var vc = d2 ? '#ffffff' : '#111111';
        var vb = d2 ? '#1e1e1e' : '#ffffff';

        // Remove old meshes
        contactMeshes.forEach(function(item) {
          if (item.role !== 'spot') scene.remove(item.mesh);
        });
        contactMeshes = contactMeshes.filter(function(item) { return item.role === 'spot'; });

        // Rebuild title
        var t = makeTextBlock('GET IN TOUCH', 52, true, 6.5, 0.9, 0.35, tc, tb);
        t.position.set(0, CH - 1.0, endWallZ + 0.2);
        scene.add(t);
        contactMeshes.push({ mesh: t, role: 'title' });

        var ld = new THREE.Mesh(
          new THREE.BoxGeometry(4, 0.02, 0.08),
          new THREE.MeshStandardMaterial({ color: d2 ? 0x444444 : 0x999999, roughness: 0.2, metalness: 0.5 })
        );
        ld.position.set(0, CH - 1.6, endWallZ + 0.15);
        scene.add(ld);
        contactMeshes.push({ mesh: ld, role: 'line' });

        var rws = [
          { icon: 'GITHUB',   value: 'github.com/muriarty1893' },
          { icon: 'EMAIL',    value: 'ekermuratinfo@gmail.com' },
          { icon: 'LINKEDIN', value: 'linkedin.com/in/murat-eker' }
        ];
        rws.forEach(function(row, i) {
          var yPos = CH - 2.4 - i * 1.15;
          var lab = makeTextBlock(row.icon, 18, true, 2.0, 0.4, 0.2, lc, lb);
          lab.position.set(-2.2, yPos, endWallZ + 0.15);
          scene.add(lab);
          contactMeshes.push({ mesh: lab, role: 'label' });
          var v = makeTextBlock(row.value, 18, false, 5.0, 0.4, 0.1, vc, vb);
          v.position.set(1.3, yPos, endWallZ + 0.1);
          scene.add(v);
          contactMeshes.push({ mesh: v, role: 'value' });
        });

        contactSpot.intensity = d2 ? 3.0 : 2.0;
      }
    };
  })();

  // ============ SCROLL-DRIVEN CAMERA ============
  var scrollProgress = 0;
  var camX = 0, camY = 2.7;
  var lookX = 0, lookY = 2.4, lookZ = -OFFSET;
  var currentInfoIndex = -1;

  // Camera z range: start just before first painting, end at contact wall
  var CAM_START_Z = -(OFFSET - 4);
  var CAM_END_Z   = -(CL - 4 - 5);

  function getScrollProgress() {
    var rect = section.getBoundingClientRect();
    var total = section.offsetHeight - window.innerHeight;
    if (total <= 0) return 0;
    return clamp(-rect.top / total, 0, 1);
  }

  window.addEventListener('scroll', function() {
    scrollProgress = getScrollProgress();
  }, { passive: true });

  // ============ CAMERA UPDATE ============
  function updateCamera() {
    // Z position linearly mapped to scroll
    var targetZ = lerp(CAM_START_Z, CAM_END_Z, scrollProgress);
    camera.position.z += (targetZ - camera.position.z) * 0.12;

    // Find nearest painting
    var nearest = 0, minDist = Infinity;
    paintingData.forEach(function(p, i) {
      var d = Math.abs(camera.position.z - p.z);
      if (d < minDist) { minDist = d; nearest = i; }
    });

    var p = paintingData[nearest];
    // Proximity: 1 = right at painting, 0 = far away
    var proximity = smoothstep(clamp(1 - minDist / (SPACING * 0.45), 0, 1));

    // Camera X: very subtle shift toward the painting side
    var sideX = p.isLeft ? -1.0 : 1.0;
    var targetCamX = sideX * proximity * 0.35;
    camX += (targetCamX - camX) * 0.08;
    camera.position.x = camX + mouseX * 0.15;

    // Camera Y: stable at eye level with subtle mouse
    camera.position.y += (camY + mouseY * 0.08 - camera.position.y) * 0.06;

    // LookAt: when near a painting, turn to face it directly
    // When far from any painting, look straight ahead
    var aheadZ = camera.position.z - 4;
    // Full wall X position so camera faces the painting head-on
    var paintLookX = p.isLeft ? -CW / 2 : CW / 2;

    var targetLookX = lerp(0, paintLookX, proximity);
    var targetLookY = lerp(camY, PAINT_Y, proximity * 0.3);
    var targetLookZ = lerp(aheadZ, p.z, proximity);

    lookX += (targetLookX - lookX) * 0.07;
    lookY += (targetLookY - lookY) * 0.07;
    lookZ += (targetLookZ - lookZ) * 0.09;

    camera.lookAt(lookX, lookY, lookZ);

    // Update info overlay
    updateInfoOverlay(nearest, proximity);
  }

  // ============ INFO OVERLAY ============
  var infoPanel  = document.getElementById('gallery-info');
  var infoNum    = document.getElementById('gallery-info-num');
  var infoTitle  = document.getElementById('gallery-info-title');
  var infoTags   = document.getElementById('gallery-info-tags');
  var infoDesc   = document.getElementById('gallery-info-desc');
  var infoCta    = document.getElementById('gallery-info-cta');
  var progressEl = document.getElementById('gallery-progress-text');

  function updateInfoOverlay(index, proximity) {
    currentInfoIndex = index;
    var opacity = proximity > 0.3 ? smoothstep(clamp((proximity - 0.3) / 0.4, 0, 1)) : 0;

    if (infoPanel) infoPanel.style.opacity = opacity;

    if (opacity > 0.1) {
      var proj = PROJECTS[index];
      if (infoNum)   infoNum.textContent = proj.num;
      if (infoTitle) infoTitle.textContent = proj.title;
      if (infoTags)  infoTags.textContent = proj.tags.join(' / ');
      if (infoDesc)  infoDesc.textContent = proj.desc;
      if (infoCta) {
        infoCta.href = proj.url;
        infoCta.textContent = 'View on GitHub';
      }
    }

    if (progressEl) progressEl.textContent = (index + 1) + ' / ' + PROJECTS.length;
  }

  // ============ MOUSE TRACKING ============
  var mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', function(e) {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ============ RAYCASTING (click to open project) ============
  var raycaster = new THREE.Raycaster();
  var mouse2D = new THREE.Vector2();

  canvas.addEventListener('click', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse2D, camera);
    var meshes = paintingData.map(function(pd) { return pd.painting; });
    var hits = raycaster.intersectObjects(meshes);
    if (hits.length > 0) {
      var hit = paintingData.find(function(pd) { return pd.painting === hits[0].object; });
      if (hit && hit.project.url) window.open(hit.project.url, '_blank');
    }
  });

  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse2D, camera);
    var meshes = paintingData.map(function(pd) { return pd.painting; });
    canvas.style.cursor = raycaster.intersectObjects(meshes).length > 0 ? 'pointer' : 'default';
  });

  // ============ RENDER LOOP ============
  var galleryVisible = false;
  var observer = new IntersectionObserver(function(entries) {
    galleryVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(section);

  function animate() {
    requestAnimationFrame(animate);
    if (!galleryVisible) return;
    updateCamera();
    renderer.render(scene, camera);
  }
  animate();

  // ============ RESIZE ============
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ============ DARK MODE REACTIVITY ============
  var darkBtn = document.getElementById('dark-mode-toggle');
  if (darkBtn) {
    darkBtn.addEventListener('click', function() {
      setTimeout(function() {
        var d = getIsDark();
        var nc = getColors();

        scene.background.setHex(nc.bg);
        scene.fog = new THREE.FogExp2(nc.bg, 0.018);
        floorMat.color.setHex(nc.floor);
        ceilMat.color.setHex(nc.ceiling);
        [leftWall, rightWall, endWall, entranceWall].forEach(function(w) { w.material.color.setHex(nc.wall); });

        // Moldings
        var mc = d ? 0x1a1a1a : 0xd0d0d0;
        moldingMeshes.forEach(function(m) { m.material.color.setHex(mc); });

        // Panel seams
        var pc = d ? 0x1e1e1e : 0xe0e0e0;
        panelSeams.forEach(function(s) { s.material.color.setHex(pc); });

        ambient.intensity = d ? 0.15 : 0.45;
        stripLights.forEach(function(l) { l.intensity = d ? 0.1 : 0.18; });
        spotlights.forEach(function(s) { s.intensity = d ? 2.2 : 1.8; });

        paintingData.forEach(function(pd) {
          pd.painting.material.map = createPaintingTexture(pd.project);
          pd.painting.material.needsUpdate = true;
          pd.frame.material.color.setHex(nc.frame);
        });

        // Update title wall
        if (window._galleryTitleRefs) {
          var tr = window._galleryTitleRefs;
          tr.plane.material.map = tr.createTexture();
          tr.plane.material.needsUpdate = true;
        }

        // Update contact wall (full rebuild for 3D blocks)
        if (window._galleryContactRefs) {
          window._galleryContactRefs.rebuild();
        }
      }, 60);
    });
  }

})();
