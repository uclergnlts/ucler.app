"use client";
// Alt menü: Ana sayfa, Keşfet, Videolar, Kaydedilenler, Profil (ders adları değil; bkz. docs/KARARLAR.md).
// Ders ekranında (/ders/konu/) gizlenir.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icons";

const TABS = [
  { k: "home", href: "/", label: "Ana sayfa" },
  { k: "kesfet", href: "/kesfet/", label: "Keşfet" },
  { k: "video", href: "/videolar/", label: "Videolar" },
  { k: "kayit", href: "/kaydedilenler/", label: "Kaydedilenler" },
  { k: "profil", href: "/profil/", label: "Profil" },
] as const;

export default function Tabs() {
  const parts = usePathname().split("/").filter(Boolean);
  if (parts.length >= 2) return null;
  const cur =
    parts.length === 0
      ? "home"
      : ({ kaydedilenler: "kayit", profil: "profil", videolar: "video" } as const)[parts[0]] ?? "kesfet";
  return (
    <div className="tabs">
      <nav aria-label="Bölümler">
        {TABS.map((t) => {
          const I = Icon[t.k];
          return (
            <Link key={t.k} className="tab" href={t.href} aria-current={cur === t.k ? "page" : undefined}>
              <I />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
