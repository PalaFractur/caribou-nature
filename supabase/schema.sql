-- ═══════════════════════════════════════════════════════════════════
-- CARIBOU NATURE — Schéma Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════════

-- ── Fonction utilitaire admin ─────────────────────────────────────
create or replace function is_admin()
returns boolean
language sql
security definer
as $$
  select auth.jwt()->>'email' = current_setting('app.admin_email', true)
  or auth.jwt()->>'email' = 'admin@caribounature.fr';
$$;

-- ── Profiles clients ─────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  prenom      text not null,
  nom         text not null,
  telephone   text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles"  on public.profiles for select using (is_admin());

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, prenom, nom)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'prenom', ''),
    coalesce(new.raw_user_meta_data->>'nom', '')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Commandes ─────────────────────────────────────────────────────
create table if not exists public.orders (
  id                  text primary key,
  user_id             uuid references auth.users,
  customer            jsonb not null,
  livraison           text not null check (livraison in ('domicile', 'click-collect')),
  address             text,
  items               jsonb not null,
  subtotal            numeric(10,2) not null,
  discount            numeric(10,2) default 0,
  shipping            numeric(10,2) default 0,
  total               numeric(10,2) not null,
  gift_wrapping       boolean default false,
  promo_code          text,
  status              text default 'pending',
  stripe_session_id   text,
  payment_status      text default 'pending',
  date                timestamptz default now()
);

alter table public.orders enable row level security;

create policy "Users can view own orders"    on public.orders for select using (auth.uid() = user_id);
create policy "Admin can view all orders"    on public.orders for select using (is_admin());
create policy "Admin can update all orders"  on public.orders for update using (is_admin());
-- Service role (webhook) inserts/updates — bypasses RLS automatically

-- ── Codes promo ───────────────────────────────────────────────────
create table if not exists public.promo_codes (
  id           uuid default gen_random_uuid() primary key,
  code         text unique not null,
  type         text not null check (type in ('percent', 'fixed')),
  value        numeric(10,2) not null,
  label        text not null,
  active       boolean default true,
  usage_count  int default 0,
  created_at   timestamptz default now()
);

alter table public.promo_codes enable row level security;

create policy "Anyone can read promo codes"      on public.promo_codes for select using (true);
create policy "Admin can manage promo codes"     on public.promo_codes for all using (is_admin());

-- Données initiales
insert into public.promo_codes (code, type, value, label, active) values
  ('CARIBOU10', 'percent', 10, '-10 %', true),
  ('NOEL2025',  'percent', 15, '-15 %', true),
  ('BIENVENUE', 'fixed',    5, '-5,00 €', true)
on conflict (code) do nothing;

-- ── Avis produits ─────────────────────────────────────────────────
create table if not exists public.reviews (
  id           uuid default gen_random_uuid() primary key,
  product_slug text not null,
  user_id      uuid references auth.users,
  author       text not null,
  rating       int not null check (rating between 1 and 5),
  comment      text not null,
  date         timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can read reviews"                 on public.reviews for select using (true);
create policy "Authenticated users can insert reviews"  on public.reviews for insert with check (auth.role() = 'authenticated');
create policy "Admin can manage reviews"                on public.reviews for all using (is_admin());

-- ── Newsletter ────────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id            uuid default gen_random_uuid() primary key,
  email         text unique not null,
  subscribed_at timestamptz default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"         on public.newsletter_subscribers for insert with check (true);
create policy "Admin can view subscribers"   on public.newsletter_subscribers for select using (is_admin());
create policy "Admin can delete subscribers" on public.newsletter_subscribers for delete using (is_admin());

-- ── Surcharges stock ──────────────────────────────────────────────
create table if not exists public.stock_overrides (
  product_id  int primary key,
  stock       int not null,
  is_new      boolean default false,
  updated_at  timestamptz default now()
);

alter table public.stock_overrides enable row level security;

create policy "Anyone can read stock"      on public.stock_overrides for select using (true);
create policy "Admin can manage stock"     on public.stock_overrides for all using (is_admin());
