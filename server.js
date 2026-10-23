import express from 'express';

const app = express();
const PORT = process.env.PORT || 80;

// ВАШ ID Google Apps Script
const GAS_URL = 'https://script.google.com/u/0/home/projects/167xwC4wblR9V5QK8syWS4E2VqnN5Y4xRlb_NesKSOJt-vR6P9FTdMHn3/edit';

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
app.use(express.json({ limit: '50mb' })); // Увеличиваем лимит, чтобы проходили фото
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
