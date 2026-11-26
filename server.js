import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

const GAS_URL = 'https://script.google.com/macros/s/AKfycbzWLCPKI12R4Xi4pujuiOByL_SOyFTZ5u03KnuWz5LI7vyFBB31y9XBDBx6JOIPbPZg/exec';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Единый обработчик для GET и POST
app.all('/', async (req, res) => {
  try {
    // 1. Собираем параметры из URL
    const queryParams = { ...req.query };
    
    // 2. Собираем тело запроса (если это POST)
    const bodyParams = req.body || {};

    // 3. Отправляем всё в GAS через POST, чтобы Google не потерял параметры при редиректе
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...queryParams, // action, houseId, token (из URL)
        ...bodyParams   // payload (из тела)
      }),
      redirect: 'follow'
    });
    
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});
