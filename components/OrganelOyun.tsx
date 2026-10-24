"use client";
// Oyun: görevi verilen organeli hücre çiziminde bul. Hayvan ya da bitki hücresi, 10 tur.
// Bilgiler content/biyoloji.json'daki "Hücre ve organeller" konusuyla aynıdır.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { kaydet, PUAN } from "@/lib/puan";
import { Icon } from "./icons";
import { href, UstBar, UstEylem } from "./temel";

type Mod = "hayvan" | "bitki";
type Org = { ad: string; gorev: string; not: string };
type Durum = { mod: Mod; sira: string[]; i: number; secim: string | null; dogru: number };
const TUR = 10, KAYIT = "ucler-oyun-organel";

const ORG: Record<string, Org> = {
  zar: { ad: "Hücre zarı", gorev: "Hücreyi çevreleyen sınır: neyin girip çıkacağını seçer (seçici geçirgen).", not: "Hücre zarı her hücrede bulunur. Bitkide zarın hemen dışında bir de hücre duvarı vardır." },
  cekirdek: { ad: "Çekirdek", gorev: "DNA'yı taşır; hangi proteinin ne zaman üretileceğini belirleyerek hücreyi yönetir.", not: "Çekirdek porlu çift zarla çevrilidir; içinde DNA (kromatin) ve çekirdekçik bulunur." },
  cekirdekcik: { ad: "Çekirdekçik", gorev: "Çekirdeğin içindeki koyu bölge: ribozom yapımına katılır.", not: "Çekirdekçik zarsızdır ve çekirdeğin içinde durur." },
  ribozom: { ad: "Ribozom", gorev: "Zarsız, çok küçük yapı: protein sentezler. Sitoplazmada serbest hâlde de bulunur.", not: "Ribozom bütün hücrelerde, bakterilerde bile bulunur. Granüllü ER'nin üstündeki noktalar da ribozomdur." },
  ger: { ad: "Granüllü ER", gorev: "Üstü ribozomlarla kaplı kanal sistemi: salgılanacak ve zara gidecek proteinleri üretip taşır.", not: "Granüllü ER çekirdeğin hemen yanındadır; ürettiği proteinleri keseciklerle Golgi'ye yollar." },
  gser: { ad: "Granülsüz ER", gorev: "Ribozomsuz kanal sistemi: lipit sentezler, karaciğerde zararlı maddeleri etkisizleştirir.", not: "Granülsüz ER ribozom taşımaz; kas hücresinde Ca²⁺ depolar." },
  golgi: { ad: "Golgi aygıtı", gorev: "ER'den gelen proteinleri düzenler, paketler ve keseciklerle gideceği yere yollar.", not: "Golgi, üst üste dizili yassı keselerden oluşan kargo merkezidir." },
  mitokondri: { ad: "Mitokondri", gorev: "Hücrenin enerji santrali: oksijenli solunumla besinlerden ATP üretir.", not: "Mitokondri çift zarlıdır, iç zarı kıvrımlıdır; kendi DNA'sı ve ribozomu vardır. Kas hücrelerinde boldur." },
  lizozom: { ad: "Lizozom", gorev: "Sindirim enzimleriyle dolu kesecik: hücre içi sindirim yapar, eskiyen organelleri yıkar.", not: "Lizozom Golgi'den oluşur; özellikle hayvan hücrelerinde bulunur." },
  peroksizom: { ad: "Peroksizom", gorev: "Zararlı hidrojen peroksiti (H₂O₂) katalaz enzimiyle su ve oksijene ayırır.", not: "Peroksizom küçük, tek zarlı bir kesecik; karaciğerde boldur, bitki hücresinde de bulunur." },
  sentrozom: { ad: "Sentrozom", gorev: "Hücre bölünürken iğ ipliklerini düzenler; birbirine dik iki küçük silindirden oluşur.", not: "Sentrozom iki sentriolden oluşur. Hayvan hücresinde bulunur, bitki hücresinde yoktur." },
  duvar: { ad: "Hücre duvarı", gorev: "Selülozdan yapılmış sağlam dış katman: hücreye destek ve koruma sağlar.", not: "Hücre duvarı zarın dışındadır. Bitkide selülozdandır; hayvan hücresinde yoktur." },
  kloroplast: { ad: "Kloroplast", gorev: "Klorofille ışık enerjisini yakalar, fotosentezle glikoz üretir.", not: "Kloroplast çift zarlıdır ve kendi DNA'sı vardır. Bitki ve alglerde bulunan bir plastittir." },
  koful: { ad: "Merkezi koful", gorev: "Su, besin, pigment ve atık depolayan kese; su alınca bitki hücresini gergin tutar.", not: "Bitki hücresinde tek ve büyük bir merkezi koful vardır; hayvan hücresinin kofulları küçüktür." },
};

