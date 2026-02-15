// NOTM NEWS - Frontend simple

let featuredIndex = 0;
let featuredNews = [];
let otherNews = [];

async function fetchNews() {
  try {
    const res = await fetch('https://notm-news.onrender.com/news');
    const news = await res.json();
    featuredNews = news.filter(n => n.destacada);
    otherNews = news.filter(n => !n.destacada);
    renderFeaturedCarousel();
    renderOtherNews();
    setupCarouselControls();
  } catch (err) {
    document.getElementById('news-list').innerHTML = '<p>Error al cargar noticias.</p>';
    console.error('Error al cargar noticias:', err);
  }
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
    <div class="source">${item.fuente} <span class="star">★ Destacada</span>${item.esAnuncio ? ' <span class="ad-label">Anuncio</span>' : ''}</div>
    <p>${item.descripcion || ''}</p>
    <a href="${item.enlace}" target="_blank">${item.esAnuncio ? 'Ver producto' : 'Leer más'}</a>
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
      <div class="source">${item.fuente}</div>
      <a href="${item.enlace}" target="_blank">Leer más</a>
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
