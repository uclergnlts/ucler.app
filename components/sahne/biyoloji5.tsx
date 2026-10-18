"use client";
// Biyoloji sahneleri (mayoz, kalıtım): kuşaklar boyunca kromozom sayısı, homologlar ve tetrat,
// krossing-over, mayoz I ve II, bağımsız dağılım, ayrılmama, mitoz ile mayoz; Punnett karesi
// (baskın-çekinik, eksik baskınlık, ABO, X'e bağlı) ve kontrol çaprazlaması.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure) : 0);
const ara = (a: number, b: number, u: number) => a + (b - a) * u;

// Anneden gelen kromozomlar kırmızı, babadan gelenler mavi.
const ANNE = "var(--c2)", BABA = "var(--c1)";

/** Kromozom: iki kardeş kromatit (ya da tek kromatit), ortada sentromer. ayri: kardeş kromatitler arası ek açıklık. */
function Kr({ x, y, boy, renk, aci = 0, tek = false, ayri = 0, ust }: {
  x: number; y: number; boy: number; renk: string; aci?: number; tek?: boolean; ayri?: number; ust?: [string | null, string | null];
}) {
  const h = boy / 2 - 3, kx = tek ? [0] : [-1, 1];
  return (
    <g transform={`translate(${x} ${y}) rotate(${aci})`} strokeWidth={5.5} strokeLinecap="round" fill="none">
      {kx.map((k, i) => {
        const cx = k * (3 + ayri);
        const ustRenk = ust?.[i];
        return (
          <g key={k}>
            <line x1={cx} y1={-h} x2={cx} y2={h} stroke={renk} />
            {ustRenk && <line x1={cx} y1={-h} x2={cx} y2={-h * 0.15} stroke={ustRenk} />}
          </g>
        );
      })}
      {!tek && ayri < 3 && <circle r={3} fill="var(--ink)" stroke="none" opacity={0.7 * (1 - ayri / 3)} />}
    </g>
  );
}

/* ---------- kuşaklar boyunca kromozom sayısı ---------- */

function Kusak({ v }: SahneProps) {
  const n = sinir(v.kusak ?? 1, 1, 4), mayoz = v.mayoz === 1;
  const sayi = (g: number) => (mayoz ? 46 : 46 * 2 ** (g - 1));
  const H = 118, taban = 196;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`${n}. kuşakta vücut hücresinde ${sayi(n)} kromozom`}>
      <text x={20} y={24} fontSize={12.5} fontWeight={800} fill="var(--ink)">
        {mayoz ? "gamet: 23 + 23 → zigot: 46" : `gamet: ${sayi(n)} + ${sayi(n)} → zigot: ${sayi(n) * 2}`}
      </text>
      <text x={20} y={42} fontSize={11} fontWeight={600} fill="var(--muted)">
        {mayoz ? "mayoz sayıyı yarıya indirir, döllenme ikiye katlar" : "gametler vücut hücresi kadar kromozom taşısaydı"}
      </text>
      <line x1={20} y1={taban} x2={320} y2={taban} stroke="var(--line-2)" strokeWidth={1.4} />
      {Array.from({ length: n }, (_, i) => {
        const g = i + 1, s = sayi(g), h = Math.max(6, (s / 368) * H), x = 40 + i * 72;
        return (
          <g key={`${g}-${mayoz}`} className="ad-belir">
            <rect x={x} y={taban - h} width={44} height={h} rx={6} fill={mayoz ? "var(--biyoloji)" : s > 46 ? ANNE : "var(--biyoloji)"} fillOpacity={0.85} />
            <text x={x + 22} y={taban - h - 8} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{s}</text>
            <text x={x + 22} y={taban + 18} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{g}. kuşak</text>
          </g>
        );
      })}
      <text x={320} y={232} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="end">vücut hücresindeki kromozom</text>
    </svg>
  );
}

/* ---------- homologlar ve tetrat ---------- */

