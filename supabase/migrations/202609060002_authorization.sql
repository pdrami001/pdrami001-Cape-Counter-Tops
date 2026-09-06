create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.products enable row level security;
alter table public.admin_users enable row level security;

create policy "Products are publicly readable"
on public.products for select
to anon, authenticated
using (true);

create policy "Only listed admins can insert products"
on public.products for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Only listed admins can update products"
on public.products for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Only listed admins can delete products"
on public.products for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Admins can verify their own access"
on public.admin_users for select
to authenticated
using (user_id = (select auth.uid()));

revoke all on public.admin_users from anon;
grant select on public.admin_users to authenticated;
