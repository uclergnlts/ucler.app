-- Codex denetimi D6-09 (2026-10-26): örnek öğrenciler gerçek yarıştan ayrılır.
-- Örnekler listede puanlarıyla görünmeye devam eder, ama:
--   * 'ornek': true ile işaretlenir, arayüz "örnek" etiketi gösterir;
--   * sıra numarası almaz (sira null); gerçek öğrencilerin sırası yalnız gerçek öğrenciler arasında hesaplanır;
--   * kişi sayısına ve geçen haftanın madalyalarına girmez.
-- Kapatmak yine: update ozel.lig_ornek set aktif = false;
create or replace function public.haftalik_lig()
returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  bugun date := (now() at time zone 'Europe/Istanbul')::date;
  bas date := date_trunc('week', bugun)::date;
  ben uuid := auth.uid();
  sonuc jsonb;
begin
  with bu as (select * from ozel.hafta_puan(bas)),
  gorunen as (
    select user_id, ad, puan, rank() over (order by puan desc)::int sira
    from bu where ligde and puan > 0
  ),
  hepsi as (
    select user_id, ad, puan, sira, false ornek from gorunen
    union all
    select user_id, ad, puan, null::int, true from ozel.ornek_puan(bas) where puan > 0
  ),
  sirali as (
    select *, row_number() over (order by puan desc, ornek, ad)::int sn from hepsi
  ),
  gecen as (
    select user_id, row_number() over (order by puan desc, ad)::int s
    from ozel.hafta_puan(bas - 7)
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
        'ornek', g.ornek,
        'madalya', (select x.s from gecen x where x.user_id = g.user_id)) order by g.sn)
      from sirali g where g.sn <= 60), '[]'::jsonb),
    'ben', (select jsonb_build_object('sira', k.sira, 'ad', k.ad, 'puan', k.puan, 'ligde', k.ligde,
        'madalya', (select x.s from gecen x where x.user_id = ben)) from kendim k)
  ) into sonuc;
  return sonuc;
end;
$$;
revoke all on function public.haftalik_lig() from public;
grant execute on function public.haftalik_lig() to anon, authenticated;
