"use client";
// Fizik sahneleri (yarı iletkenler ve süper iletkenler): katkılı silisyumda yük taşıyıcıları, diyot,
// LED'in rengi ile enerji aralığı, güneş pili, transistör, sıcaklıkla direnç ve Meissner etkisi.
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, eksi işareti. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const yumusak = (u: number) => { const k = sinir(u, 0, 1); return k * k * (3 - 2 * k); };
/** (x, y) noktalarından çizgi. */
const yol = (pts: [number, number][]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

/* ================= 1. Katkılı silisyum: n-tipi ve p-tipi ================= */

// 5 × 3 silisyum kristali; ortadaki atom fosfor (n) ya da bor (p). Sol uç pilin −, sağ uç + kutbu.
// n-tipinde fazla elektron + uca sürüklenir; p-tipinde komşu elektronlar boşluğa atlar, boşluk − uca gider.
function Kristal({ v, t, oynuyor, s }: SahneProps) {
  const p = (v.p ?? 0) > 0.5, sure = Number(s.sure ?? 5), u = ilerleme(t, oynuyor, sure), zt = u * sure;
  const X0 = 74, DX = 48, Y0 = 70, DY = 52, KOL = 5, SAT = 3;
  const ax = (i: number) => X0 + i * DX, ay = (j: number) => Y0 + j * DY;
  const OI = 2, OJ = 1; // katkı atomu
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  const git = yumusak(zt / sure);
  // n: elektron katkı atomunun sağ üstünden + uca (sağa); p: boşluk katkının sol bağından − uca (sola).
  const ex = ax(OI) + 18 + git * (318 - ax(OI) - 30), ey = ay(OJ) - 16;
  // Boşluk bağdan bağa atlar: her atlamada bir bağ sola.
  const adim = Math.floor(git * 3.999), boslukX = ax(OI) - DX / 2 - adim * DX, boslukY = ay(OJ);
  const baslik = bitti
    ? p ? "Boşluk − uca gitti: elektronlar ters yöne atladı" : "Fazla elektron + uca gitti"
    : p ? "Bor katkılı silisyum: bir bağda elektron eksik" : "Fosfor katkılı silisyum: bir elektron fazla";
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={baslik}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c3)" : "var(--ink)"}>{baslik}</text>
      {/* pil kutupları */}
      <rect x={14} y={40} width={12} height={150} rx={3} fill="var(--c1)" fillOpacity={0.25} />
      <rect x={314} y={40} width={12} height={150} rx={3} fill="var(--c2)" fillOpacity={0.25} />
      <text x={20} y={208} fontSize={16} fontWeight={800} fill="var(--c1)" textAnchor="middle">−</text>
      <text x={320} y={208} fontSize={16} fontWeight={800} fill="var(--c2)" textAnchor="middle">+</text>
      {/* bağlar: her bağda iki elektron */}
      {Array.from({ length: SAT }, (_, j) => Array.from({ length: KOL }, (_, i) => {
        const cizgiler = [];
        if (i < KOL - 1) cizgiler.push(<line key={`y${i}${j}`} x1={ax(i)} x2={ax(i + 1)} y1={ay(j)} y2={ay(j)} stroke="var(--line-2)" strokeWidth={2} />);
        if (j < SAT - 1) cizgiler.push(<line key={`d${i}${j}`} x1={ax(i)} x2={ax(i)} y1={ay(j)} y2={ay(j + 1)} stroke="var(--line-2)" strokeWidth={2} />);
        return cizgiler;
      }))}
      {Array.from({ length: SAT }, (_, j) => Array.from({ length: KOL }, (_, i) => {
        const nokta = [];
        if (i < KOL - 1) {
          const mx = (ax(i) + ax(i + 1)) / 2, my = ay(j);
          const bos = p && Math.abs(mx - boslukX) < 1 && my === boslukY;
          nokta.push(<circle key={`a${i}${j}`} cx={mx - 4} cy={my} r={3} fill="var(--c1)" opacity={0.75} />);
          if (!bos) nokta.push(<circle key={`b${i}${j}`} cx={mx + 4} cy={my} r={3} fill="var(--c1)" opacity={0.75} />);
          else nokta.push(<circle key={`b${i}${j}`} cx={mx + 4} cy={my} r={5} fill="none" stroke="var(--c2)" strokeWidth={2} />);
        }
        if (j < SAT - 1) {
          const mx = ax(i), my = (ay(j) + ay(j + 1)) / 2;
          nokta.push(<circle key={`c${i}${j}`} cx={mx} cy={my - 4} r={3} fill="var(--c1)" opacity={0.75} />);
          nokta.push(<circle key={`e${i}${j}`} cx={mx} cy={my + 4} r={3} fill="var(--c1)" opacity={0.75} />);
        }
        return nokta;
      }))}
      {Array.from({ length: SAT }, (_, j) => Array.from({ length: KOL }, (_, i) => {
        const katki = i === OI && j === OJ;
        const renk = katki ? (p ? "var(--c2)" : "var(--c3)") : "var(--muted)";
        return (
          <g key={`at${i}${j}`}>
            <circle cx={ax(i)} cy={ay(j)} r={14} fill="var(--panel)" stroke={renk} strokeWidth={katki ? 2.4 : 1.4} />
            <text x={ax(i)} y={ay(j) + 4} fontSize={11} fontWeight={800} fill={katki ? renk : "var(--ink)"} textAnchor="middle">{katki ? (p ? "B" : "P") : "Si"}</text>
          </g>
        );
      }))}
      {/* n-tipinde fazla elektron */}
      {!p && (
        <g>
          <circle cx={ex} cy={ey} r={5.5} fill="var(--c1)" />
          <text x={ex} y={ey + 3} fontSize={9} fontWeight={800} fill="#fff" textAnchor="middle">−</text>
          {zt === 0 && <text x={ex + 10} y={ey - 6} fontSize={11} fontWeight={700} fill="var(--c1)">fazla elektron</text>}
        </g>
      )}
      {p && zt === 0 && <text x={boslukX + 4} y={boslukY - 12} fontSize={11} fontWeight={700} fill="var(--c2)" textAnchor="middle">boşluk</text>}
      <text x={170} y={232} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {p ? "B: 3 değerlik elektron · Si: 4" : "P: 5 değerlik elektron · Si: 4"}
      </text>
    </svg>
  );
}

