create table if not exists public.reservations (
  id text primary key,
  created_at timestamptz not null,
  status text not null,
  locale text not null,
  name text not null,
  phone text not null,
  service_type text not null,
  travel_date text not null,
  travel_time text not null,
  start_point text not null,
  destination text not null,
  airport text not null,
  flight_no text null,
  vehicle text not null,
  passengers integer not null,
  luggage integer not null,
  adult_passengers integer null,
  child_passengers integer null,
  golf_bags integer null,
  waypoints_summary text null,
  preferred_messenger text not null
);

create index if not exists idx_reservations_created_at
  on public.reservations (created_at desc);

create table if not exists public.support_inquiries (
  id text primary key,
  created_at timestamptz not null,
  locale text not null,
  name text not null,
  phone text not null,
  departure text not null,
  destination text not null,
  travel_date text not null,
  travel_time text not null,
  passengers text not null,
  message text not null,
  out_of_metro_area boolean not null default false
);

create index if not exists idx_support_inquiries_created_at
  on public.support_inquiries (created_at desc);

create table if not exists public.reviews (
  id text primary key,
  created_at timestamptz not null,
  author text not null,
  content text not null,
  images jsonb not null default '[]'::jsonb
);

create index if not exists idx_reviews_created_at
  on public.reviews (created_at desc);

create table if not exists public.site_settings (
  id text primary key,
  about_me_title text not null,
  about_me_description text not null,
  gallery_image_urls jsonb not null default '[]'::jsonb,
  vehicle_section_title text not null default '',
  vehicle_section_description text not null default '',
  pricing_tiers jsonb not null default '[]'::jsonb,
  seo_home_title text not null default '',
  seo_home_description text not null default '',
  phone_display text not null default '010-4135-7621',
  phone_tel text not null default 'tel:+821041357621',
  kakao_url text not null default '',
  instagram_url text not null default '',
  whatsapp_url text not null default '',
  line_url text not null default '',
  messenger_url text not null default '',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  about_me_title_ko text not null default '',
  about_me_title_en text not null default '',
  about_me_title_ja text not null default '',
  about_me_title_zh text not null default '',
  about_me_description_ko text not null default '',
  about_me_description_en text not null default '',
  about_me_description_ja text not null default '',
  about_me_description_zh text not null default '',
  hero_title_ko text not null default '',
  hero_title_en text not null default '',
  hero_title_ja text not null default '',
  hero_title_zh text not null default '',
  hero_subtitle_ko text not null default '',
  hero_subtitle_en text not null default '',
  hero_subtitle_ja text not null default '',
  hero_subtitle_zh text not null default '',
  seo_home_title_ko text not null default '',
  seo_home_title_en text not null default '',
  seo_home_title_ja text not null default '',
  seo_home_title_zh text not null default '',
  seo_home_description_ko text not null default '',
  seo_home_description_en text not null default '',
  seo_home_description_ja text not null default '',
  seo_home_description_zh text not null default '',
  vehicle_section_title_ko text not null default '',
  vehicle_section_title_en text not null default '',
  vehicle_section_title_ja text not null default '',
  vehicle_section_title_zh text not null default '',
  vehicle_section_description_ko text not null default '',
  vehicle_section_description_en text not null default '',
  vehicle_section_description_ja text not null default '',
  vehicle_section_description_zh text not null default '',
  pricing_tiers_ko jsonb not null default '[]'::jsonb,
  pricing_tiers_en jsonb not null default '[]'::jsonb,
  pricing_tiers_ja jsonb not null default '[]'::jsonb,
  pricing_tiers_zh jsonb not null default '[]'::jsonb
);

create table if not exists public.admin_change_logs (
  id text primary key,
  created_at timestamptz not null,
  actor text not null default 'admin',
  summary text not null default '',
  changes jsonb not null default '{}'::jsonb,
  client_ip text null,
  user_agent text null
);

create index if not exists idx_admin_change_logs_created_at
  on public.admin_change_logs (created_at desc);

