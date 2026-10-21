-- Yeni içerik e-postası (supabase/functions/yenilik-bildir). Uygulandı: 2026-10-21.
alter table public.ilerleme add column if not exists yenilik_bildir boolean not null default true;

-- Daha önce duyurulan içerikler (ders:..., konu:ders/id, video:ID). Yalnızca servis rolü okur/yazar.
create table if not exists public.duyurulan (
  id text primary key,
  tur text not null,
  ad text not null,
  eklenme timestamptz not null default now()
);
alter table public.duyurulan enable row level security;
revoke all on public.duyurulan from anon, authenticated;

-- Her gün 09:00 UTC (12:00 Türkiye). Anahtar seri hatırlatmasıyla aynı (ozel.ayar 'seri_cron').
select cron.schedule('yenilik-bildir', '0 9 * * *', $$
  select net.http_post(
    url := 'https://ergxksjvcykgmckpsrlw.supabase.co/functions/v1/yenilik-bildir',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-anahtar', (select deger from ozel.ayar where ad = 'seri_cron')),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);
