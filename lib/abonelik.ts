"use client";
// ucler Plus: aylık abonelik. Her dersin ilk konusu herkese ücretsiz; öteki konular Plus ister.
// Videolar, oyunlar, ünite ve seviye testleri herkese açık kalır; yalnızca konu anlatımları kilitlenir.
//
// Satın alma yalnızca telefon uygulamasında, App Store / Google Play abonelikleriyle yapılır (RevenueCat,
// @revenuecat/purchases-capacitor). Uygulama Plus'ı doğrudan RevenueCat'ten öğrenir. Giriş yapmış öğrencinin
// aboneliği ayrıca Supabase'deki "abonelik" tablosuna yazılır (supabase/functions/revenuecat, RevenueCat webhook'u);
// web sitesi Plus'ı bu tablodan okur. Sitede satın alma yok: Plus'ı olmayan öğrenciye uygulamadan abone olabileceği söylenir.
//
// ABONELIK kapalıyken (varsayılan) hiçbir konu kilitlenmez ve Plus hiçbir yerde görünmez. Mağazalarda ürün hazır
// olunca NEXT_PUBLIC_ABONELIK=1 ile derlenir. Kurulum adımları: docs/ABONELIK.md
import { useSyncExternalStore } from "react";
import { Capacitor } from "@capacitor/core";
import type { CustomerInfo, PurchasesPackage } from "@revenuecat/purchases-capacitor";
import type { Entry } from "./dersler";
import { oturumAl, oturumDinle, sb } from "./bulut";
import { read, useTarayici, write } from "./store";

/** Ödeme duvarı açık mı (derleme anında). */
export const ABONELIK = process.env.NEXT_PUBLIC_ABONELIK === "1";
/** RevenueCat'teki yetkinin (entitlement) kimliği. */
export const PLUS = "plus";
/** RevenueCat herkese açık SDK anahtarları (Project settings > API keys). Gizli değildir. */
const RC_ANAHTAR: Record<string, string> = { ios: "", android: "" };
/** Mağaza sayfaları; uygulama yayınlanınca doldurulur. Boşsa sitede o düğme görünmez. */
export const MAGAZA = { ios: "", android: "" };
/** Apple'ın standart kullanım lisansı (App Store'da abonelik ekranında bağlantısı istenir). */
export const APPLE_EULA = "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

/** Konu Plus olmadan açılır mı: ödeme duvarı kapalıysa hepsi, açıksa her dersin ilk konusu. */
export function ucretsiz(list: Entry[], id: string) {
  return !ABONELIK || list.find((e) => e.id)?.id === id;
}

// ---- Durum ----
/** bitis: Plus'ın bittiği an (ms); null süresiz. yenilenir: dönem sonunda kendiliğinden yenilenecek mi. */
export type Plus = { bitis: number | null; yenilenir: boolean; kaynak: "magaza" | "hesap"; yonet?: string | null };
// Son bilinen durum bu cihazda saklanır: uygulama açılırken ve internet yokken Plus konusu bir an kilitli görünmesin.
// Eşitlenmez (lib/esitle.ts), her açılışta mağazadan ya da hesaptan yeniden okunur.
const ANAHTAR = "tf-plus";
let magaza: Plus | null = null, hesap: Plus | null = null;
let bilindi = false;
const dinleyen = new Set<() => void>();
const yay = () => dinleyen.forEach((l) => l());
const gecerli = (p: Plus | null) => !!p && (p.bitis === null || p.bitis > Date.now());

function guncelle() {
  const p = gecerli(magaza) ? magaza : gecerli(hesap) ? hesap : null;
  if (bilindi) write(ANAHTAR, p);
  yay();
}
let anlik: Plus | null = null;
function oku(): Plus | null {
  const p = gecerli(magaza) ? magaza : gecerli(hesap) ? hesap : bilindi ? null : read<Plus | null>(ANAHTAR, null);
  const g = gecerli(p) ? p : null;
  // useSyncExternalStore aynı değeri aynı nesne olarak ister.
  if (JSON.stringify(g) !== JSON.stringify(anlik)) anlik = g;
  return anlik;
}
const dinle = (l: () => void) => { dinleyen.add(l); return () => { dinleyen.delete(l); }; };
/** Öğrencinin geçerli Plus'ı; yoksa null. Sunucuda ve ödeme duvarı kapalıyken hep null. */
export const usePlus = () => useSyncExternalStore(dinle, () => (ABONELIK ? oku() : null), () => null);
/** Konu bu öğrenciye kapalı mı (Plus ister ve öğrencinin Plus'ı yok). */
export function useOdemeli(list: Entry[], id: string) {
  const p = usePlus(), tarayici = useTarayici();
  return tarayici && !ucretsiz(list, id) && !p;
}

// ---- Uygulama: RevenueCat ----
const yerel = () => Capacitor.isNativePlatform() && !!RC_ANAHTAR[Capacitor.getPlatform()];
/** Mağazadan satın alma bu cihazda yapılabilir mi. */
export const satinAlinabilir = () => ABONELIK && yerel();
const rc = () => import("@revenuecat/purchases-capacitor").then((m) => m.Purchases);
let rcHazir: Promise<boolean> | null = null;

function magazaYaz(ci: CustomerInfo) {
  const y = ci.entitlements.active[PLUS];
  magaza = y ? { bitis: y.expirationDateMillis ?? null, yenilenir: y.willRenew, kaynak: "magaza", yonet: ci.managementURL } : null;
  bilindi = true;
  guncelle();
}

