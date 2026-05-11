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

  function makeLantern(startY, isBurst = false) {
    const scaleBase = Math.random() * 0.4 + 0.3;
    return {
      x: Math.random() * W,
      y: startY || H + Math.random() * 200,
      z: Math.random() * 2, // 0 = far, 2 = very close
      vy: -(Math.random() * 0.8 + 0.4),
      vx: (Math.random() - 0.5) * 0.3,
      scale: scaleBase,
      targetScale: scaleBase,
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
    // Increase scale as scroll progress increases to create "fly through" effect
    const flyScale = 1 + (Math.pow(progress, 2.5) * 25 * l.z); 
    const s = l.scale * flyScale;
    const bw = 30 * s;
    const bh = 45 * s;
    const opacity = l.alpha * (1 - (progress > 0.8 ? (progress - 0.8) * 5 : 0));

    if (opacity <= 0) return;

    ctx.save();
    ctx.translate(l.x, l.y);
    
    // Glow
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, bw * 2);
    g.addColorStop(0, `rgba(245, 166, 35, ${0.4 * l.glow * opacity})`);
    g.addColorStop(1, 'rgba(245, 166, 35, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, bw * 2, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = `rgba(247, 228, 182, ${opacity})`;
    const bodyG = ctx.createLinearGradient(0, -bh/2, 0, bh/2);
    bodyG.addColorStop(0, `rgba(255, 235, 180, ${opacity})`);
    bodyG.addColorStop(0.5, `rgba(245, 166, 35, ${opacity})`);
    bodyG.addColorStop(1, `rgba(200, 80, 0, ${opacity})`);
    ctx.fillStyle = bodyG;
    
    // Lantern Shape
    ctx.beginPath();
    ctx.moveTo(-bw/2, -bh/2);
    ctx.quadraticCurveTo(-bw/2.2, bh/2, -bw/2.5, bh/2);
    ctx.lineTo(bw/2.5, bh/2);
    ctx.quadraticCurveTo(bw/2.2, bh/2, bw/2, -bh/2);
    ctx.closePath();
    ctx.fill();

    // Bottom Flame Light
    ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * opacity})`;
    ctx.beginPath();
    ctx.ellipse(0, bh/2.5, bw/4, bh/10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  let tick = 0;
  function animate() {
    if (introComplete) return;
    raf = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H);

    // Dynamic background
    const bgOpacity = Math.max(0.2, 1 - introProgress);
    ctx.fillStyle = `rgba(10, 5, 0, ${bgOpacity})`;
    ctx.fillRect(0, 0, W, H);

    // Stars twinkle
    stars.forEach(s => {
      s.phase += s.speed;
      const alpha = (Math.sin(s.phase) * 0.4 + 0.6) * (1 - introProgress);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Add new lanterns as user scrolls to fill the screen
    if (introProgress > 0.1 && tick % 5 === 0 && lanterns.length < 150) {
        lanterns.push(makeLantern(H + 100));
    }

    lanterns.forEach((l, i) => {
      l.alpha = Math.min(l.alpha + 0.02, 1);
      l.sway += l.swaySpd;
      l.x += l.vx + Math.sin(l.sway) * 0.4;
      l.y += l.vy * (1 + introProgress * 2); // Faster upward as scroll

      // Glow pulse
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
    const threshold = window.innerHeight * 0.8; 
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
    
    // 1. Lock everything immediately
    document.body.style.overflow = 'hidden';
    
    if (wrap) {
      // 2. Start fading out the overlay
      wrap.style.transition = 'opacity 0.6s ease-out';
      wrap.style.opacity = '0';
      
      // 3. CRITICAL: Swap content behind the scenes IMMEDIATELY
      if (spacer) spacer.style.display = 'none'; // Remove the "dead space"
      if (main) {
        main.style.display = 'block';
        main.style.opacity = '1';
      }
      
      // 4. Reset scroll to top while user is still seeing the fading lanterns
      window.scrollTo(0, 0);

      setTimeout(() => {
        wrap.style.display = 'none';
        document.body.style.overflow = '';
        if (window.startAmbientLanterns) window.startAmbientLanterns();
        if (window.initReveal) window.initReveal();
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
    window.scrollTo(0, window.innerHeight * 2.1);
    onScroll();
  };
})();
