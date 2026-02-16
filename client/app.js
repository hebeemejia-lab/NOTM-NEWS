
// NOTM NEWS - Frontend simple

// Utilidad global para formatear fechas
function formatDate(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha);
  return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
}


let featuredIndex = 0;
let featuredNews = [];
let otherNews = [];
let allNews = [];
let currentCategory = 'general';


// Cambia esta variable según el entorno:
// Para local: 'http://localhost:3001'
// Para producción: 'https://notm-news.onrender.com'
const BASE_API_URL = 'https://notm-news.onrender.com';

async function fetchNews(category = 'general') {
  try {
    let url = BASE_API_URL + '/news';
    if (category && category !== 'general') {
      url += `?category=${category}`;
    }
    const res = await fetch(url);
    const news = await res.json();
    if (!Array.isArray(news)) {
      document.getElementById('news-list').innerHTML = '<p>Error al cargar noticias (respuesta inesperada).</p>';
      console.error('Respuesta inesperada de noticias:', news);
      return;
    }
    allNews = news;
    applyCategoryFilter(category);
    renderFeaturedCarousel();
    renderOtherNews();
    setupCarouselControls();
  } catch (err) {
    document.getElementById('news-list').innerHTML = '<p>Error al cargar noticias.</p>';
    console.error('Error al cargar noticias:', err);
  }
}

function applyCategoryFilter(category) {
  if (!allNews.length || category === 'general') {
    featuredNews = allNews.filter(n => n.destacada);
    otherNews = allNews.filter(n => !n.destacada);
    return;
  }
  featuredNews = allNews.filter(n => n.destacada && matchCategory(n, category));
  otherNews = allNews.filter(n => !n.destacada && matchCategory(n, category));
}

function matchCategory(news, category) {
  if (!news.descripcion && !news.titulo) return false;
  const text = `${news.titulo || ''} ${news.descripcion || ''}`.toLowerCase();
  if (category === 'sports') return /deporte|fútbol|futbol|baloncesto|tenis|liga|partido|juego/.test(text);
  if (category === 'politics') return /política|gobierno|elección|presidente|ministro|congreso|senado/.test(text);
  if (category === 'arts') return /arte|cultura|música|pintura|teatro|cine|literatura|exposición/.test(text);
  if (category === 'health') return /salud|hospital|médico|medico|enfermedad|vacuna|virus|covid|bienestar/.test(text);
  if (category === 'business') return /economía|negocio|empresa|finanzas|mercado|bolsa|dinero|banco|comercio/.test(text);
  if (category === 'science') return /ciencia|investigación|descubrimiento|experimento|científico|cientifica|universo|astronomía/.test(text);
  if (category === 'technology') return /tecnología|tecnologia|software|hardware|internet|app|aplicación|robot|inteligencia artificial|ia|smartphone|dispositivo/.test(text);
  return false;
}

function setupCategoryMenu() {
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      applyCategoryFilter(currentCategory);
      renderFeaturedCarousel();
      renderOtherNews();
    };
  });
}

function renderFeaturedCarousel() {
  const container = document.getElementById('featured-carousel');
  container.innerHTML = '';
  if (featuredNews.length === 0) return;
  const item = featuredNews[featuredIndex % featuredNews.length];
  const card = document.createElement('div');
  card.className = 'card featured big-featured' + (item.esAnuncio ? ' anuncio' : '');
  // Forzar HTTPS en la imagen
  let imagen = item.imagen;
  if (imagen && imagen.startsWith('http://')) {
    imagen = 'https://' + imagen.slice(7);
  }
  card.innerHTML = `
    ${imagen ? `<img src="${imagen}" alt="Portada" class="cover big">` : ''}
    <h2>${item.titulo}</h2>
    <div class="source">Fuente: <strong>${item.fuente}</strong> <span class="star">★ Destacada</span>${item.esAnuncio ? ' <span class="ad-label">Anuncio</span>' : ''}</div>
    <div class="meta-info">
      ${item.categoria ? `<span class="tag" data-category="${item.categoria}">${item.categoria}</span>` : ''}
      ${item.fecha ? `<span class="dh">${formatDate(item.fecha)}</span>` : ''}
    </div>
    <p>${item.descripcion || ''}</p>
    <a href="${item.esAnuncio ? item.enlace : `news.html?id=${encodeURIComponent(item.titulo)}` }" target="${item.esAnuncio ? '_blank' : '_self'}">${item.esAnuncio ? 'Ver producto' : 'Leer más'}</a>
  `;
  container.appendChild(card);
}

function renderOtherNews() {
  const list = document.getElementById('news-list');
  list.innerHTML = '';
  otherNews.forEach(item => {
    let imagen = item.imagen;
    if (imagen && imagen.startsWith('http://')) {
      imagen = 'https://' + imagen.slice(7);
    }
    const card = document.createElement('div');
    card.className = 'card small';
    card.innerHTML = `
      ${imagen ? `<img src="${imagen}" alt="Portada" class="cover small">` : ''}
      <h3>${item.titulo}</h3>
      <div class="source">Fuente: <strong>${item.fuente}</strong></div>
      <div class="meta-info">
        ${item.categoria ? `<span class="tag" data-category="${item.categoria}">${item.categoria}</span>` : ''}
        ${item.fecha ? `<span class="dh">${formatDate(item.fecha)}</span>` : ''}
      </div>
      <a href="${item.esAnuncio ? item.enlace : `news.html?id=${encodeURIComponent(item.titulo)}` }" target="${item.esAnuncio ? '_blank' : '_self'}">${item.esAnuncio ? 'Ver producto' : 'Leer más'}</a>
    `;
    list.appendChild(card);
  });
}

function setupCarouselControls() {
  document.getElementById('prev-featured').onclick = () => {
    featuredIndex = (featuredIndex - 1 + featuredNews.length) % featuredNews.length;
    renderFeaturedCarousel();
  };
  document.getElementById('next-featured').onclick = () => {
    featuredIndex = (featuredIndex + 1) % featuredNews.length;
    renderFeaturedCarousel();
  };
}

fetchNews();
setupCategoryMenu();
