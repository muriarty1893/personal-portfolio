(function() {
  var loaderEl = document.getElementById('loader');

  if (!loaderEl || !document.body.classList.contains('loading')) {
    if (typeof window.startHeroAnimations === 'function') {
      window.startHeroAnimations();
    }
    return;
  }

  if (typeof THREE === 'undefined' || typeof gsap === 'undefined') {
    loaderEl.style.display = 'none';
    document.body.classList.remove('loading');
    if (typeof window.startHeroAnimations === 'function') {
      window.startHeroAnimations();
    }
    return;
  }

  var textColor = '#000000';
  var bgColor = 0xffffff;
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('loader-canvas'),
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(bgColor);
  renderer.setSize(window.innerWidth, window.innerHeight);
  scene.add(new THREE.AmbientLight(0xffffff, 1));

  function createTextTexture(text, heightScale, fontWeight, fontFamily) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 8192;
    canvas.height = 4096;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var displayText = text + ' ';
    var family = fontFamily || 'Poppins';
    ctx.font = fontWeight + ' 100px "' + family + '", sans-serif';

    var finalSize = 100 * (canvas.width / ctx.measureText(displayText).width);
    ctx.font = fontWeight + ' ' + finalSize + 'px "' + family + '", sans-serif';
    ctx.fillStyle = textColor;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = finalSize * 0.018;
    ctx.lineJoin = 'round';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, heightScale);
    ctx.strokeText(displayText, 0, 0);
    ctx.fillText(displayText, 0, 0);
    ctx.restore();

    var texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    texture.needsUpdate = true;

    return texture;
  }

  function createTextSphere(text, heightScale, fontWeight, fontFamily) {
    var group = new THREE.Group();
    var texture = createTextTexture(text, heightScale, fontWeight, fontFamily);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    group.add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), material));
    group.userData.tex = texture;

    return group;
  }

  var masterGroup = new THREE.Group();
  masterGroup.rotation.x = Math.PI / 24;
  scene.add(masterGroup);

  var globe1 = createTextSphere('MURAT     EKER     >     COMPUTER     ENGINEER     &     IT     ', 1.45, 900, 'Sofia Sans Condensed');
  var globe2 = createTextSphere('MACHINE LEARNING       *       BACKEND DEVELOPMENT       *       IT INFRASTRUCTURE       *       PORTFOLIO       *      ', 1, 300, 'Spline Sans Mono');
  globe1.userData.tex.offset.x = -25 / 64;
  masterGroup.add(globe1, globe2);

  var mouse = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };

  window.addEventListener('mousemove', function(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  });

  function animateLoader() {
    requestAnimationFrame(animateLoader);
    globe1.userData.tex.offset.x += 0.0004;
    globe2.userData.tex.offset.x += 0.0008;
    target.x += (mouse.y * 0.4 - target.x) * 0.05;
    target.y += (mouse.x * 0.4 - target.y) * 0.05;

    var radius = 6;
    var phi = Math.PI / 2 - target.x - 0.2;
    var theta = target.y;
    camera.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  animateLoader();

  globe1.position.set(1.5, -15, 0);
  globe2.position.set(-1.5, -15, 0);

  var introTl = gsap.timeline({ delay: 0.2 });
  introTl.to(globe1.position, { x: 0, y: 0.35, duration: 2.5, ease: 'power4.out' });
  introTl.to(globe2.position, { x: 0, y: -0.15, duration: 1.8, ease: 'power4.out' }, '-=2.0');

  var counter = { value: 0 };
  var percentageDiv = document.getElementById('percentage-counter');
  var minDone = false;
  var pageDone = false;

  gsap.to(counter, {
    value: 95,
    duration: 4,
    ease: 'none',
    onUpdate: function() {
      percentageDiv.textContent = Math.round(counter.value) + '%';
    },
    onComplete: function() {
      minDone = true;
      tryExit();
    }
  });

  function tryExit() {
    if (!minDone || !pageDone) return;

    gsap.to(counter, {
      value: 100,
      duration: 0.3,
      ease: 'none',
      onUpdate: function() {
        percentageDiv.textContent = Math.round(counter.value) + '%';
      },
      onComplete: runExitAnimation
    });
  }

  if (document.readyState === 'complete') {
    pageDone = true;
  } else {
    window.addEventListener('load', function() {
      pageDone = true;
      tryExit();
    });
  }

  function runExitAnimation() {
    var exitTl = gsap.timeline();

    exitTl.to('#percentage-counter', { opacity: 0, duration: 0.3 }, 0);
    exitTl.to(globe2.position, { x: -1.5, y: -15, duration: 1.0, ease: 'power4.in' }, 0);
    exitTl.to(globe1.position, { x: 1.5, y: -15, duration: 1.3, ease: 'power4.in' }, 0.05);
    exitTl.to('#loader', {
      opacity: 0,
      duration: 0.8,
      onStart: function() {
        if (typeof window.startHeroAnimations === 'function') {
          window.startHeroAnimations();
        }
      },
      onComplete: function() {
        loaderEl.style.display = 'none';
        document.body.classList.remove('loading');
        sessionStorage.setItem('loaderShown', 'true');
      }
    }, 0.8);
  }

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