function Homolog({ v }: SahneProps) {
  const es = v.s === 1;
  // [anne, baba] x [uzun, kısa]
  const KR = [
    { renk: ANNE, boy: 66, d: [92, 92, -20], e: [150, 100] },
    { renk: BABA, boy: 66, d: [214, 120, 25], e: [176, 100] },
    { renk: ANNE, boy: 40, d: [240, 72, -10], e: [150, 168] },
    { renk: BABA, boy: 40, d: [120, 160, 30], e: [176, 168] },
  ];
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={es ? "Homolog kromozomlar yan yana: iki tetrat" : "Diploit hücre: iki homolog çift, ayrı ayrı"}>
      <ellipse cx={170} cy={126} rx={150} ry={100} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
      <g key={String(es)} className="ad-belir">
        {KR.map((k, i) => <Kr key={i} x={es ? k.e[0] : k.d[0]} y={es ? k.e[1] : k.d[1]} boy={k.boy} renk={k.renk} aci={es ? 0 : k.d[2]} />)}
        {es && (
          <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
            <rect x={136} y={60} width={54} height={80} rx={10} fill="none" stroke="var(--biyoloji)" strokeWidth={1.5} strokeDasharray="4 4" />
            <rect x={136} y={142} width={54} height={52} rx={10} fill="none" stroke="var(--biyoloji)" strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={204} y={104} fill="var(--biyoloji)">tetrat</text>
            <text x={204} y={172} fill="var(--biyoloji)">tetrat</text>
          </g>
        )}
      </g>
      <g fontSize={11} fontWeight={700}>
        <rect x={14} y={234} width={10} height={6} rx={3} fill={ANNE} /><text x={30} y={241} fill="var(--muted)">anneden</text>
        <rect x={86} y={234} width={10} height={6} rx={3} fill={BABA} /><text x={102} y={241} fill="var(--muted)">babadan</text>
        <text x={326} y={241} fill="var(--ink)" textAnchor="end">4 kromozom · 8 kromatit</text>
      </g>
    </svg>
  );
}

/* ---------- krossing-over ---------- */

function Krossing({ v }: SahneProps) {
  const k = v.k === 1;
  const XS = [100, 130, 210, 240], Y0 = 46, Y1 = 186, KZ = 112;
  // Her kromatitin üst geni (A/a) ve alt geni (B/b). Değişim 2. ve 3. kromatit (kardeş olmayanlar)
  // arasında olur: 2. kromatitin üst parçası babadan, 3.'nünki anneden gelir.
  const ustRenk = k ? [ANNE, BABA, ANNE, BABA] : [ANNE, ANNE, BABA, BABA];
  const ustGen = k ? ["A", "a", "A", "a"] : ["A", "A", "a", "a"];
  const alt = ["B", "B", "b", "b"], altR = [ANNE, ANNE, BABA, BABA];
  const birlesim = ustGen.map((g, i) => g + alt[i]);
  const yeni = (i: number) => k && (i === 1 || i === 2);
  const farkli = new Set(birlesim).size;
  return (
    <svg viewBox="0 0 340 256" role="img" aria-label={`Tetrat: ${birlesim.join(", ")}; ${farkli} farklı birleşim`}>
      <g fontSize={11.5} fontWeight={700} textAnchor="middle">
        <text x={115} y={30} fill={ANNE}>anneden</text>
        <text x={225} y={30} fill={BABA}>babadan</text>
      </g>
      {XS.map((x, i) => (
        <g key={`${i}-${k}`}>
          <line x1={x} y1={Y0} x2={x} y2={Y1} stroke={altR[i]} strokeWidth={11} strokeLinecap="round" />
          <line x1={x} y1={Y0} x2={x} y2={KZ} stroke={ustRenk[i]} strokeWidth={11} strokeLinecap="round" className={yeni(i) ? "ad-belir" : undefined} />
        </g>
      ))}
      {[115, 225].map((x) => <circle key={x} cx={x} cy={KZ + 6} r={4} fill="var(--ink)" opacity={0.7} />)}
      {k && (
        <g className="ad-belir">
          <path d={`M${XS[1] + 6} ${KZ - 18} L${XS[2] - 6} ${KZ + 6} M${XS[1] + 6} ${KZ + 6} L${XS[2] - 6} ${KZ - 18}`} stroke="var(--c5)" strokeWidth={2} strokeDasharray="5 4" />
          <text x={170} y={KZ - 26} fontSize={11} fontWeight={700} fill="var(--c5)" textAnchor="middle">kiazma</text>
        </g>
      )}
      {XS.map((x, i) => (
        <g key={`g${i}-${k}`} fontSize={11} fontWeight={800} textAnchor="middle">
          <circle cx={x} cy={70} r={9} fill="#fff" stroke={ustRenk[i]} strokeWidth={2} />
          <text x={x} y={74} fill="var(--ink)">{ustGen[i]}</text>
          <circle cx={x} cy={162} r={9} fill="#fff" stroke={altR[i]} strokeWidth={2} />
          <text x={x} y={166} fill="var(--ink)">{alt[i]}</text>
        </g>
      ))}
      {XS.map((x, i) => (
        <g key={`b${i}-${k}`} textAnchor="middle">
          <text x={x} y={214} fontSize={14} fontWeight={800} fill={yeni(i) ? "var(--c5)" : "var(--ink)"}>{birlesim[i]}</text>
          {yeni(i) && <text x={x} y={230} fontSize={10.5} fontWeight={700} fill="var(--c5)" className="ad-belir">yeni</text>}
        </g>
      ))}
      <text x={170} y={250} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">farklı gen birleşimi: {farkli}</text>
    </svg>
  );
}

