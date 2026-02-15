// Servicio para consultar la API de GNews
const axios = require('axios');

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_URL = `https://gnews.io/api/v4/top-headlines?lang=es&token=${GNEWS_API_KEY}`;

async function getNews() {
  try {
    const response = await axios.get(GNEWS_URL);
      // Simulación: destacar las 3 primeras como más leídas/interesantes
      const noticias = response.data.articles.map((article, idx) => ({
        titulo: article.title,
        descripcion: article.description,
        fuente: article.source.name,
        enlace: article.url,
        imagen: article.image || null,
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
    throw new Error('No se pudo obtener noticias de GNews');
  }
}

module.exports = { getNews };
