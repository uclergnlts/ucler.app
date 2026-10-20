"use client";
// Alt menü: Ana sayfa, Keşfet, Videolar, Oyunlar, Profil (ders adları değil; bkz. docs/KARARLAR.md).
// Kaydedilenler Profil'in içindedir.
// Ders ekranında (/ders/konu/) ve tekrar ekranında gizlenir.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
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
  // Profil'in alt ekranları (/profil/istatistikler/ ...) alt menüyü gösterir, Profil seçili kalır.
  if ((parts.length >= 2 && parts[0] !== "profil") || parts[0] === "tekrar") return null;
  // Ders haritası (/fizik/) ve bulunamayan sayfalar hiçbir sekmeye ait değil: hiçbiri seçili görünmez.
  const cur: string | undefined =
    parts.length === 0
      ? "home"
      : ({ kesfet: "kesfet", kaydedilenler: "profil", profil: "profil", hakkinda: "profil", gizlilik: "profil", videolar: "video", oyunlar: "oyun" } as Record<string, string>)[parts[0]];
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card pb-[env(safe-area-inset-bottom,0px)]">
      <nav aria-label="Bölümler" className="mx-auto grid h-[var(--nav)] max-w-[520px] grid-cols-5">
        {TABS.map((t) => {
          const I = Icon[t.k], on = cur === t.k;
          return (
            <Link
              key={t.k}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "relative grid content-center justify-items-center gap-0.5 text-[11px] transition-colors [&_svg]:size-6",
                on ? "font-bold text-foreground [&_svg]:stroke-[2.4]" : "font-semibold text-muted-foreground",
              )}
            >
              {on && (
                <motion.span
                  layoutId="sekme"
                  aria-hidden="true"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <I />
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
