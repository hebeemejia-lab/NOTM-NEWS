# NOTM NEWS

Aplicación web para mostrar titulares y artículos de noticias usando la API de GNews.

## Estructura del proyecto
- `server/`: Backend Node.js con Express
- `client/`: Frontend HTML/CSS/JS simple

## Instalación y ejecución

### Backend
1. Ve a la carpeta `server`:
   ```bash
   cd server
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` y coloca tu API key de GNews:
   ```env
   GNEWS_API_KEY=TU_API_KEY_AQUI
   PORT=3001
   ```
4. Inicia el servidor:
   ```bash
   npm start
   ```

### Frontend
1. Abre el archivo `client/index.html` en tu navegador.

## Notas
- El backend expone `/news` para obtener las noticias.
- El frontend consume este endpoint y muestra las noticias en tarjetas.
- El diseño es responsivo y limpio.

## Buenas prácticas
- Código modular y comentado.
- Lógica de API separada en `newsService.js`.
- Variables sensibles en `.env`.

---

Hecho con ❤️ para NOTM.
