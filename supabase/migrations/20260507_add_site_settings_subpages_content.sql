alter table public.site_settings
  add column if not exists subpages_content jsonb not null default '{}'::jsonb;
