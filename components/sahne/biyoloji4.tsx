"use client";
// Biyoloji sahneleri (bitkiler âlemi, mitoz): bitki grupları anahtarı, iletim demetiyle su taşıma,
// döl almaşı, baskın döl, açık ve kapalı tohum; hücre döngüsü, kromozom ve kromatit, mitoz evreleri,
// sitokinez, bakterinin ikiye bölünmesi, aşı.
import { cev, SAYI_YEREL } from "@/lib/dil";
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? t / sure : 0);

const YESIL = "var(--biyoloji)", KOYU = "#16784a", KAHVE = "#8a5a33";
// Döl almaşında haploit (n) ve diploit (2n) evreler.
const N1 = "#c98a0b", N2 = "var(--c5)";

/* ---------- bitki grupları anahtarı ---------- */

function Yosun() {
  const yap = Array.from({ length: 22 }, (_, i) => {
    const x = 128 + (i % 11) * 8.4, ust = i < 11;
    return <ellipse key={i} cx={x} cy={ust ? 124 : 131} rx={5.5} ry={ust ? 7 : 5} fill={ust ? YESIL : KOYU} />;
  });
  return (
    <g>
      <g>{yap}</g>
      {[146, 172, 196].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 120 Q${x + 2} ${100 - i * 3} ${x + 4} ${86 - i * 4}`} stroke={KAHVE} strokeWidth={1.6} fill="none" />
          <ellipse cx={x + 4} cy={82 - i * 4} rx={3} ry={5} fill={KAHVE} />
        </g>
      ))}
    </g>
  );
}

function Egrelti({ renk = YESIL, koyu = KOYU }: { renk?: string; koyu?: string }) {
  const yaprak = (aci: number, boy: number) => {
    const r = (aci * Math.PI) / 180, x2 = 170 + Math.cos(r) * boy, y2 = 140 - Math.sin(r) * boy;
    const pinna = Array.from({ length: 7 }, (_, i) => {
      const u = 0.32 + i * 0.1, px = 170 + (x2 - 170) * u, py = 140 + (y2 - 140) * u, l = 14 * (1 - u * 0.7);
      return <path key={i} d={`M${px} ${py} l${-l * Math.sin(r)} ${-l * Math.cos(r)} M${px} ${py} l${l * Math.sin(r)} ${l * Math.cos(r)}`} stroke={renk} strokeWidth={3.4} strokeLinecap="round" />;
    });
    return <g key={aci}><line x1={170} y1={140} x2={x2} y2={y2} stroke={koyu} strokeWidth={2} />{pinna}</g>;
  };
  return <g>{[56, 90, 124].map((a, i) => yaprak(a, i === 1 ? 118 : 96))}</g>;
}

function Cam() {
  return (
    <g>
      <rect x={165} y={110} width={10} height={30} fill={KAHVE} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M170 ${20 + i * 28} L${132 - i * 10} ${70 + i * 24} L${208 + i * 10} ${70 + i * 24} Z`} fill={KOYU} />
      ))}
      <ellipse cx={196} cy={102} rx={7} ry={11} fill={KAHVE} />
      <path d="M190 96 L202 96 M189 102 L203 102 M190 108 L202 108" stroke="var(--surface)" strokeWidth={1} opacity={0.6} />
    </g>
  );
}

function Elma() {
  return (
    <g>
      <rect x={163} y={96} width={14} height={44} fill={KAHVE} />
      <circle cx={170} cy={66} r={48} fill={YESIL} />
      {[[146, 56], [190, 80], [168, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill="var(--c2)" />)}
      <g transform="translate(186 44)">
        {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={Math.cos((i * 72 * Math.PI) / 180) * 5} cy={Math.sin((i * 72 * Math.PI) / 180) * 5} r={4.2} fill="var(--surface)" />)}
        <circle r={2.4} fill="var(--c4)" />
      </g>
    </g>
  );
}

const GRUP = [
  { ad: cev("Kara yosunları"), ornek: cev("kara yosunu, ciğer otu"), kisa: cev("yosunlar"), C: Yosun },
  { ad: cev("Eğrelti otları"), ornek: cev("eğrelti, at kuyruğu, kibrit otu"), kisa: cev("eğreltiler"), C: Egrelti },
  { ad: cev("Açık tohumlular"), ornek: cev("çam, ladin, köknar, ardıç"), kisa: cev("açık tohum"), C: Cam },
  { ad: cev("Kapalı tohumlular"), ornek: cev("elma, buğday, lale, meşe"), kisa: cev("kapalı tohum"), C: Elma },
];

