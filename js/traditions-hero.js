/* =====================================================
   TRADITIONS HERO — RIVER & SKY ANIMATION
   Floating Krathongs on River + Rising Lanterns in Sky
   ===================================================== */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let lanterns = [];
  let krathongs = [];
  let stars = [];
  let raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initKrathongs();
  }
  window.addEventListener('resize', resize);

  function initStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random()
      });
    }
  }

  function createLantern(isInitial = false) {
    const depth = Math.random(); // 0 (near) to 1 (far)
    return {
      x: Math.random() * W,
      y: isInitial ? Math.random() * H * 0.7 : H * 0.7 + 50,
      vx: (Math.random() - 0.5) * 0.3, 
      vy: -(Math.random() * 0.8 + 0.4),
      depth: depth,
      scale: (1 - depth) * 0.6 + 0.2,
      alpha: 0,
      sway: Math.random() * Math.PI * 2,
      swaySpd: Math.random() * 0.01 + 0.005
    };
  }

  function initKrathongs() {
    krathongs = [];
    for (let i = 0; i < 12; i++) {
      krathongs.push(createKrathong(true));
    }
  }

  function createKrathong(isInitial = false) {
    const depth = Math.random(); // 0 (near) to 1 (far)
    // River is roughly from H*0.7 to H
    const riverYStart = H * 0.75;
    const riverHeight = H * 0.25;
    
    return {
      x: isInitial ? Math.random() * W : -100,
      y: riverYStart + depth * riverHeight,
      vx: Math.random() * 0.5 + 0.3, // Current speed
      depth: depth,
      scale: (1 - depth) * 0.7 + 0.3,
      bob: Math.random() * Math.PI * 2,
      bobSpd: Math.random() * 0.02 + 0.01,
      flicker: Math.random() * Math.PI * 2
    };
  }

  // Initialize
  resize();
  for (let i = 0; i < 40; i++) {
    lanterns.push(createLantern(true));
  }

  function drawRiver() {
    const riverYStart = H * 0.65; // Move up slightly for better visibility
    
    // 1. Far Bank Silhouette (Mountains/Temples)
    ctx.fillStyle = '#050a0f';
    ctx.beginPath();
    ctx.moveTo(0, riverYStart);
    for (let x = 0; x <= W; x += 100) {
      const hillH = 15 + Math.sin(x * 0.01) * 10;
      ctx.lineTo(x, riverYStart - hillH);
    }
    ctx.lineTo(W, riverYStart);
    ctx.fill();

    // 2. Horizon Glow
    const hg = ctx.createLinearGradient(0, riverYStart - 50, 0, riverYStart);
    hg.addColorStop(0, 'rgba(13, 27, 42, 0)');
    hg.addColorStop(1, 'rgba(232, 146, 92, 0.15)');
    ctx.fillStyle = hg;
    ctx.fillRect(0, riverYStart - 50, W, 50);

    // 3. Base River Surface
    const g = ctx.createLinearGradient(0, riverYStart, 0, H);
    g.addColorStop(0, '#0a1a2a'); // Slightly lighter at horizon
    g.addColorStop(0.3, '#050a0f');
    g.addColorStop(1, '#020508');
    ctx.fillStyle = g;
    ctx.fillRect(0, riverYStart, W, H - riverYStart);

    // 4. Wave Layers with distinct colors
    const waveColors = [
      'rgba(20, 40, 60, 0.15)',
      'rgba(15, 35, 55, 0.2)',
      'rgba(10, 30, 50, 0.25)'
    ];

    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, riverYStart + layer * 30);
      const time = Date.now() * 0.0008;
      const offset = layer * 40;
      
      for (let x = 0; x <= W; x += 30) {
        // More structured waves
        const y = riverYStart + 20 + layer * 35 + Math.sin(x * 0.008 + time + offset) * 8;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.fillStyle = waveColors[layer];
      ctx.fill();

      // Highlights on wave tops
      ctx.strokeStyle = `rgba(232, 146, 92, ${0.05 + layer * 0.02})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 5. Horizon Line (Sharp division)
    ctx.strokeStyle = 'rgba(232, 146, 92, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, riverYStart);
    ctx.lineTo(W, riverYStart);
    ctx.stroke();
  }

  function drawKrathong(k) {
    k.x += k.vx;
    k.bob += k.bobSpd;
    k.flicker += 0.1;
    
    if (k.x > W + 100) {
      Object.assign(k, createKrathong());
    }

    const bobY = Math.sin(k.bob) * 3;
    const s = k.scale;
    const flickerVal = Math.sin(k.flicker) * 0.2 + 0.8;

    ctx.save();
    ctx.translate(k.x, k.y + bobY);
    
    // 1. Water Reflection/Glow
    const rg = ctx.createRadialGradient(0, 5, 0, 0, 5, 40 * s);
    rg.addColorStop(0, `rgba(232, 146, 92, ${0.4 * flickerVal})`);
    rg.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.ellipse(0, 5, 40 * s, 15 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Base (Banana Leaf - Green)
    ctx.fillStyle = '#1a3a1a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 35 * s, 12 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 3. Petals (Lotus shape)
    ctx.fillStyle = '#4a1a3a'; // Dark Magenta/Pink
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * 25 * s;
        const py = Math.sin(angle) * 8 * s;
        ctx.beginPath();
        ctx.ellipse(px, py - 5*s, 12*s, 18*s, angle + Math.PI/2, 0, Math.PI*2);
        ctx.fill();
    }
    
    // 4. Center
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.ellipse(0, -5*s, 10*s, 4*s, 0, 0, Math.PI*2);
    ctx.fill();

    // 5. Candle & Flame
    ctx.fillStyle = '#fff';
    ctx.fillRect(-1.5*s, -25*s, 3*s, 20*s);
    
    const fg = ctx.createRadialGradient(0, -28*s, 0, 0, -28*s, 10*s);
    fg.addColorStop(0, `rgba(255, 255, 200, ${flickerVal})`);
    fg.addColorStop(0.6, `rgba(232, 146, 92, ${0.8 * flickerVal})`);
    fg.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.ellipse(0, -28*s, 5*s, 8*s, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  function drawLantern(l) {
    l.sway += l.swaySpd;
    l.x += l.vx + Math.sin(l.sway) * 0.3;
    l.y += l.vy;
    l.alpha = Math.min(l.alpha + 0.01, 1);

    if (l.y < -100 || l.x < -100 || l.x > W + 100) {
      Object.assign(l, createLantern());
      return;
    }

    const s = l.scale;
    const opacity = l.alpha * (1 - l.depth * 0.6);
    const bw = 32 * s;
    const bh = 50 * s;

    ctx.save();
    ctx.translate(l.x, l.y);
    
    // 1. Soft Outer Glow
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, bw * 3);
    g.addColorStop(0, `rgba(232, 146, 92, ${0.35 * opacity})`);
    g.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, bw * 3, 0, Math.PI * 2); ctx.fill();

    // 2. 3D Volume Shading
    const volumeG = ctx.createLinearGradient(-bw/2, 0, bw/2, 0);
    volumeG.addColorStop(0, `rgba(184, 92, 74, ${opacity})`);     // Shadow Left
    volumeG.addColorStop(0.3, `rgba(255, 250, 240, ${opacity})`);   // Highlight
    volumeG.addColorStop(0.7, `rgba(244, 216, 166, ${opacity})`);   // Mid
    volumeG.addColorStop(1, `rgba(184, 92, 74, ${opacity})`);     // Shadow Right
    ctx.fillStyle = volumeG;

    ctx.beginPath();
    ctx.moveTo(-bw/2, -bh/2 + bh/4);
    ctx.bezierCurveTo(-bw/2, -bh/2 - bh/8, bw/2, -bh/2 - bh/8, bw/2, -bh/2 + bh/4);
    ctx.lineTo(bw/2.2, bh/2);
    ctx.quadraticCurveTo(0, bh/2 + bh/6, -bw/2.2, bh/2);
    ctx.lineTo(-bw/2, -bh/2 + bh/4);
    ctx.closePath();
    ctx.fill();

    // 3. Internal Fire Glow
    const fireG = ctx.createRadialGradient(0, bh/2, 0, 0, bh/2, bh);
    fireG.addColorStop(0, `rgba(255, 255, 255, ${0.8 * opacity})`);
    fireG.addColorStop(0.5, `rgba(232, 146, 92, ${0.4 * opacity})`);
    fireG.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = fireG;
    ctx.fill();

    ctx.restore();
  }

  function draw() {
    raf = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    // Deep Sky
    ctx.fillStyle = '#0D1B2A';
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      s.o += 0.01;
      const op = Math.sin(s.o) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.3})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Lanterns
    lanterns.sort((a, b) => b.depth - a.depth);
    lanterns.forEach(drawLantern);

    // River
    drawRiver();

    // Krathongs
    krathongs.sort((a, b) => a.depth - b.depth);
    krathongs.forEach(drawKrathong);
  }

  draw();
})();
