/* =====================================================
   YI PENG — HANGING LANTERNS ANIMATION
   Lanna-style octagonal hanging lanterns with swaying tails
   ===================================================== */

(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  let lanterns = [];
  let stars = [];
  let time = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
    initLanterns();
  }
  window.addEventListener('resize', resize);  let flyingLanterns = [];

  function initStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.8,
        r: Math.random() * 1.1 + 0.2,
        o: Math.random() * Math.PI * 2
      });
    }
  }

  function initFlyingLanterns() {
    flyingLanterns = [];
    for (let i = 0; i < 40; i++) {
      flyingLanterns.push(makeFlying());
    }
  }

  function makeFlying() {
    return {
      x: Math.random() * W,
      y: H + Math.random() * H,
      s: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.4 + 0.2),
      vx: (Math.random() - 0.5) * 0.1,
      glow: Math.random() * Math.PI * 2
    };
  }

  function initLanterns() {
    initFlyingLanterns();
    lanterns = [];
    const colors = [
      { main: '#FF4081', glow: 'rgba(255, 64, 129, 0.3)', star: '#FF80AB' }, // Pink
      { main: '#00C853', glow: 'rgba(0, 200, 83, 0.3)', star: '#B9F6CA' },   // Green
      { main: '#F5F5F5', glow: 'rgba(245, 245, 245, 0.3)', star: '#E0E0E0' }, // White
      { main: '#00B0FF', glow: 'rgba(0, 176, 255, 0.3)', star: '#80D8FF' }, // Blue
    ];
    
    const rowCount = 5;
    for (let r = 0; r < rowCount; r++) {
      const z = 1 - r / (rowCount);
      const lanternCount = Math.floor(9 + r * 6); // Increased count
      const wireY = H * (0.18 + r * 0.12);
      
      for (let i = 0; i < lanternCount; i++) {
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        // Ensure distribution reaches the right edge
        const xPos = (W / (lanternCount - 1)) * i;
        
        lanterns.push({
          x: xPos + (Math.random() - 0.5) * 70, // Balanced randomization
          y: wireY + (Math.random() - 0.5) * 15,
          wireY: wireY,
          z: z,
          color: colorSet.main,
          glowColor: colorSet.glow,
          starColor: colorSet.star,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: 0.006 + Math.random() * 0.006,
          size: (50 + Math.random() * 20) * z,
          tailLen: (130 + Math.random() * 60) * z,
          noise: Math.random() * 10 
        });
      }
    }
  }

  function drawStarPattern(ctx, s, color) {
    ctx.save();
    ctx.translate(0, s * 0.6);
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, s * 0.3);
        ctx.moveTo(-s*0.06, s*0.18); ctx.lineTo(s*0.06, s*0.18);
        ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, 0, s * 0.1, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  function drawTailPaper(ctx, len, color, z, offset, swayAmt) {
    const segments = 10;
    const segLen = len / segments;
    const width = 18 * z;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-width/2, 0);
    for (let i = 1; i <= segments; i++) {
        const delay = i * 0.15;
        const sway = Math.sin(time * 0.03 + offset + delay) * (12 * i * z * (0.5 + Math.abs(swayAmt)));
        const curY = i * segLen;
        const zig = (i % 2 === 0) ? width/2 : width/3;
        ctx.lineTo(-zig + sway, curY);
    }
    for (let i = segments; i >= 0; i--) {
        const delay = i * 0.15;
        const sway = Math.sin(time * 0.03 + offset + delay) * (12 * i * z * (0.5 + Math.abs(swayAmt)));
        const curY = i * segLen;
        const zig = (i % 2 === 0) ? width/2 : width/3;
        ctx.lineTo(zig + sway, curY);
    }
    ctx.fill();
  }

  function drawLantern(l) {
    const swayBase = Math.sin(time * l.swaySpeed + l.swayOffset);
    const swaySecondary = Math.sin(time * l.swaySpeed * 1.5 + l.swayOffset * 0.5) * 0.3;
    const sway = (swayBase + swaySecondary) * 0.12;
    const pendX = sway * 30 * l.z;
    const x = l.x + pendX;
    const y = l.y;
    const s = l.size;
    // Further reduced opacity for softer atmosphere
    const opacity = (l.z * 0.55 + 0.2) * 0.7; 

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(sway);

    // 1. Hanging Cable (Softer)
    ctx.strokeStyle = 'rgba(232, 146, 92, 0.1)';
    ctx.lineWidth = 1 * l.z;
    ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(0, 0); ctx.stroke();

    // 2. Glow (Even softer & more transparent)
    const g = ctx.createRadialGradient(0, s * 0.6, 0, 0, s * 0.6, s * 2.2);
    g.addColorStop(0, l.glowColor.replace('0.3', '0.2').replace('0.25', '0.15').replace('0.35', '0.22'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.globalAlpha = opacity;
    ctx.beginPath(); ctx.arc(0, s * 0.6, s * 2.5, 0, Math.PI * 2); ctx.fill();

    // 3. Faceted Roof
    ctx.fillStyle = l.color;
    ctx.beginPath(); ctx.moveTo(-s * 0.8, 0); ctx.lineTo(0, -s * 0.6); ctx.lineTo(s * 0.8, 0); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; 
    ctx.beginPath(); ctx.moveTo(0, -s * 0.6); ctx.lineTo(s * 0.8, 0); ctx.lineTo(0, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.05)'; 
    ctx.beginPath(); ctx.moveTo(0, -s * 0.6); ctx.lineTo(-s * 0.8, 0); ctx.lineTo(0, 0); ctx.fill();

    // 4. Octagonal Body
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, 0); ctx.lineTo(-s * 0.8, s * 0.2); 
    ctx.lineTo(-s * 0.8, s * 1); ctx.lineTo(-s * 0.5, s * 1.25); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.moveTo(s * 0.5, 0); ctx.lineTo(s * 0.8, s * 0.2); 
    ctx.lineTo(s * 0.8, s * 1); ctx.lineTo(s * 0.5, s * 1.25); ctx.fill();

    ctx.fillStyle = l.color;
    ctx.globalAlpha = opacity * 0.9;
    ctx.fillRect(-s * 0.5, 0, s * 1, s * 1.25);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-s * 0.5, 0, s * 1, s * 1.25);
    ctx.beginPath(); ctx.moveTo(-s*0.8, s*0.2); ctx.lineTo(s*0.8, s*0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s*0.8, s*1); ctx.lineTo(s*0.8, s*1); ctx.stroke();
    drawStarPattern(ctx, s, l.starColor);

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(-s*0.5, s*1.25, s*1, s*0.1);

    ctx.translate(0, s * 1.35);
    drawTailPaper(ctx, l.tailLen, l.color, l.z, l.swayOffset, sway);
    ctx.save(); ctx.translate(-s * 0.4, 0); ctx.scale(0.65, 0.85);
    drawTailPaper(ctx, l.tailLen * 0.85, l.color, l.z, l.swayOffset + 1, sway);
    ctx.restore();
    ctx.save(); ctx.translate(s * 0.4, 0); ctx.scale(0.65, 0.85);
    drawTailPaper(ctx, l.tailLen * 0.85, l.color, l.z, l.swayOffset + 2, sway);
    ctx.restore();
    ctx.restore();
  }

  function drawWires() {
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let r = 0; r < 5; r++) {
      const wireY = H * (0.18 + r * 0.12);
      ctx.beginPath(); ctx.moveTo(0, wireY); ctx.lineTo(W, wireY); ctx.stroke();
    }
  }

  function drawViharn(x, baseW, height) {
    ctx.save();
    // 1. Highlight Edge (Top-down lighting from city)
    ctx.strokeStyle = 'rgba(232, 120, 60, 0.25)';
    ctx.lineWidth = 1.5;
    
    // Multi-tiered Lanna roof
    const tiers = 3;
    for (let i = 0; i < tiers; i++) {
        const tierW = baseW * (1 - i * 0.2);
        const tierH = height * 0.3;
        const curY = H - (i * tierH * 0.8);
        
        // Shadow Body
        ctx.fillStyle = '#08121a';
        ctx.beginPath();
        ctx.moveTo(x - tierW/2, curY);
        ctx.lineTo(x + tierW/2, curY);
        ctx.lineTo(x, curY - tierH);
        ctx.fill();
        
        // Edge Glow
        ctx.beginPath();
        ctx.moveTo(x - tierW/2, curY);
        ctx.lineTo(x, curY - tierH);
        ctx.lineTo(x + tierW/2, curY);
        ctx.stroke();

        // Chofah
        ctx.beginPath();
        ctx.moveTo(x - tierW/2, curY);
        ctx.quadraticCurveTo(x - tierW/2 - 8, curY - 15, x - tierW/2 - 4, curY - 25);
        ctx.stroke();
    }
    // Main Body
    ctx.fillStyle = '#050a0f';
    ctx.fillRect(x - baseW * 0.4, H - height * 0.3, baseW * 0.8, height * 0.3);
    ctx.restore();
  }

  function drawChedi(x, baseW, height) {
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 120, 60, 0.3)';
    ctx.lineWidth = 1;
    
    // Shadow Body
    ctx.fillStyle = '#08121a';
    ctx.beginPath();
    ctx.moveTo(x - baseW/2, H);
    ctx.lineTo(x + baseW/2, H);
    ctx.lineTo(x + baseW/2 - 20, H - 40);
    ctx.lineTo(x - baseW/2 + 20, H - 40);
    ctx.fill();
    
    // Highlight Base
    ctx.beginPath();
    ctx.moveTo(x - baseW/2, H);
    ctx.lineTo(x - baseW/2 + 20, H - 40);
    ctx.lineTo(x + baseW/2 - 20, H - 40);
    ctx.lineTo(x + baseW/2, H);
    ctx.stroke();

    // Middle & Bell
    ctx.fillRect(x - baseW * 0.3, H - 70, baseW * 0.6, 30);
    ctx.beginPath();
    ctx.moveTo(x - baseW * 0.25, H - 70);
    ctx.quadraticCurveTo(x, H - height, x + baseW * 0.25, H - 70);
    ctx.fill();
    // Bell Edge Glow
    ctx.stroke();

    // Spire
    ctx.fillStyle = '#101b24';
    ctx.fillRect(x - 2, H - height - 30, 4, 40);
    ctx.restore();
  }

  function drawEnvironment() {
    // 1. Intense Horizon Glow (Backlighting)
    const glow = ctx.createLinearGradient(0, H, 0, H * 0.45);
    glow.addColorStop(0, 'rgba(255, 160, 60, 0.45)'); // Brighter Gold
    glow.addColorStop(0.4, 'rgba(255, 120, 20, 0.12)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, H * 0.45, W, H * 0.55);

    // 2. Cityscape Silhouettes with Bright Edges
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 220, 100, 0.5)'; // Very Bright Gold
    ctx.lineWidth = 1.8;
    
    // Distant
    drawChedi(W * 0.15, 80, 150);
    drawViharn(W * 0.3, 100, 120);
    drawChedi(W * 0.5, 60, 100);
    
    // Near
    drawViharn(W * 0.85, 220, 180);
    drawChedi(W * 0.7, 180, 310); 
    drawViharn(W * 0.05, 180, 140);
    
    ctx.restore();
  }

  function draw() {
    time++;
    ctx.clearRect(0, 0, W, H);

    // Lighter Indigo Night Sky
    const bgG = ctx.createLinearGradient(0, 0, 0, H);
    bgG.addColorStop(0, '#061226'); 
    bgG.addColorStop(1, '#1c244d');
    ctx.fillStyle = bgG;
    ctx.fillRect(0, 0, W, H);

    // Bright Stars
    stars.forEach(s => {
      s.o += 0.015;
      const op = Math.sin(s.o) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.3})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    });

    // ── Intense Flying Lanterns ──
    flyingLanterns.forEach(fl => {
      fl.y += fl.vy;
      fl.x += fl.vx;
      fl.glow += 0.05;
      if (fl.y < -50) Object.assign(fl, makeFlying());
      
      const op = Math.sin(fl.glow) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(255, 215, 0, ${op * 0.85})`;
      ctx.beginPath(); ctx.arc(fl.x, fl.y, fl.s * 1.5, 0, Math.PI * 2); ctx.fill();
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#FFD700';
      ctx.fillRect(fl.x - fl.s, fl.y - fl.s, fl.s * 2, fl.s * 2);
      ctx.shadowBlur = 0;
    });

    drawWires();
    drawEnvironment();
    
    lanterns.sort((a, b) => a.z - b.z);
    lanterns.forEach(l => drawLantern(l));

    requestAnimationFrame(draw);
  }

  resize();
  draw();
})();
