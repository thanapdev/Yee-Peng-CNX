/* =====================================================
   YI PENG — IMMERSIVE LANTERN ASCENSION (CREATIVE)
   A cinematic journey through a mass lantern release 
   with bokeh effects, depth-of-field, and interactive 
   light particles.
   ===================================================== */

(function () {
  function init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let lanterns = [];
    let embers = [];
    let time = 0;
    let mouse = { x: 0, y: 0 };

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initLanterns();
      initEmbers();
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / W - 0.5) * 50;
        mouse.y = (e.clientY / H - 0.5) * 50;
    });

    function makeLantern(isInit = false) {
      const z = Math.random(); // Depth layer
      return {
        x: Math.random() * W,
        y: isInit ? Math.random() * H : H + 100,
        z: z,
        size: 15 + z * 80,
        speed: 0.5 + z * 1.5,
        drift: (Math.random() - 0.5) * 0.5,
        hue: Math.random() < 0.8 ? 35 : Math.random() * 360, // Mostly Gold
        glow: Math.random() * Math.PI * 2,
        blur: (1 - z) * 8 // Far away is more blurred
      };
    }

    function initLanterns() {
      lanterns = [];
      for (let i = 0; i < 80; i++) {
        lanterns.push(makeLantern(true));
      }
    }

    function initEmbers() {
        embers = [];
        for (let i = 0; i < 150; i++) {
            embers.push({
                x: Math.random() * W,
                y: Math.random() * H,
                s: Math.random() * 2,
                v: 0.5 + Math.random() * 1.5,
                o: Math.random() * Math.PI * 2
            });
        }
    }

    function drawLantern(l) {
      const gX = l.x + Math.sin(time * 0.01 + l.glow) * 10 - mouse.x * l.z;
      const gY = l.y - mouse.y * l.z;
      const s = l.size;

      ctx.save();
      if (l.blur > 1) ctx.filter = `blur(${l.blur}px)`;
      
      ctx.translate(gX, gY);
      
      // Core Glow
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.5);
      grad.addColorStop(0, `hsla(${l.hue}, 100%, 70%, 0.4)`);
      grad.addColorStop(1, `hsla(${l.hue}, 100%, 70%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, 0, s * 2.5, 0, Math.PI * 2); ctx.fill();

      // Paper Body
      ctx.fillStyle = `hsla(${l.hue}, 80%, 30%, ${0.3 + l.z * 0.6})`;
      ctx.beginPath();
      ctx.moveTo(-s * 0.6, s * 0.8);
      ctx.lineTo(s * 0.6, s * 0.8);
      ctx.lineTo(s * 0.8, -s * 0.6);
      ctx.lineTo(-s * 0.8, -s * 0.6);
      ctx.closePath();
      ctx.fill();

      // Fire Core
      const fG = ctx.createRadialGradient(0, s * 0.4, 0, 0, s * 0.4, s * 0.8);
      fG.addColorStop(0, '#FFF');
      fG.addColorStop(0.4, '#FFD700');
      fG.addColorStop(1, 'rgba(255,100,0,0)');
      ctx.fillStyle = fG;
      ctx.beginPath(); ctx.arc(0, s * 0.4, s * 0.8, 0, Math.PI * 2); ctx.fill();

      ctx.restore();
    }

    function draw() {
      time++;
      ctx.clearRect(0, 0, W, H);

      // Deep Space Background
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#02050a');
      bg.addColorStop(1, '#0b1424');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Embers (Sparkles)
      embers.forEach(e => {
          e.y -= e.v;
          e.x += Math.sin(time * 0.02 + e.o) * 0.5;
          if (e.y < -10) e.y = H + 10;
          const op = Math.sin(time * 0.05 + e.o) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(255, 215, 100, ${op * 0.4})`;
          ctx.beginPath(); ctx.arc(e.x, e.y, e.s, 0, Math.PI * 2); ctx.fill();
      });

      // Sort lanterns by Z to draw distant ones first
      lanterns.sort((a, b) => a.z - b.z);

      lanterns.forEach((l, i) => {
        l.y -= l.speed;
        l.x += l.drift + Math.sin(time * 0.005) * 0.2;
        if (l.y < -200) lanterns[i] = makeLantern();
        drawLantern(l);
      });

      // Vignette effect for more "Cinematic" feel
      const vin = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/2);
      vin.addColorStop(0, 'rgba(0,0,0,0)');
      vin.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vin;
      ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(draw);
    }

    resize();
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
