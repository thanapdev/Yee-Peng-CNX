/* =====================================================
   YI PENG — COUNTDOWN + AMBIENT CANVAS + APP LOGIC
   ===================================================== */

/* ── Countdown ──────────────────────────────────── */
(function initCountdown() {
  // Yi Peng 2026 — full moon night, November 5, 2026, 20:00 ICT
  const TARGET = new Date('2026-11-05T20:00:00+07:00').getTime();

  const elD = document.getElementById('cd-days');
  const elH = document.getElementById('cd-hours');
  const elM = document.getElementById('cd-mins');
  const elS = document.getElementById('cd-secs');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = Math.max(0, TARGET - now);
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    if (elD) elD.textContent = pad(days);
    if (elH) elH.textContent = pad(hours);
    if (elM) elM.textContent = pad(mins);
    if (elS) elS.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ── Ambient background lanterns (post-intro) ───── */
(function () {
  let ambientCanvas, ambientCtx, ambientLanterns = [], ambientRaf;
  let ambientW, ambientH;

  window.startAmbientLanterns = function () {
    ambientCanvas = document.getElementById('ambient-canvas');
    if (!ambientCanvas) return;
    ambientCtx = ambientCanvas.getContext('2d');

    function resize() {
      ambientW = ambientCanvas.width  = window.innerWidth;
      ambientH = ambientCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 18; i++) {
      ambientLanterns.push(makeAmbient());
    }
    ambientLoop();
  };

  function makeAmbient() {
    return {
      x:     Math.random() * (ambientW || window.innerWidth),
      y:     (ambientH || window.innerHeight) + Math.random() * 300,
      vy:    -(Math.random() * 0.4 + 0.2),
      vx:    (Math.random() - 0.5) * 0.15,
      s:     Math.random() * 0.4 + 0.3,
      a:     Math.random() * 0.3 + 0.1,
      glow:  Math.random(),
      gdir:  1,
      sway:  Math.random() * Math.PI * 2,
      swspd: Math.random() * 0.01 + 0.005
    };
  }

  function drawAmbient(l) {
    const s = l.s;
    const bw = 28 * s, bh = 40 * s;
    ambientCtx.save();
    ambientCtx.translate(l.x, l.y);

    const grd = ambientCtx.createRadialGradient(0, 0, 1, 0, 0, bw * 2);
    grd.addColorStop(0, `rgba(255,180,60,${0.4 * l.glow * l.a})`);
    grd.addColorStop(1, 'rgba(245,120,20,0)');
    ambientCtx.fillStyle = grd;
    ambientCtx.beginPath();
    ambientCtx.ellipse(0, 0, bw * 2, bw * 2, 0, 0, Math.PI * 2);
    ambientCtx.fill();

    const bg = ambientCtx.createRadialGradient(-bw * 0.2, -bh * 0.2, 1, 0, 0, bw);
    bg.addColorStop(0, `rgba(255,220,120,${l.a})`);
    bg.addColorStop(1, `rgba(200,90,20,${l.a * 0.7})`);
    ambientCtx.fillStyle = bg;
    ambientCtx.beginPath();
    ambientCtx.ellipse(0, 0, bw * 0.5, bh * 0.48, 0, 0, Math.PI * 2);
    ambientCtx.fill();

    ambientCtx.restore();
  }

  function ambientLoop() {
    ambientRaf = requestAnimationFrame(ambientLoop);
    ambientCtx.clearRect(0, 0, ambientW, ambientH);

    ambientLanterns.forEach(l => {
      l.glow += l.gdir * 0.012;
      if (l.glow > 1) { l.glow = 1; l.gdir = -1; }
      if (l.glow < 0.3) { l.glow = 0.3; l.gdir = 1; }
      l.sway += l.swspd;
      l.x += l.vx + Math.sin(l.sway) * 0.25;
      l.y += l.vy;
      if (l.y < -100) Object.assign(l, makeAmbient());
      drawAmbient(l);
    });
  }
})();

/* ── Custom cursor ──────────────────────────────── */
(function () {
  const dot  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lerp() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  })();

  document.querySelectorAll('a, button, [data-nav]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      ring.style.borderColor = 'rgba(245,166,35,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(245,166,35,0.5)';
    });
  });
})();

