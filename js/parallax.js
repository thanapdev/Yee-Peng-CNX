/* =====================================================
   YI PENG — INTRO PARALLAX
   Scroll-driven lantern reveal experience
   ===================================================== */

(function () {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let lanterns = [];
  let stars = [];
  let raf;
  let introProgress = 0; 
  let introComplete = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function initStars() {
    stars = [];
    for (let i = 0; i < 300; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.01 + 0.002
      });
    }
  }

  function makeLantern(startY) {
    const scaleBase = Math.random() * 0.4 + 0.3;
    return {
      x: Math.random() * W,
      y: startY || H + Math.random() * 200,
      z: Math.random() * 2, 
      vy: -(Math.random() * 0.8 + 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      scale: scaleBase,
      alpha: 0,
      sway: Math.random() * Math.PI * 2,
      swaySpd: Math.random() * 0.01 + 0.005,
      glow: Math.random(),
      gDir: 1
    };
  }

  function initLanterns() {
    lanterns = [];
    for (let i = 0; i < 60; i++) {
      lanterns.push(makeLantern(Math.random() * H));
    }
  }

  function drawLantern(l, progress) {
    const flyScale = 1 + (Math.pow(progress, 2) * 18 * l.z); 
    const s = l.scale * flyScale;
    const bw = 32 * s;
    const bh = 50 * s;
    const opacity = l.alpha * (1 - (progress > 0.8 ? (progress - 0.8) * 5 : 0));

    if (opacity <= 0) return;

    ctx.save();
    ctx.translate(l.x, l.y);
    
    // 1. Soft Outer Glow
    const glowG = ctx.createRadialGradient(0, 0, 0, 0, 0, bw * 3);
    glowG.addColorStop(0, `rgba(232, 146, 92, ${0.35 * opacity})`);
    glowG.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = glowG;
    ctx.beginPath(); ctx.arc(0, 0, bw * 3, 0, Math.PI * 2); ctx.fill();

    // 2. 3D Volume Shading (Cylindrical highlight)
    const volumeG = ctx.createLinearGradient(-bw/2, 0, bw/2, 0);
    volumeG.addColorStop(0, `rgba(184, 92, 74, ${opacity})`); 
    volumeG.addColorStop(0.3, `rgba(255, 250, 240, ${opacity})`); 
    volumeG.addColorStop(0.7, `rgba(244, 216, 166, ${opacity})`);
    volumeG.addColorStop(1, `rgba(184, 92, 74, ${opacity})`);
    ctx.fillStyle = volumeG;

    ctx.beginPath();
    ctx.moveTo(-bw/2, -bh/2 + bh/4);
    ctx.bezierCurveTo(-bw/2, -bh/2 - bh/8, bw/2, -bh/2 - bh/8, bw/2, -bh/2 + bh/4);
    ctx.lineTo(bw/2.2, bh/2);
    ctx.quadraticCurveTo(0, bh/2 + bh/6, -bw/2.2, bh/2);
    ctx.lineTo(-bw/2, -bh/2 + bh/4);
    ctx.closePath();
    ctx.fill();

    // 3. Internal Fire Glow (Bottom up)
    const fireG = ctx.createRadialGradient(0, bh/2, 0, 0, bh/2, bh);
    fireG.addColorStop(0, `rgba(255, 255, 255, ${0.8 * opacity})`);
    fireG.addColorStop(0.5, `rgba(232, 146, 92, ${0.4 * opacity})`);
    fireG.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = fireG;
    ctx.fill();

    // 4. Bottom Ring (3D ellipse)
    ctx.strokeStyle = `rgba(100, 40, 20, ${opacity * 0.6})`;
    ctx.lineWidth = 1.5 * s;
    ctx.beginPath();
    ctx.ellipse(0, bh/2, bw/2.2, bh/10, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  let tick = 0;
  function animate() {
    if (introComplete) return;
    raf = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = `rgb(13, 27, 42)`;
    ctx.fillRect(0, 0, W, H);

    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = (Math.sin(s.phase) * 0.4 + 0.6) * (1 - introProgress);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (introProgress > 0.1 && tick % 5 === 0 && lanterns.length < 150) {
        lanterns.push(makeLantern(H + 100));
    }

    lanterns.forEach((l, i) => {
      l.alpha = Math.min(l.alpha + 0.02, 1);
      l.sway += l.swaySpd;
      l.x += l.vx + Math.sin(l.sway) * 0.4;
      l.y += l.vy * (1 + introProgress * 2); 

      l.glow += l.gDir * 0.02;
      if (l.glow > 1 || l.glow < 0.4) l.gDir *= -1;

      drawLantern(l, introProgress);

      if (l.y < -200) {
        lanterns[i] = makeLantern(H + 100);
      }
    });

    tick++;
  }

  function onScroll() {
    if (introComplete) return;
    const scrollY = window.scrollY;
    const threshold = window.innerHeight * 1.5; 
    introProgress = Math.min(scrollY / threshold, 1);

    const overlay = document.getElementById('intro-overlay');
    const skip = document.getElementById('intro-skip');
    const hint = document.getElementById('scroll-hint');

    if (overlay) {
        overlay.style.transform = `scale(${1 + introProgress * 0.5}) translateY(${introProgress * -100}px)`;
        overlay.style.opacity = 1 - (introProgress * 1.5);
    }
    if (skip) skip.style.opacity = 1 - (introProgress * 3);
    if (hint) hint.style.opacity = 1 - (introProgress * 4);

    if (introProgress >= 0.85) {
      completeIntro();
    }
  }

  function completeIntro() {
    if (introComplete) return;
    introComplete = true;
    
    const wrap = document.getElementById('intro-wrapper');
    const spacer = document.getElementById('intro-spacer');
    const main = document.getElementById('main-content');
    
    document.body.style.overflow = 'hidden';
    
    if (wrap) {
      wrap.style.transition = 'opacity 0.6s ease-out';
      wrap.style.opacity = '0';
      
      if (spacer) spacer.style.display = 'none'; 
      if (main) {
        main.style.display = 'block';
        main.style.opacity = '1';
      }
      
      window.scrollTo(0, 0);

      setTimeout(() => {
        wrap.style.display = 'none';
        document.body.style.overflow = '';
        if (window.startAmbientLanterns) window.startAmbientLanterns();
        if (window.initReveal) window.initReveal();
        if (window.initHeroParallax) window.initHeroParallax();
      }, 600);
    }
    cancelAnimationFrame(raf);
  }

  initStars();
  initLanterns();
  animate();
  window.addEventListener('scroll', onScroll, { passive: true });
  
  const skipBtn = document.getElementById('intro-skip');
  if (skipBtn) skipBtn.onclick = () => {
    window.scrollTo(0, window.innerHeight * 3.5);
    onScroll();
  };
})();
