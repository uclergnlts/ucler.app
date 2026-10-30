-- Günün sorusu: herkese aynı etkileşimli soru, gün Türkiye saatiyle 00:00'da değişir. Tek deneme hakkı vardır.
-- Süre ve puan sunucuda tutulur: "Başla" anı (basla) ve cevap anı (bitis) sunucu saatidir, puan bitir()'de hesaplanır.
-- Doğru: 100 + hız bonusu (ilk 10 sn +50, sonra 60. saniyeye kadar azalarak 0). Yanlış: 0.
-- Puan haftalık lige eklenir (ozel.hafta_puan aşağıda yeniden tanımlanır; günlük 600 sınırının dışında, en çok 150).
-- Tabloya doğrudan erişim yoktur; istemci yalnızca aşağıdaki üç fonksiyonu çağırır. Hesap silinince satırlar da silinir.
-- Hangi sorunun sorulacağını istemci seçer (lib/gunsoru.ts); sunucu ilk "Başla"da gelen soru anahtarını saklar.
create table if not exists public.gunun_sorusu (
  user_id uuid not null references auth.users (id) on delete cascade,
  gun date not null,
  soru text not null,
  basla timestamptz not null default now(),
  bitis timestamptz,
  dogru boolean,
  sure_ms int,
  puan int not null default 0,
  primary key (user_id, gun)
);
create index if not exists gunun_sorusu_gun on public.gunun_sorusu (gun);
alter table public.gunun_sorusu enable row level security;
revoke all on table public.gunun_sorusu from public, anon, authenticated;

-- Doğru cevabın puanı; components/GunSorusu.tsx'teki gunPuan ile aynı.
create or replace function ozel.gun_puan(ms int)
returns int language sql immutable set search_path = '' as $$
  select 100 + case when ms <= 10000 then 50 when ms >= 60000 then 0
    else round(50 * (60000 - ms) / 50000.0)::int end;
$$;

-- Öğrencinin bugünkü kaydı, günün sorusu serisi ve (cevapladıysa) bugünün istatistiği.
create or replace function ozel.gun_durum(ben uuid, bugun date)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  k public.gunun_sorusu;
  son date;
  seri int := 0;
  ist jsonb := null;
begin
  select * into k from public.gunun_sorusu where user_id = ben and gun = bugun;
  -- Seri: bugün ya da dün biten, arada boş gün olmayan cevaplanmış günler.
  select max(gun) into son from public.gunun_sorusu where user_id = ben and bitis is not null and gun <= bugun;
  if son is not null and son >= bugun - 1 then
    select count(*) into seri from (
      select gun, row_number() over (order by gun desc) n
      from public.gunun_sorusu where user_id = ben and bitis is not null and gun <= son
    ) r where r.gun = son - (r.n - 1)::int;
  end if;
  if k.bitis is not null then
    -- Bugün cevaplayan herkes; "hızlıydın": doğru yapan öğrenci, yanlış yapanları ve kendisinden yavaş doğru yapanları geçer.
    select jsonb_build_object(
      'kisi', count(*),
      'dogru', count(*) filter (where s.dogru),
      'gectigin', case when k.dogru then count(*) filter (where s.user_id <> ben and (not s.dogru or s.sure_ms > k.sure_ms)) else 0 end)
    into ist from public.gunun_sorusu s where s.gun = bugun and s.bitis is not null;
  end if;
  return jsonb_build_object(
    'gun', bugun,
    'kayit', case when k.user_id is null then null else jsonb_build_object(
      'soru', k.soru, 'gecen_ms', (extract(epoch from (coalesce(k.bitis, now()) - k.basla)) * 1000)::bigint,
      'bitti', k.bitis is not null, 'dogru', k.dogru, 'sure_ms', k.sure_ms, 'puan', k.puan) end,
    'seri', seri,
    'ist', ist);
end;
$$;
revoke all on function ozel.gun_durum(uuid, date) from public, anon, authenticated;

create or replace function public.gunun_sorusu_durum()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'giris gerekli'; end if;
  return ozel.gun_durum(auth.uid(), (now() at time zone 'Europe/Istanbul')::date);
end;
$$;

-- Süreyi başlatır. Bugün zaten başlatıldıysa hiçbir şey değişmez (süre kaldığı yerden sürer, soru aynı kalır).
create or replace function public.gunun_sorusu_basla(p_soru text)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare bugun date := (now() at time zone 'Europe/Istanbul')::date;
begin
  if auth.uid() is null then raise exception 'giris gerekli'; end if;
  insert into public.gunun_sorusu (user_id, gun, soru) values (auth.uid(), bugun, left(p_soru, 200))
  on conflict (user_id, gun) do nothing;
  return ozel.gun_durum(auth.uid(), bugun);
end;
$$;

-- Tek cevap: yalnızca başlatılmış ve henüz cevaplanmamış kayıt güncellenir; süre sunucu saatiyle ölçülür.
create or replace function public.gunun_sorusu_bitir(p_dogru boolean)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare bugun date := (now() at time zone 'Europe/Istanbul')::date;
begin
  if auth.uid() is null then raise exception 'giris gerekli'; end if;
  update public.gunun_sorusu s set
    bitis = now(),
    dogru = p_dogru,
    sure_ms = least(2000000000, (extract(epoch from (now() - s.basla)) * 1000)::bigint)::int,
    puan = case when p_dogru then ozel.gun_puan(least(2000000000, (extract(epoch from (now() - s.basla)) * 1000)::bigint)::int) else 0 end
  where s.user_id = auth.uid() and s.gun = bugun and s.bitis is null;
  return ozel.gun_durum(auth.uid(), bugun);
end;
$$;

revoke all on function public.gunun_sorusu_durum() from public, anon;
revoke all on function public.gunun_sorusu_basla(text) from public, anon;
revoke all on function public.gunun_sorusu_bitir(boolean) from public, anon;
grant execute on function public.gunun_sorusu_durum() to authenticated;
grant execute on function public.gunun_sorusu_basla(text) to authenticated;
grant execute on function public.gunun_sorusu_bitir(boolean) to authenticated;

-- 20261021_haftalik_lig.sql'deki hafta_puan; tek fark o haftanın günün sorusu puanlarının eklenmesi.
create or replace function ozel.hafta_puan(bas date)
returns table (user_id uuid, ad text, puan int, ligde boolean)
language sql stable security definer set search_path = '' as $$
  select i.user_id,
    coalesce(nullif(btrim(i.ad), ''), 'Öğrenci ' || (1000 + abs(hashtext(i.user_id::text)) % 9000)::text),
    coalesce((
      select sum(least(600, greatest(0, (g.value->>'p')::numeric)))::int
      from jsonb_each(case when jsonb_typeof(i.veri->'puan'->'gunler') = 'object' then i.veri->'puan'->'gunler' else '{}'::jsonb end) g
      where g.key ~ '^\d{4}-\d{2}-\d{2}$' and g.key >= bas::text and g.key <= (bas + 6)::text
        and jsonb_typeof(g.value->'p') = 'number'
    ), 0)
    + coalesce((
      select sum(least(150, s.puan))::int from public.gunun_sorusu s
      where s.user_id = i.user_id and s.gun between bas and bas + 6
    ), 0),
    i.ligde
  from public.ilerleme i;
$$;
revoke all on function ozel.hafta_puan(date) from public, anon, authenticated;
