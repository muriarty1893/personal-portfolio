AOS.init({
  duration: 800,
  easing: 'slide'
});

(function($) {
  'use strict';

  function setFullHeight() {
    $('.js-fullheight').css('height', $(window).height());
  }

  function bindMobileMenu() {
    $('body').on('click', '.js-fh5co-nav-toggle', function(event) {
      event.preventDefault();
      $(this).toggleClass('active', !$('#ftco-nav').is(':visible'));
    });
  }

  function bindTopNavScroll() {
    $(document).on('click', '#ftco-nav a[href^="#"]', function(event) {
      var target = $($.attr(this, 'href'));
      if (!target.length) return;

      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - 70
      }, 500);
    });
  }

  function bindNavbarState() {
    $(window).on('scroll', function() {
      var st = $(this).scrollTop();
      var navbar = $('.ftco_navbar');
      var scrollWrap = $('.js-scroll-wrap');

      navbar.toggleClass('scrolled', st > 150);

      if (st > 350) {
        navbar.addClass('awake');
        scrollWrap.addClass('sleep');
      } else {
        navbar.removeClass('awake');
        if (st < 150) navbar.removeClass('sleep');
        scrollWrap.removeClass('sleep');
      }
    });
  }

  function animateContentOnScroll() {
    var index = 0;

    $('.ftco-animate').waypoint(function(direction) {
      if (direction !== 'down' || $(this.element).hasClass('ftco-animated')) return;

      index++;
      $(this.element).addClass('item-animate');

      setTimeout(function() {
        $('body .ftco-animate.item-animate').each(function(k) {
          var el = $(this);
          setTimeout(function() {
            var effect = el.data('animate-effect');
            var effectClass = effect === 'fadeIn' || effect === 'fadeInLeft' || effect === 'fadeInRight'
              ? effect
              : 'fadeInUp';

            el.addClass(effectClass + ' ftco-animated');
            el.removeClass('item-animate');
          }, k * 50);
        });
      }, index === 1 ? 100 : 0);
    }, { offset: '95%' });
  }

  function bindResumeNav() {
    var sections = [];
    var activeId = false;
    var navLinks = $('#navi a');

    navLinks.on('click', function(event) {
      var target = $($(this).attr('href'));
      if (!target.length) return;

      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top - (window.innerWidth <= 991 ? 120 : 180)
      }, 500);
      updateHash($(this).attr('href'));
    });

    navLinks.each(function() {
      var target = $($(this).attr('href'));
      if (target.length) sections.push(target);
    });

    $(window).on('scroll', function() {
      var scrollTop = $(this).scrollTop() + ($(window).height() / 2);
      var scrolledId;

      sections.forEach(function(section) {
        if (scrollTop > section.offset().top) {
          scrolledId = section.attr('id');
        }
      });

      if (scrolledId && scrolledId !== activeId) {
        activeId = scrolledId;
        navLinks.removeClass('current');
        $('#navi a[href="#' + activeId + '"]').addClass('current');
      }
    });
  }

  function updateHash(hash) {
    if (history.pushState) {
      history.pushState(null, null, hash);
    } else {
      location.hash = hash;
    }
  }

  function bindResumeNavVisibility() {
    var navBrackets = document.querySelector('.nav-brackets');
    var resumeSection = document.getElementById('resume-section');
    if (!navBrackets || !resumeSection) return;

    function updateNavLinks() {
      var resumeTop = resumeSection.getBoundingClientRect().top;
      navBrackets.classList.toggle('nav-links-hidden', resumeTop <= 80);
    }

    window.addEventListener('scroll', updateNavLinks, { passive: true });
    updateNavLinks();
  }

  function bindMobileResumeNav() {
    var navi = document.getElementById('navi');
    var resumeSection = document.getElementById('resume-section');
    if (!navi || !resumeSection || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      if (window.innerWidth > 991) return;

      entries.forEach(function(entry) {
        navi.classList.toggle('nav-visible', entry.isIntersecting);
      });
    }, { threshold: 0.05 });

    observer.observe(resumeSection);
  }

  function setFooterYear() {
    var year = document.getElementById('current-year');
    if (year) year.textContent = new Date().getFullYear();
  }

  function bindLanguageSwitcher() {
    var switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    var pages = {
      en: 'index.html',
      tr: 'index-tr.html',
      de: 'index-de.html'
    };
    var currentLang = document.documentElement.lang || 'en';
    var buttons = switcher.querySelectorAll('.lang-switcher__button');

    buttons.forEach(function(button) {
      var isActive = button.dataset.lang === currentLang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    switcher.addEventListener('click', function(event) {
      var target = event.target;
      if (!target.matches('.lang-switcher__button') || !pages[target.dataset.lang]) return;

      localStorage.setItem('portfolio-language', target.dataset.lang);
      if (target.dataset.lang === currentLang) return;

      window.location.href = pages[target.dataset.lang] + window.location.hash;
    });
  }

  function initTextRoll() {
    var STAGGER = 0.035;
    var spans = document.querySelectorAll('.nav-brackets .nav-link > span');
    spans.forEach(function(span) {
      var text = span.textContent;
      var len = text.length;
      var topHtml = '';
      var bottomHtml = '';
      for (var i = 0; i < len; i++) {
        var ch = text[i] === ' ' ? ' ' : text[i];
        var delay = (STAGGER * Math.abs(i - (len - 1) / 2)).toFixed(4);
        var charSpan = '<span class="tr-char" style="--delay:' + delay + 's">' + ch + '</span>';
        topHtml += charSpan;
        bottomHtml += charSpan;
      }
      span.innerHTML = '<span class="text-roll">'
        + '<span class="text-roll-top">' + topHtml + '</span>'
        + '<span class="text-roll-bottom">' + bottomHtml + '</span>'
        + '</span>';
    });
  }

  $(function() {
    setFullHeight();
    bindMobileMenu();
    bindTopNavScroll();
    bindNavbarState();
    animateContentOnScroll();
    bindResumeNav();
    bindResumeNavVisibility();
    bindMobileResumeNav();
    setFooterYear();
    bindLanguageSwitcher();
    initTextRoll();
    initTiltCard();

    $(window).on('resize', setFullHeight);
  });

  function initTiltCard() {
    var cards = document.querySelectorAll('.tilt-card');
    cards.forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var rotX = -(y - 0.5) * 20;
        var rotY = (x - 0.5) * 20;
        card.style.transition = 'transform 0.06s linear';
        card.style.transform = 'perspective(1200px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.05)';
      });

      card.addEventListener('mouseleave', function() {
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';
      });
    });
  }
})(jQuery);

