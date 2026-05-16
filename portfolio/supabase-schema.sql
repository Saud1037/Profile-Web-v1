-- ============================================================
-- Portfolio Dashboard — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- PROFILE
-- ────────────────────────────────────────────────────────────
create table if not exists profile (
  id text primary key default '1',
  name text not null default 'سعود',
  role text not null default 'مطور • مبتكر',
  bio text not null default 'نبذة قصيرة عنك',
  tags jsonb not null default '[]'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  available_for_work boolean not null default true,
  updated_at timestamptz default now()
);

-- Insert default profile
insert into profile (id, name, role, bio, tags, stats, available_for_work)
values (
  '1',
  'سعود',
  'مطور • مبتكر',
  'مطور متخصص في بناء تجارب رقمية استثنائية.',
  '["JavaScript","Node.js","Discord.js","Supabase","React","UI/UX"]'::jsonb,
  '[{"key":"3+","value":"سنوات خبرة"},{"key":"20+","value":"مشروع مكتمل"},{"key":"10k+","value":"سطر كود"},{"key":"∞","value":"شغف"}]'::jsonb,
  true
)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- PROJECTS
-- ────────────────────────────────────────────────────────────
create table if not exists projects (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text not null default '',
  tags jsonb not null default '[]'::jsonb,
  link text not null default '#',
  image_url text,
  emoji text not null default '📦',
  active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists projects_sort_order_idx on projects(sort_order);

-- Sample projects
insert into projects (id, name, description, tags, link, emoji, active, sort_order) values
  ('p1', 'Discord Giveaway Bot', 'بوت سحب احترافي بنظام نقاط الحظ ولوحة المتصدرين.', '["Node.js","Discord.js","Supabase"]'::jsonb, '#', '🎉', true, 1),
  ('p2', 'Admin Manager Bot', 'بوت إدارة متعدد المستويات مع صلاحيات Owner وAdmin.', '["Node.js","Discord.js","JSON"]'::jsonb, '#', '🛡️', true, 2),
  ('p3', 'Portfolio Dashboard', 'موقع شخصي بتصميم Dashboard مستقبلي.', '["Next.js","Tailwind","Supabase"]'::jsonb, '#', '🖥️', false, 3)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- SKILL GROUPS
-- ────────────────────────────────────────────────────────────
create table if not exists skill_groups (
  id text primary key default gen_random_uuid()::text,
  group_name text not null,
  sort_order integer not null default 0
);

-- SKILLS
create table if not exists skills (
  id text primary key default gen_random_uuid()::text,
  group_id text not null references skill_groups(id) on delete cascade,
  name text not null,
  percentage integer not null default 75 check (percentage >= 0 and percentage <= 100),
  sort_order integer not null default 0
);

-- Sample skill groups + skills
insert into skill_groups (id, group_name, sort_order) values
  ('g1', 'الواجهة الأمامية', 1),
  ('g2', 'الخلفية والـ API', 2),
  ('g3', 'الأدوات والـ DevOps', 3)
on conflict (id) do nothing;

insert into skills (id, group_id, name, percentage, sort_order) values
  ('s1', 'g1', 'React / Next.js', 80, 1),
  ('s2', 'g1', 'Tailwind CSS', 85, 2),
  ('s3', 'g1', 'JavaScript', 90, 3),
  ('s4', 'g2', 'Node.js', 90, 1),
  ('s5', 'g2', 'Supabase', 85, 2),
  ('s6', 'g2', 'REST APIs', 80, 3),
  ('s7', 'g3', 'Git & GitHub', 85, 1),
  ('s8', 'g3', 'PM2 / Linux', 75, 2),
  ('s9', 'g3', 'Discord.js', 95, 3)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- SOCIAL LINKS
-- ────────────────────────────────────────────────────────────
create table if not exists social_links (
  id text primary key default gen_random_uuid()::text,
  platform text not null,
  handle text not null,
  url text not null,
  icon text not null default '🌐',
  color text not null default '#888888',
  sort_order integer not null default 0
);

insert into social_links (id, platform, handle, url, icon, color, sort_order) values
  ('sl1', 'GitHub', '@saud-dev', 'https://github.com', '💻', '#333333', 1),
  ('sl2', 'Twitter / X', '@saud_dev', 'https://twitter.com', '🐦', '#1da1f2', 2),
  ('sl3', 'LinkedIn', 'Saud', 'https://linkedin.com', '💼', '#0077b5', 3),
  ('sl4', 'Discord', 'saud#0000', '#', '🎮', '#5865f2', 4)
on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────
-- Allow public READ on all tables
alter table profile enable row level security;
alter table projects enable row level security;
alter table skill_groups enable row level security;
alter table skills enable row level security;
alter table social_links enable row level security;

create policy "Public read profile" on profile for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read skill_groups" on skill_groups for select using (true);
create policy "Public read skills" on skills for select using (true);
create policy "Public read social_links" on social_links for select using (true);

-- Service role bypasses RLS automatically (for admin writes)
-- No additional policies needed for service role

-- ────────────────────────────────────────────────────────────
-- UPDATED_AT trigger for profile
-- ────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profile_updated_at
  before update on profile
  for each row execute function update_updated_at();
