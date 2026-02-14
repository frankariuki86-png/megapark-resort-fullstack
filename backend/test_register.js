(async () => {
  try {
    const base = 'http://localhost:3000';
    const email = `auto+${Date.now()}@local`;
    const password = 'Secret123';

    const registerResp = await fetch(`${base}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName: 'Auto', lastName: 'Test' })
    });
    const registerBody = await registerResp.text();
    console.log('REGISTER STATUS', registerResp.status);
    console.log('REGISTER BODY', registerBody);

    // Attempt login
    const loginResp = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const loginBody = await loginResp.text();
    console.log('LOGIN STATUS', loginResp.status);
    console.log('LOGIN BODY', loginBody);

  } catch (e) {
    console.error('ERROR', e);
  }
})();
