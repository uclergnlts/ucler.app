-- Öğrenci bildirimi: "Anlamadım" ya da "Hata var" (kart, adım, test sorusu, video). Uygulandı: 2026-10-24.
-- Giriş yapmamış ziyaretçi de gönderebilir (anon). Öğrenciler yalnızca ekler; okuyamaz, değiştiremez.
-- Ekip bildirimleri Supabase panelinde (Table Editor > bildirim) görür; ayrıca her sabah özet e-postası gider
-- (supabase/functions/bildirim-ozet, alıcı ozel.ayar 'bildirim_alici').
create table if not exists public.bildirim (
  id uuid primary key default gen_random_uuid(),
  olusturma timestamptz not null default now(),
  tur text not null check (tur in ('anlamadim', 'hata')),
  ders text not null check (length(ders) <= 20),
  konu text check (length(konu) <= 80),
  yer text not null check (length(yer) <= 80),          -- ör. "kart 3", "adım 5", "test sorusu 2", "video KIM-01"
  ozet text check (length(ozet) <= 300),                -- kart başlığı ya da sorunun ilk cümlesi (okurken kolaylık)
  "not" text check (length("not") <= 600),              -- öğrencinin isteğe bağlı açıklaması
  sayfa text check (length(sayfa) <= 300),              -- açıldığı adres
  platform text check (length(platform) <= 20),         -- web, ios, android
  user_id uuid default auth.uid() references auth.users (id) on delete set null,
  durum text not null default 'yeni' check (durum in ('yeni', 'bakildi', 'duzeltildi')),
  gonderildi timestamptz                                -- özet e-postasına girdiği an
);
create index if not exists bildirim_olusturma on public.bildirim (olusturma desc);
create index if not exists bildirim_gonderilmedi on public.bildirim (olusturma) where gonderildi is null;

alter table public.bildirim enable row level security;
revoke all on public.bildirim from anon, authenticated;
-- Yalnızca bu sütunlar yazılabilir; user_id (oturumdan), durum ve gonderildi sunucuda dolar.
grant insert (tur, ders, konu, yer, ozet, "not", sayfa, platform) on public.bildirim to anon, authenticated;
create policy "bildirim ekle" on public.bildirim for insert to anon, authenticated
  with check (user_id is not distinct from auth.uid() and durum = 'yeni' and gonderildi is null);

-- Kaba bir taşkın sınırı: bir dakikada en çok 60 bildirim (herkes için toplam).
create or replace function ozel.bildirim_sinir() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.bildirim where olusturma > now() - interval '1 minute') >= 60 then
    raise exception 'çok fazla bildirim, biraz sonra yeniden dene';
  end if;
  return new;
end $$;
revoke all on function ozel.bildirim_sinir() from public, anon, authenticated;
drop trigger if exists bildirim_sinir on public.bildirim;
create trigger bildirim_sinir before insert on public.bildirim for each row execute function ozel.bildirim_sinir();

-- Özet e-postasının alıcısı (yalnızca servis rolü okur). Ayarlamak için:
--   insert into ozel.ayar (ad, deger) values ('bildirim_alici', 'adres@ornek.com')
--   on conflict (ad) do update set deger = excluded.deger;
create or replace function public.bildirim_alici() returns text
language sql stable security definer set search_path = '' as $$
  select deger from ozel.ayar where ad = 'bildirim_alici';
$$;
revoke all on function public.bildirim_alici() from public, anon, authenticated;
grant execute on function public.bildirim_alici() to service_role;

-- Her gün 06:00 UTC (09:00 Türkiye). Anahtar seri hatırlatmasıyla aynı (ozel.ayar 'seri_cron').
select cron.schedule('bildirim-ozet', '0 6 * * *', $$
  select net.http_post(
    url := 'https://ergxksjvcykgmckpsrlw.supabase.co/functions/v1/bildirim-ozet',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-cron-anahtar', (select deger from ozel.ayar where ad = 'seri_cron')),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
$$);
