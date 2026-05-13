/* =====================================================
   VIRTUAL YI PENG — PREMIUM STAGE-BASED LOGIC
   Detailed Model | Clickable Wishes | Ambient Lanterns
   ===================================================== */

(function () {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let W, H;
  let currentStage = 0;
  let cameraY = 0;
  let targetCameraY = 0;
  
  let lanterns = [];
  let phangPatits = [];
  let krathongs = [];
  let stars = [];

  let selectedWishes = new Set();

  // Premium Lanna Colors
  const LANNA_COLORS = { left: 'rgba(184, 92, 74, ALPHA)', right: 'rgba(232, 146, 92, ALPHA)' };
  
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initStars();
  }
  window.addEventListener('resize', resize);

  function initStars() {
    stars = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H * 5,
        r: Math.random() * 1.2 + 0.2,
        o: Math.random(),
        s: Math.random() * 0.02
      });
    }
  }

  // --- UI INITIALIZATION ---
  function initUI() {
    document.querySelectorAll('.wish-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        if (tag.classList.contains('active')) {
          selectedWishes.add(tag.innerText);
        } else {
          selectedWishes.delete(tag.innerText);
        }
      });
    });

    document.getElementById('btn-release-lantern')?.addEventListener('click', () => {
      const wishes = Array.from(selectedWishes).join('\n');
      releaseLantern(wishes, true);
      document.getElementById('sky-panel')?.classList.add('collapsed');
      showNextButton();
      selectedWishes.clear();
      document.querySelectorAll('.wish-tag').forEach(t => t.classList.remove('active'));
    });

    document.getElementById('btn-light-phang')?.addEventListener('click', () => {
      lightPhangPatit();
      document.getElementById('land-panel')?.classList.add('collapsed');
      showNextButton();
    });

    document.getElementById('btn-float-krathong')?.addEventListener('click', () => {
      const input = document.getElementById('wish-krathong');
      floatKrathong(input.value);
      input.value = '';
      document.getElementById('river-panel')?.classList.add('collapsed');
      showNextButton();
    });

    document.getElementById('next-to-land')?.addEventListener('click', () => goToStage(1));
    document.getElementById('next-to-river')?.addEventListener('click', () => goToStage(2));
    document.getElementById('next-to-final')?.addEventListener('click', () => goToStage(3));
    
    // Block manual scroll
    window.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    window.addEventListener('keydown', e => {
      if(['ArrowUp','ArrowDown','Space','PageUp','PageDown','Home','End'].includes(e.code)) {
        e.preventDefault();
      }
    });

    document.getElementById('btn-restart')?.addEventListener('click', () => {
      document.querySelectorAll('.next-stage-btn').forEach(b => b.classList.remove('visible'));
      document.querySelectorAll('.interaction-panel').forEach(p => p.classList.remove('collapsed'));
      document.querySelectorAll('.section-content').forEach(c => c.classList.remove('minimized'));
      goToStage(0);
    });

    canvas.parentElement.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        for (let l of lanterns) {
            if (!l.isPlayer) continue;
            const screenY = l.y - cameraY;
            const dx = mx - l.x;
            const dy = my - screenY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 60 * l.scale) {
                showWishModal(l.wish);
                break;
            }
        }
    });
  }

  function showWishModal(text) {
    const modal = document.getElementById('wish-modal');
    const p = document.getElementById('modal-wish-text');
    if (modal && p) {
        p.innerText = text || '...';
        modal.classList.add('active');
    }
  }

  function goToStage(idx) {
    const sections = document.querySelectorAll('.game-section');
    currentStage = idx;
    targetCameraY = idx * H;
    sections.forEach((s, i) => s.classList.toggle('active', i === idx));
  }

  function showNextButton() {
    const activeSection = document.querySelectorAll('.game-section')[currentStage];
    const content = activeSection.querySelector('.section-content');
    const nextBtn = activeSection.querySelector('.next-stage-btn');
    if (content) content.classList.add('minimized');
    if (nextBtn) nextBtn.classList.add('visible');
  }

  // --- OBJECT CREATION ---
  function releaseLantern(wish, isPlayer = false) {
    const vx = isPlayer ? -(Math.random() * 0.4 + 0.4) : (Math.random() - 0.5) * 0.6;
    const vy = isPlayer ? -(Math.random() * 0.6 + 0.4) : -(Math.random() * 0.3 + 0.2);
    
    lanterns.push({
      id: Date.now() + Math.random(),
      x: isPlayer ? W * 0.9 : Math.random() * W,
      y: isPlayer ? cameraY + H * 0.9 : cameraY + H * 1.5,
      vx: vx, vy: vy,
      scale: isPlayer ? Math.random() * 0.5 + 1.0 : Math.random() * 0.4 + 0.4,
      alpha: 0, sway: Math.random() * Math.PI * 2,
      wish: wish,
      isPlayer: isPlayer
    });
  }

  function prePopulate() {
    for (let i = 0; i < 40; i++) {
        lanterns.push({
            id: Math.random(),
            x: Math.random() * W,
            y: Math.random() * H * 5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -(Math.random() * 0.3 + 0.1),
            scale: Math.random() * 0.4 + 0.3,
            alpha: 0.5 + Math.random() * 0.5,
            sway: Math.random() * Math.PI * 2,
            isPlayer: false
        });
    }
  }

  function lightPhangPatit() {
    const targetX = W * 0.1 + Math.random() * W * 0.8;
    const targetY = H * 1.3 + Math.random() * H * 0.5;
    phangPatits.push({ id: Date.now(), x: W / 2, y: cameraY + H / 2, tx: targetX, ty: targetY, progress: 0, scale: Math.random() * 0.2 + 0.4 });
  }

  function floatKrathong(wish) {
    krathongs.push({ id: Date.now(), x: W / 2, y: H * 2.8, vx: Math.random() * 0.4 + 0.3, vy: (Math.random() - 0.5) * 0.1, scale: Math.random() * 0.3 + 0.5, bob: Math.random() * Math.PI * 2, wish: wish, alpha: 0 });
  }

  // --- DRAWING ---
  function drawLantern(l) {
    l.sway += 0.01; l.x += l.vx + Math.sin(l.sway) * 0.2; l.y += l.vy;
    l.alpha = Math.min(l.alpha + 0.01, 1);
    const screenY = l.y - cameraY;
    if (screenY < -400 || screenY > H + 400) return true;
    
    const s = l.scale; const opacity = l.alpha;
    const w = 100 * s; const h = 130 * s;
    const flickerVal = Math.sin(Date.now() * 0.005 + l.id) * 0.15 + 0.85;

    ctx.save();
    ctx.translate(l.x, screenY);
    
    // 1. Ambient Glow
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 2.5);
    g.addColorStop(0, `rgba(232, 146, 92, ${0.3 * opacity * flickerVal})`);
    g.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, w * 2.5, 0, Math.PI * 2); ctx.fill();

    // 2. Main Body (Faceted & Tapered)
    ctx.fillStyle = LANNA_COLORS.left.replace('ALPHA', opacity);
    ctx.beginPath();
    ctx.moveTo(0, -h/2); ctx.lineTo(-w/2.2, -h/4); ctx.lineTo(-w/3.5, h/2); ctx.lineTo(0, h/2);
    ctx.fill();

    ctx.fillStyle = LANNA_COLORS.right.replace('ALPHA', opacity);
    ctx.beginPath();
    ctx.moveTo(0, -h/2); ctx.lineTo(w/2.2, -h/4); ctx.lineTo(w/3.5, h/2); ctx.lineTo(0, h/2);
    ctx.fill();

    // 3. Internal Glow (Fire)
    const fireG = ctx.createRadialGradient(0, h/2 - 20*s, 0, 0, h/2 - 20*s, 30*s);
    fireG.addColorStop(0, `rgba(255, 255, 180, ${opacity * flickerVal})`);
    fireG.addColorStop(0.4, `rgba(255, 150, 0, ${opacity * 0.8})`);
    fireG.addColorStop(1, 'rgba(255, 150, 0, 0)');
    ctx.fillStyle = fireG;
    ctx.beginPath(); ctx.arc(0, h/2 - 20*s, 30*s, 0, Math.PI * 2); ctx.fill();

    // 4. Bottom Opening
    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, h/2, w/3.5, 8*s, 0, 0, Math.PI * 2); ctx.stroke();

    // 5. Front Panels
    ctx.fillStyle = LANNA_COLORS.right.replace('ALPHA', opacity * 0.3);
    ctx.beginPath(); ctx.moveTo(0, -h/4); ctx.quadraticCurveTo(-w/3, 0, -w/3.5, h/2); ctx.lineTo(0, h/2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -h/4); ctx.quadraticCurveTo(w/3, 0, w/3.5, h/2); ctx.lineTo(0, h/2); ctx.fill();

    if (l.isPlayer && opacity > 0.8) {
        const label = window.LANG && window.LANG[window.currentLang] ? window.LANG[window.currentLang].game_your_lantern : 'โคมของคุณ';
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`;
        ctx.font = `600 ${14 * s}px 'Kodchasan'`; ctx.textAlign = 'center';
        ctx.fillText(label, 0, h/2 + 35);
    }
    ctx.restore(); return true;
  }

  function drawPhang(p) {
    if (p.progress < 1) { p.progress += 0.02; const t = 1 - Math.pow(1 - p.progress, 3); p.curX = W / 2 + (p.tx - W / 2) * t; p.curY = (cameraY + H / 2) + (p.ty - (cameraY + H / 2)) * t; } else { p.curX = p.tx; p.curY = p.ty; }
    const screenY = p.curY - cameraY;
    if (screenY < -100 || screenY > H + 100) return true;
    const s = p.scale; const flicker = Math.sin(Date.now() * 0.01 + p.id) * 0.2 + 0.8;
    ctx.save(); ctx.translate(p.curX, screenY);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 40 * s);
    g.addColorStop(0, `rgba(232, 146, 92, ${0.6 * flicker})`); g.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 40 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#6b3e23'; ctx.beginPath(); ctx.arc(0, 5*s, 12 * s, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255, 255, 180, ${flicker})`; ctx.beginPath(); ctx.arc(0, 0, 5 * s, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return true;
  }

  function drawKrathong(k) {
    k.x += k.vx; k.y += k.vy; k.bob += 0.02; k.alpha = Math.min(k.alpha + 0.02, 1);
    const screenY = k.y - cameraY;
    if (screenY < -200 || screenY > H + 200) return true;
    const s = k.scale; const bobY = Math.sin(k.bob) * 4; const flicker = Math.sin(Date.now() * 0.01 + k.id) * 0.2 + 0.8;
    ctx.save(); ctx.translate(k.x, screenY + bobY);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, 50 * s);
    rg.addColorStop(0, `rgba(232, 146, 92, ${0.4 * flicker * k.alpha})`); rg.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(0, 5*s, 50 * s, 15 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(26, 58, 26, ${k.alpha})`; ctx.beginPath(); ctx.ellipse(0, 0, 35 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(184, 92, 74, ${k.alpha})`;
    for(let i=0; i<8; i++) { const angle = (i/8) * Math.PI * 2; ctx.beginPath(); ctx.ellipse(Math.cos(angle)*25*s, Math.sin(angle)*8*s - 5*s, 10*s, 15*s, angle + Math.PI/2, 0, Math.PI*2); ctx.fill(); }
    ctx.fillStyle = `rgba(255, 255, 200, ${flicker * k.alpha})`; ctx.beginPath(); ctx.ellipse(0, -20 * s, 5 * s, 10 * s, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return true;
  }

  function drawBackground() {
    const skyG = ctx.createLinearGradient(0, -cameraY, 0, H - cameraY);
    skyG.addColorStop(0, '#050a0f'); skyG.addColorStop(1, '#0D1B2A');
    ctx.fillStyle = skyG; ctx.fillRect(0, 0, W, H);
    const moonX = W * 0.2, moonY = H * 0.2 - cameraY * 0.1;
    if (moonY > -100 && moonY < H + 100) {
        ctx.save();
        const mg = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 80);
        mg.addColorStop(0, 'rgba(255, 255, 240, 1)'); mg.addColorStop(0.5, 'rgba(255, 255, 240, 0.4)'); mg.addColorStop(1, 'rgba(255, 255, 240, 0)');
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(moonX, moonY, 80, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#FFF8E7'; ctx.beginPath(); ctx.arc(moonX, moonY, 40, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }
    const landY = H - cameraY;
    if (landY < H && landY > -H) { ctx.fillStyle = '#0a1520'; ctx.fillRect(0, landY, W, H); ctx.fillStyle = '#020508'; ctx.beginPath(); ctx.moveTo(0, landY + H); ctx.lineTo(W * 0.1, landY + H * 0.7); ctx.lineTo(W * 0.3, landY + H * 0.7); ctx.lineTo(W * 0.4, landY + H * 0.4); ctx.lineTo(W * 0.5, landY + H * 0.7); ctx.lineTo(W * 0.8, landY + H * 0.7); ctx.lineTo(W, landY + H); ctx.fill(); }
    const riverY = 2 * H - cameraY;
    if (riverY < H && riverY > -H) {
        const riverG = ctx.createLinearGradient(0, riverY, 0, riverY + H);
        riverG.addColorStop(0, '#050a0f'); riverG.addColorStop(1, '#020508');
        ctx.fillStyle = riverG; ctx.fillRect(0, riverY, W, H);
        ctx.fillStyle = '#010305'; ctx.fillRect(W * 0.4, riverY + H * 0.1, W * 0.2, H * 0.1);
        ctx.fillRect(W * 0.48, riverY, W * 0.04, H * 0.2);
        ctx.strokeStyle = 'rgba(232, 146, 92, 0.05)';
        for (let i = 0; i < 5; i++) { ctx.beginPath(); const waveY = riverY + H * 0.2 + i * H * 0.15; ctx.moveTo(0, waveY); const time = Date.now() * 0.001; for (let x = 0; x <= W; x += 20) { ctx.lineTo(x, waveY + Math.sin(x * 0.01 + time + i) * 5); } ctx.stroke(); }
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    cameraY += (targetCameraY - cameraY) * 0.06;
    
    // Sync HTML sections with camera
    const scroller = document.querySelector('.game-scroller');
    if (scroller) {
        scroller.style.transform = `translateY(${-cameraY}px)`;
    }

    ctx.clearRect(0, 0, W, H);
    drawBackground();
    stars.forEach(s => { s.o += s.s; const op = Math.sin(s.o) * 0.4 + 0.6; const sy = s.y - cameraY * 0.5; if (sy > -10 && sy < H + 10) { ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.3})`; ctx.beginPath(); ctx.arc(s.x, sy, s.r, 0, Math.PI * 2); ctx.fill(); } });
    lanterns.forEach(drawLantern); phangPatits.forEach(drawPhang); krathongs.forEach(drawKrathong);
  }

  resize();
  initUI();
  prePopulate();
  loop();
})();