alter table public.site_settings add column if not exists vehicle_section_title text not null default '';
alter table public.site_settings add column if not exists vehicle_section_description text not null default '';
alter table public.site_settings add column if not exists pricing_tiers jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists seo_home_title text not null default '';
alter table public.site_settings add column if not exists seo_home_description text not null default '';
alter table public.site_settings add column if not exists phone_display text not null default '010-4135-7621';
alter table public.site_settings add column if not exists phone_tel text not null default 'tel:+821041357621';
alter table public.site_settings add column if not exists kakao_url text not null default '';
alter table public.site_settings add column if not exists instagram_url text not null default '';
alter table public.site_settings add column if not exists whatsapp_url text not null default '';
alter table public.site_settings add column if not exists line_url text not null default '';
alter table public.site_settings add column if not exists messenger_url text not null default '';
alter table public.site_settings add column if not exists hero_title text not null default '';
alter table public.site_settings add column if not exists hero_subtitle text not null default '';
alter table public.site_settings add column if not exists about_me_title_ko text not null default '';
alter table public.site_settings add column if not exists about_me_title_en text not null default '';
alter table public.site_settings add column if not exists about_me_title_ja text not null default '';
alter table public.site_settings add column if not exists about_me_title_zh text not null default '';
alter table public.site_settings add column if not exists about_me_description_ko text not null default '';
alter table public.site_settings add column if not exists about_me_description_en text not null default '';
alter table public.site_settings add column if not exists about_me_description_ja text not null default '';
alter table public.site_settings add column if not exists about_me_description_zh text not null default '';
alter table public.site_settings add column if not exists hero_title_ko text not null default '';
alter table public.site_settings add column if not exists hero_title_en text not null default '';
alter table public.site_settings add column if not exists hero_title_ja text not null default '';
alter table public.site_settings add column if not exists hero_title_zh text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_ko text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_en text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_ja text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_zh text not null default '';
alter table public.site_settings add column if not exists seo_home_title_ko text not null default '';
alter table public.site_settings add column if not exists seo_home_title_en text not null default '';
alter table public.site_settings add column if not exists seo_home_title_ja text not null default '';
alter table public.site_settings add column if not exists seo_home_title_zh text not null default '';
alter table public.site_settings add column if not exists seo_home_description_ko text not null default '';
alter table public.site_settings add column if not exists seo_home_description_en text not null default '';
alter table public.site_settings add column if not exists seo_home_description_ja text not null default '';
alter table public.site_settings add column if not exists seo_home_description_zh text not null default '';
alter table public.site_settings add column if not exists vehicle_section_title_ko text not null default '';
alter table public.site_settings add column if not exists vehicle_section_title_en text not null default '';
alter table public.site_settings add column if not exists vehicle_section_title_ja text not null default '';
alter table public.site_settings add column if not exists vehicle_section_title_zh text not null default '';
alter table public.site_settings add column if not exists vehicle_section_description_ko text not null default '';
alter table public.site_settings add column if not exists vehicle_section_description_en text not null default '';
alter table public.site_settings add column if not exists vehicle_section_description_ja text not null default '';
alter table public.site_settings add column if not exists vehicle_section_description_zh text not null default '';
alter table public.site_settings add column if not exists pricing_tiers_ko jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists pricing_tiers_en jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists pricing_tiers_ja jsonb not null default '[]'::jsonb;
alter table public.site_settings add column if not exists pricing_tiers_zh jsonb not null default '[]'::jsonb;

insert into public.site_settings (
  id,
  about_me_title,
  about_me_description,
  gallery_image_urls,
  vehicle_section_title,
  vehicle_section_description,
  pricing_tiers,
  seo_home_title,
  seo_home_description,
  phone_display,
  phone_tel,
  kakao_url,
  instagram_url,
  whatsapp_url,
  line_url,
  messenger_url,
  hero_title,
  hero_subtitle
)
values (
  'default',
  'ABOUT ME',
  '원하시는 채널로 빠르게 연결해 예약 상담을 도와드립니다.',
  '[]'::jsonb,
  '',
  '',
  '[]'::jsonb,
  '',
  '',
  '010-4135-7621',
  'tel:+821041357621',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
)
on conflict (id) do nothing;
