const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { LoginSchema } = require('../validators/schemas');
const { generateToken } = require('../middleware/authenticate');
const { generateTokenPair, refreshAccessToken } = require('../middleware/authenticate');

module.exports = ({ logger }) => {
  // Mock users with hashed passwords (replace with DB lookup in production)
  // Default password: admin123 (hashed with bcrypt, rounds=10)
  const users = [
    { id: 'admin-001', email: 'admin@megapark.com', passwordHash: '$2b$10$2Z3vN7q8K1xR4p.J9m2R.uE6vL5O9s.HqM1w3Y2c4B0d5F6g7H8', name: 'Admin User', role: 'admin' }
  ];

  router.post('/login', async (req, res) => {
    try {
      // Validate input
      const { email, password } = LoginSchema.parse(req.body);

      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare passwords
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user);
      logger.info({ email: user.email }, 'User logged in');
      
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (e) {
      if (e.name === 'ZodError') {
        return res.status(400).json({ error: 'Validation error', details: e.errors });
      }
      logger.error('Login error', e.message);
      res.status(500).json({ error: 'server_error' });

      // Refresh access token endpoint
      router.post('/refresh', async (req, res) => {
        try {
          const { refreshToken } = req.body;
          if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh token required' });
          }

          const tokens = refreshAccessToken(refreshToken);
          logger.info({}, 'Token refreshed');
      
          return res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
          });
        } catch (e) {
          logger.error('Token refresh error', e.message);
          res.status(401).json({ error: 'Invalid refresh token' });
        }
      });

      // Logout endpoint (client-side clears tokens)
      router.post('/logout', (req, res) => {
        logger.info({}, 'User logged out');
        res.json({ message: 'Logged out successfully' });
      });
    }
  });

  return router;
};
