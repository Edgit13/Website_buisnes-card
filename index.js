// Lightweight cursor, card tilt and particle canvas + ripple on buttons
(function(){
  // Check if the window object exists and if reduced motion is preferred
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Custom Cursor --- (Залишаємо ваш код курсора без змін)
  if (!('ontouchstart' in window) && !prefersReduced) {
    const dot = document.createElement('div');
    const outline = document.createElement('div');
    dot.className = 'cursor-dot';
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);
    
    // Initial positions and smooth transition values
    let mx = 0, my = 0, lx = 0, ly = 0;

    // Update dot position immediately on mouse move
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    });

    // Smoothly move the outline with a slight delay
    function animateCursor() {
      lx += (mx - lx) * 0.18;
      ly += (my - ly) * 0.18;
      outline.style.transform = `translate(${lx}px,${ly}px)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
    
    // Hide on window blur
    window.addEventListener('blur', () => {
      dot.style.opacity = 0;
      outline.style.opacity = 0;
    });

    // Show on window focus
    window.addEventListener('focus', () => {
      dot.style.opacity = 1;
      outline.style.opacity = 1;
    });
  }

  // --- Card tilt (Only for index.html) --- (Залишаємо ваш код тілту)
  const card = document.querySelector('.card');
  if (card && !prefersReduced) {
    card.addEventListener('pointermove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotY = (px - 0.5) * 12; // degrees
      const rotX = (0.5 - py) * 10;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.classList.add('is-tilting');
      // parallax sublayers
      const hero = card.querySelector('.hero-effect');
      if (hero) hero.style.transform = `translate3d(${(px-0.5)*18}px, ${(py-0.5)*12}px, 0) rotate(${(px-0.5)*6}deg)`;
    });
    card.addEventListener('pointerleave', ()=>{ card.style.transform=''; card.classList.remove('is-tilting'); const hero = card.querySelector('.hero-effect'); if(hero) hero.style.transform=''; });
  }

  // --- Button ripple --- (Залишаємо ваш код ріпл-ефекту)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.link, .header-content a');
    if (!btn) return;
    
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top = (e.clientY - r.top) + 'px';
    
    btn.appendChild(ripple);
    
    // Remove ripple element after animation
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // --- Particle canvas (very light) --- (Залишаємо ваш код частинок)
  if (!prefersReduced) {
    const canvas = document.querySelector('#bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    window.addEventListener('resize', resize); resize();
    function createParticles(n=45){
      particles = [];
      for(let i=0;i<n;i++){
        particles.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r: 1+Math.random()*3,
          vx: (Math.random()-0.5)*0.2,
          vy: -0.2 - Math.random()*0.6,
          a: 0.05 + Math.random()*0.6
        });
      }
    }
    createParticles(45);
    function draw(){
      ctx.clearRect(0,0,W,H);
      for(const p of particles){
        p.x += p.vx; p.y += p.vy;
        p.a -= 0.002;
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

// --- Функції, що запускаються після завантаження сторінки ---
document.addEventListener("DOMContentLoaded", function() {
    // Ефект скролінгу для хедеру (Залишаємо ваш код)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Зміна класу, коли прокрутка перевищує 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Текст для анімації (Залишаємо ваш код)
    const fullText = "Коротка візитка сайту — натисніть 'Open Project' щоб перейти до демонстрації.";
    const typewriterElement = document.getElementById("typewriter-text");
    const typewriterCursor = document.querySelector(".typewriter-cursor");
    let i = 0;

    function typeWriter() {
        if (i < fullText.length) {
            typewriterElement.innerHTML += fullText.charAt(i);
            i++;
            setTimeout(typeWriter, 50); // Швидкість друку
        } else {
            typewriterCursor.style.animation = 'none'; // Зупиняє блимання курсора після завершення
            typewriterCursor.style.opacity = '1';
        }
    }

    // Приховати оверлей після 3 секунд, потім запустити анімацію тексту (Залишаємо ваш код)
    setTimeout(() => {
        document.body.classList.add('loaded');
        typeWriter(); // Запускаємо анімацію після зникнення завантажувального екрану
    }, 3000); // Затримка 3 секунди
    
    // --- Сполучення клавіш для Адмін-панелі ---
    document.addEventListener('keydown', function(event) {
        // Перевіряємо, чи натиснуті Control (або Command на Mac), Shift та клавіша 'A'
        if (event.ctrlKey && event.shiftKey && event.key === 'A') {
            // Щоб уникнути відкриття системних меню
            event.preventDefault(); 
            
            // Перенаправлення на сторінку адміністратора
            window.location.href = 'Admin.html';
        }
    });
});