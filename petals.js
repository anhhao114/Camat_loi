/* ═══════════════════════════════════════════════════════
   NHẬT KÝ LỚP 11H — petals.js
   Shared cherry blossom + sparkle for ALL subpages
   ─── Thêm vào cuối mỗi file HTML con ───────────────────
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* Inject required CSS if not already present */
    if (!document.getElementById('petals-css')) {
        const style = document.createElement('style');
        style.id = 'petals-css';
        style.textContent = `
            .petal {
                position: fixed;
                pointer-events: none;
                z-index: 999;
                border-radius: 60% 40% 40% 60% / 60% 60% 40% 40%;
                animation: petalFall linear forwards;
                will-change: transform, opacity;
            }
            @keyframes petalFall {
                0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 0.85; }
                20%  { opacity: 0.9; }
                80%  { opacity: 0.6; }
                100% { transform: translateY(105vh) translateX(var(--drift,80px)) rotate(var(--spin,540deg)); opacity: 0; }
            }
            .sparkle-sub {
                position: fixed;
                z-index: 9997;
                pointer-events: none;
                font-size: 12px;
                color: #e05896;
                transform: translate(-50%, -50%);
                animation: sparkleUpSub 0.7s ease forwards;
                user-select: none;
            }
            .sparkle-sub.lav { color: #9b72cf; }
            .sparkle-sub.gold { color: #f0b429; }
            @keyframes sparkleUpSub {
                0%   { opacity: 1; transform: translate(-50%,-50%) scale(1.1); }
                100% { opacity: 0; transform: translate(-50%,-170%) scale(0.4); }
            }
        `;
        document.head.appendChild(style);
    }

    /* ── Cherry blossom petals ── */
    const COLORS = [
        'rgba(255,182,210,0.75)',
        'rgba(255,205,225,0.65)',
        'rgba(230,180,255,0.6)',
        'rgba(255,240,200,0.6)',
        'rgba(255,210,235,0.7)',
    ];

    function spawnPetal() {
        if (document.visibilityState === 'hidden') return;
        const p  = document.createElement('div');
        p.className = 'petal';
        const sz = Math.random() * 8 + 7;
        p.style.cssText = [
            `left:${Math.random() * 106 - 2}vw`,
            `width:${sz}px`,
            `height:${sz}px`,
            `background:${COLORS[Math.floor(Math.random() * COLORS.length)]}`,
            `animation-duration:${Math.random() * 7 + 9}s`,
            `--drift:${(Math.random() - 0.5) * 160}px`,
            `--spin:${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 380 + 200)}deg`,
            `filter:blur(${Math.random() > 0.65 ? '1px' : '0'})`,
        ].join(';');
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove(), { once: true });
    }

    // Staggered start
    for (let i = 0; i < 5; i++) setTimeout(spawnPetal, i * 500);
    setInterval(spawnPetal, 800);

    /* ── Sparkle cursor trail ── */
    if (!window.matchMedia('(hover:none)').matches) {
        const CHARS  = ['✦','✧','⋆','˚','✿','♡','·'];
        const CLS    = ['', 'lav', 'gold'];
        let last = 0;

        document.addEventListener('mousemove', e => {
            const now = Date.now();
            if (now - last < 100) return;
            last = now;
            if (Math.random() > 0.4) return;
            const s = document.createElement('span');
            s.className = 'sparkle-sub ' + CLS[Math.floor(Math.random() * CLS.length)];
            s.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
            s.style.left = e.clientX + 'px';
            s.style.top  = e.clientY + 'px';
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 720);
        }, { passive: true });
    }

    /* ── Breadcrumb scroll shadow ── */
    const nav = document.querySelector('.breadcrumb-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    /* ── Back to top (subpages) ── */
    const btt = document.getElementById('backToTop');
    if (btt) {
        window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 300), { passive: true });
        btt.addEventListener('click', e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /* ── Scroll reveal (.reveal elements) ── */
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

}());
