create extension if not exists pgcrypto;

create type public.project_type as enum (
  'Kitchen',
  'Bathroom',
  'Vanity',
  'Kitchen Island',
  'Fireplace',
  'Feature Wall',
  'Reception Counter',
  'Commercial',
  'Other'
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  project_type public.project_type not null,
  material text check (material is null or char_length(material) <= 80),
  colour text check (colour is null or char_length(colour) <= 60),
  finish text check (finish is null or char_length(finish) <= 60),
  location text check (location is null or char_length(location) <= 120),
  featured boolean not null default false,
  completed_at date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index projects_featured_idx on public.projects (featured desc, completed_at desc, created_at desc);
create index projects_project_type_idx on public.projects (project_type);
create index project_images_project_id_order_idx on public.project_images (project_id, display_order asc, created_at asc);

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

create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

create policy "Projects are publicly readable"
on public.projects for select
to anon, authenticated
using (true);

create policy "Only admins can insert projects"
on public.projects for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Only admins can update projects"
on public.projects for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Only admins can delete projects"
on public.projects for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Project images are publicly readable"
on public.project_images for select
to anon, authenticated
using (true);

create policy "Only admins can insert project images"
on public.project_images for insert
to authenticated
with check (
  exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

create policy "Only admins can update project images"
on public.project_images for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())))
with check (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

create policy "Only admins can delete project images"
on public.project_images for delete
to authenticated
using (exists (select 1 from public.admin_users where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = excluded.public;

create policy "Project images are publicly readable in storage"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-images');

create policy "Only admins can upload project images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
  and (storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp'))
);

create policy "Only admins can update project images in storage"
on storage.objects for update
to authenticated
using (
  bucket_id = 'project-images'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
)
with check (
  bucket_id = 'project-images'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

create policy "Only admins can delete project images from storage"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'project-images'
  and exists (select 1 from public.admin_users where user_id = (select auth.uid()))
);

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant select on public.project_images to anon, authenticated;
grant insert, update, delete on public.project_images to authenticated;
