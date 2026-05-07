alter table public.site_settings
add column if not exists seo_pages jsonb not null default '{}'::jsonb;
