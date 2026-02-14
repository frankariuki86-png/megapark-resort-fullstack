const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { LoginSchema } = require('../validators/schemas');
const { generateTokenPair, refreshAccessToken } = require('../middleware/authenticate');

module.exports = ({ logger, pgClient }) => {
  // Fallback mock user (only used when DB is not configured)
  const mockUsers = [
    { id: 'admin-001', email: 'admin@megapark.com', password: 'admin123', name: 'Admin User', role: 'admin' }
  ];

  const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

  // Helper to find user by email. If `pgClient` is provided, query the database,
  // otherwise read from `backend/data/users.json` (if present) and fall back to mockUsers.
  const findUserByEmail = async (email) => {
    const lowerEmail = String(email).toLowerCase();
    if (pgClient) {
      try {
        // Wrap query in timeout to prevent hanging on bad connections
        const queryPromise = pgClient.query('SELECT id, email, password_hash AS "passwordHash", name, role FROM users WHERE email = $1 LIMIT 1', [lowerEmail]);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 3000)
        );
        const res = await Promise.race([queryPromise, timeoutPromise]);
        if (res.rows.length === 0) return null;
        return res.rows[0];
      } catch (dbErr) {
        // Fall through to file/mock fallback (don't log, it's expected)
      }
    }

    try {
      const raw = fs.readFileSync(usersFilePath, 'utf8');
      const users = JSON.parse(raw || '[]');
      const u = users.find(x => String(x.email).toLowerCase() === lowerEmail);
      if (u) {
        return {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash || u.password_hash || null,
          password: u.password || undefined,
          name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim(),
          role: u.role || 'customer'
        };
      }
    } catch (e) {
      // ignore and fallback to mockUsers below
    }

    return mockUsers.find(u => String(u.email).toLowerCase() === lowerEmail) || null;
  };

  router.post('/login', async (req, res) => {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: 'Validation error', details: parsed.error.errors });
      }
      const { email, password } = parsed.data;
      
      const user = await findUserByEmail(email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      // For mock users, do direct comparison. For DB users, use bcrypt
      let passwordMatch = false;
      if (user.password) {
        // Mock user - direct comparison
        passwordMatch = (password === user.password);
      } else if (user.passwordHash || user.password_hash) {
        // DB user - use bcrypt
        const hash = user.passwordHash || user.password_hash;
        passwordMatch = await bcrypt.compare(password, hash);
      }

      if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const tokens = generateTokenPair({ id: user.id, email: user.email, role: user.role });
      logger.info({ email: user.email }, 'User logged in');

      return res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      });
    } catch (e) {
      if (e.name === 'ZodError') return res.status(400).json({ error: 'Validation error', details: e.errors });
      logger.error('Login error', e.message || e.toString());
      return res.status(500).json({ error: 'server_error' });
    }
  });

  // Register new user
  router.post('/register', async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
      const lowerEmail = String(email).toLowerCase();

      // If using Postgres
      if (pgClient) {
        const exists = await pgClient.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [lowerEmail]);
        if (exists.rows.length > 0) return res.status(409).json({ error: 'Account already exists' });
        const passwordHash = await bcrypt.hash(password, 10);
        const id = `user-${Date.now()}`;
        await pgClient.query('INSERT INTO users(id, email, password_hash, name, phone, role, is_active) VALUES($1,$2,$3,$4,$5,$6,$7)', [id, lowerEmail, passwordHash, `${firstName || ''} ${lastName || ''}`.trim(), phone || null, 'customer', true]);
        return res.json({ ok: true, user: { id, email: lowerEmail, name: `${firstName || ''} ${lastName || ''}`.trim() } });
      }

      // Fallback to file-based storage in backend/data/users.json
      const usersPath = require('path').join(__dirname, '..', 'data', 'users.json');
      let users = [];
      try { users = JSON.parse(require('fs').readFileSync(usersPath, 'utf8')); } catch (e) { users = []; }
      if (users.find(u => u.email === lowerEmail)) return res.status(409).json({ error: 'Account already exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = { id: `user-${Date.now()}`, email: lowerEmail, passwordHash, name: `${firstName || ''} ${lastName || ''}`.trim(), phone: phone || null, role: 'customer', createdAt: new Date().toISOString() };
      users.push(newUser);
      require('fs').writeFileSync(usersPath, JSON.stringify(users, null, 2));
      return res.json({ ok: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
    } catch (e) {
      logger.error('Register error', e.message || e.toString());
      return res.status(500).json({ error: 'server_error' });
    }
  });

  // Refresh endpoint — accepts a refresh token and returns a new token pair
  router.post('/refresh', async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
      const tokens = refreshAccessToken(refreshToken);
      logger.info({}, 'Token refreshed');
      return res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (e) {
      logger.error('Token refresh error', e.message || e.toString());
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
  });

  // Logout endpoint (stateless; client should clear tokens)
  router.post('/logout', (req, res) => {
    logger.info({}, 'User logged out');
    return res.json({ message: 'Logged out successfully' });
  });

  return router;
};
