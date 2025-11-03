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
    if (typeof projectFiles === 'undefined' || projectFiles.length === 0) {
        console.error("Помилка: Не знайдено даних про проєкти. Перевірте projectsData.js");
        return;
    }

    const sortedProjects = [...projectFiles].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const latestProject = sortedProjects[0];

    // --- Перевірка адмін-посилання ---
    const ADMIN_LINK_KEY = 'admin_pptx_link';
    const adminLink = localStorage.getItem(ADMIN_LINK_KEY);
    if (adminLink) {
        latestProject.onlineLink = adminLink;
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
            row.insertCell().textContent = project.date.split('-').reverse().join('.');

            // Посилання на файл
            const fileCell = row.insertCell();
            const fileLink = document.createElement('a');
            fileLink.href = project.filename;
            fileLink.download = project.filename;
            fileLink.textContent = 'Завантажити';
            fileLink.className = 'download-btn'; 
            fileLink.style.padding = '5px 10px';
            fileLink.style.fontSize = '0.9em';
            fileCell.appendChild(fileLink);
        });
    }

    const ADMIN_TEXT_KEY = 'admin_index_text';
    const defaultText = `Проєкт "${latestProject.title}" працював над сайтом Eduard. Дата завершення: ${latestProject.date.split('-').reverse().join('.')}.`;
    const fullText = localStorage.getItem(ADMIN_TEXT_KEY) || defaultText;
    
    const typewriterElement = document.getElementById("typewriter-text");
    const typewriterCursor = document.querySelector(".typewriter-cursor");
    
    let i = 0;

    function typeWriter() {
        if (i < fullText.length) {
            if (typewriterElement) {
                typewriterElement.innerHTML += fullText.charAt(i);
            }
            i++;
            setTimeout(typeWriter, 50);
        } else {
            if (typewriterCursor) {
                typewriterCursor.style.animation = 'none';
                typewriterCursor.style.opacity = '1';
            }
        }
    }

    // 5. Ефект скролінгу для хедеру
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
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
            typeWriter();
        }, 3000);
    } else {
         typeWriter(); 
    }

    // --- СЕКРЕТНА АДМІНКА ---
    let keySequence = [];
    const secretCode = '1337';
    
    document.addEventListener('keydown', (e) => {
        keySequence.push(e.key);
        
        if (keySequence.length > 4) {
            keySequence.shift();
        }
        
        if (keySequence.join('') === secretCode) {
            openAdminPanel();
            keySequence = [];
        }
        
        // Альтернативні комбінації
        if ((e.ctrlKey && e.shiftKey && e.key === 'A') || (e.ctrlKey && e.altKey && e.key === 'A')) {
            e.preventDefault();
            openAdminPanel();
        }
    });

    function openAdminPanel() {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-overlay">
                <div class="admin-content">
                    <div class="admin-header">
                        <h2>🔐 Адмін Панель</h2>
                        <button class="admin-close">&times;</button>
                    </div>
                    <div class="admin-body">
                        <div class="admin-section">
                            <h3>Швидкі дії</h3>
                            <button class="admin-btn" onclick="location.href='index.html'">🏠 Головна</button>
                            <button class="admin-btn" onclick="location.href='ChangeLog.html'">📋 Чейнджлог</button>
                            <button class="admin-btn" onclick="location.href='Support.html'">🛟 Support</button>
                            <button class="admin-btn" onclick="location.href='Admin.html'">⚙️ Admin Tools</button>
                        </div>
                        <div class="admin-section">
                            <h3>Інформація про проєкт</h3>
                            <p><strong>Сторінка:</strong> Project</p>
                            <p><strong>Кількість проєктів:</strong> ${sortedProjects.length}</p>
                            <p><strong>Останнє оновлення:</strong> ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="admin-section">
                            <h3>Інструменти</h3>
                            <button class="admin-btn" onclick="exportProjects()">📤 Експорт проєктів</button>
                            <button class="admin-btn danger" onclick="clearLocalStorage()">🧹 Очистити кеш</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminPanel);
        
        adminPanel.querySelector('.admin-close').addEventListener('click', () => {
            document.body.removeChild(adminPanel);
        });
        
        adminPanel.querySelector('.admin-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                document.body.removeChild(adminPanel);
            }
        });
    }

    // Функція для експорту проєктів
    window.exportProjects = function() {
        const dataStr = JSON.stringify(sortedProjects, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'projects_export.json';
        link.click();
        
        alert('Проєкти експортовано у JSON файл!');
    };

    window.clearLocalStorage = function() {
        localStorage.clear();
        alert('Кеш очищено!');
        location.reload();
    };
});

// Додаємо стилі для адмін панелі
const adminStyles = `
    #admin-panel {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
    }
    
    .admin-overlay {
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(10px);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: adminFadeIn 0.3s ease;
    }
    
    @keyframes adminFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .admin-content {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1px solid rgba(96, 165, 250, 0.3);
        border-radius: 15px;
        padding: 0;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        animation: adminSlideIn 0.3s ease;
    }
    
    @keyframes adminSlideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .admin-header {
        background: rgba(96, 165, 250, 0.1);
        padding: 20px;
        border-bottom: 1px solid rgba(96, 165, 250, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .admin-header h2 {
        margin: 0;
        color: #60a5fa;
        font-size: 1.5em;
    }
    
    .admin-close {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .admin-close:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #ef4444;
    }
    
    .admin-body {
        padding: 20px;
    }
    
    .admin-section {
        margin-bottom: 25px;
    }
    
    .admin-section h3 {
        color: #5eead4;
        margin-bottom: 15px;
        font-size: 1.1em;
        border-bottom: 1px solid rgba(94, 234, 212, 0.3);
        padding-bottom: 5px;
    }
    
    .admin-btn {
        background: rgba(96, 165, 250, 0.1);
        border: 1px solid rgba(96, 165, 250, 0.3);
        color: #e6eef8;
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        margin: 5px;
        transition: all 0.3s ease;
        font-size: 0.9em;
        display: inline-block;
    }
    
    .admin-btn:hover {
        background: rgba(96, 165, 250, 0.2);
        border-color: #60a5fa;
        transform: translateY(-2px);
    }
    
    .admin-btn.danger {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
    }
    
    .admin-btn.danger:hover {
        background: rgba(239, 68, 68, 0.2);
        border-color: #ef4444;
    }
    
    .admin-section p {
        color: #94a3b8;
        margin: 8px 0;
        font-size: 0.9em;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = adminStyles;
document.head.appendChild(styleSheet);