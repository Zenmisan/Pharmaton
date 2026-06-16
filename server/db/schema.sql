-- PharmaConnect AI database schema

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('patient','pharmacist','hospital','supplier')),
  org_name TEXT,
  location TEXT,
  license_number TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pharmacies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner_user_id INTEGER REFERENCES users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('pharmacy','hospital','supplier')),
  location TEXT NOT NULL,
  lat REAL,
  lng REAL,
  phone TEXT,
  nafdac_verified INTEGER NOT NULL DEFAULT 0,
  rating REAL DEFAULT 4.5
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pharmacy_id INTEGER NOT NULL REFERENCES pharmacies(id),
  name TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  price TEXT,
  expiry TEXT,
  status TEXT NOT NULL CHECK(status IN ('In Stock','Low Stock','Out of Stock'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_code TEXT UNIQUE NOT NULL,
  buyer_id INTEGER REFERENCES users(id),
  supplier_id INTEGER REFERENCES users(id),
  medicine TEXT NOT NULL,
  qty TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Processing','Confirmed','In Transit','Delivered')),
  eta TEXT,
  value TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS supplier_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  supplier_id INTEGER NOT NULL REFERENCES users(id),
  from_name TEXT NOT NULL,
  medicine TEXT NOT NULL,
  qty TEXT NOT NULL,
  urgent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tag TEXT,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS hospital_needs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hospital_id INTEGER NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  qty TEXT NOT NULL,
  priority TEXT NOT NULL CHECK(priority IN ('CRITICAL','HIGH','MEDIUM')),
  status TEXT NOT NULL DEFAULT 'Pending'
);
