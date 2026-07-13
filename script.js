/* ============================================
   MEMAX — script.js
   Vanilla JS: nav, reveal, counters, mobile menu
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        // ---------------------------------------
        // 1. Sticky nav shadow on scroll
        // ---------------------------------------
        const nav = document.getElementById('nav');
        function onScroll() {
            if (window.scrollY > 8) nav.classList.add('is-scrolled');
            else nav.classList.remove('is-scrolled');
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // ---------------------------------------
        // 2. Mobile hamburger menu
        // ---------------------------------------
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');

        toggle.addEventListener('click', function () {
            const open = menu.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });

        // Close menu when a link is clicked
        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.remove('is-open');
                toggle.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
            });
        });

        // ---------------------------------------
        // 3. Reveal-on-scroll (IntersectionObserver)
        // ---------------------------------------
        const revealEls = document.querySelectorAll('.reveal');

        if ('IntersectionObserver' in window && revealEls.length) {
            const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

            revealEls.forEach(function (el) { revealObserver.observe(el); });
        } else {
            // Fallback for very old browsers
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }

        // ---------------------------------------
        // 4. Animated counters
        // ---------------------------------------
        const counters = document.querySelectorAll('[data-count]');

        function animateCounter(el) {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const startTime = performance.now();

            function tick(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutCubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * target);
                el.textContent = value + suffix;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                }
            }
            requestAnimationFrame(tick);
        }

        if ('IntersectionObserver' in window && counters.length) {
            const counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });

            counters.forEach(function (c) { counterObserver.observe(c); });
        } else {
            counters.forEach(function (c) {
                c.textContent = c.getAttribute('data-count') + (c.getAttribute('data-suffix') || '');
            });
        }

        // ---------------------------------------
        // 5. Dynamic year in footer
        // ---------------------------------------
        const yearEl = document.getElementById('year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

    });

})();
