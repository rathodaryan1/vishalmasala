# Vishal Masala Ecommerce

Full ecommerce frontend built with React + Vite, including:
- Product catalog + product detail page
- Cart and wishlist with local persistence
- Checkout with Razorpay popup (frontend demo flow)
- Supabase-backed order storage
- Admin login + admin orders management
- Standalone About page

## Setup

1. Install dependencies:
   - `npm install`
2. Create `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

3. Run app:
   - `npm run dev`

## Supabase SQL (run this)

```sql
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  cart_items jsonb not null default '[]'::jsonb,
  total_amount numeric not null default 0,
  payment_id text not null,
  payment_status text not null default 'paid',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy if not exists "orders_select_own"
on public.orders for select
using (
  auth.uid() = user_id
  or customer_email = auth.jwt() ->> 'email'
  or (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

create policy if not exists "orders_insert_authenticated"
on public.orders for insert
to authenticated
with check (true);

create policy if not exists "orders_update_admin_only"
on public.orders for update
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

## Supabase requirements

### Admin role
- Create admin user in Supabase Auth.
- Add metadata role:
  - `app_metadata.role = "admin"` (or `user_metadata.role = "admin"`).

### Orders table
Create `orders` table with columns:
- `id` uuid primary key default `gen_random_uuid()`
- `customer_name` text
- `customer_email` text
- `customer_phone` text
- `address` text
- `city` text
- `state` text
- `pincode` text
- `cart_items` jsonb
- `total_amount` numeric
- `payment_id` text
- `payment_status` text
- `status` text
- `created_at` timestamptz default `now()`

Enable RLS policies as required for your deployment.

## Payment note

Razorpay checkout in this project is currently frontend-triggered demo flow.  
For production, add backend order creation and signature verification before confirming payment.
