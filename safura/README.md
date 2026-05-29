# 🛒 সাফুরা — Grocery E-commerce

Next.js + Supabase + Vercel দিয়ে বানানো বাংলা গ্রোসারি শপ।

---

## ⚡ সেটআপ গাইড

### ১. GitHub এ push করুন

```bash
cd safura
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/safura.git
git push -u origin main
```

### ২. Supabase সেটআপ

1. [supabase.com](https://supabase.com) → New Project তৈরি করুন
2. **SQL Editor** এ যান → `supabase-schema.sql` ফাইলের সব কোড paste করে **Run** করুন
3. **Project Settings → API** থেকে এগুলো নিন:
   - `Project URL`
   - `anon public key`

### ৩. .env.local সেট করুন

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

### ৪. Vercel Deploy

1. [vercel.com](https://vercel.com) → **New Project** → GitHub repo import করুন
2. **Environment Variables** এ দুটো `.env.local` ভ্যারিয়েবল যোগ করুন
3. **Deploy** চাপুন — ব্যস!

---

## 📁 ফাইল স্ট্রাকচার

```
safura/
├── app/
│   ├── page.js          # হোমপেজ
│   ├── products/        # পণ্য লিস্ট
│   ├── cart/            # কার্ট
│   ├── checkout/        # চেকআউট
│   ├── orders/          # অর্ডার ট্র্যাক
│   ├── dashboard/       # কাস্টমার ড্যাশবোর্ড
│   ├── admin/           # অ্যাডমিন প্যানেল
│   ├── login/           # লগইন
│   └── register/        # নিবন্ধন
├── components/
│   └── Navbar.js
├── lib/
│   └── supabase.js
└── supabase-schema.sql
```

## 🔐 অ্যাডমিন লগইন

- ফোন: `01700000000`
- পাসওয়ার্ড: `admin123`

> ⚠️ Deploy করার পর Supabase থেকে পাসওয়ার্ড পরিবর্তন করুন!

## ✅ ফিচার সমূহ

- বাংলা UI সহ সম্পূর্ণ grocery shop
- প্রোডাক্ট ব্রাউজ + সার্চ + ক্যাটাগরি ফিল্টার
- কার্ট সিস্টেম (localStorage)
- চেকআউট (Cash on Delivery)
- অর্ডার ট্র্যাকিং
- কাস্টমার রেজিস্ট্রেশন ও লগইন
- ফুল অ্যাডমিন প্যানেল (অর্ডার, পণ্য, গ্রাহক)
