-- ucler Plus aboneliği (lib/abonelik.ts). Satın alma App Store / Google Play'de, RevenueCat üzerinden olur.
-- RevenueCat her olayda (satın alma, yenileme, iptal, bitiş...) supabase/functions/revenuecat webhook'unu çağırır;
-- fonksiyon giriş yapmış öğrencinin satırını yazar. Web sitesi Plus'ı bu tablodan okur; uygulama ayrıca RevenueCat'e sorar.
-- Plus açık: bitis null (süresiz) ya da bitis > now(). Öğrenci yalnızca kendi satırını okur; yazan yalnızca fonksiyon.
create table if not exists public.abonelik (
  user_id uuid primary key references auth.users (id) on delete cascade,
  bitis timestamptz,                 -- Plus'ın bittiği / biteceği an (deneme süresi dahil)
  iptal boolean not null default false, -- öğrenci yenilemeyi kapattı: dönem sonunda biter
  urun text,                         -- mağazadaki ürün kimliği
  magaza text,                       -- APP_STORE, PLAY_STORE...
  ortam text,                        -- PRODUCTION ya da SANDBOX (deneme satın alması)
  donem text,                        -- TRIAL, NORMAL...
  son_olay text,
  olay_zamani timestamptz,           -- sırası karışan olaylarda eskisi yeniyi ezmesin
  guncellendi timestamptz not null default now()
);
alter table public.abonelik enable row level security;
revoke all on public.abonelik from anon, authenticated;
grant select on public.abonelik to authenticated;
drop policy if exists "kendi aboneligi" on public.abonelik;
create policy "kendi aboneligi" on public.abonelik for select to authenticated using (user_id = (select auth.uid()));

-- Gelen olayların kaydı (sorun çıkarsa geriye bakmak için).
create table if not exists ozel.abonelik_olay (
  id text primary key,
  alindi timestamptz not null default now(),
  tur text,
  app_user_id text,
  govde jsonb
);
revoke all on ozel.abonelik_olay from public, anon, authenticated;

-- Webhook'un gizli anahtarı (RevenueCat > Integrations > Webhooks > Authorization header). Bir kez üretilir.
insert into ozel.ayar (ad, deger) values ('revenuecat_anahtar', encode(extensions.gen_random_bytes(24), 'hex'))
on conflict (ad) do nothing;
create or replace function public.revenuecat_anahtar() returns text
language sql stable security definer set search_path = '' as $$
  select deger from ozel.ayar where ad = 'revenuecat_anahtar';
$$;
revoke all on function public.revenuecat_anahtar() from public, anon, authenticated;
grant execute on function public.revenuecat_anahtar() to service_role;

-- Fonksiyon olay kaydını bu yolla yazar (ozel şeması API'ye açık değil). true: yeni olay, false: daha önce işlendi.
create or replace function public.abonelik_olay_ekle(p_id text, p_tur text, p_kullanici text, p_govde jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  insert into ozel.abonelik_olay (id, tur, app_user_id, govde) values (p_id, p_tur, p_kullanici, p_govde);
  return true;
exception when unique_violation then
  return false;
end $$;
revoke all on function public.abonelik_olay_ekle(text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.abonelik_olay_ekle(text, text, text, jsonb) to service_role;

-- Anahtarı görmek için (RevenueCat'e yapıştırılacak):
--   select 'Bearer ' || deger from ozel.ayar where ad = 'revenuecat_anahtar';
