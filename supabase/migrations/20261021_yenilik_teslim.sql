-- Yeni içerik e-postasının teslim takibi (Codex denetimi D4-05). Uygulandı: 2026-10-21.
-- duyurulan.tamam: içerik bütün alıcılara ulaştı mı. Var olan satırlar duyurulmuş sayılır.
alter table public.duyurulan add column if not exists tamam boolean not null default true;

-- Bekleyen içerikte, e-postası Resend'e kabul edilmiş alıcılar; aynı kişiye ikinci kez gönderilmez.
create table if not exists public.duyuru_teslim (
  oge_id text not null references public.duyurulan(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  gonderildi timestamptz not null default now(),
  primary key (oge_id, user_id)
);
alter table public.duyuru_teslim enable row level security;
revoke all on public.duyuru_teslim from anon, authenticated;