function Gruplar({ v }: SahneProps) {
  const d = v.d ?? 0, t = v.t ?? 0, c = v.c ?? 0;
  const yok = t === 0 && c === 1 ? cev("Çiçek ve meyve yalnızca tohumlu bitkilerde bulunur.") : d === 0 && t === 1 ? cev("Damarsız ama tohumlu bir bitki grubu yoktur.") : null;
  const k = yok ? -1 : d === 0 ? 0 : t === 0 ? 1 : c === 0 ? 2 : 3;
  const G = k >= 0 ? GRUP[k] : null;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={G ? `${G.ad}: ${G.ornek}` : cev("Böyle bir bitki grubu yok")}>
      <line x1={90} y1={140} x2={250} y2={140} stroke="var(--line-2)" strokeWidth={1.6} />
      <g key={k} className="ad-belir">
        {G ? <G.C /> : <text x={170} y={110} fontSize={48} fontWeight={800} fill="var(--line-2)" textAnchor="middle">?</text>}
      </g>
      <text x={170} y={166} fontSize={15} fontWeight={800} fill={G ? "var(--ink)" : "var(--bad)"} textAnchor="middle">{G ? G.ad : cev("Böyle bir grup yok")}</text>
      <text x={170} y={185} fontSize={11.5} fontWeight={600} fill="var(--muted)" textAnchor="middle">{G ? G.ornek : yok}</text>
      {GRUP.map((g, i) => {
        const x = 4 + i * 84, on = i === k;
        return (
          <g key={g.kisa}>
            <rect x={x} y={204} width={80} height={26} rx={13} fill={on ? YESIL : "none"} stroke={on ? YESIL : "var(--line-2)"} strokeWidth={1.4} />
            <text x={x + 40} y={221} fontSize={11} fontWeight={700} fill={on ? "#fff" : "var(--muted)"} textAnchor="middle">{g.kisa}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- iletim demetiyle su taşıma ---------- */

function Su({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const N = 8, H = 20, Y0 = 196;
  // Demetsiz: su hücreden hücreye yavaşça (en çok 2,5 hücre). Demetli: ksilemde hızla tepeye, sonra hücrelere.
  const yavas = 2.5 * yumusak(u), boru = yumusak(u / 0.45) * N;
  const hucreler = (x: number, dolu: (i: number) => number) =>
    Array.from({ length: N }, (_, i) => (
      <g key={i}>
        <rect x={x} y={Y0 - (i + 1) * H} width={64} height={H} fill="var(--c1)" fillOpacity={0.55 * sinir(dolu(i))} />
        <rect x={x} y={Y0 - (i + 1) * H} width={64} height={H} fill="none" stroke="var(--line-2)" strokeWidth={1.2} />
      </g>
    ));
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={cev("İletim demeti olan ve olmayan iki gövdede suyun yükselmesi")}>
      {hucreler(46, (i) => yavas - i)}
      {hucreler(226, (i) => (u > 0.45 ? yumusak((u - 0.45) / 0.4) : 0) * (boru > i ? 1 : 0))}
      <g>
        <rect x={252} y={Y0 - N * H} width={12} height={N * H} fill="var(--surface)" stroke="var(--c1)" strokeWidth={1.6} />
        <rect x={254} y={Y0 - boru * H} width={8} height={boru * H} fill="var(--c1)" />
      </g>
      <g>
        <rect x={30} y={Y0} width={96} height={10} rx={3} fill="var(--c1)" fillOpacity={0.35} />
        <rect x={210} y={Y0} width={96} height={10} rx={3} fill="var(--c1)" fillOpacity={0.35} />
      </g>
      <g fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        <text x={78} y={24}>{cev("iletim demeti yok")}</text>
        <text x={258} y={24}>{cev("iletim demeti var")}</text>
      </g>
      {u > 0 && (
      <g fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        <text x={78} y={226}>{u > 0.95 ? cev("yavaş geçen su") : cev("su hücreden hücreye")}</text>
        <text x={78} y={241} fill={u > 0.95 ? "var(--bad)" : undefined} fontWeight={u > 0.95 ? 800 : 600}>{u > 0.95 ? cev("tepeye ulaşamadı") : cev("yavaşça geçer")}</text>
        <text x={258} y={226}>{cev("ksilem borusu suyu")}</text>
        <text x={258} y={241}>{cev("hızla yukarı taşır")}</text>
      </g>
      )}
    </svg>
  );
}

/* ---------- döl almaşı ---------- */

const DOL = [
  { ad: cev("sporofit"), p: "2n", x: 170, y: 30 },
  { ad: cev("spor"), p: "n", x: 282, y: 92 },
  { ad: cev("gametofit"), p: "n", x: 238, y: 178 },
  { ad: cev("gametler"), p: "n", x: 102, y: 178 },
  { ad: cev("zigot"), p: "2n", x: 58, y: 92 },
];
const OLAY = [cev("mayoz"), cev("mitoz"), cev("mitoz"), cev("döllenme"), cev("mitoz")];

function DolAlmasi({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const adim = u * 5, CX = 170, CY = 110;
  return (
    <svg viewBox="0 0 340 256" role="img" aria-label={cev("Eğreltide döl almaşı: sporofit mayozla spor, spor mitozla gametofit, gametofit mitozla gamet, döllenme ile zigot")}>
      {DOL.map((a, i) => {
        const b = DOL[(i + 1) % 5], dolu = sinir(adim - i);
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, lx = mx + (mx - CX) * 0.42, ly = my + (my - CY) * 0.42 + 4;
        const ox = a.x + (b.x - a.x) * 0.62, oy = a.y + (b.y - a.y) * 0.62, ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        const aktif = u > 0 && dolu > 0;
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--line-2)" strokeWidth={2} />
            {aktif && <line x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * dolu} y2={a.y + (b.y - a.y) * dolu} stroke={YESIL} strokeWidth={3.2} />}
            <path d="M6 0 L-5 -5.5 L-5 5.5 Z" transform={`translate(${ox} ${oy}) rotate(${ang})`} fill={aktif ? YESIL : "var(--line-2)"} />
            <text x={lx} y={ly} fontSize={12} fontWeight={800} fill={i === 0 && aktif ? "var(--c2)" : aktif ? YESIL : "var(--muted)"} textAnchor="middle">{OLAY[i]}</text>
          </g>
        );
      })}
      {DOL.map((d, i) => {
        const renk = d.p === "2n" ? N2 : N1, gecti = u > 0 && adim >= i;
        return (
          <g key={d.ad}>
            <rect x={d.x - 44} y={d.y - 17} width={88} height={34} rx={10} fill="var(--surface)" stroke={renk} strokeWidth={gecti ? 2.6 : 1.6} />
            <text x={d.x} y={d.y - 1} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{d.ad}</text>
            <text x={d.x} y={d.y + 12} fontSize={11} fontWeight={800} fill={renk} textAnchor="middle">{d.p}</text>
          </g>
        );
      })}
      <g fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        <text x={170} y={236}>{cev("Eğreltide büyük yapraklı bitki sporofit,")}</text>
        <text x={170} y={251}>{cev("kalp biçimli küçük protallus gametofittir.")}</text>
      </g>
    </svg>
  );
}

/* ---------- baskın döl ---------- */

function Baskin({ v }: SahneProps) {
  const g = sinir(v.g ?? 1, 1, 3);
  const [ad, gam, spo, gNot, sNot] = [
    [cev("Kara yosunu"), 0.85, 0.25, cev("gördüğün yosun örtüsü"), cev("üstündeki sapçık, ona bağlı")],
    [cev("Eğrelti otu"), 0.2, 0.85, cev("küçük protallus, bağımsız"), cev("büyük yapraklı bitki")],
    [cev("Tohumlu bitki"), 0.06, 1, cev("polen ve embriyo kesesi"), cev("ağacın, çiçeğin kendisi")],
  ][g - 1] as [string, number, number, string, string];
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={cev("{0}: gametofit {1}, sporofit {2}", ad, gNot, sNot)}>
      <text x={170} y={22} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="middle">{ad}</text>
      <g key={g} className="ad-belir">
        {g === 1 && (
          <g>
            {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={110 + (i % 8) * 16} cy={i < 8 ? 112 : 122} rx={10} ry={9} fill={N1} fillOpacity={0.85} />)}
            {[134, 170, 206].map((x) => (
              <g key={x}>
                <line x1={x} y1={104} x2={x + 3} y2={64} stroke={N2} strokeWidth={2} />
                <ellipse cx={x + 3} cy={60} rx={4} ry={7} fill={N2} />
              </g>
            ))}
          </g>
        )}
        {g === 2 && (
          <g>
            <g transform="translate(150 128) scale(0.8) translate(-170 -140)"><Egrelti renk={N2} koyu={N2} /></g>
            <path d="M248 126 C236 110 252 100 260 112 C268 100 284 110 272 126 L260 132 Z" fill={N1} />
          </g>
        )}
        {g === 3 && (
          <g>
            <rect x={165} y={100} width={10} height={28} fill={N2} />
            <circle cx={170} cy={68} r={36} fill={N2} />
            {[[156, 58], [184, 74], [172, 50]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.6} fill={N1} />)}
          </g>
        )}
      </g>
      <line x1={60} y1={132} x2={280} y2={132} stroke="var(--line-2)" strokeWidth={1.4} />
      {[
        { y: 156, ad: cev("gametofit (n)"), oran: gam, renk: N1, not: gNot },
        { y: 200, ad: cev("sporofit (2n)"), oran: spo, renk: N2, not: sNot },
      ].map((b) => (
        <g key={b.ad}>
          <text x={14} y={b.y} fontSize={12} fontWeight={800} fill={b.renk}>{b.ad}</text>
          <text x={326} y={b.y} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="end">{b.not}</text>
          <rect x={14} y={b.y + 7} width={312} height={12} rx={6} fill="var(--panel)" />
          <rect x={14} y={b.y + 7} width={Math.max(10, 312 * b.oran)} height={12} rx={6} fill={b.renk} />
        </g>
      ))}
    </svg>
  );
}

