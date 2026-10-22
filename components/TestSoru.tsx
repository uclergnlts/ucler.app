"use client";
// Konu sonu testinin soru gövdesi: çoktan seçmeli ve etkileşimli türler (sırala, eşleştir, ayır, sayı, sahne).
// Etkileşimli soruda öğrenci cevabını kurar, alttaki "Kontrol et" ile bir kez değerlendirilir; sonra doğrusu
// gövdede işaretlenir. Ders ekranındaki test ve tekrar ekranı ortak kullanır. Biçim: docs/ICERIK-SPEC.md ("Test").
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { secmeli, type Question } from "@/lib/dersler";
import { cn } from "@/lib/utils";
import { SAHNELER } from "./sahne";
import { Kontroller, uyar } from "./DersMotoru";
import { karistir } from "./EtkGenel";
import { Secenekler } from "./Soru";
import { Html } from "./temel";

type Of<T extends string> = Extract<Question, { tur: T }>;
/** Öğrencinin kurduğu cevap. secim: şık; sirala/eslestir: her yuvadaki öğe; ayir: her öğenin grubu; sayi: yazılan; sahne: değerler. */
export type Cevap = number | (number | null)[] | string | Record<string, number> | null;

/** Soru açılınca cevabın başlangıç hâli. */
export function ilkCevap(q: Question): Cevap {
  if (q.tur === "sirala") return q.ogeler.map(() => null);
  if (q.tur === "eslestir") return q.ciftler.map(() => null);
  if (q.tur === "ayir") return q.ogeler.map(() => null);
  if (q.tur === "sayi") return "";
  if (q.tur === "sahne") return { ...q.deger };
  return null;
}

/** Öğrencinin yazdığı sayıyı Türkçe yazımla okur: virgül ondalık ayracıdır, nokta binlik ayracıdır ("2.700" = 2700,
 *  "1.250,5" = 1250,5). Virgül yoksa ve noktalar binlik gruplamaya uymuyorsa ("2.5", "0.125") nokta ondalık sayılır. */
export function sayiOku(yazi: string): number {
  let s = yazi.replace(/\s/g, "").replace(/−/g, "-");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  return s === "" || s === "-" ? NaN : Number(s);
}
const doluMu = (c: Cevap) => Array.isArray(c) && c.every((x) => x !== null);
const ayniDeger = (a: Record<string, number>, b: Record<string, number>) => Object.keys({ ...a, ...b }).every((k) => a[k] === b[k]);

/** "Kontrol et" açılabilir mi: bütün yuvalar dolu, sayı yazılmış, sahnede bir şey değişmiş. */
export function hazir(q: Question, c: Cevap): boolean {
  if (secmeli(q)) return typeof c === "number";
  if (q.tur === "sayi") return typeof c === "string" && c.trim() !== "" && Number.isFinite(sayiOku(c));
  if (q.tur === "sahne") return !!c && typeof c === "object" && !Array.isArray(c) && !ayniDeger(c, q.deger);
  return doluMu(c);
}

export function dogruMu(q: Question, c: Cevap): boolean {
  if (secmeli(q)) return c === q.a;
  if (q.tur === "sirala" || q.tur === "eslestir") return Array.isArray(c) && c.every((x, i) => x === i);
  if (q.tur === "ayir") return Array.isArray(c) && c.every((g, k) => g === q.ogeler[k][1]);
  if (q.tur === "sayi") return typeof c === "string" && Math.abs(sayiOku(c) - q.cevap) <= (q.tolerans ?? 0) + 1e-9;
  if (q.tur === "sahne") return !!c && typeof c === "object" && !Array.isArray(c) && uyar(c, q.hedef);
  return false;
}

/** Doğru cevabı gösterir. Binlik ayracı nokta olunca "2.700" ondalık "2,7" sanılabiliyor; bu yüzden 9999'a kadar
 *  ayraç konmaz (2700), daha büyük sayılar boşlukla gruplanır (103 000). Ondalık ayracı virgüldür. */
const sayiYaz = (x: number) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: 3, useGrouping: Math.abs(x) >= 10000 }).replace(/\./g, "\u202f").replace("-", "−");

