(function() {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smoothScroll = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  // Deterministic pseudo-random so scattered letters land the same way on every visit.
  function seeded(seed) {
    var x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  }

  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    var chars = [];
    text.split('').forEach(function(char) {
      var span = document.createElement('span');
      if (char === ' ') {
        span.className = 'gap';
        span.textContent = ' ';
      } else {
        span.className = 'ch';
        span.textContent = char;
        chars.push(span);
      }
      el.appendChild(span);
    });
    return chars;
  }

  /* --- Smooth scrolling --- */

  function initSmoothScroll() {
    if (reduceMotion || typeof Lenis === 'undefined') return;

    smoothScroll = new Lenis({ duration: 1.15, smoothWheel: true, syncTouch: false });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(function(time) { smoothScroll.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) {
        smoothScroll.raf(time);
        requestAnimationFrame(raf);
      })(0);
    }
  }

  function bindAnchors() {
    document.addEventListener('click', function(event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      closeMenu();
      if (smoothScroll) {
        smoothScroll.scrollTo(target, { offset: -20, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  /* --- Header --- */

  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = menuToggle.dataset.openLabel;
    if (smoothScroll) smoothScroll.start();
  }

  function bindMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.addEventListener('click', function() {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
        return;
      }
      mobileMenu.classList.add('is-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.textContent = menuToggle.dataset.closeLabel;
      if (smoothScroll) smoothScroll.stop();
    });
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function initTextRoll() {
    var STAGGER = 0.035;
    var targets = document.querySelectorAll('.site-nav a > span, .footer__nav a, .footer__brackets a');
    targets.forEach(function(span) {
      var text = span.textContent.trim();
      var len = text.length;
      var chars = '';
      for (var i = 0; i < len; i++) {
        var delay = (STAGGER * Math.abs(i - (len - 1) / 2)).toFixed(4);
        var ch = text[i] === '&' ? '&amp;' : text[i] === '<' ? '&lt;' : text[i];
        chars += '<span class="tr-char" style="--delay:' + delay + 's">' + ch + '</span>';
      }
      span.innerHTML = '<span class="text-roll">'
        + '<span class="text-roll-top">' + chars + '</span>'
        + '<span class="text-roll-bottom" aria-hidden="true">' + chars + '</span>'
        + '</span>';
    });
  }

  function bindLanguageSwitcher() {
    var pages = { en: 'index.html', tr: 'index-tr.html', de: 'index-de.html' };
    var currentLang = document.documentElement.lang || 'en';

    document.querySelectorAll('[data-lang-switcher]').forEach(function(switcher) {
      switcher.querySelectorAll('.lang-switcher__button').forEach(function(button) {
        var isActive = button.dataset.lang === currentLang;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      switcher.addEventListener('click', function(event) {
        var target = event.target.closest('.lang-switcher__button');
        if (!target || !pages[target.dataset.lang]) return;
        try {
          localStorage.setItem('portfolio-language', target.dataset.lang);
        } catch (error) {
          // Storage can be unavailable in some privacy modes.
        }
        if (target.dataset.lang !== currentLang) {
          window.location.href = pages[target.dataset.lang] + window.location.hash;
        }
      });
    });
  }

  /* --- Fit display lines to the available width --- */

  function fitText() {
    document.querySelectorAll('[data-fit]').forEach(function(el) {
      var available = el.clientWidth;
      el.style.fontSize = '100px';
      var widest = 0;
      if (getComputedStyle(el).whiteSpace === 'nowrap') {
        var range = document.createRange();
        range.selectNodeContents(el);
        widest = range.getBoundingClientRect().width;
      } else {
        Array.prototype.forEach.call(el.children, function(child) {
          widest = Math.max(widest, child.getBoundingClientRect().width);
        });
      }
      if (widest > 0) el.style.fontSize = (100 * available / widest * 0.985) + 'px';
    });
  }

  /* --- Hero intro (called by js/loader.js once the loader finishes) --- */

  var heroStarted = false;

  window.startHeroAnimations = function() {
    if (heroStarted) return;
    heroStarted = true;

    var titleLines = document.querySelectorAll('.hero-title-line');
    var overlay = document.querySelector('.hero-photo-overlay');

    if (reduceMotion || typeof gsap === 'undefined') {
      titleLines.forEach(function(line) { line.style.visibility = 'visible'; });
      if (overlay) overlay.style.transform = 'scaleY(0)';
      return;
    }

    titleLines.forEach(function(line) {
      if (!line.querySelector('.char')) {
        var text = line.textContent.trim();
        line.textContent = '';
        text.split('').forEach(function(char) {
          var span = document.createElement('span');
          span.className = 'char';
          span.textContent = char;
          line.appendChild(span);
        });
      }
      line.style.visibility = 'visible';
    });

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-title-line .char', {
      yPercent: -60,
      opacity: 0,
      duration: 1.0,
      stagger: { amount: 0.7, from: 'center' }
    }, 0);
    tl.from('.hero__counter', { opacity: 0, y: 20, duration: 0.6 }, 0.2);
    tl.from('.hero__location', { opacity: 0, y: 15, duration: 0.6 }, 0.5);
    tl.from('.hero__panel', { scaleY: 0, transformOrigin: 'bottom center', duration: 1.2, ease: 'power4.out' }, 0.3);
    tl.from('.hero__specialties li', { opacity: 0, y: 15, duration: 0.5, stagger: { amount: 0.35 } }, 0.75);
    tl.fromTo('.hero__photo img', { scale: 1.34 }, { scale: 1, duration: 2.0, ease: 'power4.out' }, 0.15);
    tl.to('.hero-photo-overlay', { scaleY: 0, duration: 2.0, ease: 'power4.out' }, 0.15);
    tl.from('.hero__intro, .hero__foot', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1 }, 0.9);
  };

  /* --- Reveal on enter --- */

  function initReveals() {
    var targets = document.querySelectorAll('[data-reveal], .mask, [data-footer-name]');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function(el) { el.classList.add('is-in'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    targets.forEach(function(el) { observer.observe(el); });
  }

  /* --- Statement: letters come loose and fall with rigid-body physics (Matter.js) --- */

  function initStatement() {
    var section = document.querySelector('[data-statement]');
    var title = section && section.querySelector('[data-scatter]');
    if (!title || reduceMotion || typeof Matter === 'undefined') return;

    var Engine = Matter.Engine;
    var Bodies = Matter.Bodies;
    var Body = Matter.Body;
    var Composite = Matter.Composite;

    var sticky = section.querySelector('.statement__sticky');
    var engine = Engine.create();
    engine.gravity.y = 1.4;

    var letters = [];
    Array.prototype.forEach.call(title.children, function(line, lineIndex) {
      splitChars(line).forEach(function(ch, i) {
        var seed = lineIndex * 40 + i + 1;
        letters.push({
          el: ch,
          start: 0.16 + seeded(seed) * 0.32 + (4 - lineIndex) * 0.04,
          spin: (seeded(seed + 7) - 0.5) * 0.12,
          kick: (seeded(seed + 13) - 0.5) * 3,
          body: null,
          released: false
        });
      });
    });

    var running = false;
    var visible = false;
    var pointer = null;
    var lastTime = 0;

    function build() {
      Composite.clear(engine.world, false);
      var box = sticky.getBoundingClientRect();
      var width = box.width;
      var height = box.height;

      letters.forEach(function(letter) {
        letter.el.style.transform = '';
        var rect = letter.el.getBoundingClientRect();
        letter.x0 = rect.left - box.left + rect.width / 2;
        letter.y0 = rect.top - box.top + rect.height / 2;
        var w = rect.width * 0.9;
        var h = rect.height * 0.74;
        letter.body = Bodies.rectangle(letter.x0, letter.y0, w, h, {
          isStatic: true,
          friction: 0.6,
          frictionStatic: 0.9,
          restitution: 0.22,
          density: 0.002,
          chamfer: { radius: Math.min(w, h) * 0.12 }
        });
        letter.released = false;
        Composite.add(engine.world, letter.body);
      });

      Composite.add(engine.world, [
        Bodies.rectangle(width / 2, height + 50, width * 3, 100, { isStatic: true }),
        Bodies.rectangle(-50, height / 2, 100, height * 4, { isStatic: true }),
        Bodies.rectangle(width + 50, height / 2, 100, height * 4, { isStatic: true })
      ]);
    }

    function release(letter, push) {
      if (letter.released) return;
      letter.released = true;
      Body.setStatic(letter.body, false);
      Body.setVelocity(letter.body, push || { x: letter.kick, y: 0 });
      Body.setAngularVelocity(letter.body, letter.spin);
    }

    function progress() {
      var rect = section.getBoundingClientRect();
      return clamp(-rect.top / (rect.height - window.innerHeight), 0, 1);
    }

    function onScroll() {
      var p = progress();
      if (p < 0.06 && letters.some(function(letter) { return letter.released; })) {
        build();
        sync();
        return;
      }
      letters.forEach(function(letter) {
        if (p >= letter.start) release(letter);
      });
      start();
    }

    // Moving the pointer through the text knocks letters loose and shoves fallen ones.
    function onPointer(event) {
      var box = sticky.getBoundingClientRect();
      pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
      var radius = 110;
      letters.forEach(function(letter) {
        var pos = letter.body.position;
        var dx = pos.x - pointer.x;
        var dy = pos.y - pointer.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > radius) return;
        var strength = 1 - dist / radius;
        if (!letter.released) {
          release(letter, { x: dx / dist * 6 * strength, y: -3 * strength });
        } else {
          Body.applyForce(letter.body, pos, {
            x: dx / dist * 0.04 * letter.body.mass * strength,
            y: dy / dist * 0.04 * letter.body.mass * strength
          });
        }
      });
      start();
    }

    function sync() {
      letters.forEach(function(letter) {
        var body = letter.body;
        if (!letter.released) {
          letter.el.style.transform = '';
          return;
        }
        letter.el.style.transform = 'translate3d(' + (body.position.x - letter.x0).toFixed(1) + 'px,'
          + (body.position.y - letter.y0).toFixed(1) + 'px,0) rotate(' + body.angle.toFixed(3) + 'rad)';
      });
    }

    function frame(time) {
      if (!visible) {
        running = false;
        return;
      }
      var delta = lastTime ? Math.min(time - lastTime, 32) : 16.7;
      lastTime = time;
      Engine.update(engine, delta);
      sync();
      requestAnimationFrame(frame);
    }

    function start() {
      if (running || !visible) return;
      running = true;
      lastTime = 0;
      requestAnimationFrame(frame);
    }

    new IntersectionObserver(function(entries) {
      visible = entries[0].isIntersecting;
      if (visible) start();
    }).observe(section);

    window.addEventListener('scroll', onScroll, { passive: true });
    sticky.addEventListener('pointermove', onPointer);
    window.addEventListener('resize', function() {
      build();
      onScroll();
    });
    build();
    onScroll();
  }

  /* --- Skills: hovering a column widens it; its label rolls as it moves --- */

  function initSkills() {
    var grid = document.querySelector('[data-skills]');
    if (!grid) return;
    var cols = Array.prototype.slice.call(grid.querySelectorAll('.skill-col'));

    cols.forEach(function(col) {
      var name = col.querySelector('.skill-col__name');
      var label = name.textContent;
      var roll = document.createElement('span');
      roll.className = 'roll';
      var top = document.createElement('span');
      top.textContent = label;
      var bottom = document.createElement('span');
      bottom.setAttribute('aria-hidden', 'true');
      bottom.textContent = '// ' + label;
      roll.appendChild(top);
      roll.appendChild(bottom);
      name.textContent = '';
      name.appendChild(roll);

      function open() {
        cols.forEach(function(other) { other.classList.toggle('is-active', other === col); });
      }
      col.addEventListener('mouseenter', open);
      col.addEventListener('focus', open);
      col.addEventListener('click', open);
    });
  }

  /* --- Contact form opens a pre-filled email --- */

  function bindContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var status = form.querySelector('.contact-form__status');
    var budgetBox = form.querySelector('[data-budget]');
    var budgetSet = budgetBox && budgetBox.querySelector('fieldset');
    var projectRadio = form.querySelector('[data-shows-budget]');

    function syncBudget() {
      if (!budgetBox || !projectRadio) return;
      var open = projectRadio.checked;
      budgetBox.classList.toggle('is-open', open);
      budgetBox.inert = !open;
      budgetSet.disabled = !open;
    }
    form.addEventListener('change', function(event) {
      if (event.target.name === 'topic') syncBudget();
    });
    syncBudget();

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      if (!name || !email || !form.elements.email.checkValidity()) {
        status.textContent = form.dataset.invalid;
        return;
      }
      var topic = form.querySelector('input[name="topic"]:checked');
      var subject = form.dataset.subject + (topic ? ' — ' + topic.value : '');
      var budget = projectRadio && projectRadio.checked && form.querySelector('input[name="budget"]:checked');
      var body = form.elements.message.value.trim()
        + (budget ? '\n\n' + form.querySelector('.topic--budget legend').textContent + ': ' + budget.value : '')
        + '\n\n— ' + name + ' (' + email + ')';
      status.textContent = form.dataset.sending;
      window.location.href = 'mailto:' + form.dataset.to
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);
    });
  }

  /* --- Footer --- */

  // Footer credit: shows a short word ("Me") and rolls to the full name on hover,
  // widening smoothly so the rest of the line isn't pushed abruptly.
  function initCreditRoll() {
    var link = document.querySelector('[data-credit-roll]');
    if (!link) return;
    var STAGGER = 0.03;

    function chars(text) {
      var html = '';
      for (var i = 0; i < text.length; i++) {
        var ch = text[i] === '&' ? '&amp;' : text[i] === '<' ? '&lt;' : text[i];
        html += '<span class="tr-char" style="--delay:' + (STAGGER * i).toFixed(3) + 's">' + ch + '</span>';
      }
      return html;
    }

    var full = link.textContent.trim();
    link.innerHTML = '<span class="text-roll credit-roll__box" aria-hidden="true">'
      + '<span class="text-roll-top">' + chars(link.dataset.short) + '</span>'
      + '<span class="text-roll-bottom">' + chars(full) + '</span>'
      + '</span>';

    var box = link.firstChild;
    // Measure both words at their natural width (inline spans report no scrollWidth).
    function measure() {
      box.style.setProperty('--short', 'auto');
      box.style.setProperty('--long', 'auto');
      var shortWidth = Math.ceil(box.firstChild.getBoundingClientRect().width);
      var longWidth = Math.ceil(box.lastChild.getBoundingClientRect().width);
      box.style.setProperty('--short', shortWidth + 'px');
      box.style.setProperty('--long', longWidth + 'px');
    }
    measure();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    window.addEventListener('resize', measure);
  }


  // Footer name: letters flip up from the middle out (CSS, --d = distance from
  // the centre letter).
  function initFooterName(name) {
    var chars = splitChars(name);
    var mid = (chars.length - 1) / 2;
    chars.forEach(function(ch, i) {
      ch.style.setProperty('--d', Math.round(Math.abs(i - mid)));
    });
  }

  function initFooter() {
    var name = document.querySelector('[data-footer-name]');
    if (name) initFooterName(name);

    var year = document.querySelector('[data-year]');
    if (year) year.textContent = new Date().getFullYear();

    var clock = document.querySelector('[data-clock]');
    if (clock) {
      var format = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Istanbul'
      });
      var tick = function() { clock.textContent = format.format(new Date()); };
      tick();
      setInterval(tick, 15000);
    }
  }

  /* --- Boot --- */

  initSmoothScroll();
  bindAnchors();
  bindMenu();
  initTextRoll();
  bindLanguageSwitcher();
  initReveals();
  initSkills();
  bindContactForm();
  initFooter();
  initCreditRoll();

  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function() {
    fitText();
    initStatement();
  });
  window.addEventListener('resize', fitText);

  // Safety net in case the loader script never hands over.
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (!document.body.classList.contains('loading')) window.startHeroAnimations();
    }, 1500);
  });
})();