/* ── Section navigation ──────────────────────────── */
(function () {
  const sections = ['home', 'festival', 'lanterns', 'traditions', 'plan', 'gallery'];

  window.showSection = function (id) {
    sections.forEach(s => {
      const el = document.getElementById('sec-' + s);
      if (el) el.style.display = (s === id) ? 'block' : 'none';
    });

    document.querySelectorAll('[data-nav]').forEach(a => {
      a.classList.toggle('active', a.dataset.nav === id);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.initReveal();

    // Close mobile nav
    document.getElementById('nav-mobile')?.classList.remove('open');
  };

  // Attach nav click events
  document.querySelectorAll('[data-nav]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      window.showSection(a.dataset.nav);
    });
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }
})();

/* ── Scroll reveal ───────────────────────────────── */
window.initReveal = function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
};

/* ── Navbar scroll behavior ──────────────────────── */
(function () {
  const nb = document.getElementById('navbar');
  if (!nb) return;
  window.addEventListener('scroll', () => {
    nb.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ── Language buttons ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => window.applyLang(btn.dataset.lang));
  });
  // Apply stored language
  window.applyLang(window.currentLang);
});

/* ── Gallery filter ──────────────────────────────── */
(function () {
  window.initGallery = function () {
    document.querySelectorAll('.gal-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gal-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.gal-item').forEach(item => {
          const show = filter === 'all' || item.dataset.cat === filter;
          item.style.display = show ? 'block' : 'none';
          if (show) item.classList.add('anim-scale-in');
        });
      });
    });
  };
})();

/* ── Do & Dont tabs ──────────────────────────────── */
window.initDoDont = function () {
  document.querySelectorAll('.dd-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dd-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.target;
      document.querySelectorAll('.dd-panel').forEach(p => {
        p.style.display = p.id === target ? 'block' : 'none';
      });
    });
  });
};

/* ── DIY Stepper ─────────────────────────────────── */
window.initDIY = function () {
  let step = 0;
  const steps = document.querySelectorAll('.diy-step');
  const total = steps.length;
  if (!total) return;

  function show(i) {
    steps.forEach((s, idx) => {
      s.classList.toggle('active', idx === i);
    });
    const counter = document.getElementById('diy-counter');
    if (counter) counter.textContent = `${i + 1} / ${total}`;
  }

  document.getElementById('diy-prev')?.addEventListener('click', () => {
    step = Math.max(0, step - 1); show(step);
  });
  document.getElementById('diy-next')?.addEventListener('click', () => {
    step = Math.min(total - 1, step + 1); show(step);
  });

  show(0);
};

/* ── Interactive Map pins ─────────────────────────── */
window.initMap = function () {
  const pins = document.querySelectorAll('.map-pin');
  const popup = document.getElementById('map-popup');

  pins.forEach(pin => {
    pin.addEventListener('click', e => {
      e.stopPropagation();
      const info = {
        name:    pin.dataset.name,
        nameEn:  pin.dataset.nameEn,
        desc:    pin.dataset.desc,
        descEn:  pin.dataset.descEn,
        type:    pin.dataset.type
      };
      const lang = window.currentLang;
      if (popup) {
        popup.querySelector('.popup-name').textContent = lang === 'th' ? info.name : info.nameEn;
        popup.querySelector('.popup-desc').textContent = lang === 'th' ? info.desc : info.descEn;
        popup.querySelector('.popup-type').textContent = info.type;
        popup.style.display = 'block';
        popup.style.left = (pin.offsetLeft + 20) + 'px';
        popup.style.top  = (pin.offsetTop  - 10) + 'px';
      }
      pins.forEach(p => p.classList.remove('active'));
      pin.classList.add('active');
    });
  });

  document.addEventListener('click', () => {
    if (popup) popup.style.display = 'none';
    pins.forEach(p => p.classList.remove('active'));
  });
};

/* ── Initialize everything on DOM ready ───────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.initGallery?.();
  window.initDoDont?.();
  window.initDIY?.();
  window.initMap?.();
});
