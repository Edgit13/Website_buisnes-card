// Admin.js

const INDEX_TEXT_KEY = 'admin_index_text';
const PPTX_LINK_KEY = 'admin_pptx_link';

function showMessage(text) {
    const messageDiv = document.getElementById('admin-message');
    messageDiv.textContent = text;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// 1. Функція для збереження тексту для index.html
function saveIndexText(event) {
    event.preventDefault();
    const input = document.getElementById('index-text-input');
    const newText = input.value.trim();
    if (newText) {
        localStorage.setItem(INDEX_TEXT_KEY, newText);
        showMessage('Текст візитки на Index.html успішно оновлено!');
    } else {
        localStorage.removeItem(INDEX_TEXT_KEY);
        showMessage('Текст візитки скинуто до стандартного.');
    }
}

// 2. Функція для збереження онлайн-посилання для Project.html
function savePptxLink(event) {
    event.preventDefault();
    const input = document.getElementById('pptx-link-input');
    const newLink = input.value.trim();
    if (newLink) {
        localStorage.setItem(PPTX_LINK_KEY, newLink);
        showMessage('Онлайн-посилання на PPTX успішно оновлено!');
    } else {
        localStorage.removeItem(PPTX_LINK_KEY);
        showMessage('Онлайн-посилання на PPTX скинуто.');
    }
}

// Завантаження поточних значень при відкритті Admin-панелі
document.addEventListener("DOMContentLoaded", function() {
    const savedText = localStorage.getItem(INDEX_TEXT_KEY);
    if (savedText) {
        document.getElementById('index-text-input').value = savedText;
    }
    
    const savedLink = localStorage.getItem(PPTX_LINK_KEY);
    if (savedLink) {
        document.getElementById('pptx-link-input').value = savedLink;
    }
    
    // Включаємо курсор та частинки (якщо потрібно, скопіюйте сюди логіку з Project.js)
    // Оскільки ми підключили Project.css, візуальні ефекти будуть працювати.
});