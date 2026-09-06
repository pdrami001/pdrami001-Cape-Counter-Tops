create extension if not exists pgcrypto;

create type public.product_category as enum ('granite', 'quartz', 'sintered_stone');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  category public.product_category not null,
  description text not null check (char_length(description) between 10 and 500),
  image_url text,
  colour text check (colour is null or char_length(colour) <= 60),
  finish text check (finish is null or char_length(finish) <= 60),
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index products_catalogue_order_idx on public.products (featured desc, in_stock desc, created_at desc);
create index products_category_idx on public.products (category);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();
