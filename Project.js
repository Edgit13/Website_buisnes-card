// Lightweight cursor, card tilt and particle canvas + ripple on buttons
(function(){
  // Check if the window object exists and if reduced motion is preferred
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

    window.addEventListener('focus', () => {
      dot.style.opacity = 1;
      outline.style.opacity = 1;
    });
  }

  // --- Button ripple ---
  document.addEventListener('click', e => {
    const btn = e.target.closest('.download-btn, .header-content a');
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
    // Ефект скролінгу для хедеру
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Зміна класу, коли прокрутка перевищує 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Текст для анімації
    const fullText = "Про'єкт \"Еволюція лабораторного обладнання\" працював над сайтом Eduard, робота над про'єктом 4 дні";
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

    // Приховати оверлей після 3 секунд, потім запустити анімацію тексту
    setTimeout(() => {
        document.body.classList.add('loaded');
        typeWriter(); // Запускаємо анімацію після зникнення завантажувального екрану
    }, 3000); // Затримка 3 секунди

    // Language translations (якщо потрібно)
    const translations = {
        uk: {
            intro: "Коротка візитка сайту — натисніть 'Open Project' щоб перейти до демонстрації.",
            share: "Поділитися",
            contact: "Контакти"
        },
        en: {
            intro: "Brief site card - click 'Open Project' to go to the demonstration.",
            share: "Share",
            contact: "Contact"
        }
    };

    // Quick actions (якщо потрібно)
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            switch(action) {
                case 'share':
                    if (navigator.share) {
                        navigator.share({
                            title: 'Eduard Koch - Project',
                            url: window.location.href
                        });
                    }
                    break;
                case 'contact':
                    const tel = document.querySelector('.contact-phone')?.href;
                    if (tel) window.location.href = tel;
                    break;
            }
        });
    });

    // openLocalPptx function (якщо потрібно)
    function openLocalPptx(filename) {
        if (location.protocol === 'file:') {
            const folderUrl = location.href.replace(/[^\/\\]+$/, '');
            const fileUrl = folderUrl + encodeURIComponent(filename);
            window.location.href = fileUrl;
            return;
        }

        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            window.open(encodeURI(filename), '_blank');
            return;
        }

        try {
            const pageUrl = (location.origin && location.origin !== 'null') ? location.origin + '/' + encodeURIComponent(filename) : encodeURIComponent(filename);
            const msProtocol = 'ms-powerpoint:ofe|u|' + pageUrl;
            const a = document.createElement('a');
            a.href = msProtocol;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => window.open(encodeURI(filename), '_blank'), 600);
        } catch (e) {
            window.open(encodeURI(filename), '_blank');
        }
    }
});