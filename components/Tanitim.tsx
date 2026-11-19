// Tanıtım sayfası (Üçler, 2026-11-19): web'de "/" adresinde, İngilizce, YouTube kanalının "Gece Defteri" görünümünde.
// Kim olduğumuzu, ne yaptığımızı ve nasıl anlattığımızı söyler; ders çözdürmez, uygulamaya ve kanala yönlendirir.
// Kapak kalıbı: siyah zemin, dev gravür nesne, ölçek için minik Çizgi, pembe el çizimi ok, tek pembe kelime, sonda "..".
import Link from "next/link";
import { INSTAGRAM, PLAY_URL, YOUTUBE } from "@/lib/site";
import { Logo } from "./temel";

const DERSLER = [
  { id: "fizik", ad: "Physics", not: "Motion, forces, energy, electricity, waves, light, modern physics" },
  { id: "kimya", ad: "Chemistry", not: "Atoms, bonds, reactions, gases, equilibrium, acids, organic chemistry" },
  { id: "biyoloji", ad: "Biology", not: "Cells, genetics, energy in life, the human body, ecology, evolution" },
] as const;

const ILKELER = [
  { b: "Start with a question", p: "Every lesson and every video opens with something you can wonder about, not with a definition to memorise." },
  { b: "Draw it, don't recite it", p: "Each idea gets its own drawing. If we can't draw it clearly, we haven't explained it yet." },
  { b: "Let you try", p: "You move the slider, sort the cards, make the prediction. Then you find out if you were right." },
];

const EKRANLAR = [
  { src: "/tanitim/ekran-ana.webp", alt: "The app's home screen with Physics, Chemistry and Biology", not: "FIG. 2 · Three subjects, one path each" },
  { src: "/tanitim/ekran-ders.webp", alt: "A lesson card explaining displacement with a drawing", not: "FIG. 3 · One idea, one drawing" },
  { src: "/tanitim/ekran-soru.webp", alt: "An interactive question about atomic models", not: "FIG. 4 · Try it, then see why" },
];

const mono = "font-mono text-[11px] tracking-[.14em] uppercase text-[var(--muted)]";
const sarmal = "mx-auto w-full max-w-[1080px] px-5 sm:px-8";
const anaDugme = "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--btn)] px-5 text-[16px] font-bold text-[var(--on-btn)] transition-transform active:scale-[.98]";
const cizgiDugme = "inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[var(--line-2)] px-5 text-[16px] font-bold transition-colors hover:border-[var(--ink)]";

