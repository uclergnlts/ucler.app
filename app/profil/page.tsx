import Profile from "@/components/Profile";
import { allEntries, kartBasliklari } from "@/lib/content";

export const metadata = { title: "Profil" };

export default function Page() {
  return <Profile all={allEntries()} basliklar={kartBasliklari()} />;
}
