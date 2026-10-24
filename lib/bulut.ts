"use client";
// Hesap ve bulut eşitleme (Supabase). İlerleme yine önce bu cihazda (localStorage) tutulur; giriş yapmış öğrencinin
// verisi ayrıca "ilerleme" tablosundaki tek satırına yazılır. Buluttaki veriyle cihazdaki veri birleştirilir
// (kurallar lib/esitle.ts), böylece öğrenci telefon değiştirse de, hesabı açmadan önce çalıştıklarını da kaybetmez.
// Adres ve anahtar herkese açık (publishable) değerlerdir; tabloyu satır düzeyi güvenlik (RLS) korur.
import { useEffect, useState, useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { ayni, birlestir3, ESIT, type Veri } from "./esitle";
import type { Puan } from "./puan";
import { olay } from "./olay";
import { adres } from "./site";
import { KEYS, read, subscribe, write } from "./store";

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

// ---- Eşitleme ----
// Kurallar lib/esitle.ts içinde. Her eşitleme turu: buluttakini oku, cihazdaki ve son eşitlenen "temel" ile
// birleştir, buluta sürüm koşuluyla yaz, sonucu cihaza uygula. Okuma başarısız olursa hiçbir şey yazılmaz;
// tur bir süre sonra (ve bağlantı dönünce) yeniden denenir. Her tur başladığı hesaba ve oturuma bağlıdır:
// çıkış ya da hesap değişince eski turun sonucu ne cihaza ne buluta yazılır.
const cihazVerisi = (): Veri => Object.fromEntries(ESIT.map((k) => [k, read(KEYS[k], null)]).filter(([, v]) => v !== null));
const veriAl = (v: unknown): Veri => {
  const { _surum, ...veri } = (v ?? {}) as Veri & { _surum?: unknown };
  void _surum;
  return veri;
};

/** Bu cihazın bu hesapla buluta en son eşitlediği veri (üç yönlü birleştirmenin temeli). */
const TEMEL = "tf-bulut";
const temelOku = (id: string): Veri | null => {
  const t = read<{ id?: string; veri?: Veri } | null>(TEMEL, null);
  return t?.id === id && t.veri ? t.veri : null;
};

export type Esitleme = "yok" | "esitleniyor" | "tamam" | "hata";
let esitleme: Esitleme = "yok";
const esitlemeDinleyen = new Set<() => void>();
const esitlemeYaz = (d: Esitleme) => { if (esitleme !== d) { esitleme = d; esitlemeDinleyen.forEach((l) => l()); } };
/** Ayarlar ekranı için: buluta kayıt yapılabildi mi. */
export const useEsitleme = () => useSyncExternalStore((l) => { esitlemeDinleyen.add(l); return () => { esitlemeDinleyen.delete(l); }; }, () => esitleme, () => "yok" as Esitleme);

let kullanici: string | null = null;
let kayitAdi: string | undefined;
/** Oturum nesli: her başlatma/durdurmada artar; eski turların sonucu bununla ayıklanır. */
let nesil = 0;
let uygulaniyor = false;
let zamanlayici: ReturnType<typeof setTimeout> | undefined;
let yeniden: ReturnType<typeof setTimeout> | undefined;
let deneme = 0;
let suren: Promise<boolean> | null = null, yine = false;
let birakDinleme: (() => void) | undefined;

const sahip = (id: string, n: number) => kullanici === id && nesil === n;

/** Bu cihaza ve temele yazar (değişmeyeni yazmaz); eşitleme kendi yazdığını değişiklik sanmasın. */
function uygula(veri: Veri, id: string, temel: Veri) {
  uygulaniyor = true;
  try {
    for (const k of ESIT) if (veri[k] !== undefined && !ayni(read(KEYS[k], null), veri[k])) write(KEYS[k], veri[k]);
    if (!ayni(read(TEMEL, null), { id, veri: temel })) write(TEMEL, { id, veri: temel });
  } finally {
    uygulaniyor = false;
  }
}

/** Bir eşitleme turu. Sürüm çakışmasında (başka cihaz araya yazdıysa) baştan okur. */
async function birTur(id: string, n: number): Promise<boolean> {
  for (let k = 0; k < 3; k++) {
    const { data, error } = await sb().from("ilerleme").select("veri").eq("user_id", id).maybeSingle();
    if (!sahip(id, n)) return false;
    if (error) return false; // okunamayan bulut boş hesap sayılmaz
    const bulutHam = (data?.veri ?? {}) as Veri & { _surum?: number };
    const surum = typeof bulutHam._surum === "number" ? bulutHam._surum : null;
    const cihaz = cihazVerisi();
    const birlesik = birlestir3(veriAl(bulutHam), cihaz, temelOku(id));
    // Kayıtta yazılan ad hesabın bilgisinde durur; onay bağlantısı başka cihazda açıldıysa ad oradan gelir.
    if (!birlesik.ad && kayitAdi) birlesik.ad = kayitAdi.trim().slice(0, 30);
    const satir = {
      veri: { ...birlesik, _surum: (surum ?? 0) + 1 },
      puan: (birlesik.puan as Puan | undefined)?.toplam ?? 0,
      ad: ((birlesik.ad as string) ?? "").slice(0, 30),
    };
    const tablo = sb().from("ilerleme");
    const yaz = !data
      ? tablo.insert({ user_id: id, ...satir })
      : surum === null
        ? tablo.update(satir).eq("user_id", id).is("veri->_surum", null)
        : tablo.update(satir).eq("user_id", id).eq("veri->>_surum", String(surum));
    const { data: yazilan, error: yazHata } = await yaz.select("user_id");
    if (!sahip(id, n)) return false;
    if (yazHata) { if (yazHata.code === "23505") continue; return false; } // 23505: başka cihaz satırı az önce açtı
    if (!yazilan?.length) continue; // sürüm değişmiş: yeniden oku
    // Tur sürerken cihazda yeni bir şey olduysa onu da sonucun üzerine koy ve bir tur daha çalıştır.
    const simdi = cihazVerisi();
    const son = ayni(simdi, cihaz) ? birlesik : birlestir3(birlesik, simdi, cihaz);
    // Temel buluttaki haldir; cihazda fazladan değişiklik kaldıysa sıradaki tur onu yollar.
    uygula(son, id, birlesik);
    if (!ayni(son, birlesik)) yine = true;
    return true;
  }
  return false;
}

/** Eşitler; aynı anda tek tur çalışır, sürerken gelen istek bir tur daha çalıştırır. */
function esitle(): Promise<boolean> {
  if (!kullanici) return Promise.resolve(false);
  if (suren) { yine = true; return suren; }
  const id = kullanici, n = nesil;
  clearTimeout(yeniden);
  esitlemeYaz("esitleniyor");
  let p: Promise<boolean> | null = null;
  p = (async () => {
    let ok = false;
    try {
      do { yine = false; ok = await birTur(id, n).catch(() => false); } while (ok && yine && sahip(id, n));
    } finally {
      if (suren === p) suren = null;
    }
    if (!sahip(id, n)) return false;
    if (ok) { deneme = 0; esitlemeYaz("tamam"); }
    else {
      // 5, 10, 20, 40 sn... en çok 2 dk sonra yeniden dene.
      esitlemeYaz("hata");
      yeniden = setTimeout(() => { void esitle(); }, Math.min(120_000, 5000 * 2 ** deneme++));
    }
    return ok;
  })();
  suren = p;
  return p;
}

/** Bekleyen değişikliği beklemeden buluta yazar (lig ekranı açılırken son puan listeye girsin). */
export function simdiEsitle() {
  clearTimeout(zamanlayici);
  zamanlayici = undefined;
  return esitle();
}

/** Cihazda bir şey değişince birkaç saniye bekleyip eşitler (art arda değişiklikler tek turda gider). */
function degisti() {
  if (uygulaniyor || !kullanici) return;
  clearTimeout(zamanlayici);
  zamanlayici = setTimeout(() => { zamanlayici = undefined; void esitle(); }, 2500);
}

/** Girişten sonra: ilk eşitlemeyi başlatır ve cihazdaki değişiklikleri izler. */
function baslat(id: string, ad?: string) {
  if (kullanici === id) return;
  durdur();
  kullanici = id;
  kayitAdi = ad;
  birakDinleme = subscribe(degisti);
  void esitle();
}

/** Eşitlemeyi bırakır; süren tur artık hiçbir şey yazmaz. */
function durdur() {
  nesil++;
  kullanici = null;
  suren = null;
  deneme = 0;
  clearTimeout(zamanlayici);
  clearTimeout(yeniden);
  zamanlayici = undefined;
  birakDinleme?.();
  birakDinleme = undefined;
  esitlemeYaz("yok");
}
/** Cihaz hesaptan ayrılınca temel de silinir; sonraki girişte veri yeniden birleştirilir, silme sayılmaz. */
const temelSil = () => { uygulaniyor = true; try { write(TEMEL, null); } finally { uygulaniyor = false; } };

/** Hesap az önce açıldıysa kayıt olayını bir kez sayar (lib/olay.ts). Google'da hesap girişle açılır;
 *  e-postada hesap, doğrulama bağlantısına dokunulunca (ilk girişte) açılmış sayılır. */
function yeniHesapSay(s: Session) {
  const acilis = Date.parse(s.user.email_confirmed_at ?? s.user.created_at ?? "");
  if (!(Date.now() - acilis < 10 * 60_000)) return;
  try {
    if (localStorage.getItem("tf-kayit-sayildi") === s.user.id) return;
    localStorage.setItem("tf-kayit-sayildi", s.user.id);
  } catch {}
  olay("kayit_tamam", { yol: s.user.app_metadata?.provider === "google" ? "google" : "eposta" });
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
    if (data.session) baslat(data.session.user.id, data.session.user.user_metadata?.ad);
  });
  c.auth.onAuthStateChange((tur, s) => {
    oturum = s;
    yay();
    if (s && (tur === "SIGNED_IN" || tur === "INITIAL_SESSION")) baslat(s.user.id, s.user.user_metadata?.ad);
    if (s && tur === "SIGNED_IN") yeniHesapSay(s);
    if (tur === "SIGNED_OUT") { durdur(); temelSil(); }
  });
  // Sekme kapanırken bekleyen yazışı hemen gönder; bağlantı dönünce başarısız eşitlemeyi hemen yeniden dene.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && zamanlayici && kullanici) { clearTimeout(zamanlayici); zamanlayici = undefined; void esitle(); }
  });
  window.addEventListener("online", () => { if (kullanici && esitleme === "hata") void esitle(); });
}

