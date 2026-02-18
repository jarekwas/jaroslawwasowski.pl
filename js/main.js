/* ==========================================================================
   Main JavaScript - Navigation, Scroll Animations, Counter
   ========================================================================== */

(function () {
  'use strict';

  // ---- Sticky Navigation ----

  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');

  function updateNav() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ---- Active Nav Link ----

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function updateActiveLink() {
    const scrollY = window.scrollY + 200;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---- Mobile Menu ----

  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute(
        'aria-expanded',
        hamburger.classList.contains('open').toString()
      );
      document.body.style.overflow = mobileMenu.classList.contains('open')
        ? 'hidden'
        : '';
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll Reveal Animation ----

  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (!prefersReducedMotion) {
    var revealElements = document.querySelectorAll('.reveal');

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // If reduced motion, show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Counter-Up Animation ----

  var counterElements = document.querySelectorAll('[data-target]');
  var counterAnimated = false;

  function animateCounters() {
    if (counterAnimated) return;
    counterAnimated = true;

    counterElements.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '+';

      var duration = 1500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);
        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      if (prefersReducedMotion) {
        el.textContent = target + suffix;
      } else {
        requestAnimationFrame(step);
      }
    });
  }

  // Observe the metrics section for counter trigger
  var metricsBar = document.querySelector('.about-metrics');
  if (metricsBar) {
    var metricsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            metricsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    metricsObserver.observe(metricsBar);
  }

  // ---- Smooth Scroll for Anchor Links ----

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var offset = nav.offsetHeight + 16;
        var top =
          targetEl.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
})();
