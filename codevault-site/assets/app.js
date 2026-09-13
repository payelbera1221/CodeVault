/* CodeVault shared front-end behaviour */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch  = window.matchMedia('(pointer:coarse)').matches;
  const NAV = [
    {href:'index.html',     label:'Home',      pages:[/index\.html$/, /^\/?$/]},
    {href:'problems.html',  label:'Problems',  pages:[/problems\.html$/]},
    {href:'practice.html',  label:'Practice',  pages:[/practice\.html$/]},
    {href:'learn.html',     label:'Learn',     pages:[/learn\.html$/]},
    {href:'community.html', label:'Community', pages:[/community\.html$/]},
    {href:'leaderboard.html', label:'Leaderboard', pages:[/leaderboard\.html$/]},
    {href:'progress.html',  label:'Progress',  pages:[/progress\.html$/]},
    {href:'ai-hints.html',  label:'AI Hints',  pages:[/ai-hints\.html$/]},
    {href:'about.html',     label:'About',     pages:[/about\.html$/]}
  ];

  function buildNav(currentPath){
    const links = NAV.map(n => `<a href="${n.href}" data-page="${n.href}">${n.label}</a>`).join('');
    const isAuthed = !!localStorage.getItem('cv_user');
    const cta = isAuthed
      ? `<a href="progress.html" class="cv-nav-cta" style="color:var(--green)">● ${escapeHtml(JSON.parse(localStorage.getItem('cv_user')).name||'You')}</a>`
      : `<a href="login.html" class="cv-nav-cta">Sign in</a>`;
    return `<a class="cv-logo" href="index.html"><span class="cv-gem"></span>CODEVAULT</a>
      <button class="cv-menu-btn" aria-label="Toggle menu" onclick="document.querySelector('.cv-nav-links').classList.toggle('open')">☰</button>
      <div class="cv-nav-links">${links}${cta}</div>`;
  }

  function escapeHtml(s){return String(s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

  function highlightActive(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.cv-nav-links a[data-page]').forEach(a=>{
      const match = NAV.find(n => n.href === a.dataset.page);
      if (!match) return;
      if (match.pages.some(rx => rx.test(path))) a.classList.add('active');
    });
  }
  function buildFooter(){
    return `<div class="cv-foot">
      <div>
        <h4>CodeVault</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="https://github.com/payelbera1221/CodeVault" target="_blank" rel="noopener">GitHub ↗</a></li>
          <li><a href="community.html">Contribute</a></li>
        </ul>
      </div>
      <div>
        <h4>Practice</h4>
        <ul>
          <li><a href="problems.html">All problems</a></li>
          <li><a href="practice.html">Daily challenge</a></li>
          <li><a href="learn.html">Topic paths</a></li>
        </ul>
      </div>
      <div>
        <h4>Account</h4>
        <ul>
          <li><a href="login.html">Sign in</a></li>
          <li><a href="progress.html">My progress</a></li>
          <li><a href="ai-hints.html">AI Hints</a></li>
        </ul>
      </div>
      <div>
        <h4>Stack</h4>
        <ul>
          <li>Next.js · TypeScript · Tailwind</li>
          <li>Spring Boot · MongoDB</li>
          <li class="txt-muted">© 2026 CodeVault</li>
        </ul>
      </div>
    </div>
    <div>Made with <span style="color:var(--magenta)">♥</span> by <a href="https://github.com/payelbera1221" target="_blank" rel="noopener" style="color:var(--cyan)">@payelbera1221</a></div>`;
  }

  /* inject nav + footer */
  const navMount = document.querySelector('[data-mount="nav"]');
  if (navMount) navMount.innerHTML = buildNav();
  const footMount = document.querySelector('[data-mount="footer"]');
  if (footMount) footMount.innerHTML = buildFooter();
  highlightActive();

  /* nav scrolled state */
  const nav = document.querySelector('nav.cv-nav');
  if (nav) window.addEventListener('scroll', ()=>nav.classList.toggle('scrolled', window.scrollY>12), {passive:true});

  /* reveal on scroll */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}), {threshold:.15});
    reveals.forEach(el=>io.observe(el));
  } else reveals.forEach(el=>el.classList.add('in'));

  /* tilt cards (desktop only) */
  document.querySelectorAll('.cv-card.tilt').forEach(card=>{
    card.addEventListener('pointermove', e=>{
      if (reduce || touch) { card.style.transform=''; return; }
      const r = card.getBoundingClientRect();
      const px = (e.clientX-r.left)/r.width, py = (e.clientY-r.top)/r.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5-py)*10}deg) rotateY(${(px-0.5)*12}deg) translateZ(4px)`;
      card.style.setProperty('--gx', (px*100)+'%');
      card.style.setProperty('--gy', (py*100)+'%');
    });
    card.addEventListener('pointerleave', ()=>card.style.transform='');
  });

  /* counter-up */
  function counter(el){
    if (reduce) { el.textContent = (parseInt(el.dataset.count,10)||0) + (el.dataset.suffix||''); return; }
    const target = parseInt(el.dataset.count,10)||0;
    const suffix = el.dataset.suffix||'';
    const dur = 1300; let st = null;
    function step(ts){
      if (!st) st = ts;
      const p = Math.min((ts-st)/dur, 1);
      const e = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(target*e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const ns = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce){
    const sio = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){counter(e.target);sio.unobserve(e.target);}}), {threshold:.5});
    ns.forEach(el=>sio.observe(el));
  } else ns.forEach(counter);

  /* container of utility helpers */
  window.CV = {
    saveSnippet(code, lang){ localStorage.setItem('cv_snippet', JSON.stringify({code,lang,ts:Date.now()})); },
    getSnippet(){ try{return JSON.parse(localStorage.getItem('cv_snippet'));}catch(_){return null;} },
    setUser(u){ localStorage.setItem('cv_user', JSON.stringify(u)); },
    getUser(){ try{return JSON.parse(localStorage.getItem('cv_user'));}catch(_){return null;} },
    logout(){ localStorage.removeItem('cv_user'); location.reload(); }
  };

  /* WebGL scene (landing only) */
  const gl = document.getElementById('webgl');
  if (gl && !reduce && typeof THREE !== 'undefined'){
    try {
      const W = innerWidth, H = innerHeight;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(55, W/H, 0.1, 120); cam.position.z = 10;
      const r = new THREE.WebGLRenderer({alpha:true, antialias:true});
      r.setSize(W,H); r.setPixelRatio(Math.min(devicePixelRatio||1,2));
      gl.appendChild(r.domElement);

      scene.add(new THREE.AmbientLight(0x606080, .7));
      const a = new THREE.PointLight(0x22d3ee,1.5,40); a.position.set(6,4,7); scene.add(a);
      const b = new THREE.PointLight(0xe879f9,1.2,40); b.position.set(-7,-3,6); scene.add(b);

      const grp = new THREE.Group(); scene.add(grp);
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.6,0.45,160,24),
        new THREE.MeshStandardMaterial({color:0x7c3aed, metalness:.85, roughness:.2, emissive:0x2e1065, emissiveIntensity:.55})
      ); grp.add(knot);

      const wire = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.86,0.5,160,24),
        new THREE.MeshBasicMaterial({color:0x22d3ee, wireframe:true, transparent:true, opacity:.16})
      ); grp.add(wire);

      const symbols = ['<>','{}','=>','()[]','λ','#!'];
      symbols.forEach((s,i)=>{
        const c = document.createElement('canvas'); c.width = 256; c.height = 256;
        const ctx = c.getContext('2d');
        ctx.fillStyle = ['#22d3ee','#e879f9','#fbbf24','#22c55e','#a78bfa','#f472b6'][i];
        ctx.font='bold 160px JetBrains Mono, monospace';
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(s, 128, 138);
        const tex = new THREE.CanvasTexture(c);
        const mat = new THREE.MeshBasicMaterial({map:tex, transparent:true});
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.3), mat);
        const ang = (i/symbols.length)*Math.PI*2;
        m.position.set(Math.cos(ang)*3.4, Math.sin(ang)*1.8, Math.sin(ang*1.7)*0.6);
        m.userData = {ang, vy:0.3+Math.random()*0.2};
        grp.add(m);
      });

      const N = innerWidth<768?300:750;
      const positions = new Float32Array(N*3);
      for (let i=0;i<N;i++){
        const rr = 6+Math.random()*14;
        const th = Math.random()*Math.PI*2;
        const ph = Math.acos(2*Math.random()-1);
        positions[i*3]=rr*Math.sin(ph)*Math.cos(th);
        positions[i*3+1]=rr*Math.sin(ph)*Math.sin(th);
        positions[i*3+2]=rr*Math.cos(ph);
      }
      const sg = new THREE.BufferGeometry();
      sg.setAttribute('position', new THREE.BufferAttribute(positions,3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({color:0xa5c8ff,size:0.045,transparent:true,opacity:.85,blending:THREE.AdditiveBlending,depthWrite:false})));

      let mx=0, my=0, tx=0, ty=0;
      addEventListener('pointermove', e=>{mx=(e.clientX/innerWidth-.5)*2; my=(e.clientY/innerHeight-.5)*2}, {passive:true});
      addEventListener('resize', ()=>{cam.aspect=innerWidth/innerHeight; cam.updateProjectionMatrix(); r.setSize(innerWidth,innerHeight)});

      const clock = new THREE.Clock();
      (function tick(){
        requestAnimationFrame(tick);
        const dt = clock.getDelta();
        knot.rotation.x += dt*0.22; knot.rotation.y += dt*0.16;
        wire.rotation.x -= dt*0.12; wire.rotation.y -= dt*0.09;
        grp.children.forEach((m,i)=>{
          if (i<2) return;
          m.position.x = Math.cos((m.userData.ang)+clock.elapsedTime*m.userData.vy)*3.4;
          m.position.y = Math.sin((m.userData.ang)+clock.elapsedTime*m.userData.vy)*1.8;
        });
        tx += (mx-tx)*.05; ty += (my-ty)*.05;
        grp.rotation.y = tx*0.4; grp.rotation.x = ty*0.2;
        r.render(scene, cam);
      })();
    } catch(_) { /* fallback aurora is already in CSS */ }
  }
})();
