const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', (e) => reject(e));
    req.setTimeout(10000, () => {
      req.destroy(new Error('Request timed out'));
    });
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const email = `probe+${Date.now()}@local`;
    const password = 'Secret123';
    console.log('Registering', email);
    const r1 = await post('/api/auth/register', { email, password, firstName: 'Probe', lastName: 'Test' });
    console.log('REGISTER', r1.status, r1.body);

    console.log('Logging in', email);
    const r2 = await post('/api/auth/login', { email, password });
    console.log('LOGIN', r2.status, r2.body);
  } catch (e) {
    console.error('ERROR', e);
  }
})();
