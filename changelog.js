(function(){
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Custom Cursor ---
  if (!('ontouchstart' in window) && !prefersReduced) {
    const dot = document.createElement('div');
    const outline = document.createElement('div');
    dot.className = 'cursor-dot';
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);
    
    let mx = 0, my = 0, lx = 0, ly = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    });
    function animateCursor() {
      lx += (mx - lx) * 0.18;
      ly += (my - ly) * 0.18;
      outline.style.transform = `translate(${lx}px,${ly}px)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
    window.addEventListener('blur', () => {
      dot.style.opacity = 0;
      outline.style.opacity = 0;
    });
    window.addEventListener('focus', () => {
      dot.style.opacity = 1;
      outline.style.opacity = 1;
    });
  }

  // --- Button ripple ---
  document.addEventListener('click', e => {
    const btn = e.target.closest('.home-button, .header-content a');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top = (e.clientY - r.top) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
  
  // --- Particle canvas (very light) ---
  if (!prefersReduced) {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    window.addEventListener('resize', resize); resize();
    function createParticles(n=35){
      particles = [];
      for(let i=0;i<n;i++){
        particles.push({
          x: Math.random()*W, y: Math.random()*H, r: 1+Math.random()*3,
          vx: (Math.random()-0.5)*0.2, vy: -0.2 - Math.random()*0.6, a: 0.05 + Math.random()*0.6
        });
      }
    }
    createParticles(45);
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(const p of particles){
        p.x += p.vx; p.y += p.vy; p.a -= 0.002;
        if (p.y < -20 || p.a <= 0){ p.x = Math.random()*W; p.y = H + 20; p.a = 0.4 + Math.random()*0.8; p.vy = -0.2 - Math.random()*0.6; }
        ctx.beginPath();
        ctx.fillStyle = `rgba(96,165,250,${Math.max(0, p.a)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
})();

document.addEventListener("DOMContentLoaded", function() {
    // Ефект скролінгу для хедеру
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Приховати оверлей
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});