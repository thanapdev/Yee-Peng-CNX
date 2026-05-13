/* =====================================================
   YI PENG — CORE APP LOGIC (Multi-page Version)
   ===================================================== */

/* ── Countdown ──────────────────────────────────── */
(function initCountdown() {
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

/* ── Ambient background lanterns ────────────────── */
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

    ambientLanterns = [];
    for (let i = 0; i < 18; i++) {
      ambientLanterns.push(makeAmbient());
    }
    ambientLoop();
  };

  function makeAmbient() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x:     Math.random() * w,
      y:     h + Math.random() * 300,
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
    grd.addColorStop(0, `rgba(232,120,60,${0.4 * l.glow * l.a})`);
    grd.addColorStop(1, 'rgba(212,100,20,0)');
    ambientCtx.fillStyle = grd;
    ambientCtx.beginPath();
    ambientCtx.ellipse(0, 0, bw * 2, bw * 2, 0, 0, Math.PI * 2);
    ambientCtx.fill();

    const bg = ambientCtx.createRadialGradient(-bw * 0.2, -bh * 0.2, 1, 0, 0, bw);
    bg.addColorStop(0, `rgba(240,168,117,${l.a})`);
    bg.addColorStop(1, `rgba(184,92,74,${l.a * 0.7})`);
    ambientCtx.fillStyle = bg;
    ambientCtx.beginPath();
    ambientCtx.ellipse(0, 0, bw * 0.5, bh * 0.48, 0, 0, Math.PI * 2);
    ambientCtx.fill();

    ambientCtx.restore();
  }

  function ambientLoop() {
    ambientRaf = requestAnimationFrame(ambientLoop);
    ambientCtx.clearRect(0, 0, ambientW || window.innerWidth, ambientH || window.innerHeight);

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

  function lerp() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerp);
  }
  lerp();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      ring.style.borderColor = 'rgba(232,146,92,0.9)';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.borderColor = 'rgba(232,146,92,0.5)';
    });
  });
})();

/* ── UI Logic (Nav & Language) ──────────────────── */
(function () {
  // Mobile Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }

  // Navbar Scroll
  const nb = document.getElementById('navbar');
  if (nb) {
    window.addEventListener('scroll', () => {
      nb.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
    if (window.scrollY > 60) nb.classList.add('scrolled');
  }

  // Language Persistence
  document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('yp-lang') || 'th';
    if (window.applyLang) window.applyLang(savedLang, true);

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        localStorage.setItem('yp-lang', lang);
        if (window.applyLang) window.applyLang(lang);
      });
    });
  });
})();

/* ── Scroll Reveal ──────────────────────────────── */
window.initReveal = function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
};

/* ── Specialized Components Inits ────────────────── */
window.initGallery = function () {
  const btns = document.querySelectorAll('.gal-filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.gal-item').forEach(item => {
        const show = filter === 'all' || item.dataset.cat === filter;
        item.style.display = show ? 'block' : 'none';
      });
    });
  });
};

window.initDIY = function () {
  let step = 0;
  const steps = document.querySelectorAll('.diy-step');
  if (!steps.length) return;

  function show(i) {
    steps.forEach((s, idx) => s.style.display = (idx === i ? 'block' : 'none'));
    const counter = document.getElementById('diy-counter');
    if (counter) counter.textContent = `${i + 1} / ${steps.length}`;
  }
  document.getElementById('diy-prev')?.addEventListener('click', () => { step = Math.max(0, step - 1); show(step); });
  document.getElementById('diy-next')?.addEventListener('click', () => { step = Math.min(steps.length - 1, step + 1); show(step); });
  show(0);
};

window.initMap = function () {
  const pins = document.querySelectorAll('.map-pin');
  const popup = document.getElementById('map-popup');
  pins.forEach(pin => {
    pin.addEventListener('click', e => {
      e.stopPropagation();
      if (popup) {
        const isEn = window.currentLang === 'en';
        popup.querySelector('.popup-name').textContent = isEn ? pin.dataset.nameEn : pin.dataset.name;
        popup.querySelector('.popup-desc').textContent = isEn ? pin.dataset.descEn : pin.dataset.desc;
        popup.querySelector('.popup-type').textContent = pin.dataset.type;
        popup.style.display = 'block';
        popup.style.left = (pin.offsetLeft + 20) + 'px';
        popup.style.top  = (pin.offsetTop - 10) + 'px';
      }
    });
  });
  document.addEventListener('click', () => { if (popup) popup.style.display = 'none'; });
};

