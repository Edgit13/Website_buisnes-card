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

    // Show on window focus
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
    
    // Remove ripple element after animation
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

// --- Функції, що запускаються після завантаження сторінки та ЛОГІКА ПРОЄКТІВ ---
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Сортуємо проєкти за датою (від новіших до старіших)
    // Перевіряємо, чи існує projectFiles (з файлу projectsData.js)
    if (typeof projectFiles === 'undefined' || projectFiles.length === 0) {
        console.error("Помилка: Не знайдено даних про проєкти. Перевірте projectsData.js");
        return;
    }

    const sortedProjects = [...projectFiles].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const latestProject = sortedProjects[0]; // Найновіший проєкт

    // --- ДОДАНО: Перевірка адмін-посилання ---
    const ADMIN_LINK_KEY = 'admin_pptx_link';
    const adminLink = localStorage.getItem(ADMIN_LINK_KEY);
    if (adminLink) {
        latestProject.onlineLink = adminLink; // Перезаписуємо онлайн-посилання, якщо адміністратор його оновив
    }

    // 2. ВІДОБРАЖЕННЯ НАЙНОВІШОГО ПРОЄКТУ
    
    // a) Завантажити файл
    const downloadArea = document.getElementById('latest-project-download-area');
    if (downloadArea) {
        document.getElementById('latest-project-title').textContent = latestProject.title;
        const downloadLink = document.createElement('a');
        downloadLink.href = latestProject.filename;
        downloadLink.download = latestProject.filename;
        downloadLink.className = 'download-btn';
        downloadLink.textContent = 'Завантажити зараз';
        downloadArea.appendChild(downloadLink);
    }
    
    // b) Онлайн-посилання (якщо є)
    const onlineArea = document.getElementById('latest-project-online-area');
    if (onlineArea && latestProject.onlineLink) {
        document.getElementById('latest-project-online-title').textContent = latestProject.title;
        const onlineLink = document.createElement('a');
        onlineLink.href = latestProject.onlineLink;
        onlineLink.target = '_blank';
        onlineLink.rel = 'noopener';
        onlineLink.className = 'download-btn';
        onlineLink.textContent = 'У Локальному';
        onlineArea.appendChild(onlineLink);
    } else if (onlineArea) {
        // Якщо онлайн-посилання немає, приховуємо цей блок
        onlineArea.style.display = 'none';
    }


    // 3. ВІДОБРАЖЕННЯ ПРОЄКТІВ У ТАБЛИЦІ
    const tableBody = document.getElementById('project-table-body');
    if (tableBody) {
        sortedProjects.forEach(project => {
            const row = tableBody.insertRow();

            // Назва проєкту (додаємо позначку "Поточний")
            const titleCell = row.insertCell();
            titleCell.textContent = project.title;
            if (project === latestProject) {
                titleCell.innerHTML += ' <span style="font-size: 0.8em; color: var(--accent);"> (Поточний)</span>';
            }

            // Автор
            row.insertCell().textContent = project.author;

            // Дата
            row.insertCell().textContent = project.date.split('-').reverse().join('.'); // Формат ДД.ММ.РРРР

            // Посилання на файл
            const fileCell = row.insertCell();
            const fileLink = document.createElement('a');
            fileLink.href = project.filename;
            fileLink.download = project.filename;
            fileLink.textContent = 'Завантажити';
            // Використовуємо .download-btn-small для стилю
            fileLink.className = 'download-btn'; 
            fileLink.style.padding = '5px 10px';
            fileLink.style.fontSize = '0.9em';
            fileCell.appendChild(fileLink);
        });
    }


    // 4. Оновлення Typewriter Text
    // --- ПОМИЛКА: ЗАЙВЕ ВИЗНАЧЕННЯ АДМІН-КЛЮЧА ---
    // const ADMIN_TEXT_KEY = 'admin_index_text'; // Цей ключ визначений нижче
    
    // Новий текст береться з адміністративного налаштування або використовується стандартний
    const ADMIN_TEXT_KEY = 'admin_index_text';
    const defaultText = `Проєкт "${latestProject.title}" працював над сайтом Eduard. Дата завершення: ${latestProject.date.split('-').reverse().join('.')}.`;
    // Використовуємо Admin-текст, якщо він був встановлений на Admin.html, інакше генеруємо текст з поточного проєкту.
    const fullText = localStorage.getItem(ADMIN_TEXT_KEY) || defaultText;
    
    // --- ВИПРАВЛЕННЯ: Елементи анімації друкарської машинки ПОВИННІ БУТИ ВИЗНАЧЕНІ ТУТ ---
    const typewriterElement = document.getElementById("typewriter-text");
    const typewriterCursor = document.querySelector(".typewriter-cursor");
    // ---------------------------------------------------------------------------------
    
    let i = 0;

    function typeWriter() {
        if (i < fullText.length) {
            // Перевірка, чи елементи були знайдені (на випадок, якщо їх немає на сторінці)
            if (typewriterElement) {
                typewriterElement.innerHTML += fullText.charAt(i);
            }
            i++;
            setTimeout(typeWriter, 50); // Швидкість друку
        } else {
            if (typewriterCursor) {
                typewriterCursor.style.animation = 'none'; // Зупиняє блимання курсора після завершення
                typewriterCursor.style.opacity = '1';
            }
        }
    }

    // 5. Ефект скролінгу для хедеру
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Зміна класу, коли прокрутка перевищує 50px
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 6. Приховати оверлей після 3 секунд, потім запустити анімацію тексту
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        setTimeout(() => {
            document.body.classList.add('loaded');
            typeWriter(); // Запускаємо анімацію після зникнення завантажувального екрану
        }, 3000); // Затримка 3 секунди
    } else {
         typeWriter(); 
    }
});