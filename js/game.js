/* =====================================================
   VIRTUAL YI PENG — PREMIUM STAGE-BASED LOGIC
   Stepped Wall | Interactive Lighting | Lantern Isolation
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
  let phangState = 'idle'; // idle, lit, placed

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
      stars.push({ x: Math.random() * W, y: Math.random() * H * 5, r: Math.random() * 1.2 + 0.2, o: Math.random(), s: Math.random() * 0.02 });
    }
    // Stage 3 Krathongs
    for(let i=0; i<15; i++) {
        krathongs.push({
            id: i,
            x: Math.random()*W,
            y: 2 * H + H * 0.7 + Math.random() * H * 0.25, // Restrict to water area
            vx: (Math.random()-0.5)*0.2,
            vy: (Math.random()-0.5)*0.1,
            scale: 0.4 + Math.random()*0.4,
            bob: Math.random()*Math.PI,
            alpha: 1,
            style: Math.floor(Math.random()*5),
            isPlayer: false
        });
    }
  }

  function updateHint(key) {
    const hint = document.getElementById('candle-hint');
    if (!hint) return;
    if (key) {
        const text = window.LANG && window.LANG[window.currentLang] ? window.LANG[window.currentLang][key] : key;
        hint.innerText = text;
        hint.classList.add('visible');
    } else {
        hint.classList.remove('visible');
    }
  }

  // --- UI INITIALIZATION ---
  function initUI() {
    document.querySelectorAll('.wish-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        tag.classList.toggle('active');
        if (tag.classList.contains('active')) selectedWishes.add(tag.innerText);
        else selectedWishes.delete(tag.innerText);
      });
    });

    document.getElementById('btn-release-lantern')?.addEventListener('click', () => {
      const wishes = Array.from(selectedWishes).join('\n');
      releaseLantern(wishes, true);
      document.getElementById('sky-panel')?.classList.add('collapsed');
      showNextButton();
    });

    // Stage 2: Starter Candle Interaction
    const starterCandle = document.getElementById('starter-candle');
    starterCandle?.addEventListener('click', (e) => {
        if (phangState === 'idle') {
            phangState = 'lit';
            starterCandle.classList.add('lit');
            updateHint('game_hint_place');
            e.stopPropagation();
        }
    });

    document.getElementById('next-to-land')?.addEventListener('click', () => {
        goToStage(1);
        setTimeout(() => {
            document.getElementById('starter-candle')?.classList.add('visible');
            updateHint('game_hint_light');
        }, 1000);
    });
    document.getElementById('next-to-river')?.addEventListener('click', () => {
        goToStage(2);
        document.getElementById('starter-candle')?.classList.remove('visible');
        updateHint(null);
    });

    document.getElementById('btn-start-krathong')?.addEventListener('click', () => {
        const initPanel = document.getElementById('river-panel-init');
        const mainPanel = document.getElementById('river-panel');
        if (initPanel) initPanel.style.display = 'none';
        if (mainPanel) mainPanel.style.display = 'block';
    });

    document.getElementById('btn-float-krathong')?.addEventListener('click', () => {
        const activeWishTag = document.querySelector('#kr-wishes .wish-tag.active');
        const wishKey = activeWishTag?.dataset.wish || 'kr_wish_1';
        const wishText = activeWishTag?.innerText || '...';
        const styleIdx = document.querySelector('#river-panel .kr-style-card.active')?.dataset.style || 0;
        
        let spawnX = W / 2 + (Math.random() - 0.5) * 100;
        // Collision Avoidance: Check existing krathongs to prevent overlap
        let safety = 0;
        while (safety < 10) {
            let tooClose = false;
            for (let k of krathongs) {
                if (Math.abs(k.x - spawnX) < 120 && Math.abs((H * 0.75) - (k.y - cameraY)) < 60) {
                    tooClose = true;
                    break;
                }
            }
            if (!tooClose) break;
            spawnX += (Math.random() > 0.5 ? 130 : -130);
            safety++;
        }

        krathongs.push({
            id: Date.now(),
            x: spawnX,
            y: cameraY + H * 0.75,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.1 - Math.random() * 0.1,
            scale: 0.8 + Math.random() * 0.3,
            bob: Math.random() * Math.PI,
            alpha: 1,
            wish: wishText,
            style: parseInt(styleIdx),
            isPlayer: true
        });
        
        const panel = document.getElementById('river-panel');
        if(panel) panel.style.display = 'none';
        showNextButton();
    });

    document.querySelectorAll('.kr-style-card').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.kr-style-card').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.querySelectorAll('#kr-wishes .wish-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            document.querySelectorAll('#kr-wishes .wish-tag').forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
        });
    });
    document.getElementById('next-to-final')?.addEventListener('click', () => goToStage(3));
    
    document.getElementById('btn-restart')?.addEventListener('click', () => {
      document.querySelectorAll('.next-stage-btn').forEach(b => b.classList.remove('visible'));
      document.querySelectorAll('.interaction-panel').forEach(p => p.classList.remove('collapsed'));
      document.querySelectorAll('.section-content').forEach(c => {
          c.classList.remove('minimized');
          c.style.opacity = (c.parentElement.id === 'sec-sky') ? '1' : '0';
      });
      phangState = 'idle';
      const sc = document.getElementById('starter-candle');
      if (sc) { sc.classList.remove('visible', 'lit'); }
      goToStage(0);
    });

    // Block manual scroll
    window.addEventListener('wheel', e => e.preventDefault(), { passive: false });
    window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    window.addEventListener('keydown', e => { if(['ArrowUp','ArrowDown','Space','PageUp','PageDown','Home','End'].includes(e.code)) e.preventDefault(); });

    canvas.parentElement.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Stage 1: Lantern Click
        if (currentStage === 0) {
            for (let l of lanterns) {
                if (!l.isPlayer) continue;
                const screenY = l.y - cameraY;
                const dx = mx - l.x; const dy = my - screenY;
                if (Math.sqrt(dx*dx + dy*dy) < 60 * l.scale) { showWishModal(l.wish); return; }
            }
        }

        // Stage 3: Krathong Click
        if (currentStage === 2) {
            for (let k of krathongs) {
                if (!k.isPlayer) continue;
                const screenY = k.y - cameraY;
                const dx = mx - k.x; const dy = my - screenY;
                // Larger hit area for krathongs
                if (Math.sqrt(dx*dx + dy*dy) < 70 * k.scale) { showWishModal(k.wish); return; }
            }
        }

        // Stage 2: Wall Click to Place
        if (currentStage === 1 && phangState === 'lit') {
            const rowH = 50;
            const worldY = my + cameraY;
            // Snap to brick row relative to H
            const rowIdx = Math.floor((worldY - H) / rowH);
            const snappedY = H + (rowIdx * rowH) - 10;
            
            phangPatits.push({ id: Date.now(), x: mx, y: snappedY, tx: 0, ty: 0, progress: 1, scale: 1.2, isPlayer: true });
            phangState = 'placed';
                document.getElementById('starter-candle')?.classList.remove('visible');
                updateHint(null);
                showNextButton();
        }
    });
  }

  function showWishModal(text) {
    const modal = document.getElementById('wish-modal');
    const p = document.getElementById('modal-wish-text');
    if (modal && p) { p.innerText = text || '...'; modal.classList.add('active'); }
  }

  function goToStage(idx) {
    const sections = document.querySelectorAll('.game-section');
    currentStage = idx;
    targetCameraY = idx * H;
    sections.forEach((s, i) => {
        s.classList.toggle('active', i === idx);
        // Special: Land stage box is hidden until placed
        const content = s.querySelector('.section-content');
        if (i === 1 && phangState !== 'placed') { if(content) content.style.opacity = '0'; }
    });

    // Handle Krathong Button Visibility
    const krBtn = document.getElementById('btn-create-krathong');
    const krCreator = document.getElementById('krathong-creator');
    if (idx === 2) {
        setTimeout(() => {
            if(krBtn) krBtn.classList.add('visible');
        }, 1000);
    } else {
        if(krBtn) krBtn.classList.remove('visible');
        if(krCreator) krCreator.classList.remove('active');
    }
  }

  function showNextButton() {
    const activeSection = document.querySelectorAll('.game-section')[currentStage];
    const content = activeSection.querySelector('.section-content');
    const nextBtn = activeSection.querySelector('.next-stage-btn');
    if (content) {
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';
        content.classList.add('minimized');
    }
    if (nextBtn) nextBtn.classList.add('visible');
  }

  // --- OBJECT CREATION ---
  function releaseLantern(wish, isPlayer = false) {
    const vx = isPlayer ? -(Math.random() * 0.4 + 0.4) : (Math.random() - 0.5) * 0.6;
    const vy = isPlayer ? -(Math.random() * 0.6 + 0.4) : -(Math.random() * 0.3 + 0.2);
    lanterns.push({ id: Date.now() + Math.random(), x: isPlayer ? W * 0.9 : Math.random() * W, y: isPlayer ? cameraY + H * 0.9 : cameraY + H * 1.5, vx: vx, vy: vy, scale: isPlayer ? Math.random() * 0.5 + 1.0 : Math.random() * 0.4 + 0.4, alpha: 0, sway: Math.random() * Math.PI * 2, wish: wish, isPlayer: isPlayer });
  }

  function prePopulate() {
    for (let i = 0; i < 40; i++) {
        lanterns.push({ id: Math.random(), x: Math.random() * W, y: Math.random() * H * 5, vx: (Math.random() - 0.5) * 0.3, vy: -(Math.random() * 0.3 + 0.1), scale: Math.random() * 0.4 + 0.3, alpha: 0.5 + Math.random() * 0.5, sway: Math.random() * Math.PI * 2, isPlayer: false });
    }
    const rowH = 50;
    for (let i = 0; i < 30; i++) {
        const rowIdx = Math.floor(Math.random() * (H / rowH - 4)) + 2;
        phangPatits.push({ id: Math.random(), x: Math.random() * W, y: H + (rowIdx * rowH) - 10, tx: 0, ty: 0, progress: 1, scale: Math.random() * 0.2 + 0.4 });
    }
  }

  function floatKrathong(wish) {
    krathongs.push({ id: Date.now(), x: W / 2, y: H * 2.8, vx: Math.random() * 0.4 + 0.3, vy: (Math.random() - 0.5) * 0.1, scale: Math.random() * 0.3 + 0.5, bob: Math.random() * Math.PI * 2, wish: wish, alpha: 0 });
  }

  // --- DRAWING ---
  function drawLantern(l) {
    // Isolation: Only draw if within sky zone or slightly beyond
    if (cameraY > H * 0.7) {
        l.alpha = Math.max(0, l.alpha - 0.05);
        if (l.alpha <= 0) return false;
    } else {
        l.alpha = Math.min(l.alpha + 0.01, 1);
    }

    l.sway += 0.01; l.x += l.vx + Math.sin(l.sway) * 0.2; l.y += l.vy;
    const screenY = l.y - cameraY;
    if (screenY < -400 || screenY > H + 400) return true;
    
    const s = l.scale; const opacity = l.alpha; const w = 100 * s; const h = 130 * s;
    const flickerVal = Math.sin(Date.now() * 0.005 + l.id) * 0.15 + 0.85;

    ctx.save(); ctx.translate(l.x, screenY);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w * 2.5);
    g.addColorStop(0, `rgba(232, 146, 92, ${0.3 * opacity * flickerVal})`); g.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, w * 2.5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = LANNA_COLORS.left.replace('ALPHA', opacity);
    ctx.beginPath(); ctx.moveTo(0, -h/2); ctx.lineTo(-w/2.2, -h/4); ctx.lineTo(-w/3.5, h/2); ctx.lineTo(0, h/2); ctx.fill();
    ctx.fillStyle = LANNA_COLORS.right.replace('ALPHA', opacity);
    ctx.beginPath(); ctx.moveTo(0, -h/2); ctx.lineTo(w/2.2, -h/4); ctx.lineTo(w/3.5, h/2); ctx.lineTo(0, h/2); ctx.fill();

    const fireG = ctx.createRadialGradient(0, h/2 - 20*s, 0, 0, h/2 - 20*s, 30*s);
    fireG.addColorStop(0, `rgba(255, 255, 180, ${opacity * flickerVal})`); fireG.addColorStop(0.4, `rgba(255, 150, 0, ${opacity * 0.8})`); fireG.addColorStop(1, 'rgba(255, 150, 0, 0)');
    ctx.fillStyle = fireG; ctx.beginPath(); ctx.arc(0, h/2 - 20*s, 30*s, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, h/2, w/3.5, 8*s, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = LANNA_COLORS.right.replace('ALPHA', opacity * 0.3);
    ctx.beginPath(); ctx.moveTo(0, -h/4); ctx.quadraticCurveTo(-w/3, 0, -w/3.5, h/2); ctx.lineTo(0, h/2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -h/4); ctx.quadraticCurveTo(w/3, 0, w/3.5, h/2); ctx.lineTo(0, h/2); ctx.fill();

    if (l.isPlayer && opacity > 0.8) {
        const label = window.LANG && window.LANG[window.currentLang] ? window.LANG[window.currentLang].game_your_lantern : 'โคมของคุณ';
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.7})`; ctx.font = `600 ${14 * s}px 'Kodchasan'`; ctx.textAlign = 'center'; ctx.fillText(label, 0, h/2 + 35);
    }
    ctx.restore(); return true;
  }

  function drawPhang(p) {
    const screenY = p.y - cameraY;
    if (screenY < -100 || screenY > H + 100) return true;
    const s = p.scale; 
    // Slower flicker
    const flicker = Math.sin(Date.now() * 0.003 + p.id) * 0.15 + 0.85;
    ctx.save(); ctx.translate(p.x, screenY);
    
    // Glow
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 60 * s);
    g.addColorStop(0, `rgba(232, 146, 92, ${0.4 * flicker})`); g.addColorStop(1, 'rgba(232, 146, 92, 0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 60 * s, 0, Math.PI * 2); ctx.fill();

    // Premium Scalloped Bowl (Rounded Petals)
    ctx.fillStyle = '#f5f5f5';
    const petals = 12;
    const outerR = 22 * s;
    const innerR = 18 * s;
    ctx.beginPath();
    for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * Math.PI * 2;
        const nextAngle = ((i + 1) / petals) * Math.PI * 2;
        const midAngle = (angle + nextAngle) / 2;
        
        // Use curves for a softer, ceramic look
        ctx.quadraticCurveTo(
            Math.cos(midAngle) * outerR * 1.2, Math.sin(midAngle) * outerR * 0.5,
            Math.cos(nextAngle) * innerR, Math.sin(nextAngle) * innerR * 0.4
        );
    }
    ctx.fill();
    
    // Inner Shadow for depth
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.beginPath(); ctx.ellipse(0, 2*s, 16*s, 6*s, 0, 0, Math.PI*2); ctx.fill();

    // Wax (Yellow Center)
    ctx.fillStyle = '#f0c000';
    ctx.beginPath(); ctx.ellipse(0, 0, 15 * s, 6 * s, 0, 0, Math.PI * 2); ctx.fill();

    // Wick
    ctx.strokeStyle = '#331a00'; ctx.lineWidth = 2 * s;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -5 * s); ctx.stroke();

    // Flame (Softer Glow)
    const flameG = ctx.createRadialGradient(0, -12 * s, 0, 0, -12 * s, 15 * s);
    flameG.addColorStop(0, `rgba(255, 255, 200, ${flicker})`);
    flameG.addColorStop(0.5, `rgba(255, 150, 0, ${0.8 * flicker})`);
    flameG.addColorStop(1, 'rgba(255, 150, 0, 0)');
    ctx.fillStyle = flameG;
    ctx.beginPath(); ctx.ellipse(0, -12 * s, 6 * s, 12 * s, 0, 0, Math.PI * 2); ctx.fill();

    if (p.isPlayer) {
        const label = window.LANG && window.LANG[window.currentLang] ? window.LANG[window.currentLang].game_your_phang : 'ผางประทีปของคุณ';
        ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.font = `600 ${13 * s}px 'Kodchasan'`; ctx.textAlign = 'center';
        ctx.fillText(label, 0, 35 * s);
    }
    ctx.restore(); return true;
  }

  function drawKrathong(k) {
    if (currentStage !== 2) return false;
    k.x += k.vx; k.y += k.vy; k.bob += 0.02; k.alpha = Math.min(k.alpha + 0.02, 1);
    const screenY = k.y - cameraY;
    if (screenY < H * 0.64) k.vy = 0.1;
    if (screenY < -200 || screenY > H + 200) return true;

    const s = k.scale; const bobY = Math.sin(k.bob) * 4; const flicker = Math.sin(Date.now() * 0.01 + k.id) * 0.2 + 0.8;
    ctx.save(); ctx.translate(k.x, screenY + bobY);
    
    // Style Themes (Restored & Enhanced)
    const KR_THEMES = [
        { l1: '#003300', l2: '#006400', l3: '#228b22', flower: '#800080', f2: '#ff8c00', candle: '#fff8e7' }, // Classic
        { l1: '#5c4033', l2: '#8b6508', l3: '#ffd700', flower: '#ffffff', f2: '#b8860b', candle: '#ffcc00' }, // Royal
        { l1: '#2a0035', l2: '#4b0082', l3: '#9370db', flower: '#ffd700', f2: '#6a5acd', candle: '#ffffff' }, // Lanna
        { l1: '#1a1a1a', l2: '#808080', l3: '#f0f0f0', flower: '#ff69b4', f2: '#333333', candle: '#ffd700' }, // White
        { l1: '#5c0033', l2: '#c71585', l3: '#ff69b4', flower: '#ffffff', f2: '#ff1493', candle: '#fff8e7' }  // Pink
    ];
    const theme = KR_THEMES[k.style % KR_THEMES.length];

    // 1. Water Ripple & Glow
    ctx.save();
    ctx.globalAlpha = 0.2 * k.alpha;
    ctx.fillStyle = theme.candle === '#ffffff' ? '#ffffff' : '#ffcc00';
    ctx.beginPath(); ctx.ellipse(0, 8*s, 65*s, 18*s, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // 2. High-Detail Banana Leaves
    function drawUltraLeaf(lx, ly, lScale, color, angle, isOuter) {
        ctx.save(); ctx.translate(lx, ly); ctx.rotate(angle);
        // Main Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.moveTo(2*s, 0); ctx.quadraticCurveTo(-20*lScale, -15*lScale, 2*s, -55*lScale); ctx.quadraticCurveTo(22*lScale, -15*lScale, 2*s, 0); ctx.fill();
        // Leaf Body with texture gradient
        const lg = ctx.createLinearGradient(0, 0, 0, -50*lScale);
        lg.addColorStop(0, color); lg.addColorStop(0.7, color); lg.addColorStop(1, isOuter ? color : '#dfffaf');
        ctx.fillStyle = lg;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-18*lScale, -15*lScale, 0, -52*lScale); ctx.quadraticCurveTo(18*lScale, -15*lScale, 0, 0); ctx.fill();
        // Edge Highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-16*lScale, -15*lScale); ctx.quadraticCurveTo(-10*lScale, -30*lScale, 0, -52*lScale); ctx.stroke();
        // Fine Rib Texture
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        for(let i=-2; i<=2; i++) {
            ctx.beginPath(); ctx.moveTo(i*4*lScale, -2*lScale); ctx.lineTo(i*5*lScale, -45*lScale); ctx.stroke();
        }
        ctx.restore();
    }
    
    // 4 Layers of Leaves for extreme detail
    for(let i=0; i<12; i++) {
        const a = (i/12)*Math.PI*2;
        drawUltraLeaf(Math.cos(a)*35*s, Math.sin(a)*12*s + 12*s, s*0.85, theme.l1, a + Math.PI/2, true);
    }
    for(let i=0; i<10; i++) {
        const a = (i/10)*Math.PI*2 + 0.3;
        drawUltraLeaf(Math.cos(a)*25*s, Math.sin(a)*10*s + 5*s, s*0.95, theme.l2, a + Math.PI/2, false);
    }
    for(let i=0; i<8; i++) {
        const a = (i/8)*Math.PI*2 + 0.6;
        drawUltraLeaf(Math.cos(a)*15*s, Math.sin(a)*6*s - 5*s, s*1.05, theme.l3, a + Math.PI/2, false);
    }

    // 3. Fluffy Marigolds (Back Row - Palette Synced)
    for(let i=0; i<4; i++) {
        const a = (i/4)*Math.PI + Math.PI;
        const mx = Math.cos(a)*22*s; const my = Math.sin(a)*8*s - 15*s;
        ctx.fillStyle = theme.f2;
        for(let j=0; j<12; j++) {
            const pa = (j/12)*Math.PI*2;
            ctx.beginPath(); ctx.arc(mx + Math.cos(pa)*8*s, my + Math.sin(pa)*4*s, 6*s, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = theme.flower; ctx.beginPath(); ctx.arc(mx, my, 8*s, 0, Math.PI*2); ctx.fill();
    }

    // 4. Purple Orchids (Front Row - Palette Synced)
    function drawOrchid(ox, oy, oScale, color) {
        ctx.save(); ctx.translate(ox, oy);
        ctx.fillStyle = color;
        for(let i=0; i<5; i++) {
            const a = (i/5)*Math.PI*2;
            ctx.beginPath(); ctx.ellipse(Math.cos(a)*8*oScale, Math.sin(a)*8*oScale, 6*oScale, 10*oScale, a, 0, Math.PI*2); ctx.fill();
        }
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(0, 0, 4*oScale, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1;
        ctx.restore();
    }
    for(let i=0; i<5; i++) {
        const a = (i/5)*Math.PI;
        const ox = Math.cos(a)*28*s; const oy = Math.sin(a)*12*s - 5*s;
        drawOrchid(ox, oy, s, theme.flower);
    }

    // 5. Incense & Smoke
    ctx.lineWidth = 1.5*s; ctx.strokeStyle = '#d2b48c';
    for(let i=-1; i<=1; i++) {
        const ix = i*6*s + 5*s; const iy = -15*s;
        ctx.strokeStyle = '#d2b48c'; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix, iy - 95*s); ctx.stroke();
        ctx.strokeStyle = '#b22222'; ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ix, iy-15*s); ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,255, ${0.1 * flicker})`; ctx.lineWidth = 1;
        const smokeOffset = Math.sin(Date.now()*0.002 + i)*12*s;
        ctx.beginPath(); ctx.moveTo(ix, iy-95*s); ctx.bezierCurveTo(ix+smokeOffset, iy-115*s, ix-smokeOffset, iy-135*s, ix, iy-155*s); ctx.stroke();
    }

    // 6. Slender Candle
    const cx = -10*s; const cy = -20*s; const cw = 10*s; const ch = 85*s;
    ctx.fillStyle = theme.candle; ctx.fillRect(cx - cw/2, cy - ch, cw, ch);
    const fg = ctx.createRadialGradient(cx, cy - ch - 12*s, 0, cx, cy - ch - 12*s, 30*s);
    fg.addColorStop(0, `rgba(255, 255, 200, ${0.8 * flicker})`); fg.addColorStop(1, 'rgba(255, 150, 0, 0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(cx, cy - ch - 12*s, 30*s, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(cx, cy - ch - 12*s, 5*s, 11*s, 0, 0, Math.PI*2); ctx.fill();

    if (k.isPlayer) {
        const label = window.LANG && window.LANG[window.currentLang] ? window.LANG[window.currentLang].game_your_krathong : 'กระทงของคุณ';
        ctx.fillStyle = `rgba(255, 255, 255, 0.95)`;
        ctx.font = `700 ${16 * s}px 'Kodchasan'`; ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 4;
        ctx.fillText(label, 0, -165 * s);
        ctx.font = `400 ${12 * s}px 'Kodchasan'`; ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillText('(คลิกเพื่อดูคำอธิษฐาน)', 0, -145 * s);
        ctx.shadowBlur = 0;
    }

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
    if (landY < H && landY > -H) {
        ctx.fillStyle = '#0f0805'; ctx.fillRect(0, landY, W, H);
        const rowH = 50; const brickW = 120;
        for (let i = 0; i <= H / rowH; i++) {
            const ry = landY + i * rowH;
            // Stepped Ledge effect with shadow
            ctx.fillStyle = '#160a08'; ctx.fillRect(0, ry, W, 10); // Ledge shadow
            ctx.fillStyle = '#2a1a15'; ctx.fillRect(0, ry, W, 4); // Ledge top highlight
            
            ctx.strokeStyle = 'rgba(0,0,0,0.9)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(0, ry); ctx.lineTo(W, ry); ctx.stroke();
            const offset = (i % 2) * (brickW / 2);
            for (let j = -1; j <= W / brickW + 1; j++) {
                const bx = j * brickW + offset;
                // Vertical Crevices (Ambient Occlusion)
                ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                ctx.beginPath(); ctx.moveTo(bx, ry + 10); ctx.lineTo(bx, ry + rowH); ctx.stroke();
                
                if (Math.random() > 0.6) { 
                    ctx.fillStyle = `rgba(30, 15, 10, ${Math.random() * 0.15})`; 
                    ctx.fillRect(bx + 4, ry + 12, brickW - 8, rowH - 16); 
                }
            }
        }
        const g = ctx.createLinearGradient(0, landY, 0, landY + H);
        g.addColorStop(0, 'rgba(0,0,0,0.8)'); g.addColorStop(0.3, 'rgba(0,0,0,0)'); g.addColorStop(0.7, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx.fillStyle = g; ctx.fillRect(0, landY, W, H);
    }
    function drawMountain(x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x - w/2, y);
        ctx.lineTo(x, y - h);
        ctx.lineTo(x + w/2, y);
        ctx.closePath(); ctx.fill();
    }

    function drawFireworkPattern(x, y, scale) {
        ctx.strokeStyle = 'rgba(255, 255, 150, 0.4)';
        ctx.lineWidth = 1;
        for(let i=0; i<12; i++) {
            const a = (i/12)*Math.PI*2;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a)*40*scale, y + Math.sin(a)*40*scale); ctx.stroke();
        }
    }

    const riverY = 2 * H - cameraY;
    if (riverY < H && riverY > -H) {
        // 1. Sky Gradient (Clean & Deep)
        const skyG = ctx.createLinearGradient(0, riverY, 0, riverY + H);
        skyG.addColorStop(0, '#002626'); skyG.addColorStop(1, '#004d4d');
        ctx.fillStyle = skyG; ctx.fillRect(0, riverY, W, H);

        // 2. Distant Mountains (Clear Layers)
        ctx.fillStyle = '#001a1a';
        ctx.beginPath();
        ctx.moveTo(0, riverY + H * 0.6);
        ctx.quadraticCurveTo(W*0.2, riverY + H * 0.4, W*0.4, riverY + H * 0.6);
        ctx.quadraticCurveTo(W*0.6, riverY + H * 0.45, W*0.8, riverY + H * 0.6);
        ctx.quadraticCurveTo(W*0.9, riverY + H * 0.55, W, riverY + H * 0.6);
        ctx.lineTo(W, riverY + H * 0.7); ctx.lineTo(0, riverY + H * 0.7);
        ctx.fill();

        // 3. Moon (Simple & Glowing)
        const moonX = W * 0.85, moonY = riverY + H * 0.25;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath(); ctx.arc(moonX, moonY, 35, 0, Math.PI*2); ctx.fill();

        // Distant City Lights (Background Detail)
        for(let i=0; i<15; i++) {
            const lx = (Math.sin(i*555)*0.5+0.5)*W;
            const ly = riverY + H*0.58 + Math.sin(i)*5;
            ctx.fillStyle = `rgba(255, 200, 100, ${0.3 + Math.sin(Date.now()*0.001+i)*0.2})`;
            ctx.beginPath(); ctx.arc(lx, ly, 2, 0, Math.PI*2); ctx.fill();
        }

        const waterline = riverY + H * 0.65;
        
        // 4. Water (Vibrant Teal with Depth)
        const waterG = ctx.createLinearGradient(0, waterline, 0, riverY + H);
        waterG.addColorStop(0, '#008080'); waterG.addColorStop(0.5, '#006666'); waterG.addColorStop(1, '#004d4d');
        ctx.fillStyle = waterG; ctx.fillRect(0, waterline, W, H);

        // 5. Stylized Water Shine & Reflections
        for(let i=0; i<12; i++) {
            const sx = (Math.sin(i*123)*0.5+0.5)*W;
            const sy = waterline + 10 + i*25;
            const sw = 80 + Math.sin(Date.now()*0.002+i)*40;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(i)*0.03})`;
            ctx.fillRect(sx - sw/2, sy, sw, 1.5);
        }

    }
  }

  function drawPier() {
    const riverY = 2 * H - cameraY;
    if (riverY < H && riverY > -H) {
        const pierW = 200, pierH = 120;
        const px = W/2 - pierW/2;
        const py = riverY + H - pierH;
        
        ctx.fillStyle = '#1a0d0a';
        ctx.fillRect(px + 10, py - 40, 15, pierH + 40);
        ctx.fillRect(px + pierW - 25, py - 40, 15, pierH + 40);
        
        ctx.fillStyle = '#3d2b1f';
        ctx.fillRect(px, py, pierW, pierH);
        
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2;
        for(let i=0; i<6; i++) {
            const plankY = py + i * 20;
            ctx.beginPath(); ctx.moveTo(px, plankY); ctx.lineTo(px + pierW, plankY); ctx.stroke();
        }
        
        ctx.strokeStyle = '#5c4033'; ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(px + 10, py - 30); ctx.lineTo(px + pierW - 10, py - 30);
        ctx.stroke();
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    cameraY += (targetCameraY - cameraY) * 0.06;
    const scroller = document.querySelector('.game-scroller');
    if (scroller) scroller.style.transform = `translateY(${-cameraY}px)`;
    ctx.clearRect(0, 0, W, H);
    drawBackground();
    stars.forEach(s => { s.o += s.s; const op = Math.sin(s.o) * 0.4 + 0.6; const sy = s.y - cameraY * 0.5; if (sy > -10 && sy < H + 10) { ctx.fillStyle = `rgba(255, 255, 255, ${op * 0.3})`; ctx.beginPath(); ctx.arc(s.x, sy, s.r, 0, Math.PI * 2); ctx.fill(); } });
    lanterns = lanterns.filter(drawLantern); phangPatits.forEach(drawPhang); krathongs.forEach(drawKrathong);
    drawPier();
  }

  resize(); initUI(); prePopulate(); loop();
})();