/* ================= 2. Diyot: ileri ve ters yön ================= */

// Pil, diyot ve lamba seri. Silisyum diyot ileri yönde ≈ 0,7 V'tan sonra iletir; ters yönde iletmez.
const ESIK = 0.7;
const diyotAkim = (V: number, ters: boolean) => (ters || V < ESIK ? 0 : (V - ESIK) / 2.3); // 0..1 göreli
function Diyot({ v, t, oynuyor, s }: SahneProps) {
  const ters = (v.ters ?? 0) > 0.5, V = sinir(v.V ?? 2, 0, 3), sure = Number(s.sure ?? 4), zt = ilerleme(t, oynuyor, sure) * sure;
  const I = diyotAkim(V, ters), akar = I > 0, yanik = zt > 0.3 ? I : 0;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  // Engel bölgesi: ileri yönde incelir, ters yönde kalınlaşır (oynayınca görünür).
  const engel = zt > 0 ? (ters ? 14 + 6 * V : sinir(14 - 12 * (V / ESIK), 2, 14)) : 14;
  const baslik = bitti || zt > 0.3
    ? akar ? "İleri yön: akım geçiyor" : ters ? "Ters yön: engel kalınlaştı, akım yok" : `${say(V)} V yetmiyor: akım yok`
    : ters ? "Pilin artısı n ucunda" : "Pilin artısı p ucunda";
  // Devre: dikdörtgen yol. Pil solda (x=50), diyot üstte ortada, lamba sağda.
  const L = 50, R = 290, U = 64, A = 170;
  const yolUzun = 2 * (R - L) + 2 * (A - U);
  const noktalar = akar && zt > 0
    ? Array.from({ length: 14 }, (_, k) => {
      let d = ((k / 14) * yolUzun + zt * 60 * (0.4 + I)) % yolUzun;
      // Saat yönünde (+ uçtan çıkan akım yönü): sol kenarda yukarı, üstte sağa, sağda aşağı, altta sola.
      if (d < A - U) return [L, A - d];
      d -= A - U; if (d < R - L) return [L + d, U];
      d -= R - L; if (d < A - U) return [R, U + d];
      d -= A - U; return [R - d, A];
    })
    : [];
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={baslik}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? (akar ? "var(--c3)" : "var(--c2)") : "var(--ink)"}>{baslik}</text>
      <path d={`M${L} ${U} H${R} V${A} H${L} Z`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      {/* pil */}
      <rect x={L - 16} y={100} width={32} height={34} fill="var(--bg, #fff)" />
      <line x1={L - 14} x2={L + 14} y1={ters ? 128 : 106} y2={ters ? 128 : 106} stroke="var(--ink)" strokeWidth={3} />
      <line x1={L - 8} x2={L + 8} y1={ters ? 106 : 128} y2={ters ? 106 : 128} stroke="var(--ink)" strokeWidth={5} />
      <text x={L - 22} y={ters ? 132 : 110} fontSize={13} fontWeight={800} fill="var(--c2)" textAnchor="end">+</text>
      <text x={L - 22} y={ters ? 110 : 132} fontSize={13} fontWeight={800} fill="var(--c1)" textAnchor="end">−</text>
      <text x={L + 20} y={121} fontSize={11.5} fontWeight={700} fill="var(--muted)">{say(V)} V</text>
      {/* diyot: üçgen sağa bakar (p solda, n sağda) */}
      <rect x={140} y={U - 16} width={60} height={32} fill="var(--bg, #fff)" />
      <path d={`M150 ${U - 12} L150 ${U + 12} L174 ${U} Z`} fill="var(--c5)" fillOpacity={0.3} stroke="var(--c5)" strokeWidth={2} />
      <line x1={175} x2={175} y1={U - 12} y2={U + 12} stroke="var(--c5)" strokeWidth={3} />
      <text x={146} y={U - 18} fontSize={11.5} fontWeight={800} fill="var(--c5)" textAnchor="end">p</text>
      <text x={180} y={U - 18} fontSize={11.5} fontWeight={800} fill="var(--c5)">n</text>
      {/* lamba */}
      <circle cx={R} cy={117} r={16} fill="var(--c4)" fillOpacity={0.12 + 0.75 * yanik} stroke="var(--ink)" strokeWidth={1.6} />
      <path d={`M${R - 7} 124 L${R - 3} 110 L${R + 3} 124 L${R + 7} 110`} fill="none" stroke="var(--ink)" strokeWidth={1.2} />
      {yanik > 0 && [0, 1, 2, 3, 4, 5].map((k) => {
        const a = (k / 6) * 2 * Math.PI, r1 = 21, r2 = 21 + 10 * yanik;
        return <line key={k} x1={R + r1 * Math.cos(a)} y1={117 + r1 * Math.sin(a)} x2={R + r2 * Math.cos(a)} y2={117 + r2 * Math.sin(a)} stroke="var(--c4)" strokeWidth={2} />;
      })}
      {noktalar.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={3} fill="var(--c4)" />)}
      {/* p-n bloğu ve engel bölgesi */}
      <g transform="translate(90 192)">
        <rect x={0} y={0} width={80} height={26} fill="var(--c2)" fillOpacity={0.14} />
        <rect x={80} y={0} width={80} height={26} fill="var(--c1)" fillOpacity={0.14} />
        <rect x={80 - engel / 2} y={0} width={engel} height={26} fill="var(--panel)" stroke="var(--muted)" strokeDasharray="3 2" />
        <text x={30} y={17} fontSize={11.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">p</text>
        <text x={130} y={17} fontSize={11.5} fontWeight={800} fill="var(--c1)" textAnchor="middle">n</text>
        <text x={80} y={40} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">engel bölgesi</text>
      </g>
    </svg>
  );
}

