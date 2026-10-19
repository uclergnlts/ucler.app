import Profile from "@/components/Profile";
import { allEntries, kartBasliklari } from "@/lib/content";

// Kaydedilenler artık Profil'in içinde. Eski bağlantılar çalışsın diye bu adres de Profil'i gösterir.
export const metadata = { title: "Profil" };

export default function Page() {
  return <Profile all={allEntries()} basliklar={kartBasliklari()} />;
}