window.startHeroAnimations = function() {
  var titleLines = document.querySelectorAll('.hero-title-line');
  if (!titleLines.length) return;

  if (window.innerWidth <= 767 || typeof gsap === 'undefined') {
    titleLines.forEach(function(line) { line.style.visibility = 'visible'; });
    return;
  }

  titleLines.forEach(function(line) {
    if (line.querySelector('.char')) return;

    var text = line.textContent;
    line.textContent = '';
    text.split('').forEach(function(char) {
      var span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      line.appendChild(span);
    });
    line.style.visibility = 'visible';
  });

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-title-line .char', {
    y: -70,
    opacity: 0,
    duration: 1.0,
    stagger: {
      amount: 0.7,
      from: 'center'
    }
  }, 0);

  tl.from('.hero-counter', { opacity: 0, y: 20, duration: 0.6 }, 0.2);
  tl.from('.hero-location', { opacity: 0, y: 15, duration: 0.6 }, 0.5);
  tl.from('.hero-specialties li', {
    opacity: 0,
    y: 15,
    duration: 0.5,
    stagger: { amount: 0.35 }
  }, 0.75);

  tl.fromTo('.hero-photo img', {
    scale: 1.34,
    transformOrigin: 'center center'
  }, {
    scale: 1,
    duration: 2.0,
    ease: 'power4.out'
  }, 0.15);

  tl.to('.hero-photo-overlay', {
    scaleY: 0,
    duration: 2.0,
    ease: 'power4.out'
  }, 0.15);
};