/* ---------- mayoz I ve II ---------- */

const EVRELER = [
  { u: 0, ad: "Profaz I", not: "homologlar eşleşir: tetrat" },
  { u: 0.17, ad: "Metafaz I", not: "tetratlar ekvatorda karşılıklı" },
  { u: 0.3, ad: "Anafaz I", not: "homolog kromozomlar zıt kutuplara" },
  { u: 0.44, ad: "Telofaz I", not: "2 hücre; kromozomlar hâlâ iki kromatitli" },
  { u: 0.58, ad: "Metafaz II", not: "kromozomlar ekvatorda tek sıra" },
  { u: 0.7, ad: "Anafaz II", not: "kardeş kromatitler ayrılır" },
  { u: 0.84, ad: "Telofaz II", not: "4 haploit (n) hücre" },
];
// Başlangıç, metafaz I, anafaz I sonu, metafaz II konumları; kardeş kromatitlerin ayrılma yönü (+1 aşağı).
const MK = [
  { renk: ANNE, boy: 46, p0: [118, 86, -20], m1: [160, 92], a1: [84, 92], m2: [62, 120] },
  { renk: BABA, boy: 46, p0: [220, 100, 30], m1: [180, 92], a1: [256, 92], m2: [222, 120] },
  { renk: ANNE, boy: 30, p0: [146, 158, 15], m1: [180, 154], a1: [256, 154], m2: [278, 120] },
  { renk: BABA, boy: 30, p0: [206, 160, -25], m1: [160, 154], a1: [84, 154], m2: [118, 120] },
];

/** Ortadan boğumlanan zar: neck 0 tam, 1 ikiye ayrılmış. */
function zar(cx: number, cy: number, rx: number, ry: number, neck: number) {
  const L = cx - rx, R = cx + rx, w = ry * neck;
  return `M${L} ${cy} C${L} ${cy - ry * 0.9} ${cx - 12} ${cy - ry * 1.02} ${cx} ${cy - ry + w} C${cx + 12} ${cy - ry * 1.02} ${R} ${cy - ry * 0.9} ${R} ${cy} C${R} ${cy + ry * 0.9} ${cx + 12} ${cy + ry * 1.02} ${cx} ${cy + ry - w} C${cx - 12} ${cy + ry * 1.02} ${L} ${cy + ry * 0.9} ${L} ${cy} Z`;
}

