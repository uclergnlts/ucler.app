-- Uygulandı: 2026-10-21 (Supabase MCP, proje ergxksjvcykgmckpsrlw).
-- Haftalık lig: pazartesi 00:00 - pazar 23:59 (Türkiye saati) arasında kazanılan puanlar.
-- Puan cihazda gün gün tutulur ve veri->puan->gunler içinde buluta eşitlenir; liste oradan sunucuda kurulur.
-- Günlük puan en çok 600 sayılır (puan cihazda hesaplandığı için kaba bir hile sınırı).
-- Listede yalnızca ad (boşsa takma ad), puan ve sıra döner; e-posta ya da başka veri dönmez.
alter table public.ilerleme add column if not exists ligde boolean not null default true;

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
    ), 0),
    i.ligde
  from public.ilerleme i;
$$;
revoke all on function ozel.hafta_puan(date) from public, anon, authenticated;

-- Bu haftanın ilk 50'si, çağıranın kendi satırı ve geçen haftanın ilk 3'ü (madalya için).
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
    select user_id, ad, puan, rank() over (order by puan desc)::int sira,
      row_number() over (order by puan desc, ad)::int sn
    from bu where ligde and puan > 0
  ),
  gecen as (
    select user_id, row_number() over (order by puan desc, ad)::int s
    from ozel.hafta_puan(bas - 7) where ligde and puan > 0
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