async function rcKur(): Promise<boolean> {
  const P = await rc();
  const id = oturumAl()?.user.id;
  await P.configure({ apiKey: RC_ANAHTAR[Capacitor.getPlatform()], appUserID: id ?? null });
  await P.addCustomerInfoUpdateListener(magazaYaz);
  magazaYaz((await P.getCustomerInfo()).customerInfo);
  return true;
}
const rcBekle = () => (rcHazir ??= rcKur().catch(() => { rcHazir = null; return false; }));

/** Hesap değişince RevenueCat'e de söylenir: satın alma hesaba bağlansın, web sitesinde de açılsın. */
async function rcHesap(id: string | null) {
  if (!(await rcBekle())) return;
  const P = await rc();
  try {
    const { appUserID } = await P.getAppUserID();
    if (id && appUserID !== id) magazaYaz((await P.logIn({ appUserID: id })).customerInfo);
    if (!id && !(await P.isAnonymous()).isAnonymous) magazaYaz((await P.logOut()).customerInfo);
  } catch {}
}

/** deneme: ücretsiz deneme süresi (gün), öğrenci yararlanabiliyorsa; yoksa null. */
export type Teklif = { paket: PurchasesPackage; fiyat: string; deneme: number | null };
const GUN: Record<string, number> = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 };
/** Mağazadaki aylık paket, fiyatı (öğrencinin ülkesinin para biriminde) ve ücretsiz deneme süresi.
 *  Deneme mağazada tanımlanır (App Store: tanıtım teklifi, Google Play: ücretsiz deneme teklifi; docs/ABONELIK.md).
 *  Daha önce denemeyi kullanan öğrenciye deneme gösterilmez: iPhone'da Apple'a sorulur, Google Play ise
 *  hakkı olmayana deneme teklifini hiç vermez. */
export async function teklifAl(): Promise<Teklif | null> {
  if (!satinAlinabilir() || !(await rcBekle())) return null;
  try {
    const c = (await (await rc()).getOfferings()).current;
    const paket = c?.monthly ?? c?.availablePackages[0];
    if (!paket) return null;
    const ip = paket.product.introPrice;
    let deneme = ip && ip.price === 0 ? ip.periodNumberOfUnits * (GUN[ip.periodUnit] ?? 1) : null;
    if (deneme && Capacitor.getPlatform() === "ios") {
      const h = await (await rc()).checkTrialOrIntroductoryPriceEligibility({ productIdentifiers: [paket.product.identifier] }).catch(() => null);
      if (h?.[paket.product.identifier]?.status !== 2) deneme = null; // 2: hakkı var
    }
    return { paket, fiyat: paket.product.priceString, deneme };
  } catch {
    return null;
  }
}

/** Satın alır. "tamam": Plus açıldı, "vazgecti": öğrenci mağaza penceresini kapattı, "hata": olmadı. */
export async function satinAl(t: Teklif): Promise<"tamam" | "vazgecti" | "hata"> {
  try {
    const r = await (await rc()).purchasePackage({ aPackage: t.paket });
    magazaYaz(r.customerInfo);
    return r.customerInfo.entitlements.active[PLUS] ? "tamam" : "hata";
  } catch (e) {
    const h = e as { code?: string; userCancelled?: boolean };
    return h.userCancelled || h.code === "1" ? "vazgecti" : "hata";
  }
}

/** Telefon değişince ya da uygulama yeniden kurulunca: mağazadaki eski satın almayı geri yükler. */
export async function geriYukle(): Promise<boolean> {
  if (!(await rcBekle())) return false;
  try {
    const { customerInfo } = await (await rc()).restorePurchases();
    magazaYaz(customerInfo);
    return !!customerInfo.entitlements.active[PLUS];
  } catch {
    return false;
  }
}

// ---- Hesap: Supabase "abonelik" tablosu ----
async function hesapOku(id: string | null) {
  if (!id) { hesap = null; if (!yerel()) bilindi = true; return guncelle(); }
  const { data, error } = await sb().from("abonelik").select("bitis, iptal").eq("user_id", id).maybeSingle();
  if (oturumAl()?.user.id !== id) return;
  if (error) return; // okunamadıysa son bilinen durum kalır
  hesap = data ? { bitis: data.bitis ? Date.parse(data.bitis) : null, yenilenir: !data.iptal, kaynak: "hesap" } : null;
  if (!yerel()) bilindi = true;
  guncelle();
}

let kuruldu = false;
/** Her sayfada bir kez çağrılır (components/Bulut.tsx). */
export function abonelikKur() {
  if (!ABONELIK || kuruldu) return;
  kuruldu = true;
  let son: string | null | undefined;
  const degisti = () => {
    const o = oturumAl();
    if (o === undefined) return; // oturum henüz bilinmiyor
    const id = o?.user.id ?? null;
    if (id === son) return;
    son = id;
    void hesapOku(id);
    if (yerel()) void rcHesap(id);
  };
  oturumDinle(degisti);
  degisti();
  if (yerel()) void rcBekle();
  // Dönem sonu geçtiyse ekran Plus'ı bıraksın; uygulamaya dönünce yeniden okunur.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    void hesapOku(oturumAl()?.user.id ?? null);
    if (yerel()) void rcBekle().then(async (ok) => { if (ok) magazaYaz((await (await rc()).getCustomerInfo()).customerInfo); }).catch(() => {});
  });
}