function Mayoz({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 8;
  const u = ilerleme(t, oynuyor, sure), basladi = oynuyor || t > 0;
  const e = [...EVRELER].reverse().find((x) => u >= x.u) ?? EVRELER[0];
  const CY = 124;
  const esle = yumusak(u / 0.12), dizil = yumusak((u - 0.12) / 0.12), ayril1 = yumusak((u - 0.3) / 0.12);
  const bog1 = yumusak((u - 0.44) / 0.1), don = yumusak((u - 0.52) / 0.12), ayril2 = yumusak((u - 0.7) / 0.12), bog2 = yumusak((u - 0.84) / 0.12);
  const ikinci = u >= 0.52;
  const hucre = u >= 0.92 ? 4 : u >= 0.5 ? 2 : 1;
  // Anafaz II'de ayrılan kardeş kromatitler hücre ikiye bölünene dek geçici olarak 4 kromozom sayılır.
  const kromozom = u >= 0.72 && u < 0.92 ? 4 : u >= 0.5 ? 2 : 4;
  const kAd = u >= 0.72 && u < 0.92 ? "(geçici)" : u >= 0.5 ? "(n)" : "(2n)";
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={basladi ? `${e.ad}: ${e.not}` : "Mayoz başlamadan: 2n = 4, DNA eşlenmiş"}>
      {/* zar */}
      {bog1 < 1 ? (
        <path d={zar(170, CY, 152, 96, bog1)} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
      ) : (
        [90, 250].map((cx) => (
          bog2 < 1 ? (
            <path key={cx} d={zar(cx, CY, 96, 74, bog2)} transform={`rotate(90 ${cx} ${CY})`} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
          ) : (
            <g key={cx}>
              <ellipse cx={cx} cy={CY - 49} rx={72} ry={45} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
              <ellipse cx={cx} cy={CY + 49} rx={72} ry={45} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
            </g>
          )
        ))
      )}
      <circle cx={170} cy={CY} r={78} fill="none" stroke="var(--ink)" strokeWidth={1.2} strokeDasharray="5 5" opacity={1 - esle} />
      {/* kromozomlar */}
      <g>
        {MK.map((k, i) => {
          let x: number, y: number, aci: number;
          if (!ikinci) {
            const ex = ara(k.p0[0], ara(k.p0[0], k.m1[0], 0.6), esle), ey = ara(k.p0[1], k.m1[1], esle);
            x = ara(ara(ex, k.m1[0], dizil), k.a1[0], ayril1);
            y = ara(ey, k.m1[1], dizil);
            aci = k.p0[2] * (1 - esle);
          } else {
            x = ara(k.a1[0], k.m2[0], don); y = ara(k.a1[1], k.m2[1], don); aci = 90 * don;
          }
          if (ayril2 > 0) {
            // Kardeş kromatitler yukarı ve aşağı ayrılır.
            return [-1, 1].map((d) => (
              <Kr key={`${i}${d}`} x={x} y={y + d * (8 + 41 * ayril2)} boy={k.boy} renk={k.renk} aci={90} tek />
            ));
          }
          return <Kr key={i} x={x} y={y} boy={k.boy} renk={k.renk} aci={aci} />;
        })}
      </g>
      {dizil > 0 && dizil < 1.01 && !ikinci && <line x1={170} y1={CY - 70} x2={170} y2={CY + 70} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 5" opacity={0.6 * (1 - bog1)} />}
      <text x={12} y={18} fontSize={13.5} fontWeight={800} fill="var(--biyoloji)">{basladi ? e.ad : "Mayozdan önce"}</text>
      <text x={328} y={18} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="end">{basladi ? e.not : "2n = 4, DNA eşlendi"}</text>
      <g fontSize={12} fontWeight={800} fill="var(--ink)">
        <text x={12} y={252}>hücre: {hucre}</text>
        <text x={328} y={252} textAnchor="end">
          her hücrede kromozom: {kromozom} {kAd}
        </text>
      </g>
    </svg>
  );
}

/* ---------- bağımsız dağılım ---------- */

function Dagilim({ v }: SahneProps) {
  const n = sinir(v.n ?? 1, 1, 4), adet = 2 ** n;
  const sut = Math.min(adet, 8), W = 36, x0 = 170 - (sut * W) / 2;
  return (
    <svg viewBox="0 0 340 246" role="img" aria-label={`${n} homolog çift: ${adet} çeşit gamet`}>
      <text x={20} y={22} fontSize={11.5} fontWeight={700} fill="var(--muted)">hücredeki homolog çiftler ({n})</text>
      <g key={`c${n}`}>
        {Array.from({ length: n }, (_, i) => {
          const x = 170 - (n * 40) / 2 + i * 40 + 20, boy = 40 - i * 6;
          return (
            <g key={i}>
              <Kr x={x - 7} y={64} boy={boy} renk={ANNE} tek />
              <Kr x={x + 7} y={64} boy={boy} renk={BABA} tek />
            </g>
          );
        })}
      </g>
      <line x1={20} y1={100} x2={320} y2={100} stroke="var(--line)" />
      <text x={20} y={120} fontSize={11.5} fontWeight={700} fill="var(--muted)">olası gametler</text>
      <g key={`g${n}`} className="ad-belir">
        {Array.from({ length: adet }, (_, g) => {
          const sx = x0 + (g % 8) * W, sy = 132 + Math.floor(g / 8) * 46;
          return (
            <g key={g}>
              <rect x={sx + 3} y={sy} width={W - 6} height={40} rx={8} fill="#fff" stroke="var(--line-2)" strokeWidth={1.2} />
              {Array.from({ length: n }, (_, i) => {
                const bx = sx + W / 2 - ((n - 1) * 6) / 2 + i * 6, boy = 26 - i * 4;
                return <line key={i} x1={bx} y1={sy + 20 - boy / 2} x2={bx} y2={sy + 20 + boy / 2} stroke={(g >> (n - 1 - i)) & 1 ? BABA : ANNE} strokeWidth={4} strokeLinecap="round" />;
              })}
            </g>
          );
        })}
      </g>
      <text x={170} y={238} fontSize={13} fontWeight={800} fill="var(--ink)" textAnchor="middle">gamet çeşidi = 2{"¹²³⁴"[n - 1]} = {adet}</text>
    </svg>
  );
}

/* ---------- ayrılmama ---------- */

function Ayrilmama({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const m1 = yumusak((u - 0.1) / 0.3), m2 = yumusak((u - 0.5) / 0.3), son = u >= 0.95;
  const ANA = { x: 46, y: 122 };
  const I = [{ x: 156, y: 70, n: 24 }, { x: 156, y: 174, n: 22 }];
  const II = [{ x: 280, y: 36, n: 24, p: 0 }, { x: 280, y: 96, n: 24, p: 0 }, { x: 280, y: 148, n: 22, p: 1 }, { x: 280, y: 208, n: 22, p: 1 }];
  const Hucre = ({ x, y, r, n, kotu, op }: { x: number; y: number; r: number; n: number; kotu: boolean; op: number }) => (
    <g opacity={op}>
      <circle cx={x} cy={y} r={r} fill={kotu ? "#fdeeed" : "#f4f8fc"} stroke={kotu ? ANNE : "var(--ink)"} strokeWidth={1.6} />
      <text x={x} y={y + 5} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{n}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 256" role="img" aria-label={son ? "Dört gamet: 24, 24, 22, 22 kromozomlu" : "Mayoz I'de bir homolog çift ayrılmıyor"}>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={100} y={18}>mayoz I</text>
        <text x={222} y={18}>mayoz II</text>
      </g>
      <Hucre x={ANA.x} y={ANA.y} r={30} n={46} kotu={false} op={1} />
      <text x={ANA.x} y={ANA.y + 48} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">2n = 46</text>
      {I.map((c, i) => (
        <g key={i}>
          <line x1={ANA.x + 30} y1={ANA.y} x2={ara(ANA.x + 30, c.x - 26, m1)} y2={ara(ANA.y, c.y, m1)} stroke="var(--line-2)" strokeWidth={1.6} />
          <Hucre x={c.x} y={c.y} r={26} n={c.n} kotu op={m1} />
        </g>
      ))}
      {m1 > 0.9 && <text x={156} y={128} fontSize={10.5} fontWeight={700} fill={ANNE} textAnchor="middle">bir çift ayrılmadı</text>}
      {II.map((c, i) => {
        const a = I[c.p];
        return (
          <g key={i}>
            <line x1={a.x + 26} y1={a.y} x2={ara(a.x + 26, c.x - 22, m2)} y2={ara(a.y, c.y, m2)} stroke="var(--line-2)" strokeWidth={1.6} />
            <Hucre x={c.x} y={c.y} r={22} n={c.n} kotu op={m2} />
            {son && <text x={c.x + 28} y={c.y + 4} fontSize={11} fontWeight={800} fill={ANNE} className="ad-belir">{c.n === 24 ? "n+1" : "n−1"}</text>}
          </g>
        );
      })}
      {son && <text x={12} y={248} fontSize={12} fontWeight={800} fill="var(--ink)" className="ad-belir">4 gametin hepsi anormal (normali 23)</text>}
    </svg>
  );
}

/* ---------- mitoz ve mayoz ---------- */

function Karsilastir({ v }: SahneProps) {
  const my = v.m === 1;
  // Her sonuç hücresindeki kromozomlar: [renk, boy, krossing-over ile gelen üst parçanın rengi]
  type K = [string, number, string | null];
  const mitoz = [0, 1].map((): K[] => [[ANNE, 34, null], [BABA, 34, null], [ANNE, 22, null], [BABA, 22, null]]);
  const mayoz: K[][] = [
    [[ANNE, 34, null], [BABA, 22, null]],
    [[ANNE, 34, BABA], [BABA, 22, null]],
    [[BABA, 34, ANNE], [ANNE, 22, null]],
    [[BABA, 34, null], [ANNE, 22, null]],
  ];
  const sonuc = my ? mayoz : mitoz;
  const ys = my ? [4, 54, 104, 154] : [44, 144];
  return (
    <svg viewBox="0 0 340 250" role="img" aria-label={my ? "Mayoz: 4 hücre, her birinde 2 kromozom, birbirinden farklı" : "Mitoz: 2 hücre, her birinde 4 kromozom, özdeş"}>
      <circle cx={52} cy={110} r={40} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
      {[[ANNE, 30, 36, 96], [BABA, 30, 50, 96], [ANNE, 20, 62, 128], [BABA, 20, 76, 128]].map(([r, b, x, y], i) => (
        <Kr key={i} x={(x as number) - 4} y={y as number} boy={b as number} renk={r as string} tek />
      ))}
      <text x={52} y={170} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">2n = 4</text>
      <text x={150} y={110} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{my ? "2 bölünme" : "1 bölünme"}</text>
      <path d="M112 120 L188 120 M180 114 L188 120 L180 126" stroke="var(--muted)" strokeWidth={1.6} fill="none" />
      <g key={String(my)} className="ad-belir">
        {sonuc.map((h, i) => (
          <g key={i}>
            <ellipse cx={258} cy={ys[i] + 22} rx={56} ry={my ? 21 : 40} fill="#f4f8fc" stroke="var(--ink)" strokeWidth={1.6} />
            {h.map(([r, b, ust], j) => <Kr key={j} x={258 - ((h.length - 1) * 16) / 2 + j * 16} y={ys[i] + 22} boy={my ? b * 0.85 : b} renk={r} tek ust={[ust, null]} />)}
          </g>
        ))}
      </g>
      <g fontSize={12} fontWeight={800} fill="var(--ink)">
        <text x={12} y={240}>{my ? "4 hücre · n = 2" : "2 hücre · 2n = 4"}</text>
        <text x={328} y={240} textAnchor="end" fill={my ? "var(--c5)" : "var(--ink)"}>{my ? "genetik olarak farklı" : "genetik olarak özdeş"}</text>
      </g>
    </svg>
  );
}

/* ---------- Punnett karesi ---------- */

type Mod = "baskin" | "eksik" | "kan" | "x";

/** Alel yazısı: IA, IB, XH, Xh üst simgeli yazılır. */
function Alel({ a }: { a: string }) {
  if (a.length === 2 && (a[0] === "I" || a[0] === "X")) return <>{a[0]}<tspan baselineShift="super" fontSize="70%">{a[1]}</tspan></>;
  return <>{a}</>;
}
const SIRA = ["A", "a", "K", "B", "IA", "IB", "i", "XH", "Xh", "Y"];
const sirala = (g: string[]) => [...g].sort((p, q) => SIRA.indexOf(p) - SIRA.indexOf(q));

type Fen = { ad: string; renk: string; erkek?: boolean; dolu?: number };
function fenotip(m: Mod, g: string[]): Fen {
  if (m === "baskin") return g.includes("A") ? { ad: "mor", renk: "var(--c5)" } : { ad: "beyaz", renk: "#fff" };
  if (m === "eksik") {
    const k = g.filter((x) => x === "K").length;
    return k === 2 ? { ad: "kırmızı", renk: "var(--c2)" } : k === 1 ? { ad: "pembe", renk: "#f6a6bb" } : { ad: "beyaz", renk: "#fff" };
  }
  if (m === "kan") {
    const a = g.includes("IA"), b = g.includes("IB");
    return { ad: a && b ? "AB" : a ? "A" : b ? "B" : "0", renk: "var(--c2)" };
  }
  const erkek = g.includes("Y"), h = g.filter((x) => x === "Xh").length;
  if (erkek) return h ? { ad: "renk körü", renk: "var(--ink)", erkek, dolu: 1 } : { ad: "sağlıklı", renk: "var(--ink)", erkek, dolu: 0 };
  return h === 2 ? { ad: "renk körü", renk: "var(--ink)", dolu: 1 } : h === 1 ? { ad: "taşıyıcı", renk: "var(--ink)", dolu: 0.5 } : { ad: "sağlıklı", renk: "var(--ink)", dolu: 0 };
}

const kesir = (n: number, top: number) => (n === top ? "hepsi" : ({ 1: "¼", 2: "½", 3: "¾" } as Record<number, string>)[(n * 4) / top] ?? `${n}/${top}`);

function Simge({ m, f, x, y }: { m: Mod; f: Fen; x: number; y: number }) {
  if (m === "kan")
    return (
      <g>
        <circle cx={x} cy={y} r={12} fill="#fdeeed" stroke={f.renk} strokeWidth={1.6} />
        <text x={x} y={y + 4} fontSize={f.ad.length > 1 ? 10 : 11.5} fontWeight={800} fill={f.renk} textAnchor="middle">{f.ad}</text>
      </g>
    );
  if (m === "x") {
    const r = 10;
    const kutu = f.erkek ? <rect x={x - r} y={y - r} width={2 * r} height={2 * r} /> : <circle cx={x} cy={y} r={r} />;
    return (
      <g>
        <g fill="#fff" stroke="var(--ink)" strokeWidth={1.6}>{kutu}</g>
        {f.dolu === 1 && <g fill="var(--ink)">{kutu}</g>}
        {f.dolu === 0.5 && <circle cx={x} cy={y} r={3.5} fill="var(--ink)" />}
      </g>
    );
  }
  // Çiçek: beş taç yaprak
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * 72 - 90) * (Math.PI / 180);
        return <circle key={i} cx={x + 6.5 * Math.cos(a)} cy={y + 6.5 * Math.sin(a)} r={5.5} fill={f.renk} stroke={f.renk === "#fff" ? "var(--line-2)" : "none"} strokeWidth={1.2} />;
      })}
      <circle cx={x} cy={y} r={3} fill="var(--c4)" />
    </g>
  );
}

