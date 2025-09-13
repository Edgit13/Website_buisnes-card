// Show header only while initial animations run, then reveal main content.
(function () {
    // mark loading state immediately
    document.documentElement.classList.add('is-loading');

    function finishLoading() {
        if (!document.documentElement.classList.contains('is-loading')) return;
        document.documentElement.classList.remove('is-loading');
    }

    // Remove loading state after the first meaningful animation on .card finishes,
    // fallback to timeout in case animationend doesn't fire.
    document.addEventListener('DOMContentLoaded', () => {
        const card = document.querySelector('.card');
        if (card) {
            card.addEventListener('animationend', finishLoading, { once: true });
        }
        // Safety fallback: reveal after 1500ms
        setTimeout(finishLoading, 1500);
    });
})();

// Language translations
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

// Theme toggling
const themeToggle = document.querySelector('.theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.documentElement.setAttribute('data-theme',
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
  );
  localStorage.setItem('theme', document.documentElement.getAttribute('data-theme'));
});

// Language switching
const langButtons = document.querySelectorAll('.lang-selector button');
langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    document.documentElement.setAttribute('lang', lang);
    langButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateTranslations(lang);
    localStorage.setItem('lang', lang);
  });
});

function updateTranslations(lang) {
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.dataset.translate;
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Quick actions
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

// Load saved preferences
document.addEventListener('DOMContentLoaded', () => {
  // Load theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Load language
  const savedLang = localStorage.getItem('lang') || 'uk';
  document.documentElement.setAttribute('lang', savedLang);
  document.querySelector(`[data-lang="${savedLang}"]`)?.classList.add('active');
  updateTranslations(savedLang);
});
