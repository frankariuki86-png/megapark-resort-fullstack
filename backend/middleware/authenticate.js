const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key';

// Verify and decode JWT from Authorization header
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: missing or invalid token' });
  }

  const token = authHeader.slice(7); // Remove "Bearer "
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (e) {
        if (e.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  // Generate short-lived access token (15 min default)
  const generateAccessToken = (user) => {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, type: 'access' },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '15m' }
    );
  };

  // Generate long-lived refresh token (7 days default)
  const generateRefreshToken = (user) => {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
    );
  };

  // Legacy: Generate both tokens (returns both access and refresh)
  const generateToken = (user) => {
    return generateAccessToken(user);
  };

  // Generate tokens pair
  const generateTokenPair = (user) => {
    return {
      accessToken: generateAccessToken(user),
      refreshToken: generateRefreshToken(user)
    };
  };

  // Verify refresh token and generate new access token
  const refreshAccessToken = (refreshToken) => {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Generate new access token
      const user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
    
      return {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user) // Optional: rotate refresh token
      };
    } catch (e) {
      throw new Error(`Invalid refresh token: ${e.message}`);
    }
  };

  module.exports = {
    authenticate,
    generateToken,
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    refreshAccessToken
  };
  }
};

// Generate JWT for user
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '24h' }
  );
};

module.exports = { authenticate, generateToken };
