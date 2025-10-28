-- Enable pgcrypto if not already
create extension if not exists pgcrypto;

create table if not exists cars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  year int,
  price int,
  images text[],
  condition text,
  fuel text,
  transmission text,
  color text,
  description text,
  is_promo boolean default false,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  full_name text,
  is_admin boolean default false,
  nickname text,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  car_id uuid references cars(id),
  price numeric, 
  coupon_code text,
  discount_applied numeric, 
  total_paid numeric,
  status text,
  created_at timestamptz default now()
);

create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  car_ids text[],
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_percent int check (discount_percent between 1 and 100),
  max_uses int default 1,
  times_used int default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists conversation (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  is_resolved boolean default false,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender text,
  text text,
  conversation_id uuid references conversation(id),
  created_at timestamptz default now()
);

