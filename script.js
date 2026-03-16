/* ═══════════════════════════════════════════════════════
   NHẬT KÝ LỚP 11H — script.js v3.1
   Homepage interactive effects
   ═══════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    /* ─── 1. CUSTOM CURSOR ─── */
    const dot  = document.getElementById('cursorDot');
    const halo = document.getElementById('cursorHalo');

    if (dot && halo && window.matchMedia('(hover: hover)').matches) {
        let mX = 0, mY = 0, hX = 0, hY = 0;

        document.addEventListener('mousemove', e => {
            mX = e.clientX; mY = e.clientY;
            dot.style.transform = `translate(${mX}px, ${mY}px)`;
        }, { passive: true });

        const trackHalo = () => {
            hX += (mX - hX) * 0.085;
            hY += (mY - hY) * 0.085;
            halo.style.transform = `translate(${hX}px, ${hY}px)`;
            requestAnimationFrame(trackHalo);
        };
        trackHalo();

        const hoverEls = document.querySelectorAll('a, button, .memory-card, .scroll-hint');
        hoverEls.forEach(el => {
            el.addEventListener('pointerenter', () => document.body.classList.add('cursor-hovering'));
            el.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hovering'));
        });

        document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; halo.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { dot.style.opacity = ''; halo.style.opacity = ''; });
    }

    /* ─── 2. SPARKLE CURSOR TRAIL ─── */
    const SPARKLE_CHARS = ['✦', '✧', '⋆', '˚', '✿', '♡', '·'];
    const SPARKLE_COLORS = ['', 'lavender', 'gold'];
    let sparkleThrottle = 0;

    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', e => {
            const now = Date.now();
            if (now - sparkleThrottle < 90) return;
            sparkleThrottle = now;
            if (Math.random() > 0.45) return;

            const s = document.createElement('span');
            s.className = 'sparkle ' + SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
            s.textContent = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
            s.style.left = e.clientX + 'px';
            s.style.top  = e.clientY + 'px';
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 720);
        }, { passive: true });
    }

    /* ─── 3. CHERRY BLOSSOM PETALS ─── */
    const PETAL_COLORS = [
        'rgba(255,182,210,0.75)',
        'rgba(255,200,225,0.65)',
        'rgba(255,210,230,0.7)',
        'rgba(230,180,255,0.6)',
        'rgba(255,240,200,0.65)',
    ];

    function createPetal() {
        if (document.visibilityState === 'hidden') return;
        const p = document.createElement('div');
        p.className = 'petal';
        const size = Math.random() * 8 + 7;
        p.style.cssText = `
            left: ${Math.random() * 105 - 2}vw;
            width: ${size}px;
            height: ${size}px;
            background: ${PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]};
            animation-duration: ${Math.random() * 7 + 9}s;
            --drift: ${(Math.random() - 0.5) * 160}px;
            --spin: ${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 400 + 200)}deg;
            filter: blur(${Math.random() > 0.6 ? '1px' : '0px'});
        `;
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove(), { once: true });
    }

    // Stagger initial petals
    for (let i = 0; i < 6; i++) {
        setTimeout(createPetal, i * 400);
    }
    setInterval(createPetal, 700);

    /* ─── 4. CARD SPOTLIGHT ─── */
    const cards = document.querySelectorAll('.memory-card');
    cards.forEach(card => {
        const spotlight = card.querySelector('.card-spotlight');
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width)  * 100;
            const y = ((e.clientY - rect.top)  / rect.height) * 100;
            if (spotlight) { spotlight.style.setProperty('--sx', `${x}%`); spotlight.style.setProperty('--sy', `${y}%`); }
        }, { passive: true });
    });

    /* ─── 5. 3D MAGNETIC TILT ─── */
    const MAX_TILT = 8;
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            if (window.matchMedia('(hover: none)').matches) return;
            const rect = card.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
            const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
            card.style.transform = `perspective(700px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateZ(12px)`;
        }, { passive: true });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.08s linear, opacity 0.7s, border-color 0.4s, box-shadow 0.4s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.7s, border-color 0.4s, box-shadow 0.4s';
        });
    });

    /* ─── 6. SCROLL REVEAL ─── */
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const card  = entry.target;
            const delay = parseFloat(card.dataset.delay || 0);
            setTimeout(() => card.classList.add('revealed'), delay * 1000);
            revealObserver.unobserve(card);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    cards.forEach(c => revealObserver.observe(c));

    /* ─── 7. NUMBER COUNTER ─── */
    document.querySelectorAll('.counter[data-target]').forEach(el => {
        const observer = new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) return;
            const target = parseInt(el.dataset.target, 10);
            const start  = performance.now();
            const tick   = now => {
                const p = Math.min((now - start) / 1800, 1);
                const e = 1 - Math.pow(1 - p, 4);
                el.textContent = Math.round(e * target);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            observer.disconnect();
        }, { threshold: 0.5 });
        observer.observe(el);
    });

    /* ─── 8. HERO PARALLAX ─── */
    const heroInner = document.querySelector('.hero-inner');
    if (heroInner) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroInner.style.transform = `translateY(${y * 0.22}px)`;
                heroInner.style.opacity   = 1 - (y / (window.innerHeight * 0.75));
            }
        }, { passive: true });
    }

    /* ─── 9. SMOOTH ANCHOR ─── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const t = document.querySelector(link.getAttribute('href'));
            if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    /* ─── 10. BACK TO TOP ─── */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 400), { passive: true });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ─── 11. PAGE TRANSITION ─── */
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
        document.querySelectorAll('.memory-card .card-link').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (!href || href.startsWith('#')) return;
                e.preventDefault();
                overlay.classList.add('active');
                setTimeout(() => { window.location.href = href; }, 320);
            });
        });
        window.addEventListener('pageshow', () => overlay.classList.remove('active'));
    }

    /* ─── 12. MARQUEE PAUSE ─── */
    const track = document.querySelector('.marquee-track');
    if (track) {
        const strip = track.closest('.marquee-strip');
        if (strip) {
            strip.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
            strip.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
        }
    }

});
