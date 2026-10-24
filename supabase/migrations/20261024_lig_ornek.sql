-- Uygulandı: 2026-10-24 (Supabase MCP, proje ergxksjvcykgmckpsrlw).
-- Haftalık ligde örnek öğrenciler: uygulama yeniyken lig boş görünmesin diye.
-- Bunlar gerçek hesap değildir: auth.users ve public.ilerleme'de satırları yoktur, bu yüzden hiçbir e-posta
-- (seri hatırlatma, yenilik, hoş geldin) almazlar, istatistiklere girmezler. Yalnızca haftalik_lig() listesine katılırlar.
-- Puanları gün gün, kimlik + tarihten türeyen sabit bir sayıyla hesaplanır: her hafta kendiliğinden değişir,
-- gün içinde de saat ilerledikçe artar (bugünün puanı 08:00-22:00 arasında yavaş yavaş dolar).
-- Kapatmak için: update ozel.lig_ornek set aktif = false;  (ya da tek tek satırları)
create table if not exists ozel.lig_ornek (
  id uuid primary key default gen_random_uuid(),
  ad text not null,
  -- 0-1 arası: ne kadar sık ve ne kadar çok çalıştığı.
  seviye numeric not null check (seviye between 0 and 1),
  aktif boolean not null default true
);
alter table ozel.lig_ornek enable row level security;
revoke all on table ozel.lig_ornek from public, anon, authenticated;

insert into ozel.lig_ornek (ad, seviye)
select v.ad, v.seviye from (values
  ('Elif K.', 0.92), ('Yusuf', 0.85), ('Zeynep A.', 0.80), ('Mert D.', 0.74), ('Defne', 0.70),
  ('Öğrenci 4827', 0.66), ('Ahmet Y.', 0.62), ('Ecrin S.', 0.58), ('Emir', 0.55), ('Nehir T.', 0.52),
  ('Kerem B.', 0.48), ('Ayşe', 0.45), ('Öğrenci 7310', 0.42), ('Berat Ç.', 0.40), ('Ela', 0.37),
  ('Ömer F.', 0.34), ('Duru M.', 0.31), ('Eymen', 0.28), ('Öğrenci 2195', 0.25), ('Asel K.', 0.22),
  ('Hiranur', 0.20), ('Burak E.', 0.17), ('Melis Ö.', 0.14), ('Öğrenci 5603', 0.11), ('Can', 0.08),
  ('Sude G.', 0.05)
) v(ad, seviye)
where not exists (select 1 from ozel.lig_ornek);

-- Örneklerin bas haftasındaki puanı; hafta_puan ile aynı biçimde döner.
create or replace function ozel.ornek_puan(bas date)
returns table (user_id uuid, ad text, puan int, ligde boolean)
language sql stable security definer set search_path = '' as $$
  with simdi as (
    select (now() at time zone 'Europe/Istanbul') t
  ), gunler as (
    select o.id, o.ad, o.seviye, d::date gun,
      abs(hashtext(o.id::text || d::date::text)) h
    from ozel.lig_ornek o, simdi,
      generate_series(bas, least(bas + 6, simdi.t::date), interval '1 day') d
    where o.aktif
  )
  select g.id, g.ad,
    coalesce(sum(
      case when g.h % 100 < 25 + g.seviye * 65 then
        -- O günün tam puanı: 20 ile (60 + seviye*280) arası, bugünse saate göre bir kısmı.
        (20 + (g.h / 100 % 1000) / 1000.0 * (40 + g.seviye * 280))
        * case when g.gun < (select t::date from simdi) then 1
            else least(1, greatest(0, (extract(epoch from (select t from simdi)::time) / 3600 - 8) / 14)) end
      else 0 end)::int, 0),
    true
  from gunler g
  group by g.id, g.ad;
$$;
revoke all on function ozel.ornek_puan(date) from public, anon, authenticated;

-- 20261021_haftalik_lig.sql'deki fonksiyonun aynısı; tek fark gerçek puanlara örneklerin eklenmesi.
create or replace function public.haftalik_lig()
returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  bugun date := (now() at time zone 'Europe/Istanbul')::date;
  bas date := date_trunc('week', bugun)::date;
  ben uuid := auth.uid();
  sonuc jsonb;
begin
  with bu as (select * from ozel.hafta_puan(bas) union all select * from ozel.ornek_puan(bas)),
  gorunen as (
    select user_id, ad, puan, rank() over (order by puan desc)::int sira,
      row_number() over (order by puan desc, ad)::int sn
    from bu where ligde and puan > 0
  ),
  gecen as (
    select user_id, row_number() over (order by puan desc, ad)::int s
    from (select * from ozel.hafta_puan(bas - 7) union all select * from ozel.ornek_puan(bas - 7)) g
    where ligde and puan > 0
    order by puan desc, ad limit 3
  ),
  kendim as (
    select b.ad, b.puan, b.ligde,
      case when b.ligde and b.puan > 0 then (select g.sira from gorunen g where g.user_id = b.user_id)
        else (select count(*) from gorunen g where g.puan > b.puan)::int + 1 end sira
    from bu b where b.user_id = ben
  )
  select jsonb_build_object(
    'bas', bas,
    'bitis', ((bas + 7)::timestamp at time zone 'Europe/Istanbul'),
    'kisi', (select count(*) from gorunen),
    'liste', coalesce((
      select jsonb_agg(jsonb_build_object('sira', g.sira, 'ad', g.ad, 'puan', g.puan, 'ben', g.user_id = ben,
        'madalya', (select x.s from gecen x where x.user_id = g.user_id)) order by g.sn)
      from gorunen g where g.sn <= 50), '[]'::jsonb),
    'ben', (select jsonb_build_object('sira', k.sira, 'ad', k.ad, 'puan', k.puan, 'ligde', k.ligde,
        'madalya', (select x.s from gecen x where x.user_id = ben)) from kendim k)
  ) into sonuc;
  return sonuc;
end;
$$;
revoke all on function public.haftalik_lig() from public;
grant execute on function public.haftalik_lig() to anon, authenticated;
