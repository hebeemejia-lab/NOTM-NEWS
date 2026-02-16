// news.js - Renderiza el detalle de la noticia seleccionada

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

async function fetchNewsById(id) {
  // Obtener todas las noticias y buscar por id
  const res = await fetch('https://notm-news.onrender.com/news');
  const news = await res.json();
  return news.find(n => n._id === id || n.id === id || n.titulo === id);
}

function renderNewsDetail(news) {
  const container = document.getElementById('news-detail-content');
  if (!news) {
    container.innerHTML = '<p>No se encontró la noticia.</p>';
    return;
  }
  let imagen = news.imagen;
  if (imagen && imagen.startsWith('http://')) {
    imagen = 'https://' + imagen.slice(7);
  }
  container.innerHTML = `
    <article class="news-detail">
      ${imagen ? `<img src="${imagen}" alt="Portada" style="width:100%;max-width:500px;border-radius:1rem;margin-bottom:1rem;">` : ''}
      <h2>${news.titulo}</h2>
      <div class="source">Fuente: <strong>${news.fuente}</strong></div>
      <div class="meta-info">${news.fecha ? new Date(news.fecha).toLocaleString('es-ES', {dateStyle:'short', timeStyle:'short'}) : ''}</div>
      <p style="margin:1.2rem 0;">${news.descripcion || ''}</p>
      <a href="${news.enlace}" target="_blank" class="btn-go-source">Ir a la noticia original</a>
    </article>
  `;
}

async function main() {
  const id = getQueryParam('id');
  if (!id) {
    document.getElementById('news-detail-content').innerHTML = '<p>No se encontró la noticia.</p>';
    return;
  }
  // Buscar noticia por título (id)
  const news = await fetchNewsById(id);
  renderNewsDetail(news);
}

main();
