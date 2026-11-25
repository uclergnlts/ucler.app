// Tanıtım sayfası (Üçler, 2026-11-19): web'de "/" adresinde, İngilizce, YouTube kanalının "Gece Defteri" görünümünde.
// Kim olduğumuzu, ne yaptığımızı ve nasıl anlattığımızı söyler; ders çözdürmez, uygulamaya ve kanala yönlendirir.
// Kapak kalıbı: siyah zemin, dev gravür nesne, ölçek için minik Çizgi, pembe el çizimi ok, tek pembe kelime, sonda "..".
import Link from "next/link";
import { APP_STORE_URL, INSTAGRAM, IOS_YAYINDA, PLAY_URL, YOUTUBE } from "@/lib/site";
import { CizgiDugme, CizgiIzleyen, CizgiYuruyen } from "./Cizgi";
import { CIZIM_YOL } from "./Cizimler";
import { SURUM_YOL } from "./SurumNotlari";
import { Logo } from "./temel";

export type Dil = "en" | "tr";

const METIN = {
  en: {
    al: "Get the app", play: "Get it on Google Play", ios: "Download on the App Store", yakinda: "soon", izle: "Watch on YouTube",
    k1: "Fig. 1 · Who we are", h1a: "Knowledge belongs to ", h1b: "everyone",
    giris: "ucler is an independent learning project from Türkiye. We help people truly understand what they study: short interactive lessons in the app, and long, careful videos on YouTube.",
    not: "",
    k2: "What we do", h2: "Two ways in. Same idea behind both.",
    amac: "Our goal is simple: help people reach knowledge and learn science, wherever they live and whatever school they went to.",
    a1k: "01 · The app", a1h: "Learn by doing, a few minutes at a time",
    a1p: (n: number) => `${n} topics so far, from the very basics to first-year university, with more subjects on the way. Short cards, drawings you can touch, and a quick test at the end of every topic.`,
    a2k: "02 · The channel", a2h: "Science's strangest questions, explained properly",
    a2p: "A new deep dive every week. One question, the real experiments behind it, and a small yellow explorer who walks you through. In English, with Turkish audio.",
    cz: "Drawings", k6: "From the videos", h6: "Every video gets its own engravings, one for each idea.", h6b: "See all the drawings",
    k3: "Inside the app", h3: "Built like a lab notebook, not a textbook.",
    ekran: [
      ["ana", "The app's home screen with Physics, Chemistry and Biology", "Fig. 2 · Three subjects, one path each"],
      ["ders", "A lesson card explaining displacement with a drawing", "Fig. 3 · One idea, one drawing"],
      ["soru", "An interactive question about atomic models", "Fig. 4 · Try it, then see why"],
    ],
    k4: "How we explain", h4: "Three rules we don't break.", kural: "Rule",
    ilke: [
      ["Start with a question", "Every lesson and every video opens with something you can wonder about, not with a definition to memorise."],
      ["Draw it, don't recite it", "Each idea gets its own drawing. If we can't draw it clearly, we haven't explained it yet."],
      ["Let you try", "You move the slider, sort the cards, make the prediction. Then you find out if you were right."],
    ],
    k5: "What we teach", h5: "Three sciences, from the ground up.", konu: "topics", sirada: "Mathematics is next",
    ders: {
      fizik: ["Physics", "Motion, forces, energy, electricity, waves, light, modern physics"],
      kimya: ["Chemistry", "Atoms, bonds, reactions, gases, equilibrium, acids, organic chemistry"],
      biyoloji: ["Biology", "Cells, genetics, energy in life, the human body, ecology, evolution"],
    },
    sona: "Stay ", sonb: "curious",
    gizlilik: "Privacy", kosul: "Terms", surum: "Release notes", sil: "Delete account",
  },
  tr: {
    al: "Uygulamayı indir", play: "Google Play'den indir", ios: "App Store'dan indir", yakinda: "yakında", izle: "YouTube'da izle",
    k1: "Şekil 1 · Biz kimiz", h1a: "Bilgi ", h1b: "herkesindir",
    giris: "ucler, Türkiye'den bağımsız bir öğrenme projesidir. İnsanların öğrendiği konuları gerçekten anlamasına yardım ediyoruz. Uygulamada kısa ve etkileşimli dersler, YouTube'da uzun ve özenli videolar hazırlıyoruz.",
    not: "",
    k2: "Ne yapıyoruz", h2: "İki ayrı yol var, ikisinin de fikri aynı.",
    amac: "Amacımız basit: nerede yaşarsa yaşasın, hangi okulda okumuş olursa olsun, herkesin bilgiye ulaşmasına ve bilimi öğrenmesine yardım etmek.",
    a1k: "01 · Uygulama", a1h: "Her gün birkaç dakikada, yaparak öğren",
    a1p: (n: number) => `Şimdilik ${n} konu var ve yeni dersler yolda. Konular en temelden başlar ve üniversitenin ilk yılına kadar gider. Her konuda kısa kartlar, dokunabildiğin çizimler ve sonda kısa bir test bulunur.`,
    a2k: "02 · Kanal", a2h: "Bilimin en tuhaf soruları, hakkını vererek",
    a2p: "Her hafta yeni bir uzun video yayınlıyoruz. Her videoda tek bir soru, arkasındaki gerçek deneyler ve sana yol gösteren küçük sarı bir kâşif var. Videolar İngilizce çıkıyor, Türkçe seslendirmesi de bulunuyor.",
    cz: "Çizimler", k6: "Videolardan", h6: "Her videonun kendi gravürleri var, her fikre bir çizim.", h6b: "Bütün çizimleri gör",
    k3: "Uygulamadan", h3: "Ders kitabı gibi değil, deney defteri gibi.",
    ekran: [
      ["ana", "Uygulamanın ana ekranı: Fizik, Kimya ve Biyoloji", "Şekil 2 · Üç ders, her birinin kendi yolu"],
      ["ders", "Yer değiştirmeyi çizimle anlatan bir ders kartı", "Şekil 3 · Her fikre bir çizim"],
      ["soru", "Atom modelleriyle ilgili etkileşimli bir soru", "Şekil 4 · Önce dene, sonra nedenini gör"],
    ],
    k4: "Nasıl anlatıyoruz", h4: "Hiç bozmadığımız üç kural var.", kural: "Kural",
    ilke: [
      ["Bir soruyla başlarız", "Her ders ve her video ezberlenecek bir tanımla değil, merak edebileceğin bir soruyla açılır."],
      ["Anlatmayız, çizeriz", "Her fikrin kendi çizimi olur. Bir şeyi açıkça çizemiyorsak onu henüz anlatamamışız demektir."],
      ["Denemeyi sana bırakırız", "Sürgüyü sen oynatır, kartları sen sıralar, tahmini sen yaparsın. Haklı olup olmadığını sonra görürsün."],
    ],
    k5: "Ne anlatıyoruz", h5: "Üç bilim dalı, en temelden.", konu: "konu", sirada: "Sırada matematik var",
    ders: {
      fizik: ["Fizik", "Hareket, kuvvet, enerji, elektrik, dalgalar, ışık ve modern fizik"],
      kimya: ["Kimya", "Atom, bağlar, tepkimeler, gazlar, denge, asitler ve organik kimya"],
      biyoloji: ["Biyoloji", "Hücre, kalıtım, canlılarda enerji, insan vücudu, ekoloji ve evrim"],
    },
    sona: "Hep ", sonb: "merak et",
    gizlilik: "Gizlilik", kosul: "Koşullar", surum: "Sürüm notları", sil: "Hesabı sil",
  },
} as const;

