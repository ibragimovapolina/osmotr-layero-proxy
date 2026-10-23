import http from 'http';

// ВАШ ID Google Apps Script
const GAS_URL = 'https://script.google.com/u/0/home/projects/167xwC4wblR9V5QK8syWS4E2VqnN5Y4xRlb_NesKSOJt-vR6P9FTdMHn3/edit';

const server = http.createServer(async (req, res) => {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    let body = '';
    if (req.method === 'POST') {
      // Собираем тело POST-запроса
      for await (const chunk of req) {
        body += chunk;
      }
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    let targetUrl = GAS_URL;
    
    if (req.method === 'GET') {
      targetUrl = GAS_URL + url.search;
    }

    const options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (req.method === 'POST') options.body = body;

    const gasRes = await fetch(targetUrl, options);
    const data = await gasRes.text();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
});

const PORT = process.env.PORT || 80;
server.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port ' + PORT);
});
