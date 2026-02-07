require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// simple DB abstraction: prefer Postgres via DATABASE_URL, otherwise file-backed JSON store
const { Client } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL || null;
let pgClient = null;
(async () => {
  if (DATABASE_URL) {
    try {
      pgClient = new Client({ connectionString: DATABASE_URL });
      await pgClient.connect();
      logger.info('Connected to Postgres');
    } catch (e) {
      logger.warn('Postgres connection failed, falling back to file store', e.message);
      pgClient = null;
    }
  }
})();

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const menuPath = path.join(dataDir, 'menu.json');
const ordersPath = path.join(dataDir, 'orders.json');

const readJSON = (p, fallback) => {
  try {
    if (!fs.existsSync(p)) { fs.writeFileSync(p, JSON.stringify(fallback || [], null, 2)); }
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    logger.warn('readJSON error', e.message);
    return fallback || [];
  }
}
const writeJSON = (p, data) => { fs.writeFileSync(p, JSON.stringify(data, null, 2)); }

// Routes
const authRouter = require('./routes/auth')({ logger });
const menuRouter = require('./routes/menu')({ pgClient, readJSON, writeJSON, menuPath, logger });
const ordersRouter = require('./routes/orders')({ pgClient, readJSON, writeJSON, ordersPath, logger });
const paymentsRouter = require('./routes/payments')({ logger });

app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info({ port: PORT }, 'Server started'));
