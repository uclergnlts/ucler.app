// Çizim galerisi (Üçler, 2026-11-19): YouTube videolarındaki bütün gravür çizimleri, videoya göre gruplu.
// Web'de /drawings/ (İngilizce) ve /tr/cizimler/ (Türkçe). Veri content/cizimler.json; yeni çizim: tools/cizim-ekle.py.
import Link from "next/link";
import veri from "@/content/cizimler.json";
import { YOUTUBE } from "@/lib/site";
import { CizgiIzleyen, CizgiYuruyen } from "./Cizgi";
import CizimGaleri, { type Grup } from "./CizimGaleri";
import { Logo } from "./temel";
import type { Dil } from "./Tanitim";

const METIN = {
  en: {
    k1: "The drawing room", h1a: "Every drawing from our ", h1b: "videos",
    giris: (n: number, v: number) => `Each video gets its own set of engravings, drawn for one question. Here are all ${n} of them from ${v} videos, without the narration.`,
    video: "Video", sekil: "Fig.", izle: "Watch on YouTube", kanal: "See the channel",
    kapat: "Close", onceki: "Previous drawing", sonraki: "Next drawing", ana: "Home",
  },
  tr: {
    k1: "Çizim odası", h1a: "Videolarımızdaki her ", h1b: "çizim",
    giris: (n: number, v: number) => `Her videonun kendi gravür çizimleri var ve hepsi tek bir soru için çiziliyor. ${v} videodaki ${n} çizimin hepsi burada, anlatım olmadan.`,
    video: "Video", sekil: "Şekil", izle: "YouTube'da izle", kanal: "Kanala git",
    kapat: "Kapat", onceki: "Önceki çizim", sonraki: "Sonraki çizim", ana: "Ana sayfa",
  },
} as const;

export const CIZIM_YOL = { en: "/drawings/", tr: "/tr/cizimler/" } as const;
const ANA_YOL = { en: "/", tr: "/tr/" } as const;
const mono = "font-mono text-[11px] tracking-[.14em] uppercase text-[var(--muted)]";
const sarmal = "mx-auto w-full max-w-[1080px] px-5 sm:px-8";

const tarih = (t: string, dil: Dil) =>
  new Date(t + "T12:00:00Z").toLocaleDateString(dil === "en" ? "en-GB" : "tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** Galeri verisi: videolar en yeniden eskiye, çizimler videonun içinde dosya sırasıyla. Adı boş çizim gösterilmez. */
export function cizimGruplari(dil: Dil): Grup[] {
  const m = METIN[dil];
  const sirali = [...veri.videolar].sort((a, b) => b.tarih.localeCompare(a.tarih));
  return sirali.map((v) => {
    const no = Number(v.id.replace(/\D/g, "")); // yt05 -> 5: kanaldaki video sırası
    const cizimler = veri.cizimler
      .filter((c) => c.video === v.id && c[dil])
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((c, i) => ({ id: c.id, video: v.id, ad: c[dil], sekil: `${m.sekil} ${no}.${i + 1}` }));
    return { id: v.id, ust: `${m.video} ${String(no).padStart(2, "0")} · ${tarih(v.tarih, dil)}`, baslik: v.baslik[dil], youtube: v.youtube, izle: m.izle, cizimler };
  }).filter((g) => g.cizimler.length && g.baslik && g.youtube);
}

export default function Cizimler({ dil }: { dil: Dil }) {
  const m = METIN[dil];
  const gruplar = cizimGruplari(dil);
  const n = gruplar.reduce((t, g) => t + g.cizimler.length, 0);
  const dilDugme = (d: Dil) => (
    <Link href={CIZIM_YOL[d]} hrefLang={d} aria-current={dil === d ? "true" : undefined} className={dil === d ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}>{d.toUpperCase()}</Link>
  );
  return (
    <main lang={dil} className="gece min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <div className="bg-[#070a12]">
        <header className={`${sarmal} flex items-center justify-between py-5`}>
          <Link href={ANA_YOL[dil]} aria-label={m.ana}><Logo /></Link>
          <nav className="flex items-center gap-5 text-[14px] font-semibold">
            <span className="flex items-center gap-2 font-mono text-[12px] tracking-[.1em]">{dilDugme("en")}<span aria-hidden className="text-[var(--line-2)]">/</span>{dilDugme("tr")}</span>
            <a href={YOUTUBE.url} className="rounded-md border border-[var(--line-2)] px-3.5 py-2 hover:border-[var(--ink)]">YouTube</a>
          </nav>
        </header>
        <section className={`${sarmal} grid items-end gap-6 pt-8 pb-12 sm:grid-cols-[1fr_auto] md:pt-14 md:pb-16`}>
          <div className="grid gap-5">
          <p className={mono}>{m.k1}</p>
          <h1 className="max-w-[16ch] font-display text-[40px] leading-[.98] font-extrabold tracking-[-.02em] uppercase sm:text-[60px]">
            {m.h1a}<span className="text-[var(--mark)]">{m.h1b}</span>..
          </h1>
          <p className="max-w-[52ch] text-[18px] leading-relaxed text-[var(--muted)]">{m.giris(n, gruplar.length)}</p>
          </div>
          <CizgiIzleyen className="hidden w-[150px] sm:block md:w-[190px]" />
        </section>
      </div>

      <div className={`${sarmal} grid gap-14 py-12 md:gap-20 md:py-16`}>
        <CizimGaleri gruplar={gruplar} etiket={{ kapat: m.kapat, onceki: m.onceki, sonraki: m.sonraki }} />
      </div>

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
