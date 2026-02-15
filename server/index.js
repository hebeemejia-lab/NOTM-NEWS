// NOTM NEWS Backend - Express server

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const newsService = require('./newsService');
const app = express();
const PORT = process.env.PORT || 3001;

// Habilitar CORS para todas las rutas
app.use(cors());

// Ruta para obtener noticias
app.get('/news', async (req, res) => {
  try {
    const news = await newsService.getNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener noticias.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
