// Sitenin sunucu ve istemci bileşenlerinde ortak kullanılan sabitleri.
export const INSTAGRAM = { ad: "@ucler.app", url: "https://www.instagram.com/ucler.app/" };
export const SITE_URL = "https://ucler.app";

// Paylaşım ve e-posta bağlantıları için adres. Uygulamada location.origin "capacitor://localhost" olur, o yüzden canlı adres kullanılır.
export function adres(yol: string): string {
  const o = typeof window !== "undefined" ? location.origin : "";
  return (o.startsWith("http") && !/^https?:\/\/localhost$/.test(o) ? o : SITE_URL) + yol;
}

// Telefon uygulaması derlemesi (npm run app): ana ekran "/" adresindedir. Web'de "/" tanıtım sayfasıdır (Üçler, 2026-11-19),
// dersler iOS uygulaması yayına girene kadar /ogren/ adresinde durur; tanıtım sayfası oraya bağlantı vermez.
export const UYGULAMA = process.env.NEXT_PUBLIC_UYGULAMA === "1";
export const ANA = UYGULAMA ? "/" : "/ogren/";
export const PLAY_URL = "https://play.google.com/store/apps/details?id=app.ucler";
export const YOUTUBE = { ad: "@uclerapp", url: "https://www.youtube.com/@uclerapp" };