/* ---------- açık ve kapalı tohum ---------- */

function Tohum({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const dus = yumusak(u / 0.35), sis = yumusak((u - 0.3) / 0.5), bitti = u > 0.95;
  const r = 13 + 25 * sis;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={cev("Çamda tohum kozalak pulunun üstünde açıkta, elmada meyvenin içinde")}>
      <g>
        <path d="M30 150 Q36 96 84 84 Q132 96 138 150 Q84 164 30 150 Z" fill={KAHVE} fillOpacity={0.85} />
        {[64, 104].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={128} rx={9} ry={6} fill="var(--c4)" stroke="var(--surface)" strokeWidth={1.2} />
            <ellipse cx={x + 6 + 11 * sis} cy={124 - 6 * sis} rx={2 + 11 * sis} ry={1 + 4.5 * sis} fill="var(--c4)" fillOpacity={0.55} stroke="var(--c4)" strokeWidth={1} opacity={sis} transform={`rotate(-28 ${x + 6 + 11 * sis} ${124 - 6 * sis})`} />
          </g>
        ))}
      </g>
      <g>
        {[0, 1, 2, 3, 4].map((i) => {
          const a = ((i * 72 - 90) * Math.PI) / 180;
          return <ellipse key={i} cx={250 + Math.cos(a) * (26 + 40 * dus)} cy={108 + Math.sin(a) * 26 + 70 * dus} rx={13} ry={9} fill="color-mix(in srgb, #e15080 30%, var(--surface))" opacity={1 - dus} transform={`rotate(${i * 72} ${250 + Math.cos(a) * (26 + 40 * dus)} ${108 + Math.sin(a) * 26 + 70 * dus})`} />;
        })}
        <circle cx={250} cy={118} r={r} fill={sis > 0.5 ? "var(--c2)" : "#9bd3a8"} fillOpacity={0.9} stroke={sis > 0.5 ? "#c23a28" : KOYU} strokeWidth={1.6} />
        <path d={`M250 ${118 - r} q2 -10 8 -12`} stroke={KAHVE} strokeWidth={2} fill="none" />
        {[-6, 6].map((dx) => <ellipse key={dx} cx={250 + dx * (1 + sis)} cy={120} rx={3.5} ry={5.5} fill={KAHVE} />)}
      </g>
      <g fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        <text x={84} y={30}>{cev("çam")}</text>
        <text x={250} y={30}>{cev("elma")}</text>
      </g>
      <g fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        <text x={84} y={46}>{cev("dişi kozalağın pulu")}</text>
        <text x={250} y={46}>{u === 0 ? cev("çiçek ve yumurtalık") : sis < 0.5 ? cev("yumurtalık büyüyor") : cev("yumurtalık → meyve")}</text>
      </g>
      {bitti && (
        <g className="ad-belir" fontSize={12} fontWeight={800} textAnchor="middle">
          <text x={84} y={190} fill="var(--c4)">{cev("tohum açıkta")}</text>
          <text x={84} y={207} fontSize={11} fontWeight={600} fill="var(--muted)">{cev("kanatlı, rüzgârla uçar")}</text>
          <text x={250} y={190} fill="var(--c2)">{cev("tohum meyvenin içinde")}</text>
          <text x={250} y={207} fontSize={11} fontWeight={600} fill="var(--muted)">{cev("meyve onu korur, taşıtır")}</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- tek ve çift çenekli ---------- */

function Cenek({ v }: SahneProps) {
  const p = sinir(v.p ?? 5, 3, 6), pd = v.pd === 1, sk = v.sk === 1;
  const ozellik = [
    { ad: cev("çiçek"), deger: cev("{0} yaprak", p), tek: p % 3 === 0 },
    { ad: cev("damar"), deger: pd ? cev("paralel") : cev("ağsı"), tek: pd },
    { ad: cev("kök"), deger: sk ? cev("saçak") : cev("kazık"), tek: sk },
  ];
  const tek = ozellik.filter((o) => o.tek).length;
  const sonuc = tek === 3 ? cev("tek çenekli") : tek === 0 ? cev("çift çenekli") : cev("özellikler karışık");
  const renk = tek === 3 ? "var(--c1)" : tek === 0 ? "var(--c2)" : "var(--muted)";
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={cev("{0} çiçek yaprağı, {1} damar, {2} kök: {3}", p, pd ? "paralel" : "ağsı", sk ? "saçak" : "kazık", sonuc)}>
      <g>
        {Array.from({ length: p }, (_, i) => {
          const a = (i * 360) / p - 90, r = (a * Math.PI) / 180;
          return <ellipse key={i} cx={90 + Math.cos(r) * 15} cy={42 + Math.sin(r) * 15} rx={13} ry={7.5} fill="color-mix(in srgb, #e15080 30%, var(--surface))" stroke="#e5466f" strokeWidth={1} transform={`rotate(${a} ${90 + Math.cos(r) * 15} ${42 + Math.sin(r) * 15})`} />;
        })}
        <circle cx={90} cy={42} r={6} fill="var(--c4)" />
      </g>
      <line x1={90} y1={62} x2={90} y2={164} stroke={KOYU} strokeWidth={3} />
      <g>
        <path d="M92 118 Q120 88 168 92 Q140 128 92 118 Z" fill={YESIL} fillOpacity={0.35} stroke={KOYU} strokeWidth={1.4} />
        {pd
          ? [0, 1, 2, 3].map((i) => <path key={i} d={`M${96 + i * 2} ${117 - i * 2} Q${128} ${100 - i * 3} ${164} ${93 + i * 0.5}`} stroke={KOYU} strokeWidth={1} fill="none" />)
          : (
            <g stroke={KOYU} strokeWidth={1} fill="none">
              <path d="M94 117 Q128 104 164 93" strokeWidth={1.6} />
              {[0.25, 0.45, 0.65, 0.82].map((k, i) => {
                const x = 94 + 70 * k, y = 117 - 24 * k;
                const l = 1 - k * 0.6;
                return <path key={i} d={`M${x} ${y} l${7 * l} ${-11 * l} M${x} ${y} l${10 * l} ${6 * l}`} />;
              })}
            </g>
          )}
      </g>
      <line x1={30} y1={164} x2={150} y2={164} stroke={KAHVE} strokeWidth={1.6} strokeDasharray="5 4" />
      <g key={sk ? "s" : "k"} stroke={KAHVE} strokeWidth={1.5} fill="none" strokeLinecap="round">
        {sk
          ? [-34, -22, -12, -4, 4, 12, 22, 34].map((dx, i) => <path key={i} d={`M90 164 Q${90 + dx * 0.6} ${190} ${90 + dx} ${210 + (i % 3) * 8}`} />)
          : (
            <g>
              <path d="M90 164 L90 240" strokeWidth={4.5} />
              {[178, 194, 210, 224].map((y, i) => <path key={y} d={`M90 ${y} q${i % 2 ? 14 : -14} 6 ${i % 2 ? 22 : -22} 16`} />)}
            </g>
          )}
      </g>
      <g>
        {ozellik.map((o, i) => (
          <g key={o.ad}>
            <text x={186} y={56 + i * 44} fontSize={11} fontWeight={600} fill="var(--muted)">{o.ad}</text>
            <text x={186} y={74 + i * 44} fontSize={14} fontWeight={800} fill={o.tek ? "var(--c1)" : "var(--c2)"}>{o.deger}</text>
            <text x={326} y={74 + i * 44} fontSize={11} fontWeight={700} fill={o.tek ? "var(--c1)" : "var(--c2)"} textAnchor="end">{o.tek ? cev("tek") : cev("çift")}</text>
          </g>
        ))}
      </g>
      <g>
        <rect x={180} y={196} width={150} height={34} rx={17} fill={tek === 3 || tek === 0 ? renk : "none"} stroke={renk} strokeWidth={1.6} />
        <text x={255} y={218} fontSize={13} fontWeight={800} fill={tek === 3 || tek === 0 ? "#fff" : "var(--muted)"} textAnchor="middle">{sonuc}</text>
      </g>
    </svg>
  );
}

/* ---------- hücre döngüsü ---------- */

const EVRE = [
  { ad: "G1", a: 0, b: 35, renk: "var(--c3)", not: cev("hücre büyür") },
  { ad: "S", a: 35, b: 60, renk: "var(--c1)", not: cev("DNA eşlenir") },
  { ad: "G2", a: 60, b: 80, renk: "var(--c4)", not: cev("bölünmeye hazırlanır") },
  { ad: "M", a: 80, b: 100, renk: "var(--c2)", not: cev("mitoz ve sitokinez") },
];
const yay = (cx: number, cy: number, r: number, a: number, b: number) => {
  const p = (k: number) => { const t = ((k / 100) * 360 - 90) * (Math.PI / 180); return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
  const [x1, y1] = p(a), [x2, y2] = p(b);
  return `M${x1} ${y1} A${r} ${r} 0 ${b - a > 50 ? 1 : 0} 1 ${x2} ${y2}`;
};

/** Kromozom: bir ya da iki kromatit, ortada sentromer. */
function Kromozom({ x, y, boy, renk, es = 1, aci = 0, sentromer = true }: { x: number; y: number; boy: number; renk: string; es?: number; aci?: number; sentromer?: boolean }) {
  // Kardeş kromatitler sentromerde birbirine değer, uçlara doğru açılır.
  const off = 2.6 * Math.min(es, 1), uc = off + 2.5 * es, h = boy / 2 - 2.6;
  const kol = (k: number) => `M${k * uc} ${-h} Q${k * off} ${-h * 0.3} ${k * off} 0 Q${k * off} ${h * 0.3} ${k * uc} ${h}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${aci})`} stroke={renk} strokeWidth={5.2} strokeLinecap="round" fill="none">
      <path d={kol(-1)} />
      {es > 0 && <path d={kol(1)} opacity={Math.min(es, 1)} />}
      {sentromer && <circle r={2.4 + Math.min(es, 1)} fill="var(--ink)" stroke="none" opacity={0.75} />}
    </g>
  );
}

