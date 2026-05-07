alter table public.site_settings add column if not exists hero_title_ko text not null default '';
alter table public.site_settings add column if not exists hero_title_en text not null default '';
alter table public.site_settings add column if not exists hero_title_ja text not null default '';
alter table public.site_settings add column if not exists hero_title_zh text not null default '';

alter table public.site_settings add column if not exists hero_subtitle_ko text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_en text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_ja text not null default '';
alter table public.site_settings add column if not exists hero_subtitle_zh text not null default '';
