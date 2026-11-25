// Sürüm notları (Üçler, 2026-11-25): uygulamanın her güncellemesi, en yenisi üstte. Mağaza notlarının uzun hali.
// Web'de /updates/ (İngilizce) ve /tr/guncellemeler/ (Türkçe). Veri content/surumler.json; yeni sürüm oraya eklenir.
import Link from "next/link";
import veri from "@/content/surumler.json";
import { APP_STORE_URL, IOS_YAYINDA, PLAY_URL, YOUTUBE } from "@/lib/site";
import { CizgiYuruyen } from "./Cizgi";
import { Logo } from "./temel";
import type { Dil } from "./Tanitim";

const METIN = {
  en: {
    k1: "Release notes", h1a: "What's new in ", h1b: "ucler",
    giris: "Every update to the ucler app on iPhone and Android, newest first.",
    surum: "Version", ikisi: "iOS and Android", onayda: "in store review", yakinda: "Coming soon",
    play: "Google Play", ios: "App Store", ana: "Home", kanal: "See the channel",
  },
  tr: {
    k1: "Sürüm notları", h1a: "ucler'de ", h1b: "neler yeni",
    giris: "ucler uygulamasının iPhone ve Android'deki bütün güncellemeleri burada. En yeni sürüm en üstte durur.",
    surum: "Sürüm", ikisi: "iOS ve Android", onayda: "mağaza onayında", yakinda: "Yakında",
    play: "Google Play", ios: "App Store", ana: "Ana sayfa", kanal: "Kanala git",
  },
} as const;

export const SURUM_YOL = { en: "/updates/", tr: "/tr/guncellemeler/" } as const;
const ANA_YOL = { en: "/", tr: "/tr/" } as const;
const mono = "font-mono text-[11px] tracking-[.14em] uppercase text-[var(--muted)]";
const sarmal = "mx-auto w-full max-w-[1080px] px-5 sm:px-8";

type Platform = "ios" | "android";
const PLATFORM_AD: Record<Platform, string> = { ios: "iOS", android: "Android" };

const tarih = (t: string, dil: Dil) =>
  new Date(t + "T12:00:00Z").toLocaleDateString(dil === "en" ? "en-GB" : "tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "1.10" > "1.9": sürümler sayı sayı karşılaştırılır. */
const surumSirasi = (a: string, b: string) => {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (y[i] ?? 0) - (x[i] ?? 0);
  return 0;
};

/** Sürümün yayın satırları: iki platform aynı gün çıktıysa tek satır, yoksa platform başına bir satır. */
function yayinSatirlari(yayin: Record<Platform, string>, dil: Dil): string[] {
  const m = METIN[dil];
  if (yayin.ios && yayin.ios === yayin.android) return [`${m.ikisi} · ${tarih(yayin.ios, dil)}`];
  return (["android", "ios"] as const).map((p) =>`${PLATFORM_AD[p]} · ${yayin[p] ? tarih(yayin[p], dil) : m.onayda}`);
}

export default function SurumNotlari({ dil }: { dil: Dil }) {
  const m = METIN[dil];
  const surumler = [...veri.surumler].sort((a, b) => surumSirasi(a.surum, b.surum));
  const dilDugme = (d: Dil) => (
    <Link href={SURUM_YOL[d]} hrefLang={d} aria-current={dil === d ? "true" : undefined} className={dil === d ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}>{d.toUpperCase()}</Link>
  );
  return (
    <main lang={dil} className="gece min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="bg-[#070a12]">
        <header className={`${sarmal} flex items-center justify-between py-5`}>
          <Link href={ANA_YOL[dil]} aria-label={m.ana}><Logo /></Link>
          <nav className="flex items-center gap-5 text-[14px] font-semibold">
            <span className="flex items-center gap-2 font-mono text-[12px] tracking-[.1em]">{dilDugme("en")}<span aria-hidden className="text-[var(--line-2)]">/</span>{dilDugme("tr")}</span>
            <a href={PLAY_URL} className="rounded-md border border-[var(--line-2)] px-3.5 py-2 hover:border-[var(--ink)]">{m.play}</a>
            {IOS_YAYINDA && <a href={APP_STORE_URL} className="hidden rounded-md border border-[var(--line-2)] px-3.5 py-2 hover:border-[var(--ink)] sm:block">{m.ios}</a>}
          </nav>
        </header>
        <section className={`${sarmal} grid gap-5 pt-8 pb-12 md:pt-14 md:pb-16`}>
          <p className={mono}>{m.k1}</p>
          <h1 className="max-w-[16ch] font-display text-[40px] leading-[.98] font-extrabold tracking-[-.02em] uppercase sm:text-[60px]">
            {m.h1a}<span className="text-[var(--mark)]">{m.h1b}</span>..
          </h1>
          <p className="max-w-[52ch] text-[18px] leading-relaxed text-[var(--muted)]">{m.giris}</p>
        </section>
      </div>

      <ol className={`${sarmal} grid py-6 md:py-10`}>
        {surumler.map((s) => {
          const yayin = s.yayin as Record<Platform, string>;
          const cikmadi = !yayin.ios && !yayin.android;
          const notlar = s[dil];
          return (
            <li key={s.surum} id={`v${s.surum}`} className="grid scroll-mt-6 gap-4 border-t border-[var(--line)] py-10 first:border-t-0 md:grid-cols-[240px_1fr] md:gap-10 md:py-14">
              <div className="grid content-start gap-2">
                <span className={mono}>{m.surum}</span>
                <span className="font-display text-[44px] leading-none font-extrabold tracking-[-.02em]">{s.surum}</span>
                {cikmadi
                  ? <span className="mt-1 w-fit rounded-md border border-dashed border-[var(--mark)] px-2.5 py-1 font-mono text-[11px] tracking-[.14em] text-[var(--mark)] uppercase">{m.onayda}</span>
                  : yayinSatirlari(yayin, dil).map((y) => <span key={y} className="font-mono text-[12px] tracking-[.04em] text-[var(--muted)]">{y}</span>)}
              </div>
              <div className="grid content-start gap-4">
                <h2 className="font-display text-[26px] leading-tight font-extrabold sm:text-[30px]">{notlar.baslik}</h2>
                <ul className="grid gap-3">
                  {notlar.maddeler.map((md) => (
                    <li key={md} className="relative max-w-[62ch] pl-5 text-[16px] leading-relaxed text-[var(--muted)]">
                      <span aria-hidden className="absolute top-[.7em] left-0 h-[2px] w-2.5 bg-[var(--btn)]" />
                      {md}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <footer className="bg-[#070a12]">
        <CizgiYuruyen className={sarmal} />
        <div className={`${sarmal} flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] py-6 text-[13px] text-[var(--muted)]`}>
          <Link href={ANA_YOL[dil]} aria-label={m.ana}><Logo className="text-[20px]" /></Link>
          <a href={YOUTUBE.url} className="hover:text-[var(--ink)]">{m.kanal} →</a>
        </div>
      </footer>
    </main>
  );
}
