// Google Sheets Published CSV Export URL
let SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT2KtLtV0ceFilKzYMSnmGvxhJmG5IOsGyPYpMFfRiRXTtMnyiGMzE6Ssk5kbAj05VZ6cxKlBtOrgJu/pub?gid=0&single=true&output=csv';

// Category Real Photo Repositories
const categoryPhotos = {
    'espejos': [
        'images/espejos/espejo1.jpg.jpeg',
        'images/espejos/espejo2.jpg.jpeg',
        'images/espejos/espejo3.jpg.jpeg',
        'images/espejos/espejo4.jpg.jpeg',
        'images/espejos/espejo5.jpg.jpeg'
    ],
    'llaveros': [
        'images/llaveros/llavero1.jpeg',
        'images/llaveros/llavero2.jpeg'
    ],
    'cabina': [
        'images/cabina/cabina1.jpeg'
    ],
    'shots': [
        'images/shots/shots1.jpeg'
    ],
    'telefono': [
        'images/telefono/telefono1.jpeg',
        'images/telefono/telefono2.jpeg'
    ]
};

let currentCategoryList = [];
let currentPhotoIndex = 0;
let currentCategoryTitle = '';

// Customer Reviews Carousel Logic
let currentReviewIndex = 0;
let reviewInterval = null;

function showReview(index) {
    const reviewCards = document.querySelectorAll('.review-card');
    const dots = document.querySelectorAll('.review-dots .dot');

    if (reviewCards.length === 0) return;

    reviewCards.forEach((card, i) => {
        card.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });

    currentReviewIndex = (index + reviewCards.length) % reviewCards.length;
    reviewCards[currentReviewIndex].classList.add('active');
    if (dots[currentReviewIndex]) dots[currentReviewIndex].classList.add('active');
}

function nextReview() {
    showReview(currentReviewIndex + 1);
}

function setReviewIndex(index) {
    showReview(index);
    resetReviewTimer();
}

function startReviewTimer() {
    if (!reviewInterval) {
        reviewInterval = setInterval(nextReview, 4000);
    }
}

function resetReviewTimer() {
    if (reviewInterval) {
        clearInterval(reviewInterval);
        reviewInterval = setInterval(nextReview, 4000);
    }
}

// Switch Main Nav Tabs Horizontal (Servicios | Promos | Casos de Éxito)
function switchMainTab(tabName) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    if (tabName === 'services') {
        navButtons[0].classList.add('active');
        document.getElementById('servicesSection').classList.add('active');
    } else if (tabName === 'promos') {
        navButtons[1].classList.add('active');
        document.getElementById('promosSection').classList.add('active');
    } else if (tabName === 'gallery') {
        navButtons[2].classList.add('active');
        document.getElementById('gallerySection').classList.add('active');
    }
}

// Service & Promo Modal Functions
function openServiceModal(title, description) {
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalWaBtn1 = document.getElementById('modalWaBtn1');
    const modalWaBtn2 = document.getElementById('modalWaBtn2');

    modalTitle.textContent = title;
    modalDesc.textContent = description;

    const encodedMessage = encodeURIComponent(`Hola SM PHOTOROOM, me interesa cotizar la siguiente opción/promoción: ${title}`);
    modalWaBtn1.href = `https://wa.me/528446086267?text=${encodedMessage}`;
    modalWaBtn2.href = `https://wa.me/528441790939?text=${encodedMessage}`;

    modal.style.display = 'flex';
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    modal.style.display = 'none';
}

// Photo Carousel Functions (Casos de Éxito)
function openCategoryCarousel(categoryKey, title, description) {
    const modal = document.getElementById('photoLightboxModal');
    const photoModalTitle = document.getElementById('photoModalTitle');
    const photoModalDesc = document.getElementById('photoModalDesc');
    const photoModalWaBtn1 = document.getElementById('photoModalWaBtn1');
    const photoModalWaBtn2 = document.getElementById('photoModalWaBtn2');

    photoModalTitle.textContent = title;
    photoModalDesc.textContent = description;
    currentCategoryTitle = title;

    currentCategoryList = categoryPhotos[categoryKey] || [];
    currentPhotoIndex = 0;

    updateCarouselView();

    const encodedMessage = encodeURIComponent(`Hola SM PHOTOROOM, vi su caso de éxito de "${title}" en la app y me gustaría cotizar un servicio similar.`);
    photoModalWaBtn1.href = `https://wa.me/528446086267?text=${encodedMessage}`;
    photoModalWaBtn2.href = `https://wa.me/528441790939?text=${encodedMessage}`;

    modal.style.display = 'flex';
}

