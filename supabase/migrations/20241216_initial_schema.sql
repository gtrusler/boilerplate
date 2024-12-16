-- Enable necessary extensions
create extension if not exists "vector" with schema public;

-- Set up storage for video thumbnails and transcripts
insert into storage.buckets (id, name, public) 
values ('video-assets', 'video-assets', true);

-- Create tables
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create table public.videos (
  id uuid default gen_random_uuid() primary key,
  youtube_id text not null unique,
  title text not null,
  description text,
  thumbnail_url text,
  duration interval,
  published_at timestamp with time zone,
  channel_id text,
  channel_title text,
  view_count bigint,
  like_count bigint,
  comment_count bigint,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id),
  metadata jsonb default '{}'::jsonb,
  embedding vector(1536)
);

create table public.transcripts (
  id uuid default gen_random_uuid() primary key,
  video_id uuid references public.videos(id) on delete cascade,
  content text not null,
  start_time interval,
  end_time interval,
  speaker text,
  confidence numeric(4,3),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  embedding vector(1536)
);

create table public.tags (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id)
);

create table public.video_tags (
  video_id uuid references public.videos(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.profiles(id),
  primary key (video_id, tag_id)
);

-- Create indexes
create index videos_youtube_id_idx on public.videos(youtube_id);
create index videos_created_at_idx on public.videos(created_at desc);
create index transcripts_video_id_idx on public.transcripts(video_id);
create index transcripts_start_time_idx on public.transcripts(start_time);
create index tags_name_idx on public.tags(name);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.videos enable row level security;
alter table public.transcripts enable row level security;
alter table public.tags enable row level security;
alter table public.video_tags enable row level security;

-- Create RLS policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Videos are viewable by everyone"
  on public.videos for select
  using (true);

create policy "Authenticated users can insert videos"
  on public.videos for insert
  with check (auth.role() = 'authenticated');

create policy "Creators can update their videos"
  on public.videos for update
  using (auth.uid() = created_by);

create policy "Transcripts are viewable by everyone"
  on public.transcripts for select
  using (true);

create policy "Authenticated users can insert transcripts"
  on public.transcripts for insert
  with check (auth.role() = 'authenticated');

create policy "Tags are viewable by everyone"
  on public.tags for select
  using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert
  with check (auth.role() = 'authenticated');

create policy "Video tags are viewable by everyone"
  on public.video_tags for select
  using (true);

create policy "Authenticated users can create video tags"
  on public.video_tags for insert
  with check (auth.role() = 'authenticated');

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
