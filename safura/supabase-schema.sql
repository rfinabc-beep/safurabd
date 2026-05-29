-- ===========================
-- SAFURA — Supabase SQL Schema
-- ===========================

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  address TEXT,
  role TEXT DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  unit TEXT,
  category TEXT,
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  note TEXT,
  items JSONB,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (run these in Supabase SQL editor)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: anyone can read
CREATE POLICY "Public products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone delete products" ON products FOR DELETE USING (true);

-- Orders: anyone can insert/read
CREATE POLICY "Anyone insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone update orders" ON orders FOR UPDATE USING (true);

-- Users: anyone can insert/read
CREATE POLICY "Anyone insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone read users" ON users FOR SELECT USING (true);

-- Sample admin user (change password!)
INSERT INTO users (name, phone, password, role)
VALUES ('অ্যাডমিন', '01700000000', 'admin123', 'admin');

-- Sample products
INSERT INTO products (name, price, unit, category) VALUES
  ('আলু', 35, '১ কেজি', 'সবজি'),
  ('পেঁয়াজ', 55, '১ কেজি', 'সবজি'),
  ('রসুন', 180, '১ কেজি', 'তেল-মশলা'),
  ('মিনিকেট চাল', 65, '১ কেজি', 'চাল-ডাল'),
  ('মসুর ডাল', 120, '১ কেজি', 'চাল-ডাল'),
  ('সয়াবিন তেল', 160, '১ লিটার', 'তেল-মশলা'),
  ('দুধ (পাস্তুরিত)', 70, '১ লিটার', 'দুগ্ধ'),
  ('ডিম', 145, '১ ডজন', 'দুগ্ধ');
