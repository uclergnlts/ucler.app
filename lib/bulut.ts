"use client";
// Hesap ve bulut eşitleme (Supabase). İlerleme yine önce bu cihazda (localStorage) tutulur; giriş yapmış öğrencinin
// verisi ayrıca "ilerleme" tablosundaki tek satırına yazılır. Girişte buluttaki veriyle cihazdaki veri birleştirilir,
// böylece öğrenci telefon değiştirse de, hesabı açmadan önce çalıştıklarını da kaybetmez.
// Adres ve anahtar herkese açık (publishable) değerlerdir; tabloyu satır düzeyi güvenlik (RLS) korur.
import { useSyncExternalStore } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { KEYS, read, subscribe, write, type Asama, type Prog, type Tekrar, type Unite, type Yer } from "./store";
import type { Gun, Puan } from "./puan";

const URL = "https://ergxksjvcykgmckpsrlw.supabase.co";
const ANAHTAR = "sb_publishable_TJpZ-0YfaA4NJnI-JxF2Ow_PeAoqLlt";

let istemci: SupabaseClient | null = null;
/** Supabase istemcisi; yalnızca tarayıcıda, ilk gerektiğinde kurulur. */
export function sb() {
  if (!istemci) istemci = createClient(URL, ANAHTAR, { auth: { flowType: "pkce", persistSession: true, detectSessionInUrl: true } });
  return istemci;
}

// ---- Oturum durumu (bileşenler useOturum ile okur) ----
/** undefined: henüz bilinmiyor, null: giriş yok. */
let oturum: Session | null | undefined;
const dinleyen = new Set<() => void>();
const yay = () => dinleyen.forEach((l) => l());
function oturumDinle(l: () => void) {
  dinleyen.add(l);
  return () => { dinleyen.delete(l); };
}
export const useOturum = () => useSyncExternalStore(oturumDinle, () => oturum, () => undefined);

// ---- Eşitlenen anahtarlar ----
const ESIT = ["prog", "saved", "ad", "tekrar", "anlamadim", "asama", "puan", "gorev", "yer", "ipucu", "unite"] as const;
type Veri = Partial<Record<(typeof ESIT)[number], unknown>>;

const cihazVerisi = (): Veri => Object.fromEntries(ESIT.map((k) => [k, read(KEYS[k], null)]).filter(([, v]) => v !== null));

const birlesimDizi = (a: unknown, b: unknown) => [...new Set([...((a as string[]) ?? []), ...((b as string[]) ?? [])])];
const enBuyuk = (a: unknown, b: unknown) => {
  const x = { ...((a as Record<string, number>) ?? {}) };
  for (const [k, v] of Object.entries((b as Record<string, number>) ?? {})) x[k] = Math.max(x[k] ?? 0, v);
  return x;
};

/** Puan: gün sayaçları sayaç sayaç büyük olanı alır; toplam ve en uzun seri büyük olan; seri son aktif günü yeni olandan. */
function puanBirlestir(a?: Puan, b?: Puan): Puan {
  if (!a) return b ?? {};
  if (!b) return a;
  const gunler: Record<string, Gun> = { ...(a.gunler ?? {}) };
  for (const [g, s] of Object.entries(b.gunler ?? {})) {
    const o = { ...(gunler[g] ?? {}) } as Record<string, number>;
    for (const [k, v] of Object.entries(s as Record<string, number>)) o[k] = Math.max(o[k] ?? 0, v);
    gunler[g] = o as Gun;
  }
  const seriA = a.seriSon ?? "", seriB = b.seriSon ?? "";
  const s = seriA > seriB || (seriA === seriB && (a.seri ?? 0) >= (b.seri ?? 0)) ? a : b;
  return {
    toplam: Math.max(a.toplam ?? 0, b.toplam ?? 0),
    enUzun: Math.max(a.enUzun ?? 0, b.enUzun ?? 0),
    gunler,
    ...(s.seriSon ? { seri: s.seri, seriSon: s.seriSon } : {}),
  };
}

/** Buluttaki veri (b) ile cihazdaki veriyi (c) birleştirir. İlerleme hiçbir zaman geri gitmez. */
export function birlestir(b: Veri, c: Veri): Veri {
  const prog: Prog = { ...((b.prog as Prog) ?? {}), ...((c.prog as Prog) ?? {}) };
  return {
    prog,
    saved: birlesimDizi(c.saved, b.saved),
    anlamadim: birlesimDizi(c.anlamadim, b.anlamadim),
    ipucu: birlesimDizi(c.ipucu, b.ipucu),
    ad: (c.ad as string) || (b.ad as string) || "",
    tekrar: { ...((b.tekrar as Tekrar) ?? {}), ...((c.tekrar as Tekrar) ?? {}) },
    asama: enBuyuk(b.asama as Asama, c.asama as Asama),
    unite: enBuyuk(b.unite as Unite, c.unite as Unite),
    yer: { ...((b.yer as Yer) ?? {}), ...((c.yer as Yer) ?? {}) },
    puan: puanBirlestir(b.puan as Puan, c.puan as Puan),
    gorev: c.gorev ?? b.gorev ?? {},
  };
}

// ---- Eşitleme ----
let kullanici: string | null = null;
let uygulaniyor = false;
let zamanlayici: ReturnType<typeof setTimeout> | undefined;
let birakDinleme: (() => void) | undefined;

