"use client";
// İlerleme ve kaydedilenler yalnızca bu cihazda, localStorage'da durur.
// Anahtarlar eski siteyle aynı (tf-prog, tf-saved), böylece öğrencinin ilerlemesi kaybolmaz.
import { useMemo, useSyncExternalStore } from "react";

export type Prog = Record<string, string>; // "ders.konu" -> "3/4 doğru", "_last" -> "ders.konu"

export const KEYS = {
  prog: "tf-prog", saved: "tf-saved", ad: "tf-ad", tekrar: "tf-tekrar", anlamadim: "tf-anlamadim",
  asama: "tf-asama", puan: "tf-puan", gorev: "tf-gorev", yer: "tf-yer", ipucu: "tf-ipucu", unite: "tf-unite",
  sifir: "tf-sifir", izlenen: "tf-izlenen",
} as const;
const listeners = new Set<() => void>();
const cache: Record<string, { raw: string | null; val: unknown }> = {};

// Tarayıcı depolamayı engellerse (gizli pencere, kapalı site verisi) değerler bu oturum boyunca bellekte tutulur.
const mem: Record<string, string | null> = {};
let broken = false;

export function read<T>(key: string, fallback: T): T {
  let raw: string | null = mem[key] ?? null;
  if (!broken) {
    try { raw = mem[key] = localStorage.getItem(key); } catch { broken = true; }
  }
  const c = cache[key];
  if (c && c.raw === raw) return c.val as T;
  let val: T = fallback;
  try { val = (raw ? JSON.parse(raw) : fallback) || fallback; } catch {}
  cache[key] = { raw, val };
  return val;
}
export function write(key: string, val: unknown) {
  const raw = (mem[key] = JSON.stringify(val));
  if (!broken) {
    try { localStorage.setItem(key, raw); } catch { broken = true; }
  }
  listeners.forEach((l) => l());
}
export function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = () => l();
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(l); window.removeEventListener("storage", onStorage); };
}

const EMPTY_PROG: Prog = {};
const EMPTY_SAVED: string[] = [];
const EMPTY_TEKRAR: Tekrar = {};

export const useProg = () =>
  useSyncExternalStore(subscribe, () => read<Prog>(KEYS.prog, EMPTY_PROG), () => EMPTY_PROG);
export const useSaved = () =>
  useSyncExternalStore(subscribe, () => read<string[]>(KEYS.saved, EMPTY_SAVED), () => EMPTY_SAVED);

/** Kalıcı depolama çalışıyor mu? Çalışmıyorsa ilerleme sayfa kapanınca silinir. */
export const useStorageOk = () => useSyncExternalStore(subscribe, () => !broken, () => true);

/** Ana sayfadaki "Hoş geldin, ..." için öğrencinin adı. Hesap gelince adı hesaptan alınacak; şimdilik yalnızca bu cihazda. */
export const useAd = () => useSyncExternalStore(subscribe, () => read<string>(KEYS.ad, ""), () => "");
export const setAd = (ad: string) => write(KEYS.ad, ad.trim().slice(0, 30));

export function setProg(patch: Prog) {
  write(KEYS.prog, { ...read<Prog>(KEYS.prog, EMPTY_PROG), ...patch });
}
export function toggleSaved(key: string) {
  const s = read<string[]>(KEYS.saved, EMPTY_SAVED);
  write(KEYS.saved, s.includes(key) ? s.filter((k) => k !== key) : [key, ...s]);
}
export function resetAll() {
  write(KEYS.prog, {});
  write(KEYS.saved, []);
  write(KEYS.tekrar, {});
  write(KEYS.anlamadim, []);
  write(KEYS.asama, {});
  write(KEYS.puan, {});
  write(KEYS.gorev, {});
  write(KEYS.yer, {});
  write(KEYS.unite, {});
  write(KEYS.izlenen, []);
  // Sıfırlama damgası: hesaba bağlı başka cihazın eski verisi bu sıfırlamanın üzerine birleştirilmez (lib/esitle.ts).
  write(KEYS.sifir, Date.now());
}

// Akıllı tekrar: testte yanlış yapılan soru 1, 3 ve 7 gün sonra yeniden sorulur.
// Her doğru cevap soruyu bir sonraki basamağa taşır; üçüncü doğrudan sonra soru sıradan çıkar.
// Yanlış cevap soruyu başa (ertesi güne) döndürür. Anahtar: "ders.konu.soru sırası" (0'dan başlar).
/** s: basamak (0, 1, 2), g: sorulacağı gün (YYYY-AA-GG, yerel saat). */
export type Tekrar = Record<string, { s: number; g: string }>;
/** Basamaktan bir sonrakine kaç gün: yanlıştan 1, 1+2 = 3 ve 3+4 = 7 gün sonra. */
const ARA = [1, 2, 4];

/** Bugünden n gün sonrası, yerel saatle YYYY-AA-GG. */
export function gun(n = 0) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "bugün", "yarın", "3 gün sonra". */
export function gunAdi(g: string) {
  const fark = Math.round((Date.parse(g) - Date.parse(gun())) / 864e5);
  return fark <= 0 ? "bugün" : fark === 1 ? "yarın" : `${fark} gün sonra`;
}

export const useTekrar = () =>
  useSyncExternalStore(subscribe, () => read<Tekrar>(KEYS.tekrar, EMPTY_TEKRAR), () => EMPTY_TEKRAR);

/** Anlık değer (abonelik olmadan); tekrar ekranı başlarken sorulacakları bir kez seçmek için. */
export const tekrarOku = () => read<Tekrar>(KEYS.tekrar, EMPTY_TEKRAR);

