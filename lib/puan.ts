"use client";
// Puan, günlük giriş, seri ve günlük görevler. Hepsi yalnızca bu cihazda (localStorage) durur.
// Veri gün gün sayaç olarak tutulur; hesap gelince aynı sayaçlar sunucuya taşınabilir ve puan listesi onlardan kurulur.
import { useSyncExternalStore } from "react";
import { bugunku, gun, KEYS, read, subscribe, write, type Tekrar } from "./store";

/** Bir günde yapılanlar. p: o gün kazanılan puan. */
export type Sayac = "kart" | "adim" | "soru" | "dogru" | "asama" | "konu" | "tekrar" | "oyun" | "video";
export type Gun = Partial<Record<Sayac, number>> & { p?: number; giris?: 1 };
export type Puan = { toplam?: number; enUzun?: number; gunler?: Record<string, Gun> };

export type GorevId = "asama" | "kart" | "adim" | "dogru" | "konu" | "tekrar" | "oyun" | "video";
export type Gorev = { id: GorevId; hedef: number };
type GorevKayit = { g?: string; l?: Gorev[]; tamam?: GorevId[]; hepsi?: 1 };

/** Puan tablosu: ne kaç puan getirir. */
export const PUAN = { giris: 5, kart: 1, adim: 3, dogru: 5, asama: 10, konu: 20, tekrar: 5, oyun: 10, video: 3, gorev: 15, hepsi: 20 } as const;

const GOREV_ADI: Record<GorevId, (n: number) => string> = {
  asama: () => "Bir aşama bitir",
  kart: (n) => `${n} kart oku`,
  adim: (n) => `${n} etkileşimli görevi çöz`,
  dogru: (n) => `Testte ${n} doğru cevap ver`,
  konu: () => "Bir konuyu bitir",
  tekrar: (n) => (n === 1 ? "Tekrardaki soruyu çöz" : `Tekrarda ${n} soru çöz`),
  oyun: () => "Bir oyun oyna",
  video: () => "Bir video izle",
};
export const gorevAdi = (g: Gorev) => GOREV_ADI[g.id](g.hedef);

const EMPTY: Puan = {};
const EMPTY_GOREV: GorevKayit = {};
const puanOku = () => read<Puan>(KEYS.puan, EMPTY);

/** Gün aktif sayılır mı: kart, görev, soru, tekrar, oyun ya da video. Yalnızca girmek seriyi sürdürmez. */
const AKTIF: Sayac[] = ["kart", "adim", "soru", "tekrar", "oyun", "video"];
export const aktif = (g?: Gun) => !!g && AKTIF.some((k) => (g[k] ?? 0) > 0);

/** Bugünden geriye kesintisiz aktif gün sayısı. Bugün henüz bir şey yapılmadıysa seri dünden sayılır. */
export function seri(p: Puan) {
  const gunler = p.gunler ?? {};
  let n = 0, k = aktif(gunler[gun()]) ? 0 : -1;
  while (aktif(gunler[gun(k)])) { n++; k--; }
  return n;
}

// Ödül bildirimi (kısa süre görünen "+15 puan" yazısı). Yalnızca bellekte; sayfa yenilenince kaybolur.
export type Odul = { id: number; puan: number; metin: string };
let odulNo = 0;
const odulDinleyici = new Set<(o: Odul) => void>();
export function odulDinle(f: (o: Odul) => void) {
  odulDinleyici.add(f);
  return () => { odulDinleyici.delete(f); };
}
const odulGoster = (puan: number, metin: string) => odulDinleyici.forEach((f) => f({ id: ++odulNo, puan, metin }));

/** Basit, tarihe bağlı karıştırma: aynı gün aynı görevler çıkar. */
function tohum(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) / 2 ** 32);
}

/** Bugünün üç görevi: biri her zaman konu anlatımından, tekrar sırasında soru varsa biri tekrar, gerisi karışık. */
function gorevSec(g: string): Gorev[] {
  const r = tohum(g);
  const due = bugunku(read<Tekrar>(KEYS.tekrar, {})).length;
  const l: Gorev[] = [r() < 0.5 ? { id: "asama", hedef: 1 } : { id: "kart", hedef: 8 }];
  if (due > 0) l.push({ id: "tekrar", hedef: Math.min(due, 3) });
  const havuz: Gorev[] = [{ id: "adim", hedef: 3 }, { id: "dogru", hedef: 3 }, { id: "konu", hedef: 1 }, { id: "oyun", hedef: 1 }, { id: "video", hedef: 1 }];
  while (l.length < 3) l.push(havuz.splice(Math.floor(r() * havuz.length), 1)[0]);
  return l;
}

function gorevOku(): GorevKayit {
  const k = read<GorevKayit>(KEYS.gorev, EMPTY_GOREV);
  if (k.g === gun() && k.l) return k;
  const yeni = { g: gun(), l: gorevSec(gun()), tamam: [] };
  write(KEYS.gorev, yeni);
  return yeni;
}

/** Bugünün sayacına ekler, puanı yazar; tamamlanan görev varsa ödülünü verir. */
export function kaydet(tur: Sayac | "giris", n = 1, puan = 0) {
  const p = puanOku(), g = gun();
  const gunler = { ...(p.gunler ?? {}) };
  const bu: Gun = { ...(gunler[g] ?? {}) };
  if (tur === "giris") bu.giris = 1;
  else bu[tur] = (bu[tur] ?? 0) + n;

  // Görevler
  const gk = gorevOku(), tamam = [...(gk.tamam ?? [])];
  let bonus = 0;
  const yeniTamam: Gorev[] = [];
  for (const gv of gk.l ?? []) {
    if (tamam.includes(gv.id) || (bu[gv.id] ?? 0) < gv.hedef) continue;
    tamam.push(gv.id);
    yeniTamam.push(gv);
    bonus += PUAN.gorev;
  }
  const hepsi = !gk.hepsi && tamam.length === (gk.l ?? []).length;
  if (hepsi) bonus += PUAN.hepsi;
  if (yeniTamam.length) write(KEYS.gorev, { ...gk, tamam, ...(hepsi ? { hepsi: 1 } : {}) });

  const kazanc = puan + bonus;
  bu.p = (bu.p ?? 0) + kazanc;
  gunler[g] = bu;
  // 120 günden eski günler silinir; seri için yeterli, depolamayı şişirmez.
  for (const k of Object.keys(gunler)) if (k < gun(-120)) delete gunler[k];
  const yeni: Puan = { toplam: (p.toplam ?? 0) + kazanc, gunler };
  yeni.enUzun = Math.max(p.enUzun ?? 0, seri(yeni));
  write(KEYS.puan, yeni);

  if (tur === "giris") odulGoster(puan, "Günlük giriş");
  yeniTamam.forEach((gv) => odulGoster(PUAN.gorev, `Görev tamam: ${gorevAdi(gv)}`));
  if (hepsi) odulGoster(PUAN.hepsi, "Bugünün görevlerinin hepsi tamam");
}

/** Günün ilk açılışında giriş puanı verir. Gün değişmişse yeni görevleri de hazırlar. */
export function girisYap() {
  gorevOku();
  if (!puanOku().gunler?.[gun()]?.giris) kaydet("giris", 1, PUAN.giris);
}

export const usePuan = () => useSyncExternalStore(subscribe, puanOku, () => EMPTY);
export const useGorev = () =>
  useSyncExternalStore(subscribe, () => read<GorevKayit>(KEYS.gorev, EMPTY_GOREV), () => EMPTY_GOREV);
