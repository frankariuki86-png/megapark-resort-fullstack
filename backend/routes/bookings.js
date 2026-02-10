const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authenticate');
const { sendEmail } = require('../services/emailService');

module.exports = ({ pgClient, readJSON, writeJSON, bookingsPath, logger }) => {
  // GET - list bookings (protected)
  router.get('/', authenticate, async (req, res) => {
    try {
      if (pgClient) {
        const { rows } = await pgClient.query('SELECT * FROM bookings ORDER BY created_at DESC');
        return res.json(rows);
      }
      const bookings = readJSON(bookingsPath, []);
      return res.json(bookings);
    } catch (e) {
      logger.error('GET /api/bookings error', e.message);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // POST - create booking (public)
  router.post('/', async (req, res) => {
    try {
      const payload = req.body || {};

      if (pgClient) {
        const q = `INSERT INTO bookings (id, customer_name, customer_email, customer_phone, booking_type, booking_data, total, payment_status, payment_data, status, created_at)
                   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,now()) RETURNING *`;
        const id = payload.id || `BOOK-${Date.now()}`;
        const values = [id, payload.customerName||null, payload.customerEmail||null, payload.customerPhone||null, payload.bookingType||'room', JSON.stringify(payload.bookingData||{}), payload.total||0, payload.paymentStatus||'pending', JSON.stringify(payload.paymentData||null), payload.status||'booked'];
        const { rows } = await pgClient.query(q, values);
        return res.status(201).json(rows[0]);
      }

      const bookings = readJSON(bookingsPath, []);
      const id = payload.id || `BOOK-${Date.now()}`;
      const created = Object.assign({ id, createdAt: new Date().toISOString() }, payload);
      bookings.unshift(created);
      writeJSON(bookingsPath, bookings);

      // Send confirmation email to customer if email provided
      if (created.customerEmail) {
        sendEmail(created.customerEmail, 'bookingConfirmation', created, logger).catch(err => {
          logger.warn('Failed to send booking confirmation email', err.message);
        });
      }

      return res.status(201).json(created);
    } catch (e) {
      logger.error('POST /api/bookings error', e.message);
      res.status(500).json({ error: 'server_error' });
    }
  });

  // PUT - update booking (protected)
  router.put('/:id', authenticate, async (req, res) => {
    try {
      const id = req.params.id;
      const payload = req.body || {};
      if (pgClient) {
        const updates = [];
        const values = [];
        let idx = 1;
        for (const k of ['status','payment_status']) {
          if (payload[k] !== undefined) { updates.push(`${k} = $${idx++}`); values.push(payload[k]); }
        }
        if (payload.bookingData !== undefined) { updates.push(`booking_data = $${idx++}`); values.push(JSON.stringify(payload.bookingData)); }
        if (updates.length === 0) return res.status(400).json({ error: 'no_updates' });
        const q = `UPDATE bookings SET ${updates.join(',')}, updated_at = now() WHERE id = $${idx} RETURNING *`;
        values.push(id);
        const { rows } = await pgClient.query(q, values);
        if (rows.length === 0) return res.status(404).json({ error: 'not_found' });
        return res.json(rows[0]);
      }

      const bookings = readJSON(bookingsPath, []);
      const idx = bookings.findIndex(b => b.id === id);
      if (idx === -1) return res.status(404).json({ error: 'not_found' });
      bookings[idx] = { ...bookings[idx], ...payload, updatedAt: new Date().toISOString() };
      writeJSON(bookingsPath, bookings);
      return res.json(bookings[idx]);
    } catch (e) {
      logger.error('PUT /api/bookings/:id error', e.message);
      res.status(500).json({ error: 'server_error' });
    }
  });

  return router;
};
