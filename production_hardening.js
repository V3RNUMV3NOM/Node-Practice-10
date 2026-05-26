const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    // Додаємо security headers для всіх відповідей
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    
    // Додаємо CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        // Обробка OPTIONS запиту для CORS (Preflight)
        if (req.method === 'OPTIONS' && req.url === '/health') {
            res.writeHead(204);
            res.end();
            return;
        }

        // Обробка GET /health
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ "ok": true }));
            return;
        }

        // Обробка GET /boom з симуляцією помилки
        if (req.method === 'GET' && req.url === '/boom') {
            throw new Error('Simulated Internal Error');
        }

        // Якщо роут не знайдено
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');

    } catch (error) {
        // Відловлюємо помилку, щоб сервер продовжував жити
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
});

server.listen(port, () => {
    console.log(`Hardened server is running on port ${port}`);
});