/* ================= 3. LED: enerji aralığı ve renk ================= */

// Elektron enerji aralığını inip boşlukla birleşince bir foton verir: λ (nm) ≈ 1240 / E (eV).
const dalgaBoyu = (E: number) => 1240 / E;
const renkAdi = (l: number) =>
  l > 700 ? "kızılötesi (görünmez)" : l >= 620 ? "kırmızı" : l >= 590 ? "turuncu" : l >= 570 ? "sarı" : l >= 495 ? "yeşil" : l >= 450 ? "mavi" : l >= 380 ? "mor" : "morötesi";
/** Dalga boyundan yaklaşık görünür renk. */
function dalgaRengi(l: number) {
  let r = 0, g = 0, b = 0;
  if (l < 440) { r = (440 - l) / 60; b = 1; }
  else if (l < 490) { g = (l - 440) / 50; b = 1; }
  else if (l < 510) { g = 1; b = (510 - l) / 20; }
  else if (l < 580) { r = (l - 510) / 70; g = 1; }
  else if (l < 645) { r = 1; g = (645 - l) / 65; }
  else { r = 1; }
  const k = (x: number) => Math.round(255 * sinir(x, 0, 1));
  return `rgb(${k(r)}, ${k(g)}, ${k(b)})`;
}
function Led({ v }: SahneProps) {
  const E = sinir(v.E ?? 1.9, 1.6, 3.2), l = dalgaBoyu(E), gorunur = l <= 700;
  const renk = gorunur ? dalgaRengi(l) : "var(--muted)";
  // Bant şeması: üst bant (iletim) ile alt bant (değerlik) arası E ile orantılı.
  const ALT = 196, ust = ALT - 30 - E * 38;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Enerji aralığı ${say(E, 2)} eV, ışık yaklaşık ${Math.round(l)} nm, ${renkAdi(l)}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">
        {say(E, 2)} eV → λ ≈ {Math.round(l)} nm: <tspan fill={gorunur ? renk : "var(--muted)"}>{renkAdi(l)}</tspan>
      </text>
      {/* bant şeması */}
      <rect x={24} y={ust - 18} width={120} height={18} fill="var(--c1)" fillOpacity={0.18} />
      <rect x={24} y={ALT} width={120} height={18} fill="var(--c2)" fillOpacity={0.18} />
      <text x={150} y={ust - 5} fontSize={10.5} fontWeight={700} fill="var(--c1)">elektron</text>
      <text x={150} y={ALT + 13} fontSize={10.5} fontWeight={700} fill="var(--c2)">boşluk</text>
      <circle cx={60} cy={ust - 9} r={5} fill="var(--c1)" />
      <circle cx={60} cy={ALT + 9} r={5} fill="none" stroke="var(--c2)" strokeWidth={2} />
      <line x1={60} x2={60} y1={ust - 2} y2={ALT + 2} stroke="var(--ink)" strokeWidth={1.4} strokeDasharray="4 3" />
      <text x={52} y={(ust + ALT) / 2 + 4} fontSize={11.5} fontWeight={800} fill="var(--ink)" textAnchor="end">E</text>
      <path d={yol(Array.from({ length: 30 }, (_, i) => [70 + i * 2.2, (ust + ALT) / 2 + 6 * Math.sin(i * (0.45 + E * 0.2))] as [number, number]))} fill="none" stroke={renk} strokeWidth={2.2} />
      <text x={104} y={(ust + ALT) / 2 + 22} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">foton</text>
      {/* LED */}
      <g transform="translate(250 0)">
        {gorunur && <circle cx={0} cy={100} r={56} fill={renk} fillOpacity={0.16} />}
        <path d="M-22 140 V96 A22 22 0 0 1 22 96 V140 Z" fill={gorunur ? renk : "var(--panel)"} fillOpacity={gorunur ? 0.75 : 1} stroke="var(--ink)" strokeWidth={1.6} />
        <rect x={-28} y={140} width={56} height={8} rx={2} fill="var(--ink)" fillOpacity={0.6} />
        <line x1={-10} x2={-10} y1={148} y2={196} stroke="var(--muted)" strokeWidth={2.4} />
        <line x1={10} x2={10} y1={148} y2={186} stroke="var(--muted)" strokeWidth={2.4} />
        <text x={0} y={216} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">en az ≈ {say(E, 1)} V ister</text>
      </g>
    </svg>
  );
}