/** Çıkış: önce son durumu buluta yazar, sonra bu cihazdaki ilerlemeyi siler (başka biri aynı cihazda kendi hesabıyla girebilsin).
 *  Son durum buluta yazılamazsa çıkış yapılmaz (false): cihazdaki ilerleme kaybolmasın. */
export async function cikisYap(sil: () => void) {
  clearTimeout(zamanlayici);
  zamanlayici = undefined;
  if (kullanici && !(await esitle())) return false;
  durdur();
  temelSil();
  await sb().auth.signOut();
  sil();
  return true;
}

/** Hesabı ve buluttaki ilerlemeyi kalıcı olarak siler (Supabase "hesap-sil" fonksiyonu), sonra cihazı temizler. */
export async function hesabiSil(sil: () => void) {
  const id = kullanici, ad = kayitAdi;
  durdur();
  const { error } = await sb().functions.invoke("hesap-sil", { method: "POST" });
  // Hesap sunucuda silindi ama yanıt yolda kaybolduysa yeniden denemek hep "oturum" hatası verir: hesap artık yoksa
  // silme başarılı sayılır, yoksa öğrenci silinmiş bir hesapta takılı kalırdı.
  const yok = error && (await sb().auth.getUser()).error?.code === "user_not_found";
  if (error && !yok) { const s = (await sb().auth.getSession()).data.session; if (s) baslat(s.user.id, ad); else if (id) baslat(id, ad); return false; }
  temelSil();
  await sb().auth.signOut({ scope: "local" });
  sil();
  return true;
}

