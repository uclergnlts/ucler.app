"use client";
// Fizik sahneleri (fizik bilimine giriş, madde ve özellikleri): düşme deneyi, birimle ölçme, SI tablosu,
// sürat, yön; terazi, dereceli silindir, kütle-hacim grafiği, yüzme-batma, karışım ve kılcallık.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";
import { Tutamac, useSurukle } from "./soruonce";

const say = (x: number, d = 2) => x.toLocaleString("tr-TR", { maximumFractionDigits: d });
const say2 = (x: number) => x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------- fizik bilimine giriş ---------- */

// Çelik bilye ve tüy aynı anda bırakılır (sure 2). v.hava: 1 ise tüp havalı.
function Dusme({ v, t, oynuyor }: SahneProps) {
  const hava = v.hava === 1;
  const Y0 = 46, YER = 200, TD = 1.1; // TD: bilyenin yere varma süresi
  const bilyeY = Y0 + (YER - 13 - Y0) * Math.min(1, (t / TD) ** 2);
  const tuyH = YER - 16 - Y0;
  const tuyY = hava ? Y0 + Math.min(tuyH, 42 * t) : Y0 + tuyH * Math.min(1, (t / TD) ** 2);
  const salin = hava ? Math.sin(t * 4.5) : 0;
  const durum = (yerde: boolean) => (yerde ? "yere değdi" : oynuyor ? "düşüyor" : "");
  const bilyeYerde = t >= TD, tuyYerde = !hava && t >= TD;
  return (
    <svg viewBox="0 0 340 244" role="img" aria-label={`${hava ? "Havalı" : "Havasız"} tüpte çelik bilye ve tüy düşüyor`}>
      <text x={170} y={20} fontSize={12.5} fontWeight={700} fill={hava ? "var(--c1)" : "var(--muted)"} textAnchor="middle">
        {hava ? "Tüpte hava var" : "Tüpte hava yok (vakum)"}
      </text>
      {hava && (
        <g fill="var(--line-2)">
          {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={52 + ((i * 67) % 236)} cy={40 + ((i * 41) % 150)} r={2} />)}
        </g>
      )}
      <line x1={40} x2={300} y1={YER} y2={YER} stroke="var(--ink)" strokeWidth={2} />
      <g>
        <circle cx={110} cy={bilyeY} r={13} fill="#7d8da3" />
        <circle cx={106} cy={bilyeY - 4} r={3.5} fill="#fff" opacity={0.6} />
      </g>
      <g transform={`translate(${230 + 12 * salin} ${tuyY}) rotate(${hava ? 70 + 20 * salin : 0})`}>
        <path d="M0 -16 C9 -10 9 8 0 16 C-9 8 -9 -10 0 -16 Z" fill="var(--c4)" />
        <line x1={0} y1={-16} x2={0} y2={20} stroke="#b7800d" strokeWidth={1.4} />
      </g>
      <g fontSize={12} textAnchor="middle">
        <text x={110} y={220} fontWeight={700} fill="var(--ink)">çelik bilye</text>
        <text x={230} y={220} fontWeight={700} fill="var(--ink)">tüy</text>
        <text x={110} y={237} fill={bilyeYerde ? "var(--good)" : "var(--muted)"}>{durum(bilyeYerde)}</text>
        <text x={230} y={237} fill={tuyYerde ? "var(--good)" : "var(--muted)"}>{durum(tuyYerde)}</text>
      </g>
    </svg>
  );
}

// 1,5 m'lik masa ve 25 cm'lik çubuklar. v.n: dizilen çubuk sayısı.
function Birim({ v }: SahneProps) {
  const n = v.n ?? 1, X0 = 30, W = 40; // 40 px = 25 cm
  const tam = n === 6;
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label={`Masa ve ${n} çubuk: ${n * 25} cm`}>
      <text x={X0} y={46} fontSize={12} fontWeight={700} fill="var(--muted)">masa</text>
      <rect x={X0} y={54} width={240} height={26} rx={4} fill="var(--c4)" opacity={0.85} />
      <line x1={X0 + 240} x2={X0 + 240} y1={54} y2={132} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="3 3" />
      <g>
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={X0 + i * W + 1} y={98} width={W - 2} height={18} rx={3} fill="var(--c1)" opacity={i % 2 ? 0.55 : 1} />
        ))}
      </g>
      <text x={X0} y={140} fontSize={12} fill="var(--muted)">1 çubuk = 25 cm</text>
      <text x={170} y={176} fontSize={15} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        {tam ? "Masa = 6 çubuk = 150 cm = 1,5 m" : `${n} çubuk = ${n * 25} cm${n < 6 ? ": masaya yetmiyor" : ": masayı aştı"}`}
      </text>
    </svg>
  );
}