function updateCarouselView() {
    const lightboxImage = document.getElementById('lightboxImage');
    const photoCounter = document.getElementById('photoCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (currentCategoryList.length > 0) {
        lightboxImage.src = currentCategoryList[currentPhotoIndex];
        photoCounter.textContent = `Foto ${currentPhotoIndex + 1} de ${currentCategoryList.length}`;
    }

    if (currentCategoryList.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
}

function nextPhoto() {
    if (currentCategoryList.length > 0) {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentCategoryList.length;
        updateCarouselView();
    }
}

function prevPhoto() {
    if (currentCategoryList.length > 0) {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentCategoryList.length) % currentCategoryList.length;
        updateCarouselView();
    }
}

function closePhotoLightbox() {
    const modal = document.getElementById('photoLightboxModal');
    modal.style.display = 'none';
}

// Load Promos Dynamically from Google Sheets CSV
async function loadPromosFromSheets() {
    if (!SHEET_CSV_URL) return;

    try {
        const response = await fetch(SHEET_CSV_URL);
        const csvText = await response.text();
        const rows = parseCSV(csvText);

        if (rows.length < 2) return;

        const promosGrid = document.getElementById('promosGrid');
        let html = '';

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const [id, titulo, precio, precioNormal, ahorro, duracion, detalles, activo, esDestacado] = row;

            if (activo && activo.trim().toUpperCase() === 'SI') {
                const isHighlight = esDestacado && esDestacado.trim().toUpperCase() === 'SI';
                const cardClass = isHighlight ? 'promo-card highlight-card' : 'promo-card';
                const badgeClass = isHighlight ? 'promo-badge plus' : 'promo-badge basic';
                const priceClass = isHighlight ? 'promo-price purple' : 'promo-price';
                const btnClass = isHighlight ? 'promo-btn plus-btn' : 'promo-btn';

                const detailsList = detalles ? detalles.split(';').map(d => `<li>• ${d.trim()}</li>`).join('') : '';

                html += `
                    <div class="${cardClass}" onclick="openServiceModal('${titulo} - ${precio}', '${detalles}')">
                        ${ahorro ? `<div class="savings-tag">${ahorro}</div>` : ''}
                        <div class="${badgeClass}">${titulo}</div>
                        <div class="${priceClass}">${precio}</div>
                        ${precioNormal ? `<div class="old-price">Precio normal: ${precioNormal}</div>` : ''}
                        ${duracion ? `<div class="promo-duration">${duracion}</div>` : ''}
                        <ul class="promo-details">${detailsList}</ul>
                        <button class="${btnClass}">Cotizar Promo</button>
                    </div>
                `;
            }
        }

        if (html.trim()) {
            promosGrid.innerHTML = html;
        }
    } catch (e) {
        console.log("Carga de Google Sheets no configurada o sin conexión, usando respaldo por defecto.");
    }
}

// Robust CSV Parser handling quotes and commas
function parseCSV(text) {
    const lines = text.split(/\r?\n/);
    return lines.filter(line => line.trim().length > 0).map(line => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
                inQuotes = !inQuotes;
            } else if (c === ',' && !inQuotes) {
                result.push(cur.trim().replace(/^"|"$/g, ''));
                cur = '';
            } else {
                cur += c;
            }
        }
        result.push(cur.trim().replace(/^"|"$/g, ''));
        return result;
    });
}

// Close modals when clicking outside content
window.onclick = function(event) {
    const serviceModal = document.getElementById('serviceModal');
    const photoLightboxModal = document.getElementById('photoLightboxModal');

    if (event.target === serviceModal) {
        serviceModal.style.display = 'none';
    }
    if (event.target === photoLightboxModal) {
        photoLightboxModal.style.display = 'none';
    }
};

// Initialization on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    startReviewTimer();
    loadPromosFromSheets();
});
