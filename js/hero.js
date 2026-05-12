/* =====================================================
   YI PENG — HERO ANIMATION (Diagonal Motion Version)
   Lanterns and fireworks launching diagonally from bottom
   ===================================================== */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let lanterns = [];
  let fireworks = [];
  let stars = [];
  let raf;

  let silhouettes = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initSilhouettes();
  }
  window.addEventListener('resize', resize);

  function initSilhouettes() {
    silhouettes = [];
    const h = H * 0.12;
    for (let x = 0; x <= W + 60; x += 60) {
        silhouettes.push(h * (0.8 + Math.random() * 0.5));
    }
  }

  resize();

  function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random()
      });
    }
  }

  function createLantern(isInitial = false) {
    const depth = Math.random(); // 0 (near) to 1 (far)
    return {
      x: Math.random() * W * 1.2,
      y: isInitial ? Math.random() * H : H + 50,
      vx: -(Math.random() * 0.5 + 0.5), // Constant diagonal left
      vy: -(Math.random() * 1.5 + 1),   // Upward
      depth: depth,
      scale: (1 - depth) * 0.8 + 0.2,
      alpha: 0,
      sway: Math.random() * Math.PI * 2,
      swaySpd: Math.random() * 0.02 + 0.01,
      glow: Math.random()
    };
  }

  function createFirework() {
    // Launch from bottom
    const startX = Math.random() * W;
    const targetY = Math.random() * H * 0.55;
    const targetX = startX + (Math.random() - 0.5) * W * 0.7;
    
    // Expanded vibrant color palette
    const colors = [
      '#E8925C', '#FFF8E7', '#FFD700', '#FF4500', // Gold/Orange/Red
      '#FF00FF', '#00FFFF', '#ADFF2F', '#FF69B4', // Magenta/Cyan/Green/Pink
      '#9370DB', '#87CEEB', '#F4D8A6'             // Purple/SkyBlue/Paper
    ];

    fireworks.push({
      type: 'rocket',
      x: startX,
      y: H,
      tx: targetX,
      ty: targetY,
      vx: (targetX - startX) / (40 + Math.random() * 40),
      vy: (targetY - H) / (40 + Math.random() * 40),
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 50 + Math.random() * 30,
      size: Math.random() * 0.5 + 0.5
    });
  }

  function explode(x, y, color, sizeMod) {
    const particles = [];
    const count = 80 + Math.random() * 100;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 7 + 2) * sizeMod;
      particles.push({
        x: x, y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: Math.random() * 0.01 + 0.005
      });
    }
    fireworks.push({ type: 'explosion', color, particles });
  }

  // Initialize
  for (let i = 0; i < 80; i++) {
    lanterns.push(createLantern(true));
  }

  function drawPeople() {
    ctx.save();
    ctx.fillStyle = '#050a0f';
    ctx.beginPath();
    ctx.moveTo(0, H);
    
    for (let i = 0; i < silhouettes.length; i++) {
        const x = i * 60;
        const headH = silhouettes[i];
        ctx.quadraticCurveTo(x - 30, H - headH, x, H - headH * 0.7);
    }
    ctx.lineTo(W, H);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // Deep Sky
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, W, H);

    // Twinkling Stars
    stars.forEach(s => {
      s.o += 0.01;
      const op = Math.sin(s.o) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.25})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Lanterns (Sorted by depth)
    lanterns.sort((a, b) => b.depth - a.depth);
    lanterns.forEach((l, i) => {
      l.sway += l.swaySpd;
      l.x += l.vx + Math.sin(l.sway) * 0.3;
      l.y += l.vy;
      l.alpha = Math.min(l.alpha + 0.01, 1);

      if (l.y < -100 || l.x < -100) {
          lanterns[i] = createLantern();
          return;
      }

      const s = l.scale;
      const bw = 32 * s;
      const bh = 50 * s;
      const opacity = l.alpha * (1 - l.depth * 0.6);

      ctx.save();
      ctx.translate(l.x, l.y);
      
      // 1. Soft Outer Glow
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, bw * 3);
      g.addColorStop(0, `rgba(232, 146, 92, ${0.35 * opacity})`);
      g.addColorStop(1, 'rgba(232, 146, 92, 0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, bw * 3, 0, Math.PI * 2); ctx.fill();

      // 2. 3D Volume Shading (Cylindrical highlight)
      const volumeG = ctx.createLinearGradient(-bw/2, 0, bw/2, 0);
      volumeG.addColorStop(0, `rgba(184, 92, 74, ${opacity})`);     // Shadow Left
      volumeG.addColorStop(0.3, `rgba(255, 250, 240, ${opacity})`);   // Highlight
      volumeG.addColorStop(0.7, `rgba(244, 216, 166, ${opacity})`);   // Mid
      volumeG.addColorStop(1, `rgba(184, 92, 74, ${opacity})`);     // Shadow Right
      ctx.fillStyle = volumeG;

      ctx.beginPath();
      // Puffy Top
      ctx.moveTo(-bw/2, -bh/2 + bh/4);
      ctx.bezierCurveTo(-bw/2, -bh/2 - bh/8, bw/2, -bh/2 - bh/8, bw/2, -bh/2 + bh/4);
      // Sides
      ctx.lineTo(bw/2.2, bh/2);
      // Bottom Curve (Perspective opening)
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
    });

    // Fireworks logic - INCREASED FREQUENCY
    if (Math.random() < 0.05) createFirework();
    fireworks.forEach((fw, idx) => {
      if (fw.type === 'rocket') {
        fw.x += fw.vx;
        fw.y += fw.vy;
        fw.life--;
        
        // Brighter, thicker rocket trail
        ctx.fillStyle = fw.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = fw.color;
        ctx.fillRect(fw.x - 1, fw.y - 1, 3, 3);
        ctx.shadowBlur = 0;
        
        if (fw.life <= 0) {
          explode(fw.x, fw.y, fw.color, fw.size);
          fireworks.splice(idx, 1);
        }
      } else {
        fw.particles.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.05;
          p.alpha -= p.decay;
          if (p.alpha > 0) {
            const alphaHex = Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
            
            // Core particle
            ctx.fillStyle = fw.color + alphaHex;
            ctx.beginPath(); 
            ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); 
            ctx.fill();
            
            // Outer glow for visibility
            ctx.fillStyle = fw.color + Math.floor(p.alpha * 50).toString(16).padStart(2, '0');
            ctx.beginPath(); 
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); 
            ctx.fill();
          }
        });
        if (fw.particles.every(p => p.alpha <= 0)) fireworks.splice(idx, 1);
      }
    });

    drawPeople();
  }

  draw();
})();
