"use client";
// Alt menü: Ana sayfa, Keşfet, Videolar, Oyunlar, Profil (ders adları değil; bkz. docs/KARARLAR.md).
// Kaydedilenler Profil'in içindedir.
// Ders ekranında (/ders/konu/) gizlenir.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";

const TABS = [
  { k: "home", href: "/", label: "Ana sayfa" },
  { k: "kesfet", href: "/kesfet/", label: "Keşfet" },
  { k: "video", href: "/videolar/", label: "Videolar" },
  { k: "oyun", href: "/oyunlar/", label: "Oyunlar" },
  { k: "profil", href: "/profil/", label: "Profil" },
] as const;

export default function Tabs() {
  const parts = usePathname().split("/").filter(Boolean);
  if (parts.length >= 2) return null;
  const cur =
    parts.length === 0
      ? "home"
      : ({ kaydedilenler: "profil", profil: "profil", videolar: "video", oyunlar: "oyun" } as const)[parts[0]] ?? "home";
  return (
    <div className={`tabs${cur === "video" ? " on-video" : ""}`}>
      <nav aria-label="Bölümler">
        {TABS.map((t) => {
          const I = Icon[t.k];
          return (
            <Link key={t.k} className="tab" href={t.href} aria-current={cur === t.k ? "page" : undefined}>
              <I />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
