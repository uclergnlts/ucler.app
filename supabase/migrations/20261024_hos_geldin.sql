-- Hoş geldin e-postası (supabase/functions/hos-geldin). Tablo ve fonksiyon uygulandı: 2026-10-24.
-- Karşılanan hesaplar. Var olan hesaplar "eski" olarak işaretlenir, onlara gönderilmez (silinirse gönderilir).
create table if not exists public.hos_geldin (
  user_id uuid primary key references auth.users(id) on delete cascade,
  gonderildi timestamptz not null default now(),
  eski boolean not null default false
);
alter table public.hos_geldin enable row level security;
revoke all on public.hos_geldin from anon, authenticated;
insert into public.hos_geldin (user_id, eski) select id, true from auth.users on conflict do nothing;

-- E-postası onaylı, son 7 günde açılmış ve henüz karşılanmamış hesaplar.
create or replace function public.hos_geldin_bekleyen() returns table (user_id uuid)
language sql security definer set search_path = '' as $$
  select u.id from auth.users u
  where u.email_confirmed_at is not null and u.created_at > now() - interval '7 days'
    and not exists (select 1 from public.hos_geldin h where h.user_id = u.id)
  order by u.created_at limit 300;
$$;
revoke all on function public.hos_geldin_bekleyen() from public, anon, authenticated;
grant execute on function public.hos_geldin_bekleyen() to service_role;

-- 10 dakikada bir. Üçler metni onaylayınca açılır.
select cron.schedule('hos-geldin', '*/10 * * * *', $cron$
  select net.http_post(
    url := 'https://ergxksjvcykgmckpsrlw.supabase.co/functions/v1/hos-geldin',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-anahtar', (select deger from ozel.ayar where ad = 'seri_cron')),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$cron$);