/** Hesap anahtarları: e-posta bildirimleri (seri hatırlatması: supabase/functions/seri-hatirlat, yeni içerik:
 * supabase/functions/yenilik-bildir) ve haftalık ligde görünmek (lib/lig.ts). */
export type Bildirim = "seri_hatirlat" | "yenilik_bildir" | "ligde";
export async function bildirimOku(): Promise<Record<Bildirim, boolean> | null> {
  if (!kullanici) return null;
  const { data } = await sb().from("ilerleme").select("seri_hatirlat, yenilik_bildir, ligde").eq("user_id", kullanici).maybeSingle();
  return data ? { seri_hatirlat: data.seri_hatirlat !== false, yenilik_bildir: data.yenilik_bildir !== false, ligde: data.ligde !== false } : null;
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

// ---- Google ile giriş ----
// Düğme yalnızca Supabase panelinde Google girişi açıksa görünür (ayar Auth'un herkese açık ayarlarından okunur).
// Telefon uygulamasında şimdilik yok: Google'dan dönüş uygulamaya derin bağlantı ister.
let googleSoz: Promise<boolean> | null = null;
function googleAcik(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) return Promise.resolve(false);
  return (googleSoz ??= fetch(`${URL}/auth/v1/settings`, { headers: { apikey: ANAHTAR } })
    .then((r) => (r.ok ? r.json() : null))
    .then((j) => !!j?.external?.google)
    .catch(() => { googleSoz = null; return false; }));
}
export function useGoogle() {
  const [acik, setAcik] = useState(false);
  useEffect(() => {
    let canli = true;
    void googleAcik().then((v) => { if (canli) setAcik(v); });
    return () => { canli = false; };
  }, []);
  return acik;
}

// Girişten sonra dönülecek sayfa (ör. kayıt davetinin açıldığı konu). Eşitlenmez, yalnızca bu cihazda durur.
const DONUS = "tf-donus";
export function donusYaz(yol: string) { try { localStorage.setItem(DONUS, yol); } catch {} }
/** Kayıtlı dönüş sayfasını verir ve siler. Yalnızca site içi adres kabul edilir. */
export function donusAl(): string | null {
  try {
    const y = localStorage.getItem(DONUS);
    localStorage.removeItem(DONUS);
    return y && y.startsWith("/") && !y.startsWith("//") ? y : null;
  } catch {
    return null;
  }
}

/** Google'a gönderir; Google /giris/ sayfasına geri getirir, oturum orada açılır ve öğrenci dönüş sayfasına geçer. */
export async function googleIleGir(donus?: string) {
  if (donus) donusYaz(donus);
  const { error } = await sb().auth.signInWithOAuth({ provider: "google", options: { redirectTo: adres("/giris/") } });
  if (error) throw error;
}
