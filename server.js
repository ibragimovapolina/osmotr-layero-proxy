import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Твой правильный URL веб-приложения Google Apps Script
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzWLCPKI12R4Xi4pujuiOByL_SOyFTZ5u03KnuWz5LI7vyFBB31y9XBDBx6JOIPbPZg/exec';

// Разрешаем CORS для всех (наш фронтенд на GitHub Pages)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Для POST-запросов (отправка фото и данных осмотра)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post('/', async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Для GET-запросов (чтение справочников, проверка API)
app.get('/', async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const response = await fetch(`${GAS_URL}?${query}`);
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});
