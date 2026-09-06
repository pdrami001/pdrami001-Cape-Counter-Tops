insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Product images are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "Only listed admins can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  and (storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp'))
);

create policy "Only listed admins can update product images"
on storage.objects for update
 to authenticated
using (bucket_id = 'product-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (bucket_id = 'product-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Only listed admins can delete product images"
on storage.objects for delete
 to authenticated
using (bucket_id = 'product-images' and exists (select 1 from public.admin_users where user_id = (select auth.uid())));