const maske = (id: string): React.CSSProperties => {
  const u = `url(/gravur/${id}.png)`;
  return { maskImage: u, WebkitMaskImage: u, maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center bottom", WebkitMaskPosition: "center bottom" };
};

export default function Tanitim({ sayi }: { sayi: Record<string, number> }) {
  return (
    <main lang="en" className="gece min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Kapak: kanalın kapak siyahı */}
      <div className="bg-[#070a12]">
        <header className={`${sarmal} flex items-center justify-between py-5`}>
          <Logo />
          <nav className="flex items-center gap-5 text-[14px] font-semibold">
            <a href={YOUTUBE.url} className="hidden text-[var(--muted)] hover:text-[var(--ink)] sm:block">YouTube</a>
            <a href={INSTAGRAM.url} className="hidden text-[var(--muted)] hover:text-[var(--ink)] sm:block">Instagram</a>
            <a href={PLAY_URL} className="rounded-md border border-[var(--line-2)] px-3.5 py-2 hover:border-[var(--ink)]">Get the app</a>
          </nav>
        </header>

        <section className={`${sarmal} grid items-center gap-8 pt-8 pb-14 md:grid-cols-[1.05fr_1fr] md:pt-16 md:pb-24`}>
          <div className="grid gap-6">
            <p className={mono}>Fig. 1 · Who we are</p>
            <h1 className="font-display text-[44px] leading-[.98] font-extrabold tracking-[-.02em] uppercase sm:text-[64px]">
              Knowledge belongs to <span className="text-[var(--mark)]">everyone</span>..
            </h1>
            <p className="max-w-[46ch] text-[18px] leading-relaxed text-[var(--muted)]">
              ucler is an independent science project from Türkiye. We help people understand physics, chemistry and biology:
              short interactive lessons in the app, and long, careful videos on YouTube.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={PLAY_URL} className={anaDugme}>Get it on Google Play</a>
              <a href={YOUTUBE.url} className={cizgiDugme}>Watch on YouTube</a>
            </div>
            <p className={mono}>iPhone app coming soon · The app is in Turkish today, English is on the way</p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tanitim/saat.webp" alt="" width={1400} height={788} className="w-full" />
            {/* Ölçek için minik Çizgi ve onu gösteren pembe ok */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tanitim/cizgi.svg" alt="" className="absolute bottom-[4%] left-[6%] w-[11%]" />
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
          <p className={mono}>What we do</p>
          <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">Two ways in. Same idea behind both.</h2>
          <p className="text-[17px] leading-relaxed text-[var(--muted)]">
            Our goal is simple: help people reach knowledge and learn science, wherever they live and whatever school they went to.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="grid content-start gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className={mono}>01 · The app</p>
            <h3 className="font-display text-[24px] font-extrabold">Learn by doing, a few minutes at a time</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              {Object.values(sayi).reduce((a, b) => a + b, 0)} topics in physics, chemistry and biology, from the very basics to first-year university.
              Short cards, drawings you can touch, and a quick test at the end of every topic.
            </p>
            <a href={PLAY_URL} className="mt-1 font-bold text-[var(--btn)]">Get it on Google Play →</a>
          </article>
          <article className="grid content-start gap-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-6">
            <p className={mono}>02 · The channel</p>
            <h3 className="font-display text-[24px] font-extrabold">Science&apos;s strangest questions, explained properly</h3>
            <p className="leading-relaxed text-[var(--muted)]">
              A new deep dive every week. One question, the real experiments behind it, and a small yellow explorer who walks you through.
              In English, with Turkish audio.
            </p>
            <a href={YOUTUBE.url} className="mt-1 font-bold text-[var(--btn)]">Watch on YouTube →</a>
          </article>
        </div>
      </section>

      {/* Uygulamadan */}
      <section className="border-y border-[var(--line)] bg-[#0c1322]">
        <div className={`${sarmal} grid gap-10 py-16 md:py-24`}>
          <div className="grid max-w-[60ch] gap-4">
            <p className={mono}>Inside the app</p>
            <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">Built like a lab notebook, not a textbook.</h2>
          </div>
          <div className="-mx-5 flex snap-x gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:px-0">
            {EKRANLAR.map((e) => (
              <figure key={e.src} className="grid w-[72%] flex-none snap-center gap-3 sm:w-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.src} alt={e.alt} width={640} height={1385} loading="lazy" className="w-full rounded-[22px] border border-[var(--line-2)]" />
                <figcaption className={mono}>{e.not}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Nasıl anlatıyoruz */}
      <section className={`${sarmal} grid gap-10 py-16 md:py-24`}>
        <div className="grid max-w-[60ch] gap-4">
          <p className={mono}>How we explain</p>
          <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">Three rules we don&apos;t break.</h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-3">
          {ILKELER.map((x, i) => (
            <li key={x.b} className="grid content-start gap-2 border-t-2 border-[var(--btn)] pt-4">
              <span className={mono}>Rule {i + 1}</span>
              <b className="font-display text-[22px] leading-tight font-extrabold">{x.b}</b>
              <p className="leading-relaxed text-[var(--muted)]">{x.p}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Ne anlatıyoruz */}
      <section className={`${sarmal} grid gap-10 pb-16 md:pb-24`}>
        <div className="grid max-w-[60ch] gap-4">
          <p className={mono}>What we teach</p>
          <h2 className="font-display text-[32px] leading-tight font-extrabold sm:text-[40px]">Three sciences, from the ground up.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {DERSLER.map((d) => (
            <article key={d.id} className="relative grid min-h-[230px] content-end gap-1.5 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
              <span aria-hidden className="absolute top-3 right-2 bottom-[40%] w-[46%] bg-[var(--ink)] opacity-90" style={maske(d.id)} />
              <span className={mono}>{sayi[d.id]} topics</span>
              <h3 className="font-display text-[26px] font-extrabold">{d.ad}</h3>
              <p className="text-[14px] leading-relaxed text-[var(--muted)]">{d.not}</p>
            </article>
          ))}
        </div>
        <p className={mono}>Mathematics is next</p>
      </section>

      {/* Kapanış */}
      <section className="bg-[#070a12]">
        <div className={`${sarmal} grid justify-items-start gap-6 py-16 md:py-24`}>
          <h2 className="max-w-[18ch] font-display text-[36px] leading-[1.02] font-extrabold uppercase sm:text-[52px]">
            Stay <span className="text-[var(--mark)]">curious</span>..
          </h2>
          <div className="flex flex-wrap gap-3">
            <a href={PLAY_URL} className={anaDugme}>Get it on Google Play</a>
            <a href={YOUTUBE.url} className={cizgiDugme}>Watch on YouTube</a>
          </div>
        </div>
        <footer className={`${sarmal} flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] py-6 text-[13px] text-[var(--muted)]`}>
          <Logo className="text-[20px]" />
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={YOUTUBE.url} className="hover:text-[var(--ink)]">YouTube</a>
            <a href={INSTAGRAM.url} className="hover:text-[var(--ink)]">Instagram</a>
            <Link href="/gizlilik/" className="hover:text-[var(--ink)]">Privacy</Link>
            <Link href="/kosullar/" className="hover:text-[var(--ink)]">Terms</Link>
            <Link href="/hesap-silme/" className="hover:text-[var(--ink)]">Delete account</Link>
          </nav>
        </footer>
      </section>
    </main>
  );
}
