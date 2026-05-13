/* =====================================================
   YI PENG — THA PHAE GATE 3D (HYPER-REALISTIC STYLE)
   High-fidelity procedural 3D recreation matching the 
   authentic Chiang Mai landmark photo.
   ===================================================== */

(function () {
  let scene, camera, renderer;
  let lanterns = [];
  let pigeons = [];
  let time = 0;

  function init() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1018);
    scene.fog = new THREE.FogExp2(0x0a1018, 0.0015);

    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 180, 700);
    camera.lookAt(0, 120, 0);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(300, 500, 200);
    sun.castShadow = true;
    scene.add(sun);

    // Warm Festive Glow (Brighter)
    const gateGlow = new THREE.PointLight(0xffaa44, 5, 800);
    gateGlow.position.set(0, 150, 100);
    scene.add(gateGlow);

    createEnvironment();
    createThaPhaeGate();
    animate();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
  }

  // Helper: Procedural Brick Texture
  function createBrickTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Base Color Variation
    ctx.fillStyle = '#4a251b';
    ctx.fillRect(0, 0, 512, 512);
    
    const bw = 32; const bh = 14;
    for (let y = 0; y < 512; y += bh) {
      const offset = (y / bh % 2 === 0) ? 0 : bw / 2;
      for (let x = -bw; x < 512; x += bw) {
        // Random brick color
        const r = 70 + Math.random() * 40;
        const g = 30 + Math.random() * 30;
        const b = 20 + Math.random() * 20;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x + offset + 1, y + 1, bw - 2, bh - 2);
        
        // Edge highlighting
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.strokeRect(x + offset, y, bw, bh);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 8);
    return tex;
  }

  function createEnvironment() {
    // Plaza Ground
    const groundGeo = new THREE.PlaneGeometry(4000, 4000);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0x222222, 
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for (let i = 0; i < 2000; i++) {
      starPos.push((Math.random() - 0.5) * 3000, Math.random() * 1000 + 200, (Math.random() - 0.5) * 3000);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    const starPoints = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2 }));
    scene.add(starPoints);
  }

  function createThaPhaeGate() {
    const brickTex = createBrickTexture();
    const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 1 });
    const wallGroup = new THREE.Group();

    const wallH = 260;
    const wallT = 50;
    const gateW = 340;
    const sideW = 1200;

    // 1. Base Tapered Wall (Building layers to match the photo)
    function addWallSegment(x, w, h, t, z) {
        const seg = new THREE.Mesh(new THREE.BoxGeometry(w, h, t), brickMat);
        seg.position.set(x, h/2, z);
        seg.castShadow = true;
        seg.receiveShadow = true;
        wallGroup.add(seg);
    }

    // Left Side Wall
    addWallSegment(-(sideW/2 + gateW/2 + 20), sideW, wallH, wallT, -100);
    // Right Side Wall
    addWallSegment(sideW/2 + gateW/2 + 20, sideW, wallH, wallT, -100);

    // 2. Decorative Ledge (Matching photo)
    const ledgeMat = new THREE.MeshStandardMaterial({ color: 0x3d1f16 });
    const ledgeL = new THREE.Mesh(new THREE.BoxGeometry(sideW, 15, wallT + 10), ledgeMat);
    ledgeL.position.set(-(sideW/2 + gateW/2 + 20), wallH * 0.7, -100);
    wallGroup.add(ledgeL);
    const ledgeR = ledgeL.clone();
    ledgeR.position.x = sideW/2 + gateW/2 + 20;
    wallGroup.add(ledgeR);

    // 3. Authentically Shaped Crenels
    const cw = 50; const ch = 35; const gap = 25;
    for (let x = -2000; x < 2000; x += (cw + gap)) {
        if (Math.abs(x) < gateW/2 + 40) continue;
        const crenel = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, wallT), brickMat);
        crenel.position.set(x, wallH + ch/2, -100);
        // Bevel look
        crenel.scale.set(0.9, 1, 1);
        wallGroup.add(crenel);
    }

    // 4. Massive Wooden Pillars (Vertical Logs)
    const logGeo = new THREE.CylinderGeometry(20, 20, wallH + 80, 24);
    const logMat = new THREE.MeshStandardMaterial({ color: 0x2a1a15, roughness: 1 });
    const pL = new THREE.Mesh(logGeo, logMat);
    pL.position.set(-gateW/2 - 45, (wallH + 80)/2, -60);
    pL.castShadow = true;
    wallGroup.add(pL);
    const pR = pL.clone();
    pR.position.x = gateW/2 + 45;
    wallGroup.add(pR);

    // 5. The Wooden Door (Recessed)
    const door = new THREE.Mesh(new THREE.BoxGeometry(gateW, wallH, 15), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
    door.position.set(0, wallH/2, -120);
    wallGroup.add(door);

    // 6. Black Information Sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(160, 100, 5), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    sign.position.set(gateW/2 + 150, 140, -70);
    wallGroup.add(sign);

    // 7. Small Base Windows
    const winGeo = new THREE.BoxGeometry(45, 45, 10);
    const winMat = new THREE.MeshStandardMaterial({ color: 0x050505 });
    for (let x = -1000; x <= 1000; x += 600) {
        if (Math.abs(x) < 300) continue;
        const w = new THREE.Mesh(winGeo, winMat);
        w.position.set(x, 60, -75);
        wallGroup.add(w);
    }

    // 8. Lanna Building in background
    const bgGroup = new THREE.Group();
    const roof = new THREE.Mesh(new THREE.ConeGeometry(80, 60, 4), new THREE.MeshStandardMaterial({ color: 0xb85c4a }));
    roof.position.set(-gateW/2 - 150, wallH + 30, -250);
    bgGroup.add(roof);
    wallGroup.add(bgGroup);

    scene.add(wallGroup);

    // Add Pigeons
    for (let i = 0; i < 20; i++) createPigeon();
  }

  function createPigeon() {
    const p = new THREE.Group();
    const b = new THREE.Mesh(new THREE.SphereGeometry(3, 8, 8), new THREE.MeshStandardMaterial({ color: 0x666666 }));
    const h = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x777777 }));
    h.position.set(3, 2, 0);
    p.add(b); p.add(h);
    p.position.set((Math.random() - 0.5) * 1200, 3, Math.random() * 600 + 100);
    p.userData = { vx: (Math.random()-0.5)*0.6, vz: (Math.random()-0.5)*0.6, t: Math.random()*100 };
    pigeons.push(p);
    scene.add(p);
  }

  function createLantern() {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(8, 10, 20, 8), new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xff8800, emissiveIntensity: 0.6 }));
    l.position.set((Math.random() - 0.5) * 2500, -100, (Math.random() - 0.5) * 2000);
    l.userData = { vy: 0.4 + Math.random()*0.3, s: Math.random()*10 };
    lanterns.push(l);
    scene.add(l);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 60;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    camera.position.x += (x - camera.position.x) * 0.05;
    camera.position.y += (180 - y - camera.position.y) * 0.05;
    camera.lookAt(0, 120, 0);
  }

  function animate() {
    time += 0.01;
    requestAnimationFrame(animate);

    if (lanterns.length < 120 && Math.random() < 0.15) createLantern();
    lanterns.forEach(l => {
      l.position.y += l.userData.vy;
      l.position.x += Math.sin(time + l.userData.s) * 0.3;
      if (l.position.y > 1200) l.position.y = -100;
    });

    pigeons.forEach(p => {
        p.userData.t--;
        if (p.userData.t <= 0) {
            p.userData.vx = (Math.random()-0.5)*0.6;
            p.userData.vz = (Math.random()-0.5)*0.6;
            p.userData.t = 60 + Math.random()*120;
        }
        p.position.x += p.userData.vx;
        p.position.z += p.userData.vz;
        p.rotation.y = Math.atan2(p.userData.vx, p.userData.vz);
        p.position.y = 3 + Math.abs(Math.sin(time * 12)) * 2;
    });

    renderer.render(scene, camera);
  }

  init();
})();