/** Sorusu bugün ya da daha önce gelmiş olanlar. */
export const bugunku = (t: Tekrar) => Object.keys(t).filter((k) => t[k].g <= gun());

/** Testte yanlış yapılan soru (ya da tekrarda yine yanlış): ertesi gün yeniden sorulur. */
export function yanlisKaydet(key: string) {
  write(KEYS.tekrar, { ...read<Tekrar>(KEYS.tekrar, EMPTY_TEKRAR), [key]: { s: 0, g: gun(ARA[0]) } });
}

/** Tekrardaki cevap: doğruysa bir basamak ilerler (üçüncüden sonra sıradan çıkar), yanlışsa başa döner. */
export function tekrarCevap(key: string, dogru: boolean) {
  const t = { ...read<Tekrar>(KEYS.tekrar, EMPTY_TEKRAR) };
  const cur = t[key];
  if (!cur) return;
  if (!dogru) t[key] = { s: 0, g: gun(ARA[0]) };
  else if (cur.s + 1 >= ARA.length) delete t[key];
  else t[key] = { s: cur.s + 1, g: gun(ARA[cur.s + 1]) };
  write(KEYS.tekrar, t);
}

// "Bunu anlamadım": öğrencinin işaretlediği kartlar. Anahtar: "ders.konu.kart no" (1'den başlar).
export const useAnlamadim = () =>
  useSyncExternalStore(subscribe, () => read<string[]>(KEYS.anlamadim, EMPTY_SAVED), () => EMPTY_SAVED);
/** İşareti açar ya da kapatır; yeni durumu döndürür. */
export function toggleAnlamadim(key: string) {
  const s = read<string[]>(KEYS.anlamadim, EMPTY_SAVED);
  const on = !s.includes(key);
  write(KEYS.anlamadim, on ? [key, ...s] : s.filter((k) => k !== key));
  return on;
}

/** Ders sayfasında harita mı liste mi görünsün (yalnızca bir kolaylık). */

// Aşamalar: her konu 2-4 aşamaya bölünür (lib/asama.ts). Değer, o konuda bitirilen aşama sayısıdır.
// Aşamalar sırayla açılır; öğrenci her konuya 1. aşamadan başlar.
export type Asama = Record<string, number>;
const EMPTY_ASAMA: Asama = {};
export const useAsama = () =>
  useSyncExternalStore(subscribe, () => read<Asama>(KEYS.asama, EMPTY_ASAMA), () => EMPTY_ASAMA);
/** Aşama bitince çağrılır; yalnızca sıradaki aşamaysa sayaç ilerler. İlk kez bitiyorsa true döner. */
export function asamaBitir(key: string, a: number) {
  const s = read<Asama>(KEYS.asama, EMPTY_ASAMA);
  if ((s[key] ?? 0) !== a) return false;
  write(KEYS.asama, { ...s, [key]: a + 1 });
  return true;
}

/** Bitirilen konuların anahtarları ("_last" hariç). */
export const doneKeys = (p: Prog) => Object.keys(p).filter((k) => k !== "_last");
/** Anlık ilerleme (abonelik olmadan); karışık test başlarken bitirilen konuları bir kez okumak için. */
export const progOku = () => read<Prog>(KEYS.prog, EMPTY_PROG);

// Kaldığın yer: konunun ortasında çıkınca hangi aşamanın hangi öğesinde kalındığı. Anahtar "ders.konu".
// Aşama bitince silinir; "Kaldığın yerden devam et" öğrenciyi aşamanın başına değil bu öğeye götürür.
export type Yer = Record<string, { a: number; i: number }>;
const EMPTY_YER: Yer = {};
export const useYer = () => useSyncExternalStore(subscribe, () => read<Yer>(KEYS.yer, EMPTY_YER), () => EMPTY_YER);
export function yerYaz(key: string, yer: { a: number; i: number } | null) {
  const s = { ...read<Yer>(KEYS.yer, EMPTY_YER) };
  if (yer) s[key] = yer;
  else if (key in s) delete s[key];
  else return;
  write(KEYS.yer, s);
}

// Bir kez gösterilen ipuçları (ör. ders akışında "önceki kartlar yukarıda, anlamadığın kartta ?").
export const useIpucu = () => useSyncExternalStore(subscribe, () => read<string[]>(KEYS.ipucu, EMPTY_SAVED), () => EMPTY_SAVED);
export function ipucuGoruldu(k: string) {
  const s = read<string[]>(KEYS.ipucu, EMPTY_SAVED);
  if (!s.includes(k)) write(KEYS.ipucu, [...s, k]);
}

// Ünite testleri: en yüksek puan (0-100). Anahtar "ders.ünite no". 80 ve üstü üniteyi geçer (lib/kilit.ts).
export type Unite = Record<string, number>;
const EMPTY_UNITE: Unite = {};
export const useUnite = () => useSyncExternalStore(subscribe, () => read<Unite>(KEYS.unite, EMPTY_UNITE), () => EMPTY_UNITE);
export function uniteKaydet(key: string, puan: number) {
  const s = read<Unite>(KEYS.unite, EMPTY_UNITE);
  if ((s[key] ?? -1) < puan) write(KEYS.unite, { ...s, [key]: puan });
}

/** Sayfa tarayıcıda açıldı mı (sunucuda ve ilk çizimde false). Cihazdaki ilerlemeye bağlı kararlar için. */
const hep = () => () => {};
export const useTarayici = () => useSyncExternalStore(hep, () => true, () => false);

/** Konu kilitleri için gereken bütün durumlar (lib/kilit.ts). */
export function useDurumlar() {
  const prog = useProg(), asama = useAsama(), yer = useYer(), unite = useUnite();
  return useMemo(() => ({ prog, asama, yer, unite }), [prog, asama, yer, unite]);
}
