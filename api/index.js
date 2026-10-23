// api/index.js
export default async function handler(req, res) {
  // Настройка CORS для нашего PWA
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка предварительного запроса (OPTIONS) от браузера
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Твой правильный URL веб-приложения Google Apps Script
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzWLCPKI12R4Xi4pujuiOByL_SOyFTZ5u03KnuWz5LI7vyFBB31y9XBDBx6JOIPbPZg/exec';

  try {
    // Для GET-запросов (чтение данных) передаем параметры из URL
    let targetUrl = GAS_URL;
    if (req.method === 'GET') {
      const query = new URLSearchParams(req.query).toString();
      targetUrl = `${GAS_URL}?${query}`;
    }

    const fetchOptions = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    };

    // Для POST-запросов (запись данных) передаем тело
    if (req.method === 'POST') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Отправляем запрос в Google Apps Script
    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    // Отдаем ответ клиенту
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
