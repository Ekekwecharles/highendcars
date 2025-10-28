# 🚘 High-End Cars — Full Starter

**High-End Cars** is a complete luxury car e-commerce platform built with **Next.js 15**, **TypeScript**, **Supabase**, **Redux**, and **Socket.IO**.
It features full car management, coupon control, user orders, chat system, and crypto payment (**Coinbase Commerce**) integration — all in one scalable, high-performance stack.

---

## ⚡ Quick Start

### Clone the repo

```bash
git clone https://github.com/yourusername/high-end-cars.git
cd high-end-cars
```

### Copy environment file

```bash
cp .env.example .env.local
```

Fill in your **Supabase**, **Coinbase**, and **WebSocket** credentials.

### Install dependencies

```bash
npm install
```

### Run the Socket server

```bash
npm run socket
```

### Run the Next.js app

```bash
npm run dev
```

Open the app:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧱 Database Setup (Supabase)

Before running the project:

1. Log in to your [Supabase dashboard](https://supabase.com/).

2. Go to **SQL Editor** → paste and run the contents of:

   - `supabase/schema.sql` → creates all database tables (cars, coupons, orders, users, messages, etc.)
   - `supabase/seed.sql` → seeds sample data (cars, coupons)

3. Confirm that the tables are successfully created in your Supabase project.

---

## 💸 Coinbase Commerce Webhook Setup

This connects your app with **Coinbase Commerce** for crypto payments.

### Steps:

1. Go to your [Coinbase Commerce dashboard](https://commerce.coinbase.com/).

2. Under **Webhooks**, set the webhook URL to:

   ```
   https://<your-domain>/api/checkout/webhook
   ```

   Example:

   ```
   https://highendcars.com/api/checkout/webhook
   ```

3. Coinbase will provide a **Shared Secret** — copy that and add it to your `.env.local`:

   ```bash
   COINBASE_SHARED_SECRET=your_shared_secret_here
   ```

When users pay with crypto, Coinbase sends a POST request to that webhook.
The backend validates it using the shared secret and marks the order as “paid”.

> ⚠️ Without this setup, payment confirmations won’t work automatically.

---

## 🧠 Features Overview

### 🏠 User Features

- View all cars with filtering (**new**, **used**, **promo**)
- Search and paginate car listings
- Add cars to cart and manage quantities
- Apply coupons (with validation)
- Authenticated checkout flow:

  - Redirects to login if not logged in
  - Returns to `/cart` after successful login

- View order confirmation after payment
- Real-time chat with admin (via Supabase Realtime & Socket.IO)

### 🔧 Admin Features

Secure admin dashboard for full control:

- Manage cars (add, edit, delete)
- Manage coupons (Create, activate, deactivate, set limits)
- View orders and update their status (**pending → paid → delivered**)
- Respond to user messages in real-time
- Handle customer support directly through the dashboard

Admin dashboard uses the same Supabase backend with access policies.

---

## 💬 Real-Time Chat System

- Built using **Supabase Realtime** and **Socket.IO**
- Enables instant communication between users and admins
- Includes read receipts, timestamps, and auto-refresh messages
- Supports multiple concurrent user sessions
- Stores all chats in the `messages` table for record-keeping

---

## 💰 Checkout & Coupons

- Validates coupon codes against Supabase database
- Ensures coupons are active, unexpired, and under usage limit
- Automatically applies percentage discounts

Each order includes:

```text
user_id
car_id
coupon_code
discount_applied
total_paid
status
```

---

## 🔐 Authentication

- Managed via **Supabase Auth**
- Signup, Login, Logout, Password reset
- Persisted globally using **Redux Toolkit**
- Middleware ensures only logged-in users can checkout or access orders

---

## 🧩 Tech Stack

| Category             | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js 15 (App Router), React 19, TypeScript |
| **State Management** | Redux Toolkit                                 |
| **Data Fetching**    | React Query                                   |
| **Styling**          | styled-components, Tailwind CSS               |
| **Backend**          | Supabase (PostgreSQL + Auth + Realtime)       |
| **API Requests**     | Axios                                         |
| **Chat System**      | Socket.IO, Supabase Realtime                  |
| **Crypto Payment**   | Coinbase Commerce                             |
| **Notifications**    | React Hot Toast                               |
| **Icons**            | Lucide React, React Icons                     |
| **Animations**       | Framer Motion                                 |
| **Carousel**         | React Slick, Slick Carousel                   |
| **Deployment**       | Vercel                                        |

---

## 🗂️ Folder Structure

```
📦 high-end-cars
├── app/
│   ├── page.tsx               # Homepage
│   ├── cars/
│   │   ├── page.tsx           # Car listing page
│   │   ├── [id]/page.tsx      # Single car details
│   ├── cart/page.tsx          # Shopping cart & checkout
│   ├── admin/                 # Admin dashboard (cars, coupons, orders, support)
│   ├── login/page.tsx         # Login page
│   └── layout.tsx             # Root layout with Providers
│
├── components/                # Shared UI components
├── store/                     # Redux slices (auth, cart, chat)
├── lib/                       # Supabase client, helpers, utils
├── supabase/                  # SQL schema and seed files
├── public/                    # Static assets
├── socket/                    # Socket.IO server files
├── styles/                    # Global styles, themes
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 🔐 Environment Variables (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

COINBASE_API_KEY=your_coinbase_api_key
COINBASE_SHARED_SECRET=your_coinbase_shared_secret

NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

---

## 🧠 Lessons Learned

- Implementing query-based filtering with `router.replace()`
- Managing auth redirect flows using redirect params
- Handling race conditions in coupon validation
- Integrating Coinbase Commerce securely via webhook
- Real-time communication using Socket.IO and Supabase Realtime
- Building a scalable Next.js 15 project with Supabase backend

---

## 🧾 Future Improvements

- Add Coinbase Commerce crypto checkout UI
- Admin analytics dashboard with charts
- Email notifications for new orders
- Support for Stripe or Paystack as fallback payment gateways
- PWA (Progressive Web App) optimization

---

## 🚀 Deployment

Deployed seamlessly on **Vercel**.
Every push to `main` triggers an automatic build and deploy.

---

## 👨‍💻 Author

**Charles Snow**
Frontend Developer | React • Next.js • Supabase • TypeScript
📧 [your@email.com]()
🌐 [yourportfolio.com]()

> “High-End Cars isn’t just an e-commerce site — it’s a complete SaaS-grade starter for car dealerships, integrating real-time chat, payments, and full admin control.”

---
