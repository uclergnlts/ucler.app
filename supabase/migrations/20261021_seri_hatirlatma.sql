-- Uygulandı: 2026-10-21 (Supabase MCP, proje ergxksjvcykgmckpsrlw).
-- Seri hatırlatma e-postası: öğrenci kapatabilir (Ayarlar ya da e-postadaki bağlantı); aynı gün ikinci kez gönderilmez.
alter table public.ilerleme
  add column if not exists seri_hatirlat boolean not null default true,
  add column if not exists son_hatirlatma date;

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Zamanlanmış görevin edge function'a kendini tanıtması için gizli anahtar. API'ye açık olmayan şemada durur.
create schema if not exists ozel;
revoke all on schema ozel from public, anon, authenticated;
create table if not exists ozel.ayar (ad text primary key, deger text not null);
insert into ozel.ayar (ad, deger) values ('seri_cron', encode(gen_random_bytes(32), 'hex')) on conflict (ad) do nothing;

create or replace function public.seri_cron_dogrula(anahtar text) returns boolean
language sql security definer set search_path = '' as $$
  select exists (select 1 from ozel.ayar where ad = 'seri_cron' and deger = anahtar);
$$;
revoke all on function public.seri_cron_dogrula(text) from public, anon, authenticated;
grant execute on function public.seri_cron_dogrula(text) to service_role;

-- Her gün 16:00 UTC = 19:00 Türkiye.
select cron.schedule('seri-hatirlat', '0 16 * * *', $cron$
  select net.http_post(
    url := 'https://ergxksjvcykgmckpsrlw.supabase.co/functions/v1/seri-hatirlat',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-anahtar', (select deger from ozel.ayar where ad = 'seri_cron')),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$cron$);