const SI = [
  ["uzunluk", "m", "metre"], ["kütle", "kg", "kilogram"], ["zaman", "s", "saniye"],
  ["elektrik akımı", "A", "amper"], ["sıcaklık", "K", "kelvin"], ["madde miktarı", "mol", "mol"],
  ["ışık şiddeti", "cd", "kandela"],
];

function SiTablo() {
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label="SI'daki yedi temel büyüklük ve birimleri">
      {SI.map(([ad, s, birim], i) => {
        const x = i < 6 ? 10 + (i % 3) * 110 : 120, y = 6 + Math.floor(i / 3) * 70;
        return (
          <g key={ad}>
            <rect x={x} y={y} width={100} height={64} rx={10} fill="var(--fizik-soft)" />
            <text x={x + 50} y={y + 18} fontSize={11.5} fill="var(--muted)" textAnchor="middle" fontWeight={600}>{ad}</text>
            <text x={x + 50} y={y + 42} fontSize={21} fill="var(--fizik)" textAnchor="middle" fontWeight={800}>{s}</text>
            <text x={x + 50} y={y + 57} fontSize={11} fill="var(--muted)" textAnchor="middle">{birim}</text>
          </g>
        );
      })}
    </svg>
  );
}

// 100 m koşu. v.t: süre (s). Her saniyenin sonundaki konum bir noktayla gösterilir.
function Kosu({ v }: SahneProps) {
  const T = v.t ?? 20, hiz = 100 / T, X0 = 30, PX = 2.8;
  const tam = T === 10;
  return (
    <svg viewBox="0 0 340 204" role="img" aria-label={`100 metre ${T} saniyede: sürat ${say(hiz)} m/s`}>
      <text x={170} y={30} fontSize={12} fill="var(--muted)" textAnchor="middle">Her nokta: koşucunun bir saniye sonraki yeri</text>
      <line x1={X0} x2={X0 + 100 * PX} y1={92} y2={92} stroke="var(--line-2)" strokeWidth={6} strokeLinecap="round" />
      <g>
        <line x1={X0 + 100 * PX} x2={X0 + 100 * PX} y1={56} y2={100} stroke="var(--ink)" strokeWidth={2} />
        <path d={`M${X0 + 100 * PX} 56 L${X0 + 100 * PX - 18} 62 L${X0 + 100 * PX} 68 Z`} fill="var(--c2)" />
      </g>
      <g>
        {Array.from({ length: Math.floor(T) }, (_, k) => (
          <circle key={k} cx={X0 + (k + 1) * hiz * PX} cy={92} r={4.5} fill={tam ? "var(--good)" : "var(--c1)"} />
        ))}
      </g>
      <g fontSize={11} fill="var(--muted)" textAnchor="middle">
        <text x={X0} y={118}>0 m</text>
        <text x={X0 + 100 * PX} y={118}>100 m</text>
      </g>
      <text x={170} y={160} fontSize={16} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        sürat = 100 m ÷ {T} s = {say(hiz)} m/s
      </text>
      <text x={170} y={184} fontSize={12} fill="var(--muted)" textAnchor="middle">Her saniyede {say(hiz)} m yol</text>
    </svg>
  );
}

const YONLER = ["kuzey", "kuzeydoğu", "doğu", "güneydoğu", "güney", "güneybatı", "batı", "kuzeybatı"];

