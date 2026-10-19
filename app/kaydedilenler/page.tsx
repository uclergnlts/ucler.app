import Yonlendir from "@/components/Yonlendir";

// Kaydedilenler artık Profil'in içinde. Eski bağlantılar Profil'deki bölüme gider.
export const metadata = { title: "Profil", robots: { index: false } };

export default function Page() {
  return <Yonlendir to="/profil/#kaydedilenler" ad="Profil · Kaydedilenler" />;
}
