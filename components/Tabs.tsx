"use client";
// Alt menü: Ana sayfa, Keşfet, Videolar, Deneme, Profil (ders adları değil; bkz. docs/KARARLAR.md).
// Oyunlar 2026-10-30'da menüden çıktı (Üçler: şimdilik geri planda); /oyunlar/ sayfaları duruyor, hiçbir sekmeye bağlı değil.
// Kaydedilenler Profil'in içindedir.
// Ders ekranında (/ders/konu/), tekrar ve günün sorusu ekranında gizlenir.
import { cev, DIL } from "@/lib/dil";
import { ANA, YAKINDA_GOSTER } from "@/lib/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";

// Sekme renkleri yalnızca üst çubuktaki küçük düğmelerde kullanılır (sekmeRengi). Alt menü tek renktir:
// seçili sekme mürekkep renginde ve kalın, altında küçük bir vurgu noktası durur (deney defteri, 2026-11-16).
const TABS = [
  { k: "home", href: ANA, label: cev("Ana sayfa"), renk: "var(--c1)" },
  { k: "kesfet", href: "/kesfet/", label: cev("Keşfet"), renk: "var(--c3)" },
  { k: "video", href: "/videolar/", label: cev("Videolar"), renk: "var(--kimya)" },
  { k: "deneme", href: "/deneme/", label: cev("Deneme"), renk: "var(--c4)" },
  { k: "profil", href: "/profil/", label: cev("Profil"), renk: "var(--c5)" },
] as const;

// Videolar Türkçe seslidir; İngilizce kopyada sekme ve kart altındaki videolar gösterilmez (lib/videolar.ts).
// "Deneme" sekmesi YAKINDA_GOSTER kapalıyken gizlidir (lib/site.ts).
const GORUNEN = TABS.filter((t) => !(DIL === "en" && t.k === "video") && (YAKINDA_GOSTER || t.k !== "deneme"));

/** Sayfanın ait olduğu sekme. Ders haritası (/fizik/) ve bulunamayan sayfalar hiçbir sekmeye ait değil. */
function sekme(parts: string[]): string | undefined {
  return parts.length === 0 || parts[0] === "ogren"
    ? "home"
    : ({ kesfet: "kesfet", kaydedilenler: "profil", profil: "profil", hakkinda: "profil", gizlilik: "profil", lig: "profil", videolar: "video", deneme: "deneme" } as Record<string, string>)[parts[0]];
}

/** Sayfanın sekme rengi (üst çubuk düğmeleri de bunu kullanır). */
export function sekmeRengi(path: string): string | undefined {
  const k = sekme(path.split("/").filter(Boolean));
  return TABS.find((t) => t.k === k)?.renk;
}

export default function Tabs() {
  const parts = usePathname().split("/").filter(Boolean);
  // Profil'in alt ekranları (/profil/istatistikler/ ...) alt menüyü gösterir, Profil seçili kalır.
  if ((parts.length >= 2 && parts[0] !== "profil") || parts[0] === "tekrar" || parts[0] === "gunun-sorusu") return null;
  const cur = sekme(parts);
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-background pb-[env(safe-area-inset-bottom,0px)]">
      <nav aria-label={cev("Bölümler")} className="mx-auto grid h-[var(--nav)] max-w-[520px]" style={{ gridTemplateColumns: `repeat(${GORUNEN.length}, minmax(0, 1fr))` }}>
        {GORUNEN.map((t) => {
          const I = Icon[t.k], on = cur === t.k;
          return (
            <Link
              key={t.k}
              href={t.href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "relative grid content-center justify-items-center gap-0.5 text-[11px] transition-colors [&_svg]:size-6",
                on ? "font-bold text-foreground [&_svg]:stroke-[2.2]" : "font-medium text-muted-foreground",
              )}
            >
              <span className="relative grid h-7 place-items-center"><I /></span>
              <span>{t.label}</span>
              <span className="relative h-1 w-1">
                {on && (
                  <motion.span
                    layoutId="sekme"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-mark"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