function Dongu({ v }: SahneProps) {
  const k = sinir(v.k ?? 0, 0, 100);
  const e = EVRE.find((x) => k >= x.a && k < x.b) ?? EVRE[3];
  const es = k < 35 ? 0 : k < 60 ? (k - 35) / 25 : 1;
  const dna = 2 + 2 * es;
  const CX = 100, CY = 116, R = 60;
  const ang = ((k / 100) * 360 - 90) * (Math.PI / 180);
  const yogun = k >= 80;
  const KR = [
    { x: 236, y: 92, boy: yogun ? 30 : 40, renk: "var(--c1)", aci: -15 },
    { x: 276, y: 100, boy: yogun ? 30 : 40, renk: "var(--c2)", aci: 20 },
    { x: 244, y: 138, boy: yogun ? 20 : 26, renk: "var(--c1)", aci: 10 },
    { x: 282, y: 142, boy: yogun ? 20 : 26, renk: "var(--c2)", aci: -25 },
  ];
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={cev("{0} evresi: {1}; DNA {2} birim, kromozom sayısı 4", e.ad, e.not, dna.toFixed(1))}>
      {EVRE.map((x) => (
        <g key={x.ad}>
          <path d={yay(CX, CY, R, x.a + 0.8, x.b - 0.8)} stroke={x.renk} strokeWidth={x === e ? 16 : 11} fill="none" opacity={x === e ? 1 : 0.4} />
          {(() => { const m = (((x.a + x.b) / 200) * 360 - 90) * (Math.PI / 180); return <text x={CX + (R + 18) * Math.cos(m)} y={CY + (R + 18) * Math.sin(m) + 4} fontSize={12} fontWeight={800} fill={x.renk} textAnchor="middle">{x.ad}</text>; })()}
        </g>
      ))}
      <text x={CX} y={CY - 4} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">{cev("interfaz")}</text>
      <text x={CX} y={CY + 11} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">G1 + S + G2</text>
      <circle cx={CX + R * Math.cos(ang)} cy={CY + R * Math.sin(ang)} r={9} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2.4} />
      <g>
        <circle cx={258} cy={116} r={62} fill="none" stroke="var(--line-2)" strokeWidth={1.6} strokeDasharray={yogun ? "4 5" : undefined} />
        {KR.map((c, i) => <Kromozom key={i} {...c} es={es} sentromer={es > 0.05} />)}
      </g>
      <text x={170} y={22} fontSize={14} fontWeight={800} fill={e.renk} textAnchor="middle">{e.ad}: {e.not}</text>
      <g fontSize={12} fontWeight={700} fill="var(--ink)">
        <text x={196} y={206}>{cev("DNA:")} {dna.toLocaleString(SAYI_YEREL, { maximumFractionDigits: 1 })} {cev("birim")}</text>
        <text x={196} y={224}>{cev("kromozom: 4")}</text>
      </g>
    </svg>
  );
}