const DERS_IDS = ["fizik", "kimya", "biyoloji"] as const;
/** Tanıtım sayfasında galeriye kapı olan dört çizim (video/çizim). */
const VITRIN = ["yt05/f05", "yt04/g10", "yt05/f12", "yt04/g02"] as const;

const mono = "font-mono text-[11px] tracking-[.14em] uppercase text-[var(--muted)]";
const sarmal = "mx-auto w-full max-w-[1080px] px-5 sm:px-8";
const anaDugme = "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--btn)] px-5 text-[16px] font-bold text-[var(--on-btn)] transition-transform active:scale-[.98]";
const cizgiDugme = "inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[var(--line-2)] px-5 text-[16px] font-bold transition-colors hover:border-[var(--ink)]";

const yakindaDugme = "inline-flex h-12 cursor-default items-center justify-center gap-2.5 rounded-md border border-dashed border-[var(--line-2)] px-5 text-[16px] font-bold text-[var(--muted)]";

/** App Store düğmesi. iOS uygulaması yayında değilken (IOS_YAYINDA) bağlantı vermez, "yakında" yazar.
 * Apple'ın rozetini taklit etmemek için logo kullanılmaz, yalnızca yazı vardır. */
function AppStore({ m, sinif, ok }: { m: (typeof METIN)[Dil]; sinif: string; ok?: boolean }) {
  if (IOS_YAYINDA) return <a href={APP_STORE_URL} className={sinif}>{m.ios}{ok && " →"}</a>;
  return (
    <span aria-disabled="true" className={ok ? "font-bold text-[var(--muted)]" : yakindaDugme}>
      App Store <span className="font-mono text-[11px] font-normal tracking-[.14em] uppercase">· {m.yakinda}</span>
    </span>
  );
}