/* ================= 4. Güneş pili ================= */

// 1 m² silisyum panel, verim %20: güç = 0,20 × ışık gücü. Işık eklemde elektron-boşluk çifti oluşturur;
// elektron n katmanına, boşluk p katmanına itilir ve dış devrede akım geçer.
const VERIM = 0.2;
function Gunes({ v }: SahneProps) {
  const I = sinir(v.I ?? 400, 0, 1000), P = VERIM * I, oran = I / 1000;
  const isin = Math.round(oran * 7);
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Işık ${Math.round(I)} watt bölü metrekare, panelin gücü ${Math.round(P)} watt`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">Işınım {Math.round(I)} W/m² → panel {Math.round(P)} W</text>
      {/* güneş */}
      <circle cx={40} cy={54} r={16} fill="var(--c4)" fillOpacity={0.2 + 0.7 * oran} />
      {Array.from({ length: isin }, (_, k) => {
        const x = 70 + k * 22;
        return <path key={k} d={yol(Array.from({ length: 12 }, (_, i) => [x - 10 + i * 1.6, 50 + i * 4.5 + 3 * Math.sin(i * 1.4)] as [number, number]))} fill="none" stroke="var(--c4)" strokeWidth={1.8} />;
      })}
      {/* panel: üst n, alt p */}
      <rect x={60} y={108} width={170} height={28} fill="var(--c1)" fillOpacity={0.16} stroke="var(--c1)" />
      <rect x={60} y={136} width={170} height={40} fill="var(--c2)" fillOpacity={0.14} stroke="var(--c2)" />
      <text x={66} y={127} fontSize={11.5} fontWeight={800} fill="var(--c1)">n</text>
      <text x={66} y={160} fontSize={11.5} fontWeight={800} fill="var(--c2)">p</text>
      {Array.from({ length: isin }, (_, k) => {
        const x = 92 + k * 20;
        return (
          <g key={k}>
            <circle cx={x} cy={124} r={3.5} fill="var(--c1)" />
            <circle cx={x} cy={152} r={4} fill="none" stroke="var(--c2)" strokeWidth={1.8} />
          </g>
        );
      })}
      {/* dış devre ve lamba */}
      <path d="M230 118 H300 V96" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d="M230 166 H300 V140" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <circle cx={300} cy={118} r={16} fill="var(--c4)" fillOpacity={0.1 + 0.8 * oran} stroke="var(--ink)" strokeWidth={1.6} />
      <text x={145} y={200} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">ışık elektronu n'ye, boşluğu p'ye ayırır</text>
      <text x={145} y={222} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">1 m² panel, verim %20</text>
    </svg>
  );
}

/* ================= 5. Transistör ================= */

// npn transistör, akım kazancı β = 100. Toplayıcı akımı devrenin izin verdiği 5 mA'de doyar.
const BETA = 100, IMAX = 5; // mA
const toplayici = (ib: number) => Math.min((BETA * ib) / 1000, IMAX); // ib µA → mA
function Transistor({ v }: SahneProps) {
  const ib = sinir(v.ib ?? 10, 0, 60), Ic = toplayici(ib), doyum = BETA * ib / 1000 >= IMAX, oran = Ic / IMAX;
  const baslik = ib === 0 ? "Taban akımı yok: transistör kapalı" : doyum ? "Tam açık (doyum): akım 5 mA'de durdu" : `Taban ${say(ib, 0)} µA → toplayıcı ${say(Ic, 2)} mA`;
  const TX = 190, TY = 128;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={baslik}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={doyum ? "var(--c3)" : "var(--ink)"}>{baslik}</text>
      {/* transistör simgesi */}
      <circle cx={TX} cy={TY} r={30} fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      <line x1={TX - 10} x2={TX - 10} y1={TY - 18} y2={TY + 18} stroke="var(--ink)" strokeWidth={3.5} />
      <line x1={TX - 10} x2={TX + 14} y1={TY - 8} y2={TY - 26} stroke="var(--ink)" strokeWidth={2} />
      <line x1={TX - 10} x2={TX + 14} y1={TY + 8} y2={TY + 26} stroke="var(--ink)" strokeWidth={2} />
      <path d={`M${TX + 14} ${TY + 26} l-9 -1 l5 -7 Z`} fill="var(--ink)" />
      {/* taban (ince), toplayıcı ve yayıcı (kalın) yollar */}
      <line x1={60} x2={TX - 10} y1={TY} y2={TY} stroke="var(--c5)" strokeWidth={1 + 3 * (ib / 60)} />
      <path d={`M${TX + 14} ${TY - 26} V60 H290`} fill="none" stroke="var(--c1)" strokeWidth={1.5 + 9 * oran} strokeLinejoin="round" />
      <path d={`M${TX + 14} ${TY + 26} V206 H290`} fill="none" stroke="var(--c1)" strokeWidth={1.5 + 9 * oran} strokeLinejoin="round" />
      <line x1={290} x2={290} y1={60} y2={206} stroke="var(--line-2)" strokeWidth={2} strokeDasharray="4 3" />
      <circle cx={290} cy={133} r={18} fill="var(--c4)" fillOpacity={0.1 + 0.8 * oran} stroke="var(--ink)" strokeWidth={1.6} />
      <text x={62} y={TY - 10} fontSize={11.5} fontWeight={700} fill="var(--c5)">taban: {say(ib, 0)} µA</text>
      <text x={TX + 22} y={52} fontSize={11.5} fontWeight={700} fill="var(--c1)">toplayıcı: {say(Ic, 2)} mA</text>
      <text x={TX + 22} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)">yayıcı</text>
      <text x={20} y={226} fontSize={11.5} fontWeight={700} fill="var(--muted)">β = 100</text>
    </svg>
  );
}

/* ================= 6. Sıcaklık ve direnç ================= */

// Göreli direnç (300 K'deki değer = 1). Bakır: soğudukça azalır ama sıfır olmaz. Silisyum: soğudukça artar.
// YBCO: 92 K'nin altında tam sıfır. Eğriler niteldir; ölçek gerçek değerleri göstermez.
const TC = 92;
const bakir = (T: number) => 0.08 + 0.92 * (T / 300);
const silisyum = (T: number) => Math.min(1.9, Math.exp(0.55 * (300 / T - 1)));
const ybco = (T: number) => (T < TC ? 0 : 0.3 + 0.7 * (T / 300));
function Direnc({ v, s }: SahneProps) {
  const T = sinir(v.T ?? 300, 20, 300), ybcoVar = Boolean(s.ybco);
  const GX0 = 40, GX1 = 320, GY0 = 46, GY1 = 196, YMAX = 2;
  const gx = (x: number) => GX0 + (x / 300) * (GX1 - GX0), gy = (r: number) => GY1 - (r / YMAX) * (GY1 - GY0);
  const egri = (f: (x: number) => number) => yol(Array.from({ length: 141 }, (_, i) => { const x = 20 + i * 2; return [gx(x), gy(f(x))] as [number, number]; }));
  const ybcoYol = yol(Array.from({ length: 105 }, (_, i) => { const x = TC + i * 2; return [gx(Math.min(x, 300)), gy(ybco(Math.min(x, 300)))] as [number, number]; }));
  const sifir = ybcoVar && T < TC;
  const baslik = ybcoVar ? (sifir ? `${Math.round(T)} K: YBCO süper iletken, R = 0` : `${Math.round(T)} K: YBCO'nun direnci var`) : `${Math.round(T)} K`;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Sıcaklık ${Math.round(T)} kelvin`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={sifir ? "var(--c3)" : "var(--ink)"}>{baslik}</text>
      <line x1={GX0} x2={GX1} y1={GY1} y2={GY1} stroke="var(--ink)" />
      <line x1={GX0} x2={GX0} y1={GY0 - 6} y2={GY1} stroke="var(--ink)" />
      <text x={GX0 - 6} y={GY0} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="end" transform={`rotate(-90 ${GX0 - 10} ${GY0 + 40})`}>direnç</text>
      {[0, 100, 200, 300].map((x) => <text key={x} x={gx(x)} y={GY1 + 14} fontSize={10.5} fill="var(--muted)" textAnchor="middle">{x} K</text>)}
      {ybcoVar && (
        <g>
          <line x1={gx(77)} x2={gx(77)} y1={GY0} y2={GY1} stroke="var(--c1)" strokeDasharray="3 3" />
          <text x={gx(77) - 3} y={GY0 + 2} fontSize={10} fontWeight={700} fill="var(--c1)" textAnchor="end">sıvı azot 77 K</text>
        </g>
      )}
      <path d={egri(bakir)} fill="none" stroke="var(--c4)" strokeWidth={2.4} />
      <path d={egri(silisyum)} fill="none" stroke="var(--c5)" strokeWidth={2.4} />
      {ybcoVar && <path d={ybcoYol + ` M${gx(TC)} ${gy(ybco(TC))} L${gx(TC)} ${gy(0)} L${gx(20)} ${gy(0)}`} fill="none" stroke="var(--c3)" strokeWidth={2.4} />}
      <line x1={gx(T)} x2={gx(T)} y1={GY0} y2={GY1} stroke="var(--ink)" strokeWidth={1.2} />
      <circle cx={gx(T)} cy={gy(bakir(T))} r={5} fill="var(--c4)" />
      <circle cx={gx(T)} cy={gy(silisyum(T))} r={5} fill="var(--c5)" />
      {ybcoVar && <circle cx={gx(T)} cy={gy(ybco(T))} r={5} fill="var(--c3)" />}
      <g fontSize={11.5} fontWeight={800}>
        <text x={GX1} y={gy(bakir(300)) + 20} fill="var(--c4)" textAnchor="end">bakır (metal)</text>
        <text x={gx(112)} y={gy(silisyum(112)) - 10} fill="var(--c5)">silisyum</text>
        {ybcoVar && <text x={gx(TC) + 4} y={GY1 - 8} fill="var(--c3)">YBCO</text>}
      </g>
      <text x={GX1} y={234} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="end">eğriler niteldir, ölçekli değildir</text>
    </svg>
  );
}

