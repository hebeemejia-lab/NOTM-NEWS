// NOTM NEWS - Frontend simple
async function fetchNews() {
  try {
    const res = await fetch('https://notm-news.onrender.com/news');
    const news = await res.json();
    renderNews(news);
  } catch (err) {
    document.getElementById('news-list').innerHTML = '<p>Error al cargar noticias.</p>';
  }
}

function renderNews(news) {
  const list = document.getElementById('news-list');
  list.innerHTML = '';
    news.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card' + (item.destacada ? ' featured' : '');
      card.innerHTML = `
        ${item.imagen ? `<img src="${item.imagen}" alt="Portada" class="cover">` : ''}
        <h2>${item.titulo}</h2>
        <div class="source">${item.fuente}${item.destacada ? ' <span class="star">★ Destacada</span>' : ''}</div>
        <p>${item.descripcion || ''}</p>
        <a href="${item.enlace}" target="_blank">Leer más</a>
      `;
      list.appendChild(card);
    });
  }

fetchNews();
