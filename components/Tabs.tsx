"use client";
// Alt menü: Ana sayfa, Keşfet, Videolar, Oyunlar, Profil (ders adları değil; bkz. docs/KARARLAR.md).
// Kaydedilenler Profil'in içindedir.
// Ders ekranında (/ders/konu/) ve tekrar ekranında gizlenir.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";

// Her sekmenin kendi rengi: seçili sekmenin simgesi ve adı bu renge döner, simgenin arkasında açık renkli zemin belirir.
const TABS = [
  { k: "home", href: "/", label: "Ana sayfa", renk: "var(--c1)" },
  { k: "kesfet", href: "/kesfet/", label: "Keşfet", renk: "var(--c3)" },
  { k: "video", href: "/videolar/", label: "Videolar", renk: "#d63c63" },
  { k: "oyun", href: "/oyunlar/", label: "Oyunlar", renk: "#e08a00" },
  { k: "profil", href: "/profil/", label: "Profil", renk: "var(--c5)" },
] as const;

/** Sayfanın ait olduğu sekme. Ders haritası (/fizik/) ve bulunamayan sayfalar hiçbir sekmeye ait değil. */
function sekme(parts: string[]): string | undefined {
  return parts.length === 0
    ? "home"
    : ({ kesfet: "kesfet", kaydedilenler: "profil", profil: "profil", hakkinda: "profil", gizlilik: "profil", lig: "profil", videolar: "video", oyunlar: "oyun" } as Record<string, string>)[parts[0]];
}

/** Sayfanın sekme rengi (üst çubuk düğmeleri de bunu kullanır). */
export function sekmeRengi(path: string): string | undefined {
  const k = sekme(path.split("/").filter(Boolean));
  return TABS.find((t) => t.k === k)?.renk;
}

export default function Tabs() {
  const parts = usePathname().split("/").filter(Boolean);
  // Profil'in alt ekranları (/profil/istatistikler/ ...) alt menüyü gösterir, Profil seçili kalır.
  if ((parts.length >= 2 && parts[0] !== "profil") || parts[0] === "tekrar") return null;
  const cur = sekme(parts);
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
              style={on ? { color: t.renk } : undefined}
              className={cn(
                "relative grid content-center justify-items-center gap-0.5 text-[11px] transition-colors [&_svg]:size-6",
                on ? "font-bold [&_svg]:stroke-[2.4]" : "font-semibold text-muted-foreground",
              )}
            >
              <span className="relative grid h-8 w-14 place-items-center">
                {on && (
                  <motion.span
                    layoutId="sekme"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, ${t.renk} 14%, white)` }}
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative"><I /></span>
              </span>
              <span>{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
