create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date date not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  theme_id uuid not null references public.themes(id) on delete cascade,
  image_url text not null,
  material text not null check (
    material in (
      '透明水彩',
      'アクリル',
      '油絵',
      'オイルパステル',
      '色鉛筆',
      'ペン画',
      '鉛筆',
      'デジタル',
      'コラージュ',
      'その他'
    )
  ),
  note text check (note is null or char_length(note) <= 120),
  frame_style text not null default 'blank' check (
    frame_style in ('blank', 'wood', 'mat', 'black', 'museum')
  ),
  created_at timestamptz not null default now()
);

create table if not exists public.reactions (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('color', 'line', 'view')),
  created_at timestamptz not null default now(),
  unique (artwork_id, user_id, reaction_type)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_type text not null,
  earned_at timestamptz not null default now(),
  unique (user_id, badge_type)
);

create index if not exists artworks_theme_id_created_at_idx
  on public.artworks(theme_id, created_at desc);

create index if not exists artworks_user_id_created_at_idx
  on public.artworks(user_id, created_at desc);

create index if not exists reactions_artwork_id_idx
  on public.reactions(artwork_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    'room_' || replace(left(new.id::text, 8), '-', ''),
    coalesce(new.raw_user_meta_data->>'display_name', '展示者')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.themes enable row level security;
alter table public.artworks enable row level security;
alter table public.reactions enable row level security;
alter table public.badges enable row level security;

drop policy if exists "Profiles are visible" on public.profiles;
create policy "Profiles are visible"
  on public.profiles for select
  using (true);

drop policy if exists "Users create own profile" on public.profiles;
create policy "Users create own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Themes are visible" on public.themes;
create policy "Themes are visible"
  on public.themes for select
  using (true);

drop policy if exists "Artworks are visible" on public.artworks;
create policy "Artworks are visible"
  on public.artworks for select
  using (true);

drop policy if exists "Users create own artworks" on public.artworks;
create policy "Users create own artworks"
  on public.artworks for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own artworks" on public.artworks;
create policy "Users update own artworks"
  on public.artworks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Reactions are visible" on public.reactions;
create policy "Reactions are visible"
  on public.reactions for select
  using (true);

drop policy if exists "Users create own reactions" on public.reactions;
create policy "Users create own reactions"
  on public.reactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Badges are visible" on public.badges;
create policy "Badges are visible"
  on public.badges for select
  using (true);

drop policy if exists "Users create own badges" on public.badges;
create policy "Users create own badges"
  on public.badges for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own badges" on public.badges;
create policy "Users update own badges"
  on public.badges for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artworks', 'artworks', true, 10485760, array['image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Artwork images are visible" on storage.objects;
create policy "Artwork images are visible"
  on storage.objects for select
  using (bucket_id = 'artworks');

drop policy if exists "Users upload own artwork images" on storage.objects;
create policy "Users upload own artwork images"
  on storage.objects for insert
  with check (
    bucket_id = 'artworks'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

drop policy if exists "Users update own artwork images" on storage.objects;
create policy "Users update own artwork images"
  on storage.objects for update
  using (
    bucket_id = 'artworks'
    and auth.uid()::text = (storage.foldername(name))[2]
  )
  with check (
    bucket_id = 'artworks'
    and auth.uid()::text = (storage.foldername(name))[2]
  );