const maske = (id: string): React.CSSProperties => {
  const u = `url(/gravur/${id}.png)`;
  return { maskImage: u, WebkitMaskImage: u, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center bottom", WebkitMaskPosition: "center bottom" };
};

export default function Tanitim({ sayi, dil = "en" }: { sayi: Record<string, number>; dil?: Dil }) {
  const m = METIN[dil];
  const dilDugme = (d: Dil, yol: string) => (
    <Link href={yol} hrefLang={d} aria-current={dil === d ? "true" : undefined} className={dil === d ? "text-[var(--ink)]" : "text-[var(--muted)] hover:text-[var(--ink)]"}>{d.toUpperCase()}</Link>
  );
  return (
    <main lang={dil} className="gece min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Kapak: kanalın kapak siyahı */}
      <div className="bg-[#070a12]">
        <header className={`${sarmal} flex items-center justify-between py-5`}>
          <Logo />
          <nav className="flex items-center gap-5 text-[14px] font-semibold">
            <a href={YOUTUBE.url} className="hidden text-[var(--muted)] hover:text-[var(--ink)] sm:block">YouTube</a>
            <Link href={CIZIM_YOL[dil]} className="hidden text-[var(--muted)] hover:text-[var(--ink)] sm:block">{m.cz}</Link>
            <a href={INSTAGRAM.url} className="hidden text-[var(--muted)] hover:text-[var(--ink)] sm:block">Instagram</a>
            <span className="flex items-center gap-2 font-mono text-[12px] tracking-[.1em]">{dilDugme("en", "/")}<span aria-hidden className="text-[var(--line-2)]">/</span>{dilDugme("tr", "/tr/")}</span>
            <a href={PLAY_URL} className="rounded-md border border-[var(--line-2)] px-3.5 py-2 hover:border-[var(--ink)]">{m.al}</a>
          </nav>
        </header>

        <section className={`${sarmal} grid items-center gap-8 pt-8 pb-14 md:grid-cols-[1.05fr_1fr] md:pt-16 md:pb-24`}>
          <div className="grid gap-6">
            <p className={mono}>{m.k1}</p>
            <h1 className="font-display text-[44px] leading-[.98] font-extrabold tracking-[-.02em] uppercase sm:text-[64px]">
              {m.h1a}<span className="text-[var(--mark)]">{m.h1b}</span>..
            </h1>
            <p className="max-w-[46ch] text-[18px] leading-relaxed text-[var(--muted)]">
              {m.giris}
            </p>
            <div className="flex flex-wrap gap-3">
              <CizgiDugme><a href={PLAY_URL} className={anaDugme}>{m.play}</a></CizgiDugme>
              <AppStore m={m} sinif={anaDugme} />
              <a href={YOUTUBE.url} className={cizgiDugme}>{m.izle}</a>
            </div>
            {m.not && <p className={mono}>{m.not}</p>}
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tanitim/saat.webp" alt="" width={1400} height={788} className="w-full" />
            {/* Ölçek için minik Çizgi ve onu gösteren pembe ok. Çizgi gözleriyle fareyi izler, tıklanınca el sallar. */}
            <CizgiIzleyen className="absolute bottom-[3%] left-[5%] w-[13%]" />
            <svg viewBox="0 0 120 90" aria-hidden className="absolute bottom-[30%] left-[13%] w-[17%] text-[var(--mark)]" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M108 8C78 6 40 22 16 70" />
              <path d="M12 44l3 28 26-10" />
            </svg>
          </div>
        </section>
      </div>

      {/* Ne yapıyoruz */}
      <section className={`${sarmal} grid gap-10 py-16 md:py-24`}>
        <div className="grid max-w-[60ch] gap-4">
          <p className={mono}>{m.k2}</p>
          <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">{m.h2}</h2>
          <p className="text-[17px] leading-relaxed text-[var(--muted)]">
            {m.amac}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="grid content-start gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className={mono}>{m.a1k}</p>
            <h3 className="font-display text-[24px] font-extrabold">{m.a1h}</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              {m.a1p(Object.values(sayi).reduce((a, b) => a + b, 0))}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
              <a href={PLAY_URL} className="font-bold text-[var(--btn)]">{m.play} →</a>
              <AppStore m={m} sinif="font-bold text-[var(--btn)]" ok />
            </div>
          </article>
          <article className="grid content-start gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className={mono}>{m.a2k}</p>
            <h3 className="font-display text-[24px] font-extrabold">{m.a2h}</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              {m.a2p}
            </p>
            <a href={YOUTUBE.url} className="mt-1 font-bold text-[var(--btn)]">{m.izle} →</a>
          </article>
        </div>
      </section>

      {/* Videolardan: çizim galerisine kapı (components/Cizimler.tsx) */}
      <section className={`${sarmal} grid gap-8 pb-16 md:pb-24`}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="grid max-w-[60ch] gap-4">
            <p className={mono}>{m.k6}</p>
            <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">{m.h6}</h2>
          </div>
          <Link href={CIZIM_YOL[dil]} className={cizgiDugme}>{m.h6b} →</Link>
        </div>
        <Link href={CIZIM_YOL[dil]} aria-label={m.h6b} className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {VITRIN.map((v, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={v} src={`/cizim/${v}-k.webp`} alt="" width={640} height={360} loading="lazy"
              className={`aspect-video w-full rounded-md border border-[var(--line)] object-cover ${i > 1 ? "hidden sm:block" : ""}`} />
          ))}
        </Link>
      </section>

      {/* Uygulamadan */}
      <section className="border-y border-[var(--line)] bg-[#0c1322]">
        <div className={`${sarmal} grid gap-10 py-16 md:py-24`}>
          <div className="grid max-w-[60ch] gap-4">
            <p className={mono}>{m.k3}</p>
            <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">{m.h3}</h2>
          </div>
          <div className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0">
            {m.ekran.map(([ad, alt, not]) => (
              <figure key={ad} className="grid w-[72%] flex-none snap-center gap-3 sm:w-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/tanitim/ekran-${ad}-${dil}.webp`} alt={alt} width={640} height={1385} loading="lazy" className="w-full rounded-[22px] border border-[var(--line-2)]" />
                <figcaption className={mono}>{not}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl anlatıyoruz */}
      <section className={`${sarmal} grid gap-10 py-16 md:py-24`}>
        <div className="grid max-w-[60ch] gap-4">
          <p className={mono}>{m.k4}</p>
          <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">{m.h4}</h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-3">
          {m.ilke.map(([b, p], i) => (
            <li key={b} className="grid content-start gap-2 border-t-2 border-[var(--btn)] pt-4">
              <span className={mono}>{m.kural} {i + 1}</span>
              <b className="font-display text-[22px] leading-tight font-extrabold">{b}</b>
              <p className="leading-relaxed text-[var(--muted)]">{p}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Ne anlatıyoruz */}
      <section className={`${sarmal} grid gap-10 pb-16 md:pb-24`}>
        <div className="grid max-w-[60ch] gap-4">
          <p className={mono}>{m.k5}</p>
          <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">{m.h5}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {DERS_IDS.map((d) => (
            <article key={d} className="relative grid min-h-[230px] content-end gap-1.5 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
              <span aria-hidden className="absolute top-3 right-2 bottom-[40%] w-[46%] bg-[var(--ink)] opacity-90" style={maske(d)} />
              <span className={mono}>{sayi[d]} {m.konu}</span>
              <h3 className="font-display text-[26px] font-extrabold">{m.ders[d][0]}</h3>
              <p className="text-[14px] leading-relaxed text-[var(--muted)]">{m.ders[d][1]}</p>
            </article>
          ))}
        </div>
        <p className={mono}>{m.sirada}</p>
      </section>

      {/* Kapanış */}
      <section className="bg-[#070a12]">
        <div className={`${sarmal} grid justify-items-start gap-6 py-16 md:py-24`}>
          <h2 className="max-w-[18ch] font-display text-[36px] leading-[1.02] font-extrabold uppercase sm:text-[52px]">
            {m.sona}<span className="text-[var(--mark)]">{m.sonb}</span>..
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href={PLAY_URL} className={anaDugme}>{m.play}</a>
            <AppStore m={m} sinif={anaDugme} />
            <a href={YOUTUBE.url} className={cizgiDugme}>{m.izle}</a>
          </div>
        </div>
        {/* Sayfa sonunda kendi kendine yürüyen Çizgi; ayakları alt bilginin çizgisine basar. */}
        <CizgiYuruyen className={sarmal} />
        <footer className={`${sarmal} flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] py-6 text-[13px] text-[var(--muted)]`}>
          <Logo className="text-[20px]" />
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={YOUTUBE.url} className="hover:text-[var(--ink)]">YouTube</a>
            <a href={INSTAGRAM.url} className="hover:text-[var(--ink)]">Instagram</a>
            <Link href={CIZIM_YOL[dil]} className="hover:text-[var(--ink)]">{m.cz}</Link>
            <Link href={SURUM_YOL[dil]} className="hover:text-[var(--ink)]">{m.surum}</Link>
            <Link href="/gizlilik/" className="hover:text-[var(--ink)]">{m.gizlilik}</Link>
            <Link href="/kosullar/" className="hover:text-[var(--ink)]">{m.kosul}</Link>
            <Link href="/hesap-silme/" className="hover:text-[var(--ink)]">{m.sil}</Link>
          </nav>
        </footer>
      </section>
    </main>
  );
}