// Evden 3 km yürüyüş. v.yon: kuzeyden saat yönünde açı (derece). Okul kuzeydoğuda.
// s.surukle: öğrenci oku tutup çevirir (45°'lik adımlarla).
function Yon({ s, v, set }: SahneProps) {
  const a = v.yon ?? 0, CX = 170, CY = 124, R = 82;
  const surukle = s.surukle === true;
  const { svg, olaylar, dokundu } = useSurukle((q) => {
    const d = (Math.atan2(q.x - CX, CY - q.y) * 180) / Math.PI;
    set("yon", ((Math.round(d / 45) * 45) % 360 + 360) % 360);
  });
  const r = (a * Math.PI) / 180, ex = CX + R * Math.sin(r), ey = CY - R * Math.cos(r);
  const ox = CX + R * Math.SQRT1_2, oy = CY - R * Math.SQRT1_2;
  const vardi = a === 45, renk = vardi ? "var(--good)" : "var(--c1)";
  const ux = Math.sin(r), uy = -Math.cos(r), bx = ex - ux * 11, by = ey - uy * 11;
  return (
    <svg
      ref={svg} viewBox="0 0 340 262" className={surukle ? "ad-surukle" : undefined} role="img"
      aria-label={`3 km ${YONLER[Math.round(a / 45) % 8]} yönünde yürüyüş`} {...(surukle ? olaylar : {})}
    >
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--line-2)" strokeWidth={1.5} strokeDasharray="4 5" />
      <g fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={CX} y={CY - R - 12}>K</text>
        <text x={CX + R + 16} y={CY + 4}>D</text>
        <text x={CX} y={CY + R + 22}>G</text>
        <text x={CX - R - 16} y={CY + 4}>B</text>
      </g>
      <g>
        <rect x={ox - 9} y={oy - 8} width={18} height={14} rx={2} fill="var(--c2)" />
        <path d={`M${ox - 11} ${oy - 7} L${ox} ${oy - 16} L${ox + 11} ${oy - 7} Z`} fill="var(--c2)" />
        <text x={ox + 16} y={oy - 2} fontSize={12} fontWeight={700} fill="var(--c2)">okul</text>
      </g>
      <g>
        <path d={`M${CX - 8} ${CY + 2} L${CX} ${CY - 6} L${CX + 8} ${CY + 2} L${CX + 8} ${CY + 9} L${CX - 8} ${CY + 9} Z`} fill="var(--ink)" />
        <text x={CX - 12} y={CY + 22} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="end">ev</text>
      </g>
      <g>
        <line x1={CX + ux * 10} y1={CY + uy * 10} x2={bx} y2={by} stroke={renk} strokeWidth={3.5} strokeLinecap="round" />
        <path d={`M${ex} ${ey} L${bx - uy * 6} ${by + ux * 6} L${bx + uy * 6} ${by - ux * 6} Z`} fill={renk} />
      </g>
      {surukle && <Tutamac x={CX + ux * R * 0.62} y={CY + uy * R * 0.62} nabiz={!dokundu} />}
      <text x={CX} y={252} fontSize={14} fontWeight={800} textAnchor="middle" fill={renk}>
        3 km, {YONLER[Math.round(a / 45) % 8]}{vardi ? ": okula vardın" : ""}
      </text>
    </svg>
  );
}

/* ---------- madde ve özellikleri ---------- */

