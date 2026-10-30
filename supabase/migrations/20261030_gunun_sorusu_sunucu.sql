-- Günün sorusu: cevabı sunucu kontrol eder (supabase/functions/gunun-sorusu). Önceki sürümde istemci
-- gunun_sorusu_bitir(p_dogru) ile "doğru" diyebiliyordu; o fonksiyon kaldırıldı. Sonucu artık yalnızca
-- servis anahtarıyla çalışan gunun_sorusu_sunucu yazar. p_dogru boş gelirse yalnızca durumu döndürür.
-- p_puanli false: uygulamadaki soru canlı listedekiyle aynı değil (eski sürüm); sonuç kaydedilir, puan 0.
create or replace function public.gunun_sorusu_sunucu(ben uuid, p_dogru boolean default null, p_puanli boolean default true)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare bugun date := (now() at time zone 'Europe/Istanbul')::date;
begin
  if p_dogru is not null then
    update public.gunun_sorusu s set
      bitis = now(),
      dogru = p_dogru,
      sure_ms = least(2000000000, (extract(epoch from (now() - s.basla)) * 1000)::bigint)::int,
      puan = case when p_dogru and p_puanli then ozel.gun_puan(least(2000000000, (extract(epoch from (now() - s.basla)) * 1000)::bigint)::int) else 0 end
    where s.user_id = ben and s.gun = bugun and s.bitis is null;
  end if;
  return ozel.gun_durum(ben, bugun);
end;
$$;
revoke all on function public.gunun_sorusu_sunucu(uuid, boolean, boolean) from public, anon, authenticated;
grant execute on function public.gunun_sorusu_sunucu(uuid, boolean, boolean) to service_role;

drop function if exists public.gunun_sorusu_bitir(boolean);
