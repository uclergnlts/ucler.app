"use client";
// Telefonun kendi özelliklerine giden küçük yardımcılar: paylaşım menüsü ve mağazanın puanlama penceresi.
// Sitede (tarayıcıda) paylaşım tarayıcının menüsüne ya da panoya düşer; puanlama yalnızca uygulamada çalışır.
import { Capacitor } from "@capacitor/core";
import { olay } from "./olay";
import { SITE_URL } from "./site";

/** Google Play'deki uygulama sayfası. iOS sayfası App Store'da yayımlanınca eklenecek. */
export const PLAY_URL = "https://play.google.com/store/apps/details?id=app.ucler";
/** "Uygulamayı puanla" satırının açacağı adres; mağaza sayfası olmayan yerde null. */
export const magazaAdresi = () => (Capacitor.getPlatform() === "android" ? PLAY_URL : null);

/**
 * Paylaşım menüsünü açar. Android uygulamasında tarayıcının navigator.share özelliği yoktur, o yüzden Capacitor
 * eklentisi kullanılır. Menü açılamıyorsa bağlantı panoya kopyalanır ve "kopyalandi" döner. Vazgeçilirse null döner.
 */
export async function paylas(p: { baslik: string; metin?: string; url: string }): Promise<"paylasildi" | "kopyalandi" | null> {
  try {
    if (Capacitor.isNativePlatform()) {
      const { Share } = await import("@capacitor/share");
      await Share.share({ title: p.baslik, text: p.metin, url: p.url, dialogTitle: p.baslik });
      return "paylasildi";
    }
    if (navigator.share) { await navigator.share({ title: p.baslik, text: p.metin, url: p.url }); return "paylasildi"; }
    await navigator.clipboard.writeText(p.url);
    return "kopyalandi";
  } catch { return null; }
}

/** ucler'i arkadaşa önerme: Ayarlar ve Profil'deki satır. */
export const uygulamayiPaylas = () => {
  olay("paylas", { ne: "uygulama" });
  return paylas({ baslik: "ucler", metin: "Konuları kısa kart, video ve etkileşimli soruyla anlatan ucler'i dene.", url: SITE_URL });
};

const PUAN_ANAHTAR = "ucler.puanla", PUAN_ARA = 60 * 24 * 3600 * 1000;

/**
 * Mağazanın uygulama içi puanlama penceresini ister. Yalnızca iyi bir anın ardından çağrılır (ünite testi geçildi,
 * konu başarıyla bitti); açılışta asla. En çok 60 günde bir denenir; pencerenin gerçekten çıkıp çıkmayacağına
 * mağaza karar verir (Google Play kendi sınırını uygular ve yalnızca Play'den kurulan sürümde gösterir).
 */
export async function puanIste() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const son = Number(localStorage.getItem(PUAN_ANAHTAR) ?? 0);
    if (Date.now() - son < PUAN_ARA) return;
    localStorage.setItem(PUAN_ANAHTAR, String(Date.now()));
    const { InAppReview } = await import("@capacitor-community/in-app-review");
    await InAppReview.requestReview();
    olay("puanla", { ne: "pencere" });
  } catch {}
}