// Eşit kollu terazi: 1 kg demir ve 1 kg pamuk (sure 3). Oynayınca destekler çekilir, kefeler salınıp durur.
function Terazi({ t, oynuyor }: SahneProps) {
  const serbest = oynuyor || t > 0;
  const aci = serbest ? 9 * Math.sin(t * 5) * Math.exp(-1.6 * t) : 0;
  const PX = 170, PY = 64, L = 110, ip = 62;
  const r = (aci * Math.PI) / 180;
  const sol = { x: PX - L * Math.cos(r), y: PY - L * Math.sin(r) }, sag = { x: PX + L * Math.cos(r), y: PY + L * Math.sin(r) };
  const kefe = (x: number, y: number) => (
    <g>
      <line x1={x - 28} y1={y + ip} x2={x} y2={y} stroke="var(--muted)" strokeWidth={1.2} />
      <line x1={x + 28} y1={y + ip} x2={x} y2={y} stroke="var(--muted)" strokeWidth={1.2} />
      <path d={`M${x - 36} ${y + ip} Q${x} ${y + ip + 16} ${x + 36} ${y + ip} Z`} fill="var(--ink)" />
    </g>
  );
  const pamuk = [[-22, -9, 11], [-8, -14, 13], [8, -13, 12], [22, -8, 10], [-14, -24, 10], [4, -27, 11], [16, -22, 9]];
  const bitti = !oynuyor && t > 0;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Eşit kollu terazide 1 kg demir ve 1 kg pamuk">
      <g>
        <line x1={PX} x2={PX} y1={PY} y2={196} stroke="var(--ink)" strokeWidth={4} />
        <rect x={PX - 40} y={194} width={80} height={8} rx={3} fill="var(--ink)" />
      </g>
      {!serbest && (
        <g fill="var(--line-2)">
          <rect x={sol.x - 5} y={PY + ip + 9} width={10} height={202 - PY - ip - 9} />
          <rect x={sag.x - 5} y={PY + ip + 9} width={10} height={202 - PY - ip - 9} />
        </g>
      )}
      <line x1={sol.x} y1={sol.y} x2={sag.x} y2={sag.y} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
      <circle cx={PX} cy={PY} r={5} fill="var(--c4)" />
      {kefe(sol.x, sol.y)}
      {kefe(sag.x, sag.y)}
      <rect x={sol.x - 13} y={sol.y + ip - 16} width={26} height={18} rx={2} fill="#7d8da3" />
      <g fill="#fff" stroke="var(--line-2)" strokeWidth={1.2}>
        {pamuk.map(([dx, dy, rr], i) => <circle key={i} cx={sag.x + dx} cy={sag.y + ip + dy} r={rr} />)}
      </g>
      <g fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">
        <text x={sol.x} y={sol.y - 12}>1 kg demir</text>
        <text x={sag.x} y={sag.y - 12}>1 kg pamuk</text>
      </g>
      <text x={PX} y={226} fontSize={13} fontWeight={800} textAnchor="middle" fill={bitti ? "var(--good)" : "var(--muted)"}>
        {bitti ? "Dengede: kütleler eşit" : ""}
      </text>
    </svg>
  );
}

// Dereceli silindirde su; terazi yalnızca suyun kütlesini gösterir. v.V: hacim (cm³).
function Silindir({ v }: SahneProps) {
  const V = v.V ?? 20, m = V, ALT = 186, K = 1.4; // 1 cm³ = 1,4 px
  const tam = m === 50;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${V} cm³ su, kütlesi ${m} g`}>
      <rect x={112} y={ALT - V * K} width={56} height={V * K} fill="var(--c1)" opacity={0.3} />
      <path d={`M110 ${ALT - 150} L110 ${ALT} L170 ${ALT} L170 ${ALT - 150}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g stroke="var(--muted)" strokeWidth={1}>
        {Array.from({ length: 10 }, (_, i) => <line key={i} x1={160} x2={170} y1={ALT - (i + 1) * 10 * K} y2={ALT - (i + 1) * 10 * K} />)}
      </g>
      <g fontSize={11} fill="var(--muted)">
        {[20, 40, 60, 80, 100].map((x) => <text key={x} x={176} y={ALT - x * K + 4}>{x}</text>)}
      </g>
      <g>
        <rect x={84} y={ALT + 2} width={112} height={6} rx={2} fill="var(--ink)" />
        <rect x={92} y={ALT + 8} width={96} height={30} rx={6} fill="var(--ink)" />
        <text x={140} y={ALT + 29} fontSize={15} fontWeight={800} fill="#fff" textAnchor="middle">{m} g</text>
      </g>
      <g fontSize={13} fontWeight={700}>
        <text x={224} y={78} fill="var(--c1)">V = {V} cm³</text>
        <text x={224} y={102} fill={tam ? "var(--good)" : "var(--ink)"}>m = {m} g</text>
        <line x1={224} x2={330} y1={118} y2={118} stroke="var(--line)" />
        <text x={224} y={142} fill="var(--fizik)">m / V = 1 g/cm³</text>
      </g>
    </svg>
  );
}

