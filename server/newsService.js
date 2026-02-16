const MEDIASTACK_KEY = process.env.MEDIASTACK_KEY || '76e80fd158ce0a6b77994c39bc278431';

async function fetchMediastack({category = 'general', max = 20}) {
  let url = `http://api.mediastack.com/v1/news?access_key=${MEDIASTACK_KEY}&languages=es&limit=${max}`;
  if (category && category !== 'general') {
    url += `&categories=${category}`;
  }
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return (response.data.data || []).map((article, idx) => ({
      titulo: article.title,
      descripcion: article.description,
      fuente: article.source,
      enlace: article.url,
      imagen: article.image || null,
      categoria: category,
      fecha: article.published_at || '',
      destacada: false
    }));
  } catch (error) {
    console.error('[MEDIASTACK ERROR]', error.response ? error.response.data : error);
    return [];
  }
}
const NEWSAPI_KEY = process.env.NEWSAPI_KEY || '3f9d0be220b146f4a7da95a0b807ec4f';

async function fetchNewsAPI({category = 'general', max = 20}) {
  let url = `https://newsapi.org/v2/top-headlines?language=es&pageSize=${max}&apiKey=${NEWSAPI_KEY}`;
  if (category && category !== 'general') {
    url += `&category=${category}`;
  }
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return (response.data.articles || []).map((article, idx) => ({
      titulo: article.title,
      descripcion: article.description,
      fuente: article.source.name,
      enlace: article.url,
      imagen: article.urlToImage || null,
      categoria: category,
      fecha: article.publishedAt || '',
      destacada: false
    }));
  } catch (error) {
    console.error('[NEWSAPI ERROR]', error.response ? error.response.data : error);
    return [];
  }
}
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
    // GNews (solo una página, max 20)
    let gnewsNoticias = [];
    try {
      const url = buildGNewsUrl({category, page: 1, max: Math.min(20, max)});
      console.log(`[GNEWS] Consultando: ${url}`);
      const response = await axios.get(url, { timeout: 5000 });
      const articles = response.data.articles || [];
      gnewsNoticias = articles.map((article, idx) => ({
        titulo: article.title,
        descripcion: article.description,
        fuente: article.source.name,
        enlace: article.url,
        imagen: article.image || null,
        categoria: article.topic || '',
        fecha: article.publishedAt || '',
        destacada: idx < 3 // Las 3 primeras destacadas
      }));
    } catch (error) {
      console.error('[GNEWS ERROR]', error.response ? error.response.data : error);
    }
    // NewsAPI
    const newsapiNoticias = await fetchNewsAPI({category, max: 30});
    // Mediastack
    const mediastackNoticias = await fetchMediastack({category, max: 30});
    // Combinar y limitar (prioridad: NewsAPI, Mediastack, luego GNews)
    let noticias = [...newsapiNoticias, ...mediastackNoticias, ...gnewsNoticias];
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
    return noticias.slice(0, 60);
  } catch (error) {
    console.error('[GNEWS ERROR]', error.response ? error.response.data : error);
    // Fallback: solo NewsAPI
    const newsapiNoticias = await fetchNewsAPI({category, max: Math.min(20, max)});
    if (newsapiNoticias.length > 0) return newsapiNoticias;
    // Fallback: noticias simuladas
    return [
      {
        titulo: 'Noticias simuladas por límite de API',
        descripcion: 'Las APIs han alcanzado su límite. Estas son noticias de ejemplo.',
        fuente: 'Simulado',
        enlace: 'https://notm-news.onrender.com',
        imagen: 'https://via.placeholder.com/600x300?text=Simulado',
        categoria: 'general',
        fecha: new Date().toISOString(),
        destacada: true
      },
      {
        titulo: '¿Cómo obtener más noticias?',
        descripcion: 'Puedes actualizar la página más tarde o usar una API premium.',
        fuente: 'Simulado',
        enlace: 'https://newsapi.org',
        imagen: 'https://via.placeholder.com/600x300?text=API+Limit',
        categoria: 'tecnología',
        fecha: new Date().toISOString(),
        destacada: false
      }
    ];
  }
}

module.exports = { getNews };