// Bir yayın (halka diliminin) yolu: merkez, yarıçap, başlangıç ve bitiş açısı (derece, saat yönünde).
const yay = (cx: number, cy: number, r: number, a1: number, a2: number) => {
  const p = (a: number) => `${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`;
  return `M${p(a1)} A${r},${r} 0 0 1 ${p(a2)}`;
};
const dilim = (cx: number, cy: number, r1: number, r2: number, a1: number, a2: number) => {
  const p = (r: number, a: number) => `${(cx + r * Math.cos((a * Math.PI) / 180)).toFixed(1)},${(cy + r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`;
  return `M${p(r1, a1)} A${r1},${r1} 0 0 1 ${p(r1, a2)} L${p(r2, a2)} A${r2},${r2} 0 0 0 ${p(r2, a1)} Z`;
};
const noktalar = (cx: number, cy: number, r: number, a1: number, a2: number, n: number) =>
  Array.from({ length: n }, (_, k) => {
    const a = ((a1 + ((a2 - a1) * k) / (n - 1)) * Math.PI) / 180;
    return <circle key={k} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={1.7} />;
  });

// Çizim parçaları
const Mito = ({ x, y, d }: { x: number; y: number; d: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${d})`}>
    <ellipse rx={26} ry={12} fill="var(--c2)" fillOpacity={0.18} stroke="var(--c2)" strokeWidth={2} />
    <path d="M-18,0 q4,-9 8,0 t8,0 t8,0 t8,0 t4,0" fill="none" stroke="var(--c2)" strokeWidth={1.5} />
  </g>
);
const Klor = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse rx={29} ry={15} fill="var(--c3)" fillOpacity={0.3} stroke="var(--c3)" strokeWidth={2} />
    <g fill="var(--c3)">
      {[-16, -5, 6, 17].map((dx) => <rect key={dx} x={dx - 3.5} y={-7} width={7} height={14} rx={2} />)}
    </g>
    <line x1={-20} y1={0} x2={20} y2={0} stroke="var(--c3)" strokeWidth={1.2} />
  </g>
);
const Golgi = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke="var(--c1)" strokeWidth={4.5} strokeLinecap="round" strokeOpacity={0.75}>
    <path d="M-22,-12 Q0,-4 22,-12" />
    <path d="M-24,-2 Q0,6 24,-2" />
    <path d="M-22,8 Q0,16 22,8" />
    <path d="M-18,18 Q0,25 18,18" />
    <circle cx={28} cy={-14} r={3} strokeWidth={2} />
    <circle cx={30} cy={14} r={3} strokeWidth={2} />
  </g>
);
const Cekirdek = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="var(--c5)" fillOpacity={0.14} stroke="var(--c5)" strokeWidth={2.5} />
    <circle cx={x} cy={y} r={r - 4} fill="none" stroke="var(--c5)" strokeWidth={1} />
    <path d={`M${x - r * 0.6},${y - r * 0.3} q${r * 0.15},${-r * 0.3} ${r * 0.3},0 t${r * 0.3},0`} fill="none" stroke="var(--c5)" strokeWidth={1.5} />
    <path d={`M${x - r * 0.55},${y + r * 0.35} q${r * 0.15},${-r * 0.3} ${r * 0.3},0 t${r * 0.25},0`} fill="none" stroke="var(--c5)" strokeWidth={1.5} />
  </g>
);
const Cekirdekcik = ({ x, y, r }: { x: number; y: number; r: number }) => <circle cx={x} cy={y} r={r} fill="var(--c5)" fillOpacity={0.55} />;
const Ribozomlar = ({ x, y }: { x: number; y: number }) => (
  <g fill="var(--ink)">
    {[[-12, -6], [-3, -9], [7, -5], [14, 3], [-9, 5], [1, 2], [10, 10], [-2, 11]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={y + dy} r={2.2} />)}
  </g>
);
const Peroks = ({ x, y }: { x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={11} fill="var(--c4)" fillOpacity={0.25} stroke="var(--c4)" strokeWidth={2} />
    <rect x={x - 4} y={y - 4} width={8} height={8} fill="var(--c4)" transform={`rotate(45 ${x} ${y})`} />
  </g>
);
const Ger = ({ x, y, r, a1, a2 }: { x: number; y: number; r: number[]; a1: number; a2: number }) => (
  <g>
    <g fill="none" stroke="var(--c4)" strokeWidth={6} strokeOpacity={0.45} strokeLinecap="round">
      {r.map((ri) => <path key={ri} d={yay(x, y, ri, a1, a2)} />)}
    </g>
    <g fill="var(--ink)">{r.map((ri) => <g key={ri}>{noktalar(x, y, ri + 4.5, a1 + 3, a2 - 3, Math.round((ri * (a2 - a1)) / 520))}</g>)}</g>
  </g>
);

type Sahne = { w: number; h: number; zemin: React.ReactNode; hit: Record<string, React.ReactNode> };

// Hayvan hücresi: oval, ortada çekirdek. Dokunma alanları görünen şekillerden biraz büyüktür.
const HAYVAN: Sahne = {
  w: 360, h: 290,
  zemin: (
    <>
      <ellipse cx={180} cy={145} rx={170} ry={135} fill="var(--c1)" fillOpacity={0.05} stroke="var(--c1)" strokeWidth={3} />
      <Cekirdek x={150} y={135} r={44} />
      <Cekirdekcik x={162} y={147} r={13} />
      <Ger x={150} y={135} r={[56, 66, 76]} a1={-60} a2={40} />
      <Golgi x={282} y={82} />
      <Mito x={287} y={182} d={-20} />
      <Mito x={60} y={160} d={70} />
      <g fill="none" stroke="var(--c3)" strokeWidth={5} strokeOpacity={0.6} strokeLinecap="round">
        <path d="M66,204 C80,192 92,216 108,204 S128,196 132,206" />
        <path d="M70,222 C86,212 98,236 114,222" />
        <path d="M84,240 C98,232 110,252 126,238" />
      </g>
      <g>
        <circle cx={68} cy={108} r={13} fill="var(--c5)" fillOpacity={0.22} stroke="var(--c5)" strokeWidth={2} />
        <g fill="var(--c5)"><circle cx={64} cy={104} r={1.8} /><circle cx={72} cy={106} r={1.8} /><circle cx={66} cy={113} r={1.8} /><circle cx={73} cy={113} r={1.8} /></g>
      </g>
      <Peroks x={112} y={56} />
      <g fill="var(--muted)" fillOpacity={0.6} stroke="var(--ink)" strokeWidth={1.2}>
        <rect x={213} y={232} width={22} height={9} rx={2} />
        <rect x={238} y={226} width={9} height={22} rx={2} />
      </g>
      <Ribozomlar x={168} y={246} />
    </>
  ),
  hit: {
    zar: <ellipse cx={180} cy={145} rx={170} ry={135} fill="none" strokeWidth={20} />,
    cekirdek: <circle cx={150} cy={135} r={46} />,
    ger: <path d={dilim(150, 135, 50, 83, -62, 42)} />,
    golgi: <circle cx={284} cy={84} r={32} />,
    mitokondri: <><ellipse cx={287} cy={182} rx={34} ry={22} transform="rotate(-20 287 182)" /><ellipse cx={60} cy={160} rx={34} ry={20} transform="rotate(70 60 160)" /></>,
    gser: <rect x={58} y={188} width={80} height={62} rx={18} />,
    lizozom: <circle cx={68} cy={108} r={22} />,
    peroksizom: <circle cx={112} cy={56} r={22} />,
    sentrozom: <circle cx={229} cy={237} r={23} />,
    ribozom: <rect x={145} y={224} width={46} height={44} rx={10} />,
    cekirdekcik: <circle cx={162} cy={147} r={22} />,
  },
};

// Bitki hücresi: köşeli, duvarlı; ortada büyük koful, çekirdek kenara itilmiş.
const BITKI: Sahne = {
  w: 360, h: 290,
  zemin: (
    <>
      <rect x={6} y={6} width={348} height={278} rx={18} fill="none" stroke="var(--c4)" strokeOpacity={0.55} strokeWidth={10} />
      <rect x={19} y={19} width={322} height={252} rx={12} fill="var(--c3)" fillOpacity={0.05} stroke="var(--c1)" strokeWidth={2.5} />
      <rect x={112} y={50} width={128} height={178} rx={28} fill="var(--c1)" fillOpacity={0.14} stroke="var(--c1)" strokeWidth={2} />
      <Klor x={65} y={66} />
      <Klor x={65} y={226} />
      <Klor x={292} y={242} />
      <Mito x={65} y={146} d={0} />
      <Cekirdek x={292} y={76} r={32} />
      <Cekirdekcik x={300} y={84} r={10} />
      <Ger x={292} y={76} r={[42, 50]} a1={52} a2={128} />
      <Golgi x={290} y={172} />
      <Ribozomlar x={150} y={250} />
      <Peroks x={205} y={248} />
    </>
  ),
  hit: {
    duvar: <rect x={6} y={6} width={348} height={278} rx={18} fill="none" strokeWidth={14} />,
    zar: <rect x={19} y={19} width={322} height={252} rx={12} fill="none" strokeWidth={12} />,
    koful: <rect x={112} y={50} width={128} height={178} rx={28} />,
    cekirdek: <circle cx={292} cy={76} r={34} />,
    ger: <path d={dilim(292, 76, 34, 64, 44, 136)} />,
    kloroplast: <><ellipse cx={65} cy={66} rx={36} ry={22} /><ellipse cx={65} cy={226} rx={36} ry={22} /><ellipse cx={292} cy={242} rx={36} ry={20} /></>,
    mitokondri: <ellipse cx={65} cy={146} rx={34} ry={20} />,
    golgi: <circle cx={292} cy={174} r={30} />,
    ribozom: <rect x={127} y={230} width={46} height={42} rx={10} />,
    peroksizom: <circle cx={205} cy={248} r={22} />,
    cekirdekcik: <circle cx={300} cy={84} r={21} />,
  },
};

const SAHNE: Record<Mod, Sahne> = { hayvan: HAYVAN, bitki: BITKI };

function karistir(mod: Mod) {
  const a = Object.keys(SAHNE[mod].hit);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, TUR);
}

function enIyi(): number {
  try { return Number(localStorage.getItem(KAYIT)) || 0; } catch { return 0; }
}

export default function OrganelOyun() {
  const [d, setD] = useState<Durum | null>(null);
  const [rekor, setRekor] = useState(0);
  useEffect(() => setRekor(enIyi()), []);

  const bitti = d !== null && d.i >= TUR;
  // Oyun bitince bir kez puan yazılır (aynı oyun nesnesi için yeniden yazılmaz).
  const sayilan = useRef<Durum | null>(null);
  useEffect(() => {
    if (!bitti || !d) return;
    if (sayilan.current !== d) { sayilan.current = d; kaydet("oyun", 1, PUAN.oyun); }
    if (d.dogru > enIyi()) {
      try { localStorage.setItem(KAYIT, String(d.dogru)); } catch {}
      setRekor(d.dogru);
    }
  }, [bitti, d]);

  const basla = (mod: Mod) => setD({ mod, sira: karistir(mod), i: 0, secim: null, dogru: 0 });

  let govde: React.ReactNode;
  if (!d) {
    govde = (
      <section className="oyun-giris">
        <div className="bubble">
          <h2>Görevden organele</h2>
          <p>Her turda bir organelin görevi yazacak. Hücre çiziminde o organele dokun. {TUR} tur.</p>
        </div>
        <button className="btn main" onClick={() => basla("hayvan")}>Hayvan hücresi</button>
        <button className="btn" onClick={() => basla("bitki")}>Bitki hücresi (duvar, kloroplast, koful)</button>
        {rekor > 0 && <p className="oyun-rekor">En iyi sonucun: {rekor}/{TUR}</p>}
      </section>
    );
  } else if (bitti) {
    govde = (
      <section className="card end">
        <div className="score">{d.dogru}/{TUR}</div>
        <h2>{d.dogru === TUR ? "Hepsi doğru, hücrenin haritası sende!" : d.dogru >= 7 ? "Çok iyi, birkaç organel karıştı." : "Organellerin görevlerine bir daha bak."}</h2>
        <p>En iyi sonucun: {Math.max(rekor, d.dogru)}/{TUR}</p>
        <div className="acts">
          <button className="btn main" onClick={() => basla(d.mod)}>Tekrar oyna</button>
          <button className="btn" onClick={() => basla(d.mod === "hayvan" ? "bitki" : "hayvan")}>{d.mod === "hayvan" ? "Bitki hücresiyle oyna" : "Hayvan hücresiyle oyna"}</button>
          <Link className="btn" href={href("biyoloji", "hucre-organeller")}>Konu: Hücre ve organeller</Link>
          <Link className="btn" href="/oyunlar/">Oyunlara dön</Link>
        </div>
      </section>
    );
  } else {
    const sahne = SAHNE[d.mod], hedef = d.sira[d.i], s = d.secim, o = ORG[hedef];
    const bildi = s === hedef;
    const sec = (id: string) =>
      setD((x) => (!x || x.secim !== null ? x : { ...x, secim: id, dogru: x.dogru + (id === hedef ? 1 : 0) }));
    govde = (
      <>
        <div className="oyun-ust">
          <span>Tur {d.i + 1} / {TUR}</span>
          <span>{d.dogru} doğru</span>
        </div>
        <div className="og-soru">{o.gorev}</div>
        <div className="og-alan">
          <svg viewBox={`0 0 ${sahne.w} ${sahne.h}`} role="group" aria-label={d.mod === "hayvan" ? "Hayvan hücresi" : "Bitki hücresi"}>
            {sahne.zemin}
            {Object.entries(sahne.hit).map(([id, sekil], k) => {
              const cls = s === null ? "" : id === hedef ? "ok" : id === s ? "no" : "";
              return (
                <g
                  key={id}
                  className={`og-hit ${cls}`}
                  role="button"
                  tabIndex={s === null ? 0 : -1}
                  aria-label={s === null ? `Bölge ${k + 1}` : ORG[id].ad}
                  onClick={() => sec(id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(id); } }}
                >
                  {sekil}
                </g>
              );
            })}
          </svg>
        </div>
        {s && (
          <div className={`bubble ${bildi ? "ok" : "no"}`} aria-live="polite">
            <h2>{bildi ? `Doğru: ${o.ad}` : `Dokunduğun: ${ORG[s].ad}`}</h2>
            <p>{!bildi && <>Aranan: <b>{o.ad}</b> (yeşil). </>}{o.not}</p>
          </div>
        )}
        <div className="controls one">
          <button className="btn main" disabled={!s} onClick={() => setD((x) => x && { ...x, i: x.i + 1, secim: null })}>
            {d.i === TUR - 1 ? "Sonucu gör" : "Sonraki görev"}
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="app" data-ders="biyoloji">
      <UstBar
        geri={{ to: "/oyunlar/", label: "Oyunlara dön" }}
        baslik="Organeli bul"
        sag={d && <UstEylem label="Baştan başla" icon={<Icon.tekrar />} onClick={() => setD(null)} />}
      />
      <main className="view lesson">{govde}</main>
    </div>
  );
}
