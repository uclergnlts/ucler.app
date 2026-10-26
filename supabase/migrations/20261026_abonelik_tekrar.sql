-- Codex denetimi D6-02 (2026-10-26): RevenueCat olayları idempotent işlenir.
-- Fonksiyon (supabase/functions/revenuecat) olayı işlemeden ÖNCE abonelik_olay_al ile alır. Aynı kimlikli olay ikinci kez
-- gelirse (RevenueCat yeniden teslim eder) false döner ve olay hiç işlenmez. İşleme yarıda kalırsa kayıt bırakılır
-- (abonelik_olay_birak) ve RevenueCat'in yeniden denemesi olayı işler; kayıt 2 dakikadan uzun yarım kalırsa
-- (fonksiyon çöktüyse) yeniden alınabilir.
alter table ozel.abonelik_olay add column if not exists islendi boolean not null default true; -- eski kayıtlar işlenmiş
alter table ozel.abonelik_olay alter column islendi set default false;

create or replace function public.abonelik_olay_al(p_id text, p_tur text, p_kullanici text, p_govde jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  al boolean;
begin
  insert into ozel.abonelik_olay as o (id, tur, app_user_id, govde, islendi)
  values (p_id, p_tur, p_kullanici, p_govde, false)
  on conflict (id) do update set alindi = now()
    where o.islendi = false and o.alindi < now() - interval '2 minutes'
  returning true into al;
  return coalesce(al, false);
end $$;

create or replace function public.abonelik_olay_bitti(p_id text) returns void
language sql security definer set search_path = '' as $$
  update ozel.abonelik_olay set islendi = true where id = p_id;
$$;

create or replace function public.abonelik_olay_birak(p_id text) returns void
language sql security definer set search_path = '' as $$
  delete from ozel.abonelik_olay where id = p_id and islendi = false;
$$;

-- Aktarmada (TRANSFER) yeni hesabın güncel Plus'ını RevenueCat'ten okumak için gizli API anahtarı (sk_...).
-- İsteğe bağlı: yoksa fonksiyon eski hesabın satırını kopyalar. Eklemek için:
--   insert into ozel.ayar (ad, deger) values ('revenuecat_api', 'sk_...') on conflict (ad) do update set deger = excluded.deger;
create or replace function public.revenuecat_api_anahtari() returns text
language sql stable security definer set search_path = '' as $$
  select deger from ozel.ayar where ad = 'revenuecat_api';
$$;

revoke all on function public.abonelik_olay_al(text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.abonelik_olay_bitti(text) from public, anon, authenticated;
revoke all on function public.abonelik_olay_birak(text) from public, anon, authenticated;
revoke all on function public.revenuecat_api_anahtari() from public, anon, authenticated;
grant execute on function public.abonelik_olay_al(text, text, text, jsonb) to service_role;
grant execute on function public.abonelik_olay_bitti(text) to service_role;
grant execute on function public.abonelik_olay_birak(text) to service_role;
grant execute on function public.revenuecat_api_anahtari() to service_role;
