// Sitenin sunucu ve istemci bileşenlerinde ortak kullanılan sabitleri.
export const INSTAGRAM = { ad: "@ucler.app", url: "https://www.instagram.com/ucler.app/" };
export const SITE_URL = "https://ucler.app";

// Paylaşım ve e-posta bağlantıları için adres. Uygulamada location.origin "capacitor://localhost" olur, o yüzden canlı adres kullanılır.
export function adres(yol: string): string {
  const o = typeof window !== "undefined" ? location.origin : "";
  return (o.startsWith("http") && !/^https?:\/\/localhost$/.test(o) ? o : SITE_URL) + yol;
}
