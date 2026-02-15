// Servicio para consultar la API de GNews
const axios = require('axios');

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;

function buildGNewsUrl({category, page = 1, max = 100}) {
  let url = `https://gnews.io/api/v4/top-headlines?lang=es&token=${GNEWS_API_KEY}&max=${max}&page=${page}`;
  if (category && category !== 'general') {
    url += `&topic=${category}`;
  }
  return url;
}

async function getNews({category = 'general', max = 100} = {}) {
  try {
    let allArticles = [];
    let page = 1;
    let keepFetching = true;
    while (keepFetching && allArticles.length < max) {
      const url = buildGNewsUrl({category, page, max: Math.min(100, max - allArticles.length)});
      console.log(`[GNEWS] Consultando: ${url}`);
      const response = await axios.get(url);
      const articles = response.data.articles || [];
      allArticles = allArticles.concat(articles);
      if (!response.data.totalArticles || allArticles.length >= response.data.totalArticles || articles.length === 0) {
        keepFetching = false;
      } else {
        page++;
      }
    }
    // Simulación: destacar las 3 primeras como más leídas/interesantes
    const noticias = allArticles.map((article, idx) => ({
      titulo: article.title,
      descripcion: article.description,
      fuente: article.source.name,
      enlace: article.url,
      imagen: article.image || null,
      categoria: article.topic || '',
      fecha: article.publishedAt || '',
      destacada: idx < 3 // Las 3 primeras destacadas
    }));
    // Producto popular simulado como noticia-anuncio
    noticias.splice(1, 0, {
      titulo: '¡Producto Popular! Oferta especial',
      descripcion: 'Descubre el producto más popular del momento. Haz clic para más información.',
      fuente: 'Anuncio',
      enlace: 'https://www.tu-producto-popular.com',
      imagen: 'https://via.placeholder.com/600x300?text=Producto+Popular',
      destacada: true,
      esAnuncio: true
    });
    return noticias;
  } catch (error) {
    console.error('[GNEWS ERROR]', error.response ? error.response.data : error);
    throw new Error('No se pudo obtener noticias de GNews');
  }
}

module.exports = { getNews };