/* ── Global Init ────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.initReveal?.();
  if (!document.getElementById('intro-wrapper')) {
    window.startAmbientLanterns?.();
  }

  // ── Highlights Parallax Logic ──
  const segments = document.querySelectorAll('.parallax-segment');
  if (segments.length) {
    window.addEventListener('scroll', () => {
      const winH = window.innerHeight;

      segments.forEach(seg => {
        const rect = seg.getBoundingClientRect();
        if (rect.top < winH && rect.bottom > 0) {
          // Background Parallax (Subtle)
          const bg = seg.querySelector('.parallax-bg img');
          if (bg) {
            const shift = (rect.top / winH) * 10; 
            bg.style.transform = `translateY(${shift}%)`;
          }
        }
      });
    }, { passive: true });
  }
});

/* ── Interactive Book Toggle ─────────────────────── */
window.handleBookClick = function (event) {
  const wrapper = document.getElementById('history-book-wrapper');
  const cover = document.getElementById('book-cover-part');
  const pages = document.querySelectorAll('.book-flipping-page');
  const text = document.getElementById('segment1-text');
  
  if (!wrapper || !cover || !text) return;

  // 1. If book is closed -> OPEN it
  if (!wrapper.classList.contains('is-expanded')) {
    cover.classList.add('is-open');
    document.body.classList.add('book-open');
    setTimeout(() => {
      wrapper.classList.add('is-expanded');
      text.classList.add('is-hidden');
    }, 300);
    return;
  }

  // 2. Navigation (When already open)
  // Calculate click relative to the book container
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const isRightSide = clickX > rect.width / 2;

  if (isRightSide) {
    // Flip forward: find the last page in DOM (top-most) that isn't flipped
    let flippedAny = false;
    const pagesArray = Array.from(pages);
    for (let i = pagesArray.length - 1; i >= 0; i--) {
      if (!pagesArray[i].classList.contains('is-flipped')) {
        pagesArray[i].classList.add('is-flipped');
        flippedAny = true;
        break;
      }
    }
    // If no more pages to flip (reached the end) -> Close the book
    if (!flippedAny) {
      window.openBook();
    }
  } else {
    // Flip backward: find the first page in DOM (bottom-most on left stack) that IS flipped
    // Wait, if [P3, P2, P1] are flipped, P3 is on top of left stack? 
    // No, P3 is z-index 11, P2 is 8, P1 is 5. So P3 is on top.
    // In DOM, P3 is first. So we should un-flip the first one in DOM that is flipped.
    for (let p of pages) {
      if (p.classList.contains('is-flipped')) {
        p.classList.remove('is-flipped');
        break;
      }
    }
  }
};

window.openBook = function () {
  // This function is now used by the CLOSE button
  const wrapper = document.getElementById('history-book-wrapper');
  const cover = document.getElementById('book-cover-part');
  const text = document.getElementById('segment1-text');
  
  if (wrapper && wrapper.classList.contains('is-expanded')) {
    // Cinematic closing sequence
    wrapper.classList.remove('is-expanded');
    document.body.classList.remove('book-open');
    text.classList.remove('is-hidden');
    cover.classList.remove('is-open');
    
    // Reset all internal pages to closed state
    document.querySelectorAll('.book-flipping-page').forEach(p => {
      p.classList.remove('is-flipped');
    });
  }
};




/* ── Timeline Logic ─────────────────────────────── */
window.selectTimelinePoint = function (point) {
  console.log("Selecting Point:", point);
  const card = document.getElementById('timeline-card-' + point);
  const progressLine = document.getElementById('timeline-progress-line');
  if (!card) {
    console.error("Timeline card not found for point:", point);
    return;
  }

  // Toggle Active Card
  card.classList.toggle('active-point');

  // Update Dots and Progress Line
  const dots = document.querySelectorAll('.timeline-dot');
  const cards = document.querySelectorAll('.timeline-card');
  let maxActiveTop = 0;

  cards.forEach((c, idx) => {
    const dot = dots[idx];
    if (!dot) return;
    const core = dot.querySelector('.dot-core');
    
    if (c.classList.contains('active-point')) {
      // Glow Dot
      dot.style.borderColor = '#E8925C';
      dot.style.background = '#E8925C';
      dot.style.boxShadow = '0 0 15px rgba(232, 146, 92, 0.6)';
      if (core) {
        core.style.opacity = '1';
        core.style.background = '#0D1B2A';
      }
      
      const stepWrapper = dot.parentElement;
      const currentTop = stepWrapper.offsetTop + dot.offsetTop + 12;
      maxActiveTop = Math.max(maxActiveTop, currentTop);
    } else {
      // Reset Dot
      dot.style.borderColor = 'rgba(232,146,92,0.3)';
      dot.style.background = '#0D1B2A';
      dot.style.boxShadow = 'none';
      if (core) {
        core.style.opacity = '0.3';
        core.style.background = '#E8925C';
      }
    }
  });

  if (progressLine) {
    progressLine.style.height = maxActiveTop + 'px';
  }
};
