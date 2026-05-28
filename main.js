/* ═══════════════════════════════════════════
   NEXUS — main.js
   Animations, Canvas, Cursor, Scroll magic
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. LOADER ──────────────────────────────
  const loader = document.getElementById('loader');
  const fill = loader.querySelector('.loader-fill');

  fill.style.width = '100%';
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 700);
    initAll();
  }, 2200);

  // ── 2. STARFIELD CANVAS ────────────────────
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars, mouse = { x: -999, y: -999 };

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); buildStars(); });

    function buildStars() {
      const count = Math.floor((W * H) / 7000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        speed: Math.random() * 0.25 + 0.05,
        opacity: Math.random() * 0.5 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
      }));
    }
    buildStars();

    // Connection lines
    const MAX_DIST = 140;
    const CYAN = '0, 245, 255';
    const WHITE = '240, 237, 232';

    let raf;
    function draw(ts) {
      ctx.clearRect(0, 0, W, H);

      // Background grid lines (subtle)
      ctx.strokeStyle = 'rgba(240,237,232,0.025)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      stars.forEach((s, i) => {
        s.twinkle += 0.015;
        const t = (Math.sin(s.twinkle) + 1) / 2;
        const op = s.opacity * (0.5 + 0.5 * t);

        // Mouse repulsion
        const dx = s.x - mouse.x, dy = s.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          s.x += (dx / dist) * force * 1.8;
          s.y += (dy / dist) * force * 1.8;
        }

        // Drift
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

        // Draw star
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${WHITE}, ${op})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const ddx = s.x - b.x, ddy = s.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < MAX_DIST) {
            const a = (1 - d / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${CYAN}, ${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      // Cursor glow on canvas
      if (mouse.x > 0) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
        grad.addColorStop(0, 'rgba(0,245,255,0.05)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    document.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
  }

  // ── 3. PROJECT CARD CANVASES ───────────────
  function initProjectCanvases() {
    document.querySelectorAll('.project-canvas').forEach(el => {
      const color = el.dataset.color || '#00F5FF';
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:100%;height:100%;display:block;';
      el.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      let W, H, particles;

      function resize() {
        W = canvas.width = el.offsetWidth;
        H = canvas.height = el.offsetHeight;
      }
      resize();

      const hexToRgb = h => {
        const r = parseInt(h.slice(1, 3), 16);
        const g = parseInt(h.slice(3, 5), 16);
        const b = parseInt(h.slice(5, 7), 16);
        return `${r},${g},${b}`;
      };
      const rgb = hexToRgb(color);

      function buildParticles() {
        particles = Array.from({ length: 60 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 0.5,
          op: Math.random() * 0.5 + 0.1,
        }));
      }
      buildParticles();

      let frame;
      function tick() {
        ctx.fillStyle = '#050A14';
        ctx.fillRect(0, 0, W, H);

        // Grid
        ctx.strokeStyle = `rgba(${rgb}, 0.06)`;
        ctx.lineWidth = 0.5;
        const g = 40;
        for (let x = 0; x < W; x += g) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
        for (let y = 0; y < H; y += g) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${p.op})`;
          ctx.fill();
        });

        // Gradient overlay
        const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.6);
        grad.addColorStop(0, `rgba(${rgb}, 0.08)`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Corner label
        ctx.fillStyle = `rgba(${rgb}, 0.5)`;
        ctx.font = `bold 11px 'JetBrains Mono', monospace`;
        ctx.fillText('● LIVE', 16, 26);

        frame = requestAnimationFrame(tick);
      }
      tick();
    });
  }

  // ── 4. CUSTOM CURSOR ──────────────────────
  function initCursor() {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .magnetic, .tech-card, .project-card, .service-row').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ── 5. MAGNETIC ELEMENTS ──────────────────
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  // ── 6. NAV SCROLL ─────────────────────────
  function initNav() {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobileOverlay');

    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });

    overlay?.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── 7. SCROLL REVEAL ──────────────────────
  function initReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || 0;
          setTimeout(() => e.target.classList.add('visible'), parseInt(delay));
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
  }

  // ── 8. COUNTER ANIMATION ──────────────────
  function initCounters() {
    const counters = document.querySelectorAll('.metric-num[data-target]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const duration = 1800;
        const start = performance.now();
        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  }

  // ── 9. SMOOTH SCROLL ──────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      });
    });
  }

  // ── 10. FORM ──────────────────────────────
  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"] span');
      btn.textContent = 'Message Sent ✓';
      form.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
      setTimeout(() => btn.textContent = 'Send Message', 4000);
    });
  }

  // ── 11. TYPEWRITER (hero eyebrow) ─────────
  function initTypewriter() {
    const texts = ['Digital Studio — Est. 2019', 'Building the Web\'s Future', 'Award-Winning Design & Code'];
    const el = document.querySelector('.hero-eyebrow .mono');
    if (!el) return;
    let ti = 0, ci = 0, del = false;

    function type() {
      const txt = texts[ti];
      if (!del) {
        el.textContent = txt.slice(0, ++ci);
        if (ci === txt.length) { del = true; setTimeout(type, 2000); return; }
      } else {
        el.textContent = txt.slice(0, --ci);
        if (ci === 0) { del = false; ti = (ti + 1) % texts.length; setTimeout(type, 300); return; }
      }
      setTimeout(type, del ? 40 : 65);
    }
    setTimeout(type, 3000);
  }

  // ── 12. PARALLAX SECTIONS ─────────────────
  function initParallax() {
    const sections = document.querySelectorAll('.section');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      sections.forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const depth = (rect.top / window.innerHeight) * 18;
          sec.style.backgroundPositionY = depth + 'px';
        }
      });
    }, { passive: true });
  }

  // ── INIT ALL ──────────────────────────────
  function initAll() {
    initStarfield();
    initProjectCanvases();
    initCursor();
    initMagnetic();
    initNav();
    initReveal();
    initCounters();
    initSmoothScroll();
    initForm();
    initTypewriter();
    initParallax();
  }

}); // end DOMContentLoaded