/** Değerlendirmeden sonra alttaki çubuğun başlığı. */
export function geriBaslik(q: Question, ok: boolean): string {
  if (ok) return "Doğru!";
  if (secmeli(q)) return `Doğru cevap ${"ABCD"[q.a]}`;
  if (q.tur === "sayi") return `Doğru cevap: ${sayiYaz(q.cevap)}${q.birim ? ` ${q.birim}` : ""}`;
  if (q.tur === "sirala") return "Sıra tam doğru değil";
  return "Tam doğru değil";
}

/** Sorunun altındaki kısa yönerge (etkileşimli türlerde ne yapılacağı). */
/** Cevaptan sonra alttaki çubukta çıkan yazı. Yanlış seçilen şıkkın ipucu varsa uzun açıklamanın yerine o çıkar. */
export function geriMetin(q: Question, c: Cevap, ok: boolean): string {
  if (!ok && secmeli(q) && typeof c === "number" && q.y?.[c]) return q.y[c];
  return q.e;
}

export function yonerge(q: Question): string | null {
  if (q.tur === "sirala") return "Öğelere sırayla dokun. Yanlış yerleşeni geri almak için ona dokun.";
  if (q.tur === "eslestir") return "Bir satır seç, sonra aşağıdan eşine dokun.";
  if (q.tur === "ayir") return "Bir öğe seç, sonra ait olduğu gruba dokun. × ile geri alırsın.";
  return null;
}

type GovdeProps = { q: Question; cevap: Cevap; setCevap: (c: Cevap) => void; sonuc: boolean | null; sec: (k: number) => void; tohum: string };

/** Sorunun etkileşimli gövdesi (soru metni dışında). sonuc null değilse cevap kilitlenir, doğrusu işaretlenir. */
export function TestGovde({ q, cevap, setCevap, sonuc, sec, tohum }: GovdeProps) {
  if (secmeli(q)) return <Secenekler q={q} picked={typeof cevap === "number" ? cevap : null} pick={sec} />;
  if (q.tur === "sirala" || q.tur === "eslestir")
    return <Yuvalar q={q} yuva={cevap as (number | null)[]} setYuva={setCevap} bitti={sonuc !== null} tohum={tohum} />;
  if (q.tur === "ayir") return <Ayir q={q} grup={cevap as (number | null)[]} setGrup={setCevap} bitti={sonuc !== null} tohum={tohum} />;
  if (q.tur === "sayi") return <Sayi q={q} yazi={cevap as string} setYazi={setCevap} sonuc={sonuc} />;
  if (q.tur === "sahne") return <SahneSoru q={q} v={cevap as Record<string, number>} setV={setCevap} sonuc={sonuc} />;
  return null;
}

const cip = "min-h-11 rounded-2xl border-[1.5px] bg-card px-3 py-2 text-left text-[15px] font-semibold leading-snug transition-colors";

/** Havuzdaki dokunulabilir öğe. */
function Cip({ html, secili, onClick, disabled }: { html: string; secili?: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      layout
      className={cn(cip, secili ? "border-acc bg-acc-soft" : "border-border hover:border-border-strong")}
      aria-pressed={secili}
      data-cip
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      <Html html={html} />
    </motion.button>
  );
}