// Kütle-hacim grafiği: A (2,7), B (1), C (0,5) g/cm³. Doğrular kendiliğinden çizilir.
function MvGrafik() {
  const x0 = 50, x1 = 300, y0 = 24, y1 = 190, VM = 40, MM = 120;
  const gx = (V: number) => x0 + (V / VM) * (x1 - x0), gy = (m: number) => y1 - (m / MM) * (y1 - y0);
  const dogru = [
    { ad: "A", d: 2.7, renk: "var(--c2)" },
    { ad: "B", d: 1, renk: "var(--c1)" },
    { ad: "C", d: 0.5, renk: "var(--c3)" },
  ];
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label="Üç maddenin kütle-hacim grafiği: A en dik, C en yatık">
      <g>
        {[20, 40, 60, 80, 100, 120].map((m) => (
          <g key={m}>
            <line x1={x0} x2={x1} y1={gy(m)} y2={gy(m)} stroke="var(--line)" />
            <text x={x0 - 6} y={gy(m) + 4} fontSize={11} fill="var(--muted)" textAnchor="end">{m}</text>
          </g>
        ))}
        {[10, 20, 30, 40].map((V) => <text key={V} x={gx(V)} y={y1 + 15} fontSize={11} fill="var(--muted)" textAnchor="middle">{V}</text>)}
        <line x1={x0} x2={x1 + 8} y1={y1} y2={y1} stroke="var(--ink)" strokeWidth={1.4} />
        <line x1={x0} x2={x0} y1={y0 - 10} y2={y1} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={x0 + 6} y={y0 - 8} fontSize={11} fontWeight={700} fill="var(--ink)">m (g)</text>
        <text x={x1 + 8} y={y1 + 30} fontSize={11} fontWeight={700} fill="var(--ink)" textAnchor="end">V (cm³)</text>
      </g>
      {dogru.map((o) => (
        <line key={o.ad} x1={gx(0)} y1={gy(0)} x2={gx(VM)} y2={gy(o.d * VM)} stroke={o.renk} strokeWidth={3} strokeLinecap="round" />
      ))}
      <g fontSize={14} fontWeight={800}>
        {dogru.map((o) => <text key={o.ad} x={gx(VM) + 8} y={gy(o.d * VM) + 5} fill={o.renk}>{o.ad}</text>)}
      </g>
    </svg>
  );
}

