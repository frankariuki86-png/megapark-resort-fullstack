# Database Migrations & Seeding

## Overview

The backend supports both **file-based JSON storage** (default) and **Postgres** persistence.

### File-based Storage (Default)
- Data stored in `backend/data/menu.json` and `backend/data/orders.json`
- No setup required
- Good for local dev and testing
- Data persists across server restarts

### Postgres Storage (Production-ready)
- Full ACID transactions
- Proper indexing and query optimization
- Ideal for bookings, payments, and concurrent users

## Setting Up Postgres

### 1. Install Postgres
- **macOS:** `brew install postgresql` or [PostgreSQL.app](https://postgresapp.com/)
- **Windows:** [PostgreSQL Installer](https://www.postgresql.org/download/windows/)
- **Linux:** `apt-get install postgresql`

### 2. Create Database
```bash
# Start Postgres service
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Create database
createdb megapark
```

### 3. Configure Backend
Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/megapark
PORT=3000
LOG_LEVEL=info
```

Replace `postgres` and `password` with your Postgres credentials.

### 4. Run Migrations
```bash
cd backend
npm run migrate
```

This creates the schema (tables, indexes, constraints).

### 5. Seed Sample Data
```bash
npm run seed
```

This populates menu items and sample orders.

### 6. One-command Setup
```bash
npm run db:setup
```

Runs migrations + seed in one command.

## Schema Overview

### `menu_items`
- Stores food items with pricing, prep time, availability
- Indexed by category, availability, creation date

### `food_orders`
- Stores customer orders with items (JSON), totals, status
- Indexed by customer, status, payment status, dates

### `users` (Future Auth)
- Admin/staff/user roles, password hashes
- Email unique constraint

### `rooms` (Future Bookings)
- Room inventory with capacity, amenities, pricing
- Status tracking (available, occupied, maintenance)

### `bookings` (Future)
- Room reservations with check-in/out dates
- Foreign key to `rooms`, tracks payment and booking status

### `events` (Future)
- Event space bookings (weddings, conferences, etc.)
- Client contact, event type, guest count, pricing

## Migration Files

- `migrations/001-initial-schema.sql` – Creates all tables, indexes, constraints

To add new migrations:
1. Create `migrations/002-your-migration.sql`
2. Run `npm run migrate` to apply

## Troubleshooting

### Connection Error
```
error: could not connect to server: Connection refused
```
- Ensure Postgres is running: `brew services start postgresql` (macOS)
- Check DATABASE_URL is correct

### Table Already Exists
```
error: relation "menu_items" already exists
```
- Safe to ignore (migrations use `IF NOT EXISTS`)
- Or manually: `DROP TABLE menu_items CASCADE;` then re-migrate

### Reset Database
```bash
# Drop all tables
dropdb megapark
createdb megapark

# Re-run migrations and seed
npm run db:setup
```

## Next Steps

- Add more migrations as features are built (JWT table, activity logs, etc.)
- Add database backups/restore scripts
- Set up connection pooling (PgBouncer) for production
- Add database monitoring and slow query logging