/** Sırala ve eşleştir: her yuvaya bir öğe yerleşir. Seçili (ya da ilk boş) yuvaya havuzdan dokunulan öğe gider. */
function Yuvalar({ q, yuva, setYuva, bitti, tohum }: {
  q: Of<"sirala"> | Of<"eslestir">; yuva: (number | null)[]; setYuva: (c: Cevap) => void; bitti: boolean; tohum: string;
}) {
  const sirala = q.tur === "sirala";
  const ogeler = sirala ? q.ogeler : q.ciftler.map((c) => c[1]);
  const havuz = useMemo(() => karistir(ogeler, tohum), [ogeler, tohum]);
  // Seçili yuva yuva dizisinde tutulmaz: ilk boş yuva seçilidir; dolu yuvaya dokununca boşalır ve seçili olur.
  const aktif = yuva.indexOf(null);
  const yerles = (k: number) => {
    if (bitti || aktif < 0) return;
    const y = [...yuva]; y[aktif] = k; setYuva(y);
  };
  const bosalt = (i: number) => {
    if (bitti || yuva[i] === null) return;
    const y = [...yuva]; y[i] = null; setYuva(y);
  };
  return (
    <div className="grid gap-4">
      <ol className="grid gap-2">
        {yuva.map((k, i) => {
          const durum = !bitti ? (i === aktif ? "aktif" : "") : k === i ? "ok" : "no";
          return (
            <li key={i} className={cn("grid items-center gap-2", sirala ? "grid-cols-[28px_1fr]" : "grid-cols-2")}>
              {sirala ? (
                <span className="grid size-7 place-items-center rounded-lg bg-secondary font-display text-[13px] font-extrabold text-muted-foreground">{i + 1}</span>
              ) : (
                <Html className="text-[15px] font-semibold leading-snug" html={q.ciftler[i][0]} />
              )}
              <button
                className={cn(
                  "min-h-11 rounded-2xl border-[1.5px] px-3 py-2 text-left text-[15px] font-semibold leading-snug transition-colors",
                  k === null ? "border-dashed" : "bg-card",
                  durum === "aktif" && "border-acc bg-acc-soft",
                  durum === "" && "border-border",
                  durum === "ok" && "border-good bg-good-soft",
                  durum === "no" && "border-bad bg-bad-soft",
                )}
                disabled={bitti || k === null}
                aria-label={k === null ? `${i + 1}. yuva boş` : undefined}
                onClick={() => bosalt(i)}
              >
                {k !== null ? <Html html={ogeler[k]} /> : <span className="text-muted-foreground">{durum === "aktif" ? "Buraya…" : ""}</span>}
                {durum === "no" && (
                  <span className="mt-1 block text-[13px] font-medium text-muted-foreground">Doğrusu: <Html html={ogeler[i]} /></span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
      {!bitti && (
        <div className="flex flex-wrap justify-center gap-2">
          {havuz.filter((k) => !yuva.includes(k)).map((k) => <Cip key={k} html={ogeler[k]} onClick={() => yerles(k)} />)}
        </div>
      )}
    </div>
  );
}

/** Ayır: öğe seçilir, sonra gruba dokunulur. Gruptaki öğenin × düğmesi onu havuza döndürür. */
function Ayir({ q, grup, setGrup, bitti, tohum }: { q: Of<"ayir">; grup: (number | null)[]; setGrup: (c: Cevap) => void; bitti: boolean; tohum: string }) {
  const havuz = useMemo(() => karistir(q.ogeler, tohum), [q.ogeler, tohum]);
  const kalan = havuz.filter((k) => grup[k] === null);
  const dar = q.gruplar.length > 2; // üç grup yan yana: telefonda her kutu dar, yazı ve boşluk küçülür
  // Öğrenci başka birine dokunana dek havuzdaki ilk öğe seçilidir.
  const [secilen, setSecilen] = useState(-1);
  const sec = secilen >= 0 && grup[secilen] === null ? secilen : kalan[0];
  const yerles = (g: number) => {
    if (bitti || sec === undefined) return;
    const y = [...grup]; y[sec] = g; setSecilen(-1); setGrup(y);
  };
  const geri = (k: number) => {
    if (bitti) return;
    const y = [...grup]; y[k] = null; setSecilen(k); setGrup(y);
  };
  return (
    <div className="grid gap-4">
      {!bitti && (
        <div className="flex min-h-11 flex-wrap justify-center gap-2">
          {kalan.map((k) => (
            <Cip key={k} html={q.ogeler[k][0]} secili={k === sec} onClick={() => setSecilen(k)} />
          ))}
        </div>
      )}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${q.gruplar.length}, minmax(0, 1fr))` }}>
        {q.gruplar.map((ad, g) => (
          <div
            key={g}
            role="button"
            tabIndex={bitti ? -1 : 0}
            aria-label={`${ad} grubuna koy`}
            data-grup
            onClick={() => yerles(g)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); yerles(g); } }}
            className={cn(
              "flex min-h-28 min-w-0 flex-col items-stretch gap-1.5 rounded-2xl border-[1.5px] border-dashed bg-secondary/60 transition-colors",
              dar ? "p-1" : "p-2",
              !bitti && sec !== undefined ? "cursor-pointer border-border-strong hover:border-acc" : "border-border",
            )}
          >
            <b className={cn("pb-0.5 text-center font-display leading-tight [overflow-wrap:anywhere]", dar ? "text-[13px]" : "text-[14px]")}>{ad}</b>
            {grup.map((gg, k) => gg === g && (
              <span
                key={k}
                className={cn(
                  "flex items-center justify-center gap-0.5 rounded-xl border-[1.5px] bg-card py-1 pr-0.5 text-center font-semibold leading-snug",
                  dar ? "pl-1 text-[12px]" : "pl-2 text-[13px]",
                  !bitti ? "border-border" : q.ogeler[k][1] === g ? "border-good bg-good-soft pr-1" : "border-bad bg-bad-soft pr-1",
                )}
              >
                <span className="min-w-0 [overflow-wrap:anywhere]">
                  <Html html={q.ogeler[k][0]} />
                  {bitti && q.ogeler[k][1] !== g && <span className="block text-[12px] font-medium text-muted-foreground">→ {q.gruplar[q.ogeler[k][1]]}</span>}
                </span>
                {!bitti && (
                  <button
                    className="grid size-5 flex-none place-items-center rounded-full text-[15px] leading-none text-muted-foreground hover:bg-secondary"
                    aria-label="Geri al"
                    onClick={(e) => { e.stopPropagation(); geri(k); }}
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sayı: öğrenci sonucu kendisi hesaplayıp yazar. */
function Sayi({ q, yazi, setYazi, sonuc }: { q: Of<"sayi">; yazi: string; setYazi: (c: Cevap) => void; sonuc: boolean | null }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="flex items-center justify-center gap-3">
        <input
          className={cn(
            "h-14 w-40 rounded-2xl border-[1.5px] bg-card px-3 text-center font-display text-[24px] font-extrabold tabular-nums outline-none focus:border-acc",
            sonuc === null ? "border-border-strong" : sonuc ? "border-good bg-good-soft" : "border-bad bg-bad-soft",
          )}
          inputMode="decimal"
          autoComplete="off"
          aria-label="Cevabın"
          placeholder="?"
          disabled={sonuc !== null}
          value={yazi}
          onChange={(e) => setYazi(e.target.value.replace(/[^0-9.,\-−]/g, "").slice(0, 10))}
        />
        {q.birim && <Html className="text-[18px] font-bold" html={q.birim} />}
      </label>
      {sonuc === null && <p className="text-center text-[13px] font-semibold text-muted-foreground">Ondalık için virgül: 2,5 · Binlik ayraç koyma: 2700</p>}
    </div>
  );
}

/** Sahne: adımlı derslerin sahnesi test modunda; öğrenci kontrolleri (ya da sahnedeki nesneyi) hedefe getirir. */
function SahneSoru({ q, v, setV, sonuc }: { q: Of<"sahne">; v: Record<string, number>; setV: (c: Cevap) => void; sonuc: boolean | null }) {
  const kayit = SAHNELER[q.sahne.tur];
  if (!kayit) return <p>Bu sahne bulunamadı: {q.sahne.tur}</p>;
  const C = kayit.C;
  const set = (ad: string, x: number) => { if (sonuc === null) setV(kayit.bagla ? kayit.bagla(ad, x, v) : { ...v, [ad]: x }); };
  return (
    <div className="grid gap-3">
      <div className="ad-sahne">
        <C s={{ ...q.sahne, test: sonuc === null }} v={v} set={set} t={0} oynuyor={false} kosular={[]} secim={null} />
      </div>
      <Kontroller liste={q.kontroller} v={v} set={set} kapali={sonuc !== null} />
    </div>
  );
}