// Suya konan küp. v.d: özkütle × 10 (g/cm³).
function Yuzme({ v }: SahneProps) {
  const d = (v.d ?? 6) / 10, SU = 84, TABAN = 204, K = 52;
  const ust = d < 1 ? SU + d * K - K : d === 1 ? (SU + TABAN) / 2 - K / 2 : TABAN - K;
  const hal = d < 1 ? "Yüzer: cisim sudan az yoğun" : d === 1 ? "Askıda: özkütleler eşit" : "Batar: cisim sudan yoğun";
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Özkütlesi ${say(d)} g/cm³ olan cisim. ${hal}`}>
      <rect x={62} y={SU} width={216} height={TABAN - SU} fill="var(--c1)" opacity={0.16} />
      <path d={`M60 46 L60 ${TABAN + 2} L280 ${TABAN + 2} L280 46`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <line x1={62} x2={278} y1={SU} y2={SU} stroke="var(--c1)" strokeWidth={2} />
      <text x={272} y={SU + 18} fontSize={11.5} fontWeight={700} fill="var(--c1)" textAnchor="end">su: 1 g/cm³</text>
      <g>
        <rect x={170 - K / 2} y={ust} width={K} height={K} rx={4} fill="var(--c4)" />
        <text x={170} y={ust + K / 2 + 5} fontSize={12} fontWeight={800} fill="#fff" textAnchor="middle">{say(d)}</text>
      </g>
      <text x={170} y={230} fontSize={13.5} fontWeight={800} textAnchor="middle" fill={d === 1 ? "var(--good)" : "var(--ink)"}>{hal}</text>
    </svg>
  );
}

// 100 cm³ su + v.a cm³ alkol (0,8 g/cm³). Hacimler toplanır (yaklaşım).
function Karisim({ v }: SahneProps) {
  const a = v.a ?? 0, m = 100 + 0.8 * a, Vt = 100 + a, d = m / Vt;
  const ALT = 176, K = 0.5, KK = 0.3; // küçük kaplarda 0,5 px/cm³, karışım kabında 0,3 px/cm³
  const kap = (x: number, w: number, h: number) => <path d={`M${x} ${ALT - h} L${x} ${ALT} L${x + w} ${ALT} L${x + w} ${ALT - h}`} fill="none" stroke="var(--ink)" strokeWidth={2} />;
  const tam = a === 100;
  return (
    <svg viewBox="0 0 340 262" role="img" aria-label={`100 cm³ su ve ${a} cm³ alkol: karışımın özkütlesi ${say2(d)} g/cm³`}>
      <rect x={31} y={ALT - 100 * K} width={58} height={100 * K} fill="var(--c1)" opacity={0.35} />
      {a > 0 && <rect x={111} y={ALT - a * K} width={58} height={a * K} fill="var(--c5)" opacity={0.3} />}
      <g>
        <rect x={211} y={ALT - Vt * KK} width={98} height={Vt * KK} fill="var(--c1)" opacity={0.3} />
        {a > 0 && <rect x={211} y={ALT - Vt * KK} width={98} height={Vt * KK} fill="var(--c5)" opacity={(0.3 * a) / Vt} />}
      </g>
      {kap(30, 60, 104)}
      {kap(110, 60, 104)}
      {kap(210, 100, 104)}
      <g fontSize={20} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        <text x={100} y={150}>+</text>
        <text x={190} y={150}>=</text>
      </g>
      <g fontSize={11.5} textAnchor="middle">
        <text x={60} y={196} fontWeight={700} fill="var(--c1)">su 100 cm³</text>
        <text x={140} y={196} fontWeight={700} fill="var(--c5)">alkol {a} cm³</text>
        <text x={260} y={196} fontWeight={700} fill="var(--ink)">karışım {Vt} cm³</text>
        <text x={60} y={213} fill="var(--muted)">100 g</text>
        <text x={140} y={213} fill="var(--muted)">{say(0.8 * a)} g</text>
        <text x={260} y={213} fill="var(--muted)">{say(m)} g</text>
      </g>
      <text x={170} y={248} fontSize={15} fontWeight={800} textAnchor="middle" fill={tam ? "var(--good)" : "var(--ink)"}>
        d = {say(m)} g ÷ {Vt} cm³ = {say2(d)} g/cm³
      </text>
    </svg>
  );
}

// Üç cam boru suya daldırılır (sure 3); su ince boruda en çok yükselir (h ∝ 1/r).
function Kilcal({ t, oynuyor }: SahneProps) {
  const SU = 176, k = oynuyor || t > 0 ? yumusak(t / 2.6) : 0;
  const borular = [{ x: 90, w: 4, ad: "ince" }, { x: 170, w: 8, ad: "orta" }, { x: 250, w: 16, ad: "kalın" }];
  return (
    <svg viewBox="0 0 340 234" role="img" aria-label="Farklı kalınlıkta üç cam boruda suyun yükselmesi">
      <rect x={30} y={SU} width={280} height={44} fill="var(--c1)" opacity={0.2} />
      <line x1={30} x2={310} y1={SU} y2={SU} stroke="var(--c1)" strokeWidth={2} />
      <g>
        {borular.map((b) => {
          const h = (104 * 4) / b.w * k;
          return <rect key={b.ad} x={b.x - b.w / 2} y={SU - h} width={b.w} height={h + 30} fill="var(--c1)" opacity={0.5} />;
        })}
      </g>
      <g stroke="var(--ink)" strokeWidth={1.6}>
        {borular.map((b) => (
          <g key={b.ad}>
            <line x1={b.x - b.w / 2 - 1.5} x2={b.x - b.w / 2 - 1.5} y1={40} y2={206} />
            <line x1={b.x + b.w / 2 + 1.5} x2={b.x + b.w / 2 + 1.5} y1={40} y2={206} />
          </g>
        ))}
      </g>
      <g fontSize={12} fontWeight={700} fill="var(--muted)" textAnchor="middle">
        {borular.map((b) => <text key={b.ad} x={b.x} y={30}>{b.ad}</text>)}
      </g>
      {!oynuyor && t > 0 && (
        <text x={170} y={232} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--good)">Boru inceldikçe su daha çok yükselir</text>
      )}
    </svg>
  );
}

export const FIZIK1: Record<string, SahneKaydi> = {
  "fiz-dusme": { C: Dusme },
  "fiz-birim": { C: Birim },
  "fiz-si-tablo": { C: SiTablo },
  "fiz-kosu": { C: Kosu },
  "fiz-yon": { C: Yon },
  "fiz-terazi": { C: Terazi },
  "fiz-silindir": { C: Silindir },
  "fiz-mv-grafik": { C: MvGrafik },
  "fiz-yuzme": { C: Yuzme },
  "fiz-karisim": { C: Karisim },
  "fiz-kilcal": { C: Kilcal },
};
