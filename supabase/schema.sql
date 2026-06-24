-- ============================================
-- UptimeGuard Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  created_at timestamp with time zone default now()
);

-- Websites table
create table websites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  url text not null,
  slug text unique not null,
  status text default 'PENDING' check (status in ('UP', 'DOWN', 'PENDING')),
  consecutive_failures int default 0,
  last_checked_at timestamp with time zone,
  uptime_percentage float default 100,
  created_at timestamp with time zone default now()
);

-- Monitoring logs table
create table monitoring_logs (
  id uuid default uuid_generate_v4() primary key,
  website_id uuid references websites(id) on delete cascade not null,
  status text check (status in ('UP', 'DOWN')),
  response_time int,
  error_message text,
  checked_at timestamp with time zone default now()
);

-- Incidents table
create table incidents (
  id uuid default uuid_generate_v4() primary key,
  website_id uuid references websites(id) on delete cascade not null,
  started_at timestamp with time zone default now(),
  resolved_at timestamp with time zone,
  duration int,
  status text default 'OPEN' check (status in ('OPEN', 'RESOLVED')),
  notified boolean default false
);

-- Notifications table
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  website_id uuid references websites(id) on delete cascade not null,
  email text not null,
  type text check (type in ('DOWN', 'RECOVERY')),
  sent_at timestamp with time zone default now()
);

-- SMTP settings table
create table smtp_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade unique not null,
  host text not null,
  port int not null,
  username text not null,
  password text not null,
  from_name text not null,
  from_email text not null,
  created_at timestamp with time zone default now()
);

-- ============================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', new.email),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- websites
alter table websites enable row level security;
create policy "Users can CRUD own websites" on websites for all using (auth.uid() = user_id);

-- monitoring_logs
alter table monitoring_logs enable row level security;
create policy "Users can view own logs" on monitoring_logs for select using (
  auth.uid() = (select user_id from websites where id = website_id)
);

-- incidents
alter table incidents enable row level security;
create policy "Users can view own incidents" on incidents for select using (
  auth.uid() = (select user_id from websites where id = website_id)
);

-- notifications
alter table notifications enable row level security;
create policy "Users can view own notifications" on notifications for select using (
  auth.uid() = (select user_id from websites where id = website_id)
);

-- smtp_settings
alter table smtp_settings enable row level security;
create policy "Users can CRUD own smtp settings" on smtp_settings for all using (auth.uid() = user_id);

-- ============================================
-- SERVICE ROLE BYPASS (for cron/monitoring worker)
-- ============================================

create policy "Service role full access to websites" on websites for all using (true) with check (true);
create policy "Service role full access to monitoring_logs" on monitoring_logs for all using (true) with check (true);
create policy "Service role full access to incidents" on incidents for all using (true) with check (true);
create policy "Service role full access to notifications" on notifications for all using (true) with check (true);