async function gonder() {
  if (!kullanici) return;
  const veri = cihazVerisi();
  const puan = (veri.puan as Puan | undefined)?.toplam ?? 0;
  await sb().from("ilerleme").upsert({ user_id: kullanici, veri, puan, ad: ((veri.ad as string) ?? "").slice(0, 30) });
}
/** Cihazda bir şey değişince birkaç saniye bekleyip buluta yazar (art arda değişiklikler tek yazışta gider). */
function degisti() {
  if (uygulaniyor || !kullanici) return;
  clearTimeout(zamanlayici);
  zamanlayici = setTimeout(() => { void gonder(); }, 2500);
}

/** Girişten sonra: buluttakiyle cihazdakini birleştirir, cihaza yazar, sonucu buluta gönderir; sonra değişiklikleri izler. */
async function baslat(id: string, kayitAdi?: string) {
  if (kullanici === id) return;
  kullanici = id;
  const { data } = await sb().from("ilerleme").select("veri").eq("user_id", id).maybeSingle();
  const yeni = birlestir((data?.veri as Veri) ?? {}, cihazVerisi());
  // Kayıtta yazılan ad hesabın bilgisinde durur; onay bağlantısı başka cihazda açıldıysa ad oradan gelir.
  if (!yeni.ad && kayitAdi) yeni.ad = kayitAdi.trim().slice(0, 30);
  uygulaniyor = true;
  for (const k of ESIT) if (yeni[k] !== undefined) write(KEYS[k], yeni[k]);
  uygulaniyor = false;
  await gonder();
  birakDinleme?.();
  birakDinleme = subscribe(degisti);
}

function durdur() {
  kullanici = null;
  clearTimeout(zamanlayici);
  birakDinleme?.();
  birakDinleme = undefined;
}

let kuruldu = false;
/** Uygulama açılınca bir kez çağrılır (components/Bulut.tsx). */
export function bulutKur() {
  if (kuruldu) return;
  kuruldu = true;
  const c = sb();
  c.auth.getSession().then(({ data }) => {
    oturum = data.session;
    yay();
    if (data.session) void baslat(data.session.user.id, data.session.user.user_metadata?.ad);
  });
  c.auth.onAuthStateChange((olay, s) => {
    oturum = s;
    yay();
    if (s && (olay === "SIGNED_IN" || olay === "INITIAL_SESSION")) void baslat(s.user.id, s.user.user_metadata?.ad);
    if (olay === "SIGNED_OUT") durdur();
  });
  // Sekme kapanırken bekleyen yazışı hemen gönder.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && zamanlayici && kullanici) { clearTimeout(zamanlayici); zamanlayici = undefined; void gonder(); }
  });
}

/** Çıkış: önce son durumu buluta yazar, sonra bu cihazdaki ilerlemeyi siler (başka biri aynı cihazda kendi hesabıyla girebilsin). */
export async function cikisYap(sil: () => void) {
  clearTimeout(zamanlayici);
  await gonder();
  durdur();
  await sb().auth.signOut();
  sil();
}

/** Hesabı ve buluttaki ilerlemeyi kalıcı olarak siler (Supabase "hesap-sil" fonksiyonu), sonra cihazı temizler. */
export async function hesabiSil(sil: () => void) {
  clearTimeout(zamanlayici);
  durdur();
  const { error } = await sb().functions.invoke("hesap-sil", { method: "POST" });
  if (error) { const s = (await sb().auth.getSession()).data.session; if (s) void baslat(s.user.id); return false; }
  await sb().auth.signOut({ scope: "local" });
  sil();
  return true;
}

/** E-posta bildirimleri: seri hatırlatması (supabase/functions/seri-hatirlat) ve yeni içerik (supabase/functions/yenilik-bildir). */
export type Bildirim = "seri_hatirlat" | "yenilik_bildir";
export async function bildirimOku(): Promise<Record<Bildirim, boolean> | null> {
  if (!kullanici) return null;
  const { data } = await sb().from("ilerleme").select("seri_hatirlat, yenilik_bildir").eq("user_id", kullanici).maybeSingle();
  return data ? { seri_hatirlat: data.seri_hatirlat !== false, yenilik_bildir: data.yenilik_bildir !== false } : null;
}
export async function bildirimYaz(tur: Bildirim, acik: boolean) {
  if (!kullanici) return false;
  const { error } = await sb().from("ilerleme").update({ [tur]: acik }).eq("user_id", kullanici);
  return !error;
}

/** Supabase hata iletilerini öğrencinin anlayacağı Türkçe cümlelere çevirir. */
export function hataMetni(e: { message?: string; code?: string } | null | undefined): string {
  const m = `${e?.code ?? ""} ${e?.message ?? ""}`.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid_credentials")) return "E-posta ya da şifre yanlış.";
  if (m.includes("email not confirmed") || m.includes("email_not_confirmed")) return "E-postanı henüz doğrulamadın. Gelen kutundaki bağlantıya dokun.";
  if (m.includes("already registered") || m.includes("user_already_exists")) return "Bu e-postayla zaten bir hesap var. Giriş yapmayı dene.";
  if (m.includes("password") && (m.includes("short") || m.includes("weak") || m.includes("characters"))) return "Şifre en az 8 karakter olmalı.";
  if (m.includes("not authorized") || m.includes("email_address_not_authorized")) return "Şu an e-posta gönderemiyoruz, hesap açma kısa süre sonra açılacak.";
  if (m.includes("rate limit") || m.includes("over_email_send_rate_limit") || m.includes("too many")) return "Çok fazla deneme oldu. Birkaç dakika sonra yeniden dene.";
  if (m.includes("invalid") && m.includes("email")) return "Bu e-posta adresi geçerli görünmüyor.";
  if (m.includes("fetch") || m.includes("network")) return "İnternet bağlantısı yok gibi görünüyor.";
  return "Bir sorun oldu. Biraz sonra yeniden dene.";
}