/* ---------- kromozom ve kromatit ---------- */

function Kromatit({ v }: SahneProps) {
  const es = v.es === 1 ? 1 : 0;
  const KR = [
    { x: 76, y: 104, boy: 70, renk: "var(--c1)" },
    { x: 136, y: 104, boy: 70, renk: "var(--c2)" },
    { x: 204, y: 112, boy: 46, renk: "var(--c1)" },
    { x: 264, y: 112, boy: 46, renk: "var(--c2)" },
  ];
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={cev("{0}: 4 kromozom, {1} kromatit", es ? cev("Eşlenmiş") : cev("Eşlenmemiş"), es ? 8 : 4)}>
      <g key={es} className="ad-belir">
        {KR.map((c, i) => <Kromozom key={i} {...c} es={es * 2} />)}
      </g>
      {es === 1 && (
        <g className="ad-belir" fontSize={11} fontWeight={700} fill="var(--muted)">
          <path d="M130 60 L114 46 M142 60 L158 46" stroke="var(--muted)" strokeWidth={1.2} />
          <text x={136} y={38} textAnchor="middle">{cev("kardeş kromatitler")}</text>
          <path d="M208 108 L296 64" stroke="var(--muted)" strokeWidth={1.2} />
          <text x={300} y={56} textAnchor="middle">{cev("sentromer")}</text>
        </g>
      )}
      <g fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        <text x={106} y={172}>{cev("uzun çift")}</text>
        <text x={234} y={172}>{cev("kısa çift")}</text>
      </g>
      <g>
        {[
          { x: 60, ad: cev("kromozom"), n: 4 },
          { x: 170, ad: cev("kromatit"), n: es ? 8 : 4 },
          { x: 280, ad: cev("DNA molekülü"), n: es ? 8 : 4 },
        ].map((s) => (
          <g key={s.ad}>
            <text x={s.x} y={206} fontSize={22} fontWeight={800} fill="var(--ink)" textAnchor="middle">{s.n}</text>
            <text x={s.x} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{s.ad}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ---------- mitoz evreleri ---------- */

const MITOZ = [
  { ad: cev("Profaz"), not: cev("kromozomlar belirir, çekirdek zarı kaybolur") },
  { ad: cev("Metafaz"), not: cev("kromozomlar ekvatorda tek sıra") },
  { ad: cev("Anafaz"), not: cev("kardeş kromatitler zıt kutuplara") },
  { ad: cev("Telofaz"), not: cev("iki yeni çekirdek kurulur") },
];
const KROM = [
  { boy: 34, renk: "var(--c1)", pro: [138, 92, -25], y: 62 },
  { boy: 34, renk: "var(--c2)", pro: [198, 84, 20], y: 96 },
  { boy: 22, renk: "var(--c1)", pro: [150, 136, 35], y: 128 },
  { boy: 22, renk: "var(--c2)", pro: [200, 132, -15], y: 154 },
];
// Statik gösterimde her evrenin karesi (0-4 ölçeğinde).
const STATIK = [0.85, 1.95, 2.55, 3.95];

function Mitoz({ s, v, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 0;
  const x = sure ? (oynuyor || t > 0 ? (t / sure) * 4 : 0) : STATIK[sinir(v.e ?? 1, 1, 4) - 1];
  const f = Math.min(3, Math.floor(x));
  const yogun = 0.55 + 0.45 * yumusak(x / 0.8);
  const hiza = yumusak((x - 1) / 0.6), ayril = yumusak((x - 2) / 0.8), tel = yumusak((x - 3) / 0.8);
  const sayi = x >= 2 ? 8 : 4;
  const CX = 170, CY = 128, PL = 62, PR = 278, DY = CY - 112;
  // Hücre zarı: telofazda ortadan boğumlanır.
  const w = 52 * tel;
  const zar = `M44 ${CY} C44 ${CY - 72} 160 ${CY - 82} ${CX} ${CY - 80 + w} C180 ${CY - 82} 296 ${CY - 72} 296 ${CY} C296 ${CY + 72} 180 ${CY + 82} ${CX} ${CY + 80 - w} C160 ${CY + 82} 44 ${CY + 72} 44 ${CY} Z`;
  const ky = (y: number) => CY + (y - CY) * (1 - 0.2 * ayril - 0.45 * tel);
  const govde = KROM.map((k) => {
    const px = k.pro[0] + (CX - k.pro[0]) * hiza, py = DY + k.pro[1] + (k.y - k.pro[1]) * hiza, aci = k.pro[2] * (1 - hiza);
    return { ...k, px, py: ky(py), aci, boy: k.boy * yogun * (1 - 0.35 * tel) };
  });
  const kutupX = (d: number) => CX + d * 74 * ayril;
  return (
    <svg viewBox="0 0 340 260" role="img" aria-label={cev("{0}: {1}; kromozom sayısı {2}", MITOZ[f].ad, MITOZ[f].not, sayi)}>
      <path d={zar} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.8} />
      <circle cx={CX} cy={CY} r={66} fill="none" stroke="var(--ink)" strokeWidth={1.4} strokeDasharray="5 5" opacity={1 - yumusak(x / 0.7)} />
      <g stroke="var(--c3)" strokeWidth={1} opacity={0.75 * (1 - tel)}>
        {x > 0.3 && govde.flatMap((k, i) => {
          const sol = x >= 2 ? kutupX(-1) - 3 : k.px - 3, sag = x >= 2 ? kutupX(1) + 3 : k.px + 3;
          return [
            <line key={`l${i}`} x1={PL} y1={CY} x2={sol} y2={k.py} />,
            <line key={`r${i}`} x1={PR} y1={CY} x2={sag} y2={k.py} />,
          ];
        })}
      </g>
      <g>
        {[PL, PR].map((px) => (
          <g key={px} opacity={1 - tel}>
            <rect x={px - 6} y={CY - 2} width={8} height={4} rx={2} fill="var(--c3)" />
            <rect x={px - 1} y={CY - 5} width={4} height={10} rx={2} fill="var(--c3)" />
          </g>
        ))}
      </g>
      <g>
        {govde.map((k, i) =>
          x < 2 ? (
            <Kromozom key={i} x={k.px} y={k.py} boy={k.boy} renk={k.renk} aci={k.aci} />
          ) : (
            <g key={i} stroke={k.renk} strokeWidth={5.2} strokeLinecap="round" strokeLinejoin="round" fill="none">
              {[-1, 1].map((d) => {
                // Sentromer kutba önde gider, kollar arkada kalır: V biçimi.
                const cx = kutupX(d) + d * 3 * (1 - ayril) + (i % 2 ? 9 : -9) * tel, b = k.boy * (1 - 0.25 * ayril), h = b * 0.42, e = -d * b * 0.28 * ayril;
                return <path key={d} d={`M${cx + e} ${k.py - h} L${cx} ${k.py} L${cx + e} ${k.py + h}`} />;
              })}
            </g>
          ),
        )}
      </g>
      <g opacity={tel}>
        <circle cx={96} cy={CY} r={40} fill="none" stroke="var(--ink)" strokeWidth={1.4} strokeDasharray="5 4" />
        <circle cx={244} cy={CY} r={40} fill="none" stroke="var(--ink)" strokeWidth={1.4} strokeDasharray="5 4" />
      </g>
      <text x={14} y={22} fontSize={14} fontWeight={800} fill="var(--biyoloji)">{MITOZ[f].ad}</text>
      <text x={14} y={38} fontSize={11} fontWeight={600} fill="var(--muted)">{MITOZ[f].not}</text>
      <g fontSize={12.5} fontWeight={800}>
        <text x={14} y={248} fill={sayi === 8 ? "var(--c2)" : "var(--ink)"}>{cev("kromozom:")} {sayi}{f === 3 ? cev(" (her çekirdekte 4)") : ""}</text>
        <text x={326} y={248} fill="var(--ink)" textAnchor="end">{cev("DNA: 4 birim")}</text>
      </g>
    </svg>
  );
}

/* ---------- sitokinez ---------- */

function Sitokinez({ v, t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const bitki = v.b === 1;
  const CY = 110;
  if (!bitki) {
    const w = 78 * yumusak(u);
    const zar = `M40 ${CY} C40 36 160 28 170 ${30 + w} C180 28 300 36 300 ${CY} C300 184 180 192 170 ${190 - w} C160 192 40 184 40 ${CY} Z`;
    return (
      <svg viewBox="0 0 340 236" role="img" aria-label={cev("Hayvan hücresinde sitoplazma ortadan boğumlanarak bölünür")}>
        <path d={zar} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.8} />
        <g>
          {[100, 240].map((x) => <circle key={x} cx={x} cy={CY} r={30} fill="var(--c5)" fillOpacity={0.18} stroke="var(--c5)" strokeWidth={1.6} />)}
        </g>
        {u > 0 && u < 1 && <g stroke="var(--c2)" strokeWidth={2.2}><path d={`M170 ${16 + w * 0.6} l0 10 M165 ${21 + w * 0.6} l5 5 l5 -5`} /><path d={`M170 ${204 - w * 0.6} l0 -10 M165 ${199 - w * 0.6} l5 -5 l5 5`} /></g>}
        <text x={170} y={226} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{u > 0.95 ? cev("zar içe boğumlandı: iki hücre") : cev("hayvan hücresi: zar esnek")}</text>
      </svg>
    );
  }
  const plak = yumusak(u / 0.85);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={cev("Bitki hücresinde Golgi keseciklerinden ortada hücre plağı kurulur")}>
      <rect x={34} y={28} width={272} height={166} rx={4} fill="color-mix(in srgb, #c8f3ee 20%, var(--surface))" stroke={YESIL} strokeWidth={6} />
      <g>
        {[100, 240].map((x) => <circle key={x} cx={x} cy={CY} r={30} fill="var(--c5)" fillOpacity={0.18} stroke="var(--c5)" strokeWidth={1.6} />)}
      </g>
      <g>
        {Array.from({ length: 12 }, (_, i) => {
          const hy = 40 + i * 13.5, gel = sinir(plak * 1.6 - Math.abs(hy - CY) / 90);
          const sx = i % 2 ? 150 : 190;
          return gel < 1 && <circle key={i} cx={sx + (170 - sx) * gel} cy={hy} r={4} fill="var(--c4)" opacity={u > 0 ? 1 : 0.9} />;
        })}
      </g>
      <rect x={167} y={CY - 80 * plak} width={6} height={160 * plak} fill={YESIL} />
      <text x={170} y={222} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{u > 0.95 ? cev("ortada hücre plağı kuruldu: iki hücre") : u > 0 ? cev("Golgi kesecikleri ortada birleşiyor") : cev("bitki hücresi: sert hücre duvarı")}</text>
    </svg>
  );
}

/* ---------- bakterinin ikiye bölünmesi ---------- */

function Bakteri({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 6;
  const u = ilerleme(t, oynuyor, sure);
  const n = Math.min(6, Math.floor(u * 6 + 1e-6)), sayi = 2 ** n;
  const dk = Math.round(u * 120);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={cev("{0}. dakika: {1} bakteri", dk, sayi)}>
      <g key={n} className="ad-belir">
        {Array.from({ length: sayi }, (_, i) => {
          const sut = 8, x = 58 + (i % sut) * 32, y = 34 + Math.floor(i / sut) * 20;
          return <rect key={i} x={x - 11} y={y - 5} width={22} height={10} rx={5} fill="var(--biyoloji)" fillOpacity={0.8} transform={`rotate(${(i * 37) % 30 - 15} ${x} ${y})`} />;
        })}
      </g>
      <line x1={20} y1={200} x2={320} y2={200} stroke="var(--line)" />
      <g fontSize={13} fontWeight={800} fill="var(--ink)">
        <text x={20} y={224}>{cev("{0}. dakika", dk)}</text>
        <text x={320} y={224} textAnchor="end">{sayi} {cev("bakteri")}</text>
      </g>
      <text x={170} y={224} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">{n} {cev("bölünme")}</text>
    </svg>
  );
}

/* ---------- aşı ---------- */

function Asi({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 5;
  const u = ilerleme(t, oynuyor, sure);
  const yer = yumusak(u / 0.3), tac = yumusak((u - 0.3) / 0.4), meyve = yumusak((u - 0.7) / 0.25);
  const kx = 236 + (170 - 236) * yer, ky = 70 + (104 - 70) * yer;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={cev("Yabani elma anacına Amasya elması kalemi aşılanıyor; meyveler kalemin özelliğini taşıyor")}>
      <g>
        <rect x={164} y={112} width={12} height={68} fill={KAHVE} />
        {[-30, -14, 0, 14, 30].map((dx, i) => <path key={i} d={`M170 180 Q${170 + dx * 0.5} 192 ${170 + dx} ${204 + (i % 2) * 6}`} stroke={KAHVE} strokeWidth={2} fill="none" />)}
        <line x1={110} y1={180} x2={230} y2={180} stroke="var(--line-2)" strokeWidth={1.6} />
      </g>
      <circle cx={170} cy={72} r={50 * tac} fill={YESIL} fillOpacity={0.9} />
      <g transform={`translate(${kx} ${ky})`}>
        <path d="M0 8 L0 -30 M0 -14 L10 -22 M0 -22 L-9 -28" stroke={KOYU} strokeWidth={4} strokeLinecap="round" />
        <circle cx={10} cy={-24} r={3} fill={YESIL} />
      </g>
      <rect x={161} y={106} width={18} height={8} rx={2} fill="var(--c4)" opacity={yer} />
      {[[146, 62], [190, 78], [170, 92], [158, 86], [188, 54]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7 * meyve} fill="var(--c2)" />)}
      <g fontSize={11.5} fontWeight={700}>
        <circle cx={262} cy={124} r={6} fill="var(--c2)" />
        <text x={272} y={128} fill="var(--ink)">{cev("kalem:")}</text>
        <text x={328} y={144} fill="var(--muted)" fontWeight={600} textAnchor="end">{cev("Amasya elması (tatlı)")}</text>
        <circle cx={34} cy={124} r={5} fill="#c8c64a" />
        <text x={44} y={128} fill="var(--ink)">{cev("anaç:")}</text>
        <text x={18} y={144} fill="var(--muted)" fontWeight={600}>{cev("yabani elma (ekşi)")}</text>
      </g>
      {u > 0.95 && <text x={170} y={228} fontSize={12.5} fontWeight={800} fill="var(--c2)" textAnchor="middle" className="ad-belir">{cev("meyveler kalemin özelliğini taşır")}</text>}
    </svg>
  );
}

export const BIYOLOJI4: Record<string, SahneKaydi> = {
  "biy4-gruplar": { C: Gruplar },
  "biy4-su": { C: Su },
  "biy4-dol": { C: DolAlmasi },
  "biy4-baskin": { C: Baskin },
  "biy4-tohum": { C: Tohum },
  "biy4-cenek": { C: Cenek },
  "biy4-dongu": { C: Dongu },
  "biy4-kromatit": { C: Kromatit },
  "biy4-mitoz": { C: Mitoz },
  "biy4-sitokinez": {
    C: Sitokinez,
    geri: (v) => (v.b === 1 ? null : { baslik: cev("Bu hayvan hücresiydi"), metin: cev("Zar ortadan içe boğumlandı. Şimdi bitki hücresine geç ve onu da oynat.") }),
  },
  "biy4-bakteri": { C: Bakteri },
  "biy4-asi": { C: Asi },
};