function ebeveyn(s: SahneProps["s"], v: SahneProps["v"]): [string[], string[]] {
  const m = (s.mod as Mod) ?? "baskin";
  if (m === "baskin") {
    const g = (n: number) => (n >= 2 ? ["A", "A"] : n === 1 ? ["A", "a"] : ["a", "a"]);
    return [g(v.p1 ?? (s.p1 as number) ?? 1), g(v.p2 ?? (s.p2 as number) ?? 1)];
  }
  if (m === "x") return [(s.e1 as string[]) ?? ["XH", "Xh"], [v.bk === 1 ? "Xh" : "XH", "Y"]];
  return [(s.e1 as string[]) ?? [], (s.e2 as string[]) ?? []];
}

function Punnett(p: SahneProps) {
  const { s, t, oynuyor } = p;
  const m = (s.mod as Mod) ?? "baskin";
  const sure = typeof s.sure === "number" ? s.sure : 0;
  const u = sure ? ilerleme(t, oynuyor, sure) : 1;
  const [e1, e2] = ebeveyn(s, p.v);
  const ad = (s.adlar as string[]) ?? (m === "x" || m === "kan" ? ["anne", "baba"] : ["1. ebeveyn", "2. ebeveyn"]);
  const hucreler = e1.flatMap((a, r) => e2.map((b, c) => ({ r, c, g: sirala([a, b]) })));
  const X0 = 124, Y0 = 52, CW = 92, CH = 60;
  const gor = (k: number) => !sure || u > 0.08 + k * 0.2;
  const hepsi = !sure || u >= 0.92;
  const fenler = hucreler.map((h) => fenotip(m, h.g));
  const yazGen = (g: string[]) => g.map((a, i) => <Alel key={i} a={a} />);
  const genYaz = sirala(e1);
  const genYaz2 = sirala(e2);
  // Oran satırları
  const say = (lst: string[]) => {
    const sira: string[] = [];
    const n: Record<string, number> = {};
    lst.forEach((x) => { if (!(x in n)) { sira.push(x); n[x] = 0; } n[x]++; });
    return sira.map((x) => [x, n[x]] as [string, number]);
  };
  const oran = (lst: [string, number][]) => (lst.length === 1 ? `hepsi ${lst[0][0]}` : lst.map(([x, n]) => `${n} ${x}`).join(" : "));
  const satirlar: React.ReactNode[] = [];
  if (m === "baskin" || m === "eksik") {
    const gs = say(hucreler.map((h) => h.g.join(""))).sort((a, b) => SIRA.indexOf(a[0][0]) - SIRA.indexOf(b[0][0]) || SIRA.indexOf(a[0][1]) - SIRA.indexOf(b[0][1]));
    const fs = say(fenler.map((f) => f.ad));
    satirlar.push(`Genotip: ${oran(gs)}`, `Fenotip: ${oran(fs)}`);
  } else if (m === "kan") {
    const fs = say(fenler.map((f) => f.ad));
    satirlar.push(`Kan grubu: ${fs.map(([x, n]) => `${x} (${kesir(n, 4)})`).join(", ")}`);
  } else {
    const kiz = fenler.filter((f) => !f.erkek), ogul = fenler.filter((f) => f.erkek);
    satirlar.push(`Kızlar: ${say(kiz.map((f) => f.ad)).map(([x, n]) => `${kesir(n, kiz.length)} ${x}`).join(", ")}`);
    satirlar.push(`Oğullar: ${say(ogul.map((f) => f.ad)).map(([x, n]) => `${kesir(n, ogul.length)} ${x}`).join(", ")}`);
  }
  const fenAd = (g: string[]) => fenotip(m, sirala(g)).ad;
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`${ad[0]} ${e1.join("")}, ${ad[1]} ${e2.join("")}. ${hepsi ? satirlar.join(". ") : "Punnett karesi dolduruluyor"}`}>
      <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
        <text x={X0 + CW} y={14} textAnchor="middle">{ad[1]}: <tspan fill="var(--ink)" fontWeight={800}>{yazGen(genYaz2)}</tspan> ({fenAd(e2)})</text>
        <text x={14} y={Y0 + CH - 6}>{ad[0]}:</text>
        <text x={14} y={Y0 + CH + 12} fill="var(--ink)" fontWeight={800}>{yazGen(genYaz)}</text>
        <text x={14} y={Y0 + CH + 28}>({fenAd(e1)})</text>
      </g>
      {/* gametler */}
      <g fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        {e2.map((a, c) => (
          <g key={`s${c}`}>
            <circle cx={X0 + CW * c + CW / 2} cy={34} r={14} fill="#fff" stroke="var(--line-2)" strokeWidth={1.4} />
            <text x={X0 + CW * c + CW / 2} y={39}><Alel a={a} /></text>
          </g>
        ))}
        {e1.map((a, r) => (
          <g key={`r${r}`}>
            <circle cx={X0 - 22} cy={Y0 + CH * r + CH / 2} r={14} fill="#fff" stroke="var(--line-2)" strokeWidth={1.4} />
            <text x={X0 - 22} y={Y0 + CH * r + CH / 2 + 5}><Alel a={a} /></text>
          </g>
        ))}
      </g>
      {/* hücreler */}
      {hucreler.map((h, k) => {
        const x = X0 + CW * h.c, y = Y0 + CH * h.r, f = fenler[k];
        return (
          <g key={k}>
            <rect x={x} y={y} width={CW} height={CH} fill="#fff" stroke="var(--line-2)" strokeWidth={1.4} />
            {gor(k) ? (
              <g className={sure ? "ad-belir" : undefined}>
                <Simge m={m} f={f} x={x + 22} y={y + CH / 2} />
                <text x={x + 40} y={y + CH / 2 + 5} fontSize={15} fontWeight={800} fill="var(--ink)">{yazGen(h.g)}</text>
              </g>
            ) : (
              <text x={x + CW / 2} y={y + CH / 2 + 6} fontSize={16} fontWeight={800} fill="var(--line-2)" textAnchor="middle">?</text>
            )}
          </g>
        );
      })}
      {hepsi && (
        <g className={sure ? "ad-belir" : undefined} fontSize={12.5} fontWeight={800} fill="var(--ink)">
          {satirlar.map((l, i) => <text key={i} x={14} y={204 + i * 22}>{l}</text>)}
        </g>
      )}
      {m === "x" && (
        <g fontSize={11} fontWeight={600} fill="var(--muted)">
          <circle cx={20} cy={250} r={5} fill="#fff" stroke="var(--ink)" strokeWidth={1.3} /><text x={30} y={254}>kız</text>
          <rect x={62} y={245} width={10} height={10} fill="#fff" stroke="var(--ink)" strokeWidth={1.3} /><text x={78} y={254}>oğul</text>
          <circle cx={122} cy={250} r={5} fill="var(--ink)" /><text x={132} y={254}>renk körü</text>
          <circle cx={204} cy={250} r={5} fill="#fff" stroke="var(--ink)" strokeWidth={1.3} /><circle cx={204} cy={250} r={1.8} fill="var(--ink)" /><text x={214} y={254}>taşıyıcı</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- kontrol çaprazlaması ---------- */

function Test({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure), basladi = oynuyor || t > 0;
  const mor = Math.round(((s.mor as number) ?? 52) * yumusak(u / 0.85)), beyaz = Math.round(((s.beyaz as number) ?? 48) * yumusak(u / 0.85));
  const MAX = 60, W = 200;
  const Cicek = ({ x, y, renk }: { x: number; y: number; renk: string }) => (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i * 72 - 90) * (Math.PI / 180);
        return <circle key={i} cx={x + 9 * Math.cos(a)} cy={y + 9 * Math.sin(a)} r={7.5} fill={renk} stroke={renk === "#fff" ? "var(--line-2)" : "none"} strokeWidth={1.2} />;
      })}
      <circle cx={x} cy={y} r={4} fill="var(--c4)" />
      <line x1={x} y1={y + 16} x2={x} y2={y + 40} stroke="var(--biyoloji)" strokeWidth={3} />
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={basladi ? `Yavrular: ${mor} mor, ${beyaz} beyaz` : "Mor bitki (genotipi bilinmiyor) ile beyaz bitki (aa) çaprazlanıyor"}>
      <Cicek x={92} y={40} renk="var(--c5)" />
      <text x={92} y={104} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">?</text>
      <text x={170} y={50} fontSize={20} fontWeight={700} fill="var(--muted)" textAnchor="middle">×</text>
      <Cicek x={248} y={40} renk="#fff" />
      <text x={248} y={104} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">aa</text>
      <line x1={20} y1={120} x2={320} y2={120} stroke="var(--line)" />
      <text x={20} y={142} fontSize={11.5} fontWeight={700} fill="var(--muted)">yavrular</text>
      {[{ ad: "mor", n: mor, renk: "var(--c5)", y: 158 }, { ad: "beyaz", n: beyaz, renk: "#e7ebf1", y: 196 }].map((b) => (
        <g key={b.ad}>
          <text x={20} y={b.y + 15} fontSize={12} fontWeight={700} fill="var(--ink)">{b.ad}</text>
          <rect x={70} y={b.y} width={W} height={22} rx={6} fill="none" stroke="var(--line)" />
          <rect x={70} y={b.y} width={Math.max(0, (b.n / MAX) * W)} height={22} rx={6} fill={b.renk} />
          <text x={320} y={b.y + 16} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="end">{basladi ? b.n : "?"}</text>
        </g>
      ))}
    </svg>
  );
}

export const BIYOLOJI5: Record<string, SahneKaydi> = {
  "biy5-kusak": { C: Kusak },
  "biy5-homolog": { C: Homolog },
  "biy5-krossing": { C: Krossing },
  "biy5-mayoz": { C: Mayoz },
  "biy5-dagilim": { C: Dagilim },
  "biy5-ayrilmama": { C: Ayrilmama },
  "biy5-karsilastir": { C: Karsilastir },
  "biy5-punnett": { C: Punnett },
  "biy5-test": { C: Test },
};
