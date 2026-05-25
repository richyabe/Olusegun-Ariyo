/* ============================================================
   OLUSEGUN ARIYO PORTFOLIO — site.js
   Single script: cursor · navbar · animations · utils · counters
   ============================================================ */
(function () {
  'use strict';

  /* ── HELPERS ── */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ══════════════════════════════════════════
     1. LOADING SCREEN
  ══════════════════════════════════════════ */
  function initLoader() {
    var screen = qs('#loadingScreen');
    if (!screen) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        screen.classList.add('hidden');
        triggerAboveFoldReveals();
      }, 400);
    });
  }

  /* ══════════════════════════════════════════
     2. SCROLL PROGRESS BAR
  ══════════════════════════════════════════ */
  function initScrollProgress() {
    var bar = qs('#scrollProgress');
    if (!bar) return;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      bar.style.transform = 'scaleX(' + (window.scrollY / h) + ')';
    }
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ══════════════════════════════════════════
     3. CUSTOM CURSOR
  ══════════════════════════════════════════ */
  function initCursor() {
    if (window.innerWidth <= 768 || 'ontouchstart' in window) return;
    var dot = qs('#cursorDot');
    var ring = qs('#cursorOutline');
    if (!dot || !ring) return;

    document.body.style.cursor = 'none';
    var rx = 0, ry = 0, mx = 0, my = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * .13;
      ry += (my - ry) * .13;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    var sel = 'a,button,[role="button"],.glass-card,.btn-primary,.btn-outline,input,textarea,select,[tabindex]:not([tabindex="-1"])';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(sel)) ring.classList.add('cursor-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(sel)) ring.classList.remove('cursor-hover');
    });
    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '.5'; });

    window.addEventListener('resize', function () {
      var hide = window.innerWidth <= 768;
      dot.style.display = hide ? 'none' : 'block';
      ring.style.display = hide ? 'none' : 'block';
      document.body.style.cursor = hide ? 'auto' : 'none';
    });
  }

  /* ══════════════════════════════════════════
     4. NAVBAR
  ══════════════════════════════════════════ */
  function initNavbar() {
    var nav = qs('#navbar');
    var mBtn = qs('#mobileMenuBtn');
    var mMenu = qs('#mobileMenu');
    var darkBtn = qs('#darkModeToggle');

    /* Scroll effect */
    if (nav) {
      var lastY = 0;
      window.addEventListener('scroll', function () {
        var y = window.scrollY;
        if (y > 60) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
        /* Hide on scroll down (mobile) */
        if (window.innerWidth < 768) {
          nav.style.transform = (y > lastY && y > 100) ? 'translateY(-100%)' : 'translateY(0)';
        }
        lastY = y;
      }, { passive: true });
    }

    /* Mobile menu toggle */
    if (mBtn && mMenu) {
      mBtn.addEventListener('click', function () {
        var open = mMenu.classList.toggle('open');
        mBtn.classList.toggle('open', open);
        mBtn.setAttribute('aria-expanded', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      qsa('a', mMenu).forEach(function (a) {
        a.addEventListener('click', function () {
          mMenu.classList.remove('open');
          mBtn.classList.remove('open');
          mBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    /* Escape key closes menu */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mMenu && mMenu.classList.contains('open')) {
        mMenu.classList.remove('open');
        mBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    /* Active link */
    var path = window.location.pathname.replace(/\/$/, '') || '/index.html';
    qsa('.nav-links a, .mobile-menu a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var match = href === path || href === path + '.html' ||
        (path.endsWith('index.html') && (href === '/' || href === 'index.html')) ||
        (path === '/' && (href === '/' || href === 'index.html'));
      if (match) a.classList.add('active');
    });

    /* Dark mode */
    if (darkBtn) {
      darkBtn.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
      });
    }

    /* Restore theme */
    var saved = localStorage.getItem('theme');
    var sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && sys)) document.documentElement.classList.add('dark');

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768 && mMenu) {
        mMenu.classList.remove('open');
        if (mBtn) mBtn.classList.remove('open');
        document.body.style.overflow = '';
      }
      if (nav) nav.style.transform = 'translateY(0)';
    });
  }

  /* ══════════════════════════════════════════
     5. SCROLL REVEAL (IntersectionObserver)
  ══════════════════════════════════════════ */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      qsa('.reveal,.reveal-left,.reveal-right').forEach(function (el) { el.classList.add('active'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    qsa('.reveal,.reveal-left,.reveal-right').forEach(function (el) { obs.observe(el); });
  }

  function triggerAboveFoldReveals() {
    qsa('.reveal,.reveal-left,.reveal-right').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * .92) el.classList.add('active');
    });
  }

  /* ══════════════════════════════════════════
     6. ANIMATED COUNTERS
  ══════════════════════════════════════════ */
  function initCounters() {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || e.target._counted) return;
        e.target._counted = true;
        var target = parseInt(e.target.getAttribute('data-target'), 10);
        var start = 0, dur = 1600, t0 = performance.now();
        function tick(now) {
          var p = Math.min((now - t0) / dur, 1);
          // ease out cubic
          var ep = 1 - Math.pow(1 - p, 3);
          var val = Math.round(ep * target);
          e.target.textContent = target >= 1000
            ? (val >= 1000 ? Math.floor(val / 1000) + 'k+' : val + '+')
            : val + (target > 3 ? '+' : '');
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    qsa('.counter').forEach(function (el) { obs.observe(el); });
  }

  /* ══════════════════════════════════════════
     7. TYPING EFFECT
  ══════════════════════════════════════════ */
  function initTyping() {
    var el = qs('#typingText');
    if (!el) return;
    var phrases = [
      'Publisher of Urban Express News',
      'Certified Urban & Town Planner',
      'Award-Winning Investigative Journalist',
      'Author · Land & Property Documents Guide',
      'Social Justice & Community Advocate'
    ];
    var pi = 0, ci = 0, deleting = false, speed = 65;
    function type() {
      var p = phrases[pi];
      if (deleting) { el.textContent = p.slice(0, --ci); speed = 35; }
      else          { el.textContent = p.slice(0, ++ci); speed = 60; }
      if (!deleting && ci === p.length) { speed = 2200; deleting = true; }
      else if (deleting && ci === 0)    { deleting = false; pi = (pi + 1) % phrases.length; speed = 500; }
      setTimeout(type, speed);
    }
    setTimeout(type, 800);
  }

  /* ══════════════════════════════════════════
     8. PARTICLE BACKGROUND (lightweight canvas)
  ══════════════════════════════════════════ */
  function initParticles() {
    var canvas = qs('#particlesCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);

    var pts = [];
    for (var i = 0; i < 55; i++) {
      pts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height,
        r: Math.random() * 1.8 + .4,
        s: Math.random() * .45 + .15,
        o: 0,
        dx: (Math.random() - .5) * .4
      });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(179,0,0,' + p.o + ')';
        ctx.fill();
        p.y -= p.s; p.x += p.dx; p.o = Math.min(p.o + .006, .25);
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; p.o = 0; }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ══════════════════════════════════════════
     9. GALLERY FILTER + LIGHTBOX
  ══════════════════════════════════════════ */
  function initGallery() {
    /* Filters */
    qsa('.gallery-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qsa('.gallery-filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        qsa('.gallery-item').forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.style.display = show ? 'block' : 'none';
        });
      });
    });

    /* Lightbox */
    var box = qs('#lightbox');
    var bImg = qs('#lightboxImg');
    if (!box || !bImg) return;
    qsa('[data-lightbox]').forEach(function (el) {
      el.addEventListener('click', function () {
        var src = el.getAttribute('data-src') || el.src || '';
        var alt = el.getAttribute('alt') || '';
        if (!src) return;
        bImg.src = src; bImg.alt = alt;
        box.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLightbox() { box.classList.remove('open'); document.body.style.overflow = ''; }
    var closeBtn = qs('#lightboxClose');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    box.addEventListener('click', function (e) { if (e.target === box) closeLightbox(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ══════════════════════════════════════════
     10. PUBLICATION FILTERS
  ══════════════════════════════════════════ */
  function initPubFilters() {
    qsa('.pub-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qsa('.pub-filter').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');
        qsa('[data-pub-cat]').forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-pub-cat') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ══════════════════════════════════════════
     11. NEWS CATEGORY TABS
  ══════════════════════════════════════════ */
  function initNewsTabs() {
    qsa('.news-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        qsa('.news-tab').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  }

  /* ══════════════════════════════════════════
     12. CONTACT FORM
  ══════════════════════════════════════════ */
  function initContactForm() {
    var form = qs('#contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
      setTimeout(function () {
        if (btn) { btn.textContent = 'Message Sent ✓'; }
        form.reset();
        setTimeout(function () {
          if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; }
        }, 3000);
      }, 1200);
    });

    /* Newsletter forms */
    qsa('.newsletter-form').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = f.querySelector('input[type="email"]');
        var btn = f.querySelector('button');
        if (btn) { btn.textContent = 'Subscribed ✓'; }
        if (inp) inp.value = '';
        setTimeout(function () { if (btn) btn.textContent = 'Subscribe'; }, 3000);
      });
    });
  }

  /* ══════════════════════════════════════════
     13. LAZY IMAGES
  ══════════════════════════════════════════ */
  function initLazyImages() {
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var img = e.target;
          if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
          img.classList.add('loaded');
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '60px' });
    qsa('img[loading="lazy"]').forEach(function (img) { obs.observe(img); });
  }

  /* ══════════════════════════════════════════
     14. BACK TO TOP BUTTON
  ══════════════════════════════════════════ */
  function initBackToTop() {
    var btn = qs('#backToTopBtn');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    /* Footer back-to-top link */
    var link = qs('#backToTop');
    if (link) link.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ══════════════════════════════════════════
     15. DYNAMIC YEAR
  ══════════════════════════════════════════ */
  function initYear() {
    qsa('.current-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ══════════════════════════════════════════
     16. SMOOTH SCROLL FOR ANCHOR LINKS
  ══════════════════════════════════════════ */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id === '#') return;
        var target = qs(id);
        if (target) {
          e.preventDefault();
          var top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ══════════════════════════════════════════
     17. GSAP HERO (if GSAP loaded)
  ══════════════════════════════════════════ */
  function initGSAP() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    var heroItems = qsa('.gsap-hero-item');
    if (heroItems.length) {
      gsap.set(heroItems, { opacity: 0, y: 40 });
      gsap.to(heroItems, {
        opacity: 1, y: 0, duration: .9, stagger: .12,
        ease: 'power3.out', delay: .3
      });
    }

    /* Parallax hero BG text */
    var bgText = qs('.hero-bg-text');
    if (bgText && typeof ScrollTrigger !== 'undefined') {
      gsap.to(bgText, {
        yPercent: 30, ease: 'none',
        scrollTrigger: { trigger: bgText, scrub: 1.5 }
      });
    }
  }

  /* ══════════════════════════════════════════
     INIT ALL
  ══════════════════════════════════════════ */
  function init() {
    initLoader();
    initScrollProgress();
    initCursor();
    initNavbar();
    initReveal();
    initCounters();
    initTyping();
    initParticles();
    initGallery();
    initPubFilters();
    initNewsTabs();
    initContactForm();
    initLazyImages();
    initBackToTop();
    initYear();
    initSmoothScroll();
    initGSAP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', triggerAboveFoldReveals);

  /* Visibility change — pause GSAP triggers */
  document.addEventListener('visibilitychange', function () {
    if (typeof ScrollTrigger === 'undefined') return;
    if (document.hidden) ScrollTrigger.getAll().forEach(function (t) { t.disable(); });
    else ScrollTrigger.refresh();
  });

})();