/* ================= 7. Meissner etkisi ================= */

// Önce seramik disk sıvı azotla soğutulur (T: 295 K → 77 K), sonra üstüne mıknatıs indirilir.
// Disk 92 K'nin altında süper iletkendir: mıknatısın alanını dışarı iter, mıknatıs havada durur.
function Meissner({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6), zt = ilerleme(t, oynuyor, sure) * sure;
  const sogu = yumusak(zt / 3), T = 295 - (295 - 77) * sogu, superIl = T < TC;
  const in_ = yumusak((zt - 3) / 2.4); // mıknatıs iniyor
  const DY = 168, yuzen = DY - 40; // diskin üstü, mıknatısın duracağı alt kenar
  const altKenar = 70 + in_ * (yuzen - 70);
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  const baslik = bitti ? "Mıknatıs havada asılı kaldı" : zt === 0 ? "Seramik disk oda sıcaklığında" : `Disk soğuyor: ${Math.round(T)} K${superIl ? " (süper iletken)" : ""}`;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={baslik}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c3)" : "var(--ink)"}>{baslik}</text>
      {/* sıvı azot kabı ve disk */}
      <path d="M80 160 V206 H260 V160" fill="var(--c1)" fillOpacity={0.08 + 0.14 * sogu} stroke="var(--ink)" strokeWidth={1.6} />
      <rect x={120} y={DY} width={100} height={16} rx={3} fill="var(--ink)" fillOpacity={0.55} />
      {zt > 0 && [0, 1, 2, 3, 4].map((k) => (
        <circle key={k} cx={100 + k * 36} cy={152 - ((zt * 18 + k * 9) % 30)} r={6} fill="var(--c1)" fillOpacity={0.12 * (1 - in_ * 0.6)} />
      ))}
      {/* mıknatıs alan çizgileri: süper iletken üstündeyse diskin çevresinden dolanır */}
      {zt >= 3 && [-1, 1].map((y) => (
        <path key={y} d={`M${170 + y * 14} ${altKenar} C ${170 + y * 30} ${altKenar + 22}, ${170 + y * 66} ${DY - 6}, ${170 + y * 64} ${altKenar - 30}`} fill="none" stroke="var(--c5)" strokeWidth={1.4} strokeDasharray="4 3" />
      ))}
      <rect x={150} y={altKenar - 22} width={40} height={22} rx={2} fill="var(--c2)" fillOpacity={0.8} />
      <text x={170} y={altKenar - 7} fontSize={11} fontWeight={800} fill="#fff" textAnchor="middle">N</text>
      <text x={280} y={60} fontSize={11.5} fontWeight={700} fill={superIl ? "var(--c3)" : "var(--muted)"} textAnchor="end">T = {Math.round(T)} K</text>
      <text x={170} y={230} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">YBCO disk · kritik sıcaklık 92 K</text>
    </svg>
  );
}

const transistorGeri = (v: Record<string, number>) => {
  const ib = sinir(v.ib ?? 10, 0, 60);
  return { baslik: `Toplayıcı akımı ${say(toplayici(ib), 2)} mA`, metin: "Toplayıcı akımı taban akımının 100 katı: 3 mA için taban akımı 3 mA ÷ 100 = 30 µA olmalı." };
};

export const FIZIK16: Record<string, SahneKaydi> = {
  "fiz16-kristal": { C: Kristal },
  "fiz16-diyot": { C: Diyot },
  "fiz16-led": { C: Led },
  "fiz16-gunes": { C: Gunes },
  "fiz16-transistor": { C: Transistor, geri: transistorGeri },
  "fiz16-direnc": { C: Direnc },
  "fiz16-meissner": { C: Meissner },
};
