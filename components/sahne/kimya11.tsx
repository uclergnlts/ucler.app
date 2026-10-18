"use client";
// Kimya sahneleri (organik kimyaya giriş, hidrokarbonlar): karbonun dört bağı, hibritleşme ve bağ açıları,
// σ ve π sayma, formül türleri, zincir izomerliği, cis-trans; alkan serisi, dallanma ve kaynama noktası,
// en uzun zinciri bulma, alkini doyurma, bromlu su testi, benzen rezonansı ve pentanın yanması.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const ALT = "₀₁₂₃₄₅₆₇₈₉";
/** Sayıyı alt simge yapar: 10 → ₁₀. */
const alt = (n: number) => String(n).split("").map((c) => ALT[Number(c)]).join("");
const BROM = "#c8641e";

type Nokta = [number, number];

/** İki atom arasında n çizgilik bağ. Çizgiler eksene dik kaydırılır; renkler çizgi başınadır. */
function Bag({ a, b, n = 1, renk = "var(--ink)", renkler, kesik = false, kalin = 2.4 }: { a: Nokta; b: Nokta; n?: number; renk?: string; renkler?: string[]; kesik?: boolean; kalin?: number }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
  const kay = n === 1 ? [0] : n === 2 ? [-3.6, 3.6] : [-5.4, 0, 5.4];
  return (
    <g>
      {kay.map((k, i) => (
        <line key={i} x1={a[0] + nx * k} y1={a[1] + ny * k} x2={b[0] + nx * k} y2={b[1] + ny * k} stroke={renkler?.[i] ?? renk} strokeWidth={kalin} strokeLinecap="round" strokeDasharray={kesik ? "4 4" : undefined} />
      ))}
    </g>
  );
}

/** Atom: C koyu, H açık, Cl yeşil. */
function Atom({ p, el, renk }: { p: Nokta; el: string; renk?: string }) {
  const c = el === "C", h = el === "H";
  const r = c ? 14 : h ? 10 : 13;
  const dolgu = renk ?? (c ? "var(--ink)" : h ? "var(--panel)" : "var(--c3)");
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={r} fill={dolgu} stroke={h && !renk ? "var(--line-2)" : "none"} strokeWidth={1.2} />
      <text x={p[0]} y={p[1] + (h ? 4 : 4.5)} fontSize={h ? 11 : 12.5} fontWeight={800} textAnchor="middle" fill={h && !renk ? "var(--ink)" : "#fff"}>{el}</text>
    </g>
  );
}

/** Boşta kalan bağ: kesik çizgi ve uçta küçük halka. */
function Bos({ a, b }: { a: Nokta; b: Nokta }) {
  const u: Nokta = [a[0] + (b[0] - a[0]) * 0.72, a[1] + (b[1] - a[1]) * 0.72];
  return (
    <g>
      <line x1={a[0]} y1={a[1]} x2={u[0]} y2={u[1]} stroke="var(--bad)" strokeWidth={2} strokeDasharray="3 3" />
      <circle cx={u[0]} cy={u[1]} r={4} fill="var(--surface)" stroke="var(--bad)" strokeWidth={1.6} />
    </g>
  );
}

/* ---------- karbonun dört bağı ---------- */

function DortBag({ s, v }: SahneProps) {
  const eten = s.mod === "eten";
  if (!eten) {
    const h = Math.max(0, Math.min(4, v.h ?? 0)), C: Nokta = [170, 108];
    const yer: Nokta[] = [[170, 48], [232, 108], [170, 168], [108, 108]];
    const tamam = h === 4;
    return (
      <svg viewBox="0 0 340 228" role="img" aria-label={`C atomuna ${h} H bağlı, ${4 - h} bağ boşta`}>
        <text x={170} y={24} fontSize={18} fontWeight={800} textAnchor="middle" fill="var(--ink)">{h ? `CH${h > 1 ? alt(h) : ""}` : "C"}</text>
        <g>
          {yer.map((p, i) => (i < h ? <Bag key={i} a={C} b={p} /> : <Bos key={i} a={C} b={p} />))}
        </g>
        <g>
          <Atom p={C} el="C" />
          {yer.slice(0, h).map((p, i) => <Atom key={i} p={p} el="H" />)}
        </g>
        <text x={170} y={202} fontSize={13} fontWeight={800} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--ink)"}>Bağ sayısı: {h} / 4</text>
        <text x={170} y={221} fontSize={12} fontWeight={700} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--bad)"}>
          {tamam ? "CH₄ (metan): dört bağ tamam, oktet dolu" : `${4 - h} bağ boşta: bu yapı kararsız`}
        </text>
      </svg>
    );
  }
  const h = Math.max(0, Math.min(3, v.h ?? 0)), A: Nokta = [134, 104], B: Nokta = [206, 104];
  const sol: Nokta[] = [[96, 58], [96, 150], [80, 104]], sag: Nokta[] = [[244, 58], [244, 150], [260, 104]];
  const bag = 2 + h, fazla = h > 2;
  const yuva = (c: Nokta, ys: Nokta[]) => ys.map((p, i) => (i < h ? <Bag key={i} a={c} b={p} renk={i === 2 ? "var(--bad)" : "var(--ink)"} /> : i < 2 ? <Bos key={i} a={c} b={p} /> : null));
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={`C=C, her karbonda ${h} H: ${bag} bağ`}>
      <text x={170} y={24} fontSize={18} fontWeight={800} textAnchor="middle" fill={fazla ? "var(--bad)" : "var(--ink)"}>C₂{h ? `H${alt(2 * h)}` : ""}{fazla ? " ?" : ""}</text>
      <g>
        <Bag a={A} b={B} n={2} />
        {yuva(A, sol)}
        {yuva(B, sag)}
      </g>
      <g>
        <Atom p={A} el="C" />
        <Atom p={B} el="C" />
        {[sol, sag].map((ys, j) => ys.slice(0, h).map((p, i) => <Atom key={`${j}${i}`} p={p} el="H" renk={i === 2 ? "var(--bad)" : undefined} />))}
      </g>
      <text x={170} y={202} fontSize={13} fontWeight={800} textAnchor="middle" fill={h === 2 ? "var(--good)" : "var(--ink)"}>Her C: 2 (C=C) + {h} H = {bag} bağ</text>
      <text x={170} y={221} fontSize={12} fontWeight={700} textAnchor="middle" fill={h === 2 ? "var(--good)" : "var(--bad)"}>
        {h === 2 ? "C₂H₄ (eten): her karbon dört bağ yaptı" : fazla ? "Beş bağ olmaz: C en fazla dört bağ yapar" : `Her karbonda ${2 - h} bağ boşta`}
      </text>
    </svg>
  );
}

/* ---------- hibritleşme ve bağ açısı ---------- */

const HIBRIT = [
  { hib: "sp³", aci: "109,5°", geo: "düzgün dörtyüzlü", ornek: "CH₄ (metan): dört tekli bağ" },
  { hib: "sp²", aci: "120°", geo: "düzlem üçgen", ornek: "C₂H₄ (eten): bir ikili bağ" },
  { hib: "sp", aci: "180°", geo: "doğrusal", ornek: "C₂H₂ (etin): bir üçlü bağ" },
];

function Hibrit({ v }: SahneProps) {
  const b = Math.max(1, Math.min(3, v.b ?? 1)), h = HIBRIT[b - 1];
  const yay = { stroke: "var(--kimya)", strokeWidth: 2, fill: "none" };
  const etiket = { fontSize: 13, fontWeight: 800, fill: "var(--kimya)" } as const;
  let mol: React.ReactNode;
  if (b === 1) {
    const C: Nokta = [170, 96];
    mol = (
      <g>
        <Bag a={C} b={[170, 38]} />
        <Bag a={C} b={[116, 124]} />
        <Bag a={C} b={[226, 112]} kesik />
        <polygon points="170,96 188,150 199,145" fill="var(--ink)" />
        <path d="M170 74 A22 22 0 0 0 150.5 106.1" {...yay} />
        <text x={146} y={72} textAnchor="end" {...etiket}>{h.aci}</text>
        <Atom p={C} el="C" />
        {([[170, 38], [116, 124], [226, 112], [194, 150]] as Nokta[]).map((p, i) => <Atom key={i} p={p} el="H" />)}
      </g>
    );
  } else if (b === 2) {
    const A: Nokta = [136, 96], B: Nokta = [204, 96];
    const hs: Nokta[] = [[106, 44], [106, 148], [234, 44], [234, 148]];
    mol = (
      <g>
        <Bag a={A} b={B} n={2} />
        {hs.map((p, i) => <Bag key={i} a={i < 2 ? A : B} b={p} />)}
        <path d="M126 78.7 A20 20 0 0 0 126 113.3" {...yay} />
        <text x={110} y={100} textAnchor="end" {...etiket}>{h.aci}</text>
        <Atom p={A} el="C" />
        <Atom p={B} el="C" />
        {hs.map((p, i) => <Atom key={i} p={p} el="H" />)}
      </g>
    );
  } else {
    const A: Nokta = [134, 100], B: Nokta = [206, 100];
    mol = (
      <g>
        <Bag a={A} b={B} n={3} />
        <Bag a={[76, 100]} b={A} />
        <Bag a={B} b={[264, 100]} />
        <path d="M110 100 A24 24 0 0 1 158 100" {...yay} />
        <text x={134} y={64} textAnchor="middle" {...etiket}>{h.aci}</text>
        <Atom p={A} el="C" />
        <Atom p={B} el="C" />
        <Atom p={[76, 100]} el="H" />
        <Atom p={[264, 100]} el="H" />
      </g>
    );
  }
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${h.hib}: ${h.aci}, ${h.geo}`}>
      {mol}
      <text x={170} y={184} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--ink)">{h.hib} · {h.aci} · {h.geo}</text>
      <text x={170} y={205} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{h.ornek}</text>
    </svg>
  );
}

/* ---------- σ ve π sayma: propin ---------- */

function SigmaPi({ v }: SahneProps) {
  const s = v.s ?? 0, p = v.p ?? 0, tamam = s === 6 && p === 2;
  const S = tamam ? "var(--c1)" : "var(--ink)", P = tamam ? "var(--c2)" : "var(--ink)";
  const H0: Nokta = [40, 92], C1: Nokta = [96, 92], C2: Nokta = [172, 92], C3: Nokta = [240, 92];
  const hs: Nokta[] = [[240, 40], [240, 144], [296, 92]];
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={tamam ? "Propin: 6 sigma, 2 pi bağı" : `Propin; senin sayın ${s} sigma, ${p} pi`}>
      <text x={170} y={20} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">propin: HC≡C–CH₃</text>
      <g>
        <Bag a={H0} b={C1} renk={S} />
        <Bag a={C1} b={C2} n={3} renkler={[P, S, P]} />
        <Bag a={C2} b={C3} renk={S} />
        {hs.map((h, i) => <Bag key={i} a={C3} b={h} renk={S} />)}
      </g>
      <g>
        <Atom p={H0} el="H" />
        <Atom p={C1} el="C" />
        <Atom p={C2} el="C" />
        <Atom p={C3} el="C" />
        {hs.map((h, i) => <Atom key={i} p={h} el="H" />)}
      </g>
      <text x={170} y={182} fontSize={14} fontWeight={800} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--ink)"}>
        Senin sayın: <tspan fill="var(--c1)">{s} σ</tspan> + <tspan fill="var(--c2)">{p} π</tspan>
      </text>
      <text x={170} y={204} fontSize={12} fontWeight={700} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--muted)"}>
        {tamam ? "Her bağda bir σ (mavi); üçlüde iki π (kırmızı)" : "İki atom arasındaki ilk bağ σ, fazlası π"}
      </text>
    </svg>
  );
}

/* ---------- formül türleri: bütan ---------- */

const FORMUL_TUR = ["açık", "yarı açık", "iskelet", "kapalı", "basit"];
const FORMUL_NOT = [
  "Bütün atomlar ve bütün bağlar görünür.",
  "Karbon zinciri gruplarla yazılır.",
  "Her köşe ve uç bir C; C'ye bağlı H'ler yazılmaz.",
  "Yalnızca atom sayıları: 4 C, 10 H.",
  "En küçük tam sayılı oran: 4 : 10 = 2 : 5.",
];

function Formul({ v, set }: SahneProps) {
  const f = Math.max(0, Math.min(4, v.f ?? 0));
  const W = 320 / 5;
  let ciz: React.ReactNode;
  if (f === 0) {
    const cx = [86, 138, 190, 242];
    ciz = (
      <g>
        {cx.map((x, i) => (
          <g key={i}>
            {i < 3 && <line x1={x} x2={cx[i + 1]} y1={110} y2={110} stroke="var(--ink)" strokeWidth={2} />}
            <line x1={x} x2={x} y1={80} y2={140} stroke="var(--ink)" strokeWidth={2} />
          </g>
        ))}
        <line x1={46} x2={282} y1={110} y2={110} stroke="var(--ink)" strokeWidth={2} />
        <g fontSize={17} fontWeight={800} textAnchor="middle">
          {cx.map((x, i) => (
            <g key={i}>
              <rect x={x - 10} y={98} width={20} height={24} fill="var(--surface)" />
              <text x={x} y={116} fill="var(--kimya)">C</text>
              <rect x={x - 9} y={63} width={18} height={22} fill="var(--surface)" />
              <text x={x} y={80} fill="var(--ink)">H</text>
              <rect x={x - 9} y={136} width={18} height={22} fill="var(--surface)" />
              <text x={x} y={153} fill="var(--ink)">H</text>
            </g>
          ))}
          <rect x={30} y={98} width={20} height={24} fill="var(--surface)" />
          <text x={40} y={116} fill="var(--ink)">H</text>
          <rect x={280} y={98} width={20} height={24} fill="var(--surface)" />
          <text x={290} y={116} fill="var(--ink)">H</text>
        </g>
      </g>
    );
  } else if (f === 1) {
    ciz = <text x={170} y={118} fontSize={22} fontWeight={800} textAnchor="middle" fill="var(--ink)">CH₃–CH₂–CH₂–CH₃</text>;
  } else if (f === 2) {
    const pt: Nokta[] = [[110, 126], [150, 92], [190, 126], [230, 92]];
    ciz = (
      <g>
        <polyline points={pt.map((q) => q.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {pt.map((q, i) => <text key={i} x={q[0]} y={q[1] + (i % 2 ? -12 : 22)} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">C</text>)}
      </g>
    );
  } else {
    ciz = <text x={170} y={126} fontSize={36} fontWeight={800} textAnchor="middle" fill="var(--ink)">{f === 3 ? "C₄H₁₀" : "C₂H₅"}</text>;
  }
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`Bütanın ${FORMUL_TUR[f]} formülü`}>
      <g>
        {FORMUL_TUR.map((ad, i) => (
          <g key={ad} onClick={() => set("f", i)} style={{ cursor: "pointer" }}>
            <rect x={10 + i * W + 2} y={8} width={W - 4} height={26} rx={13} fill={i === f ? "var(--kimya)" : "var(--panel)"} />
            <text x={10 + i * W + W / 2} y={25} fontSize={11} fontWeight={800} textAnchor="middle" fill={i === f ? "#fff" : "var(--ink)"}>{ad}</text>
          </g>
        ))}
      </g>
      {ciz}
      <text x={170} y={186} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">Bütan: {FORMUL_TUR[f]} formül</text>
      <text x={170} y={206} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{FORMUL_NOT[f]}</text>
    </svg>
  );
}

/* ---------- zincir izomerliği: C₄H₁₀ ---------- */

/** Karbon iskeleti: grup adlı halkalar ve aralarındaki bağlar. */
function Iskelet({ atom, bag }: { atom: { p: Nokta; g: string }[]; bag: [number, number][] }) {
  return (
    <g>
      {bag.map(([a, b], i) => <line key={i} x1={atom[a].p[0]} y1={atom[a].p[1]} x2={atom[b].p[0]} y2={atom[b].p[1]} stroke="var(--ink)" strokeWidth={2.4} />)}
      {atom.map((a, i) => (
        <g key={i}>
          <circle cx={a.p[0]} cy={a.p[1]} r={20} fill="var(--kimya-soft)" stroke="var(--kimya)" strokeWidth={1.6} />
          <text x={a.p[0]} y={a.p[1] + 4.5} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">{a.g}</text>
        </g>
      ))}
    </g>
  );
}

function Izomer({ v }: SahneProps) {
  const d = (v.d ?? 0) === 1;
  const duz = { atom: [{ p: [62, 92] as Nokta, g: "CH₃" }, { p: [134, 92] as Nokta, g: "CH₂" }, { p: [206, 92] as Nokta, g: "CH₂" }, { p: [278, 92] as Nokta, g: "CH₃" }], bag: [[0, 1], [1, 2], [2, 3]] as [number, number][] };
  const dal = { atom: [{ p: [170, 92] as Nokta, g: "CH" }, { p: [98, 92] as Nokta, g: "CH₃" }, { p: [242, 92] as Nokta, g: "CH₃" }, { p: [170, 150] as Nokta, g: "CH₃" }], bag: [[0, 1], [0, 2], [0, 3]] as [number, number][] };
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={d ? "2-metilpropan, dallı zincir, C₄H₁₀" : "Bütan, düz zincir, C₄H₁₀"}>
      <text x={170} y={30} fontSize={20} fontWeight={800} textAnchor="middle" fill="var(--ink)">C₄H₁₀</text>
      <Iskelet {...(d ? dal : duz)} />
      <text x={170} y={194} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{d ? "2-metilpropan (izobütan)" : "bütan"}</text>
      <text x={170} y={214} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{d ? "dallı zincir · kaynama noktası −11,7 °C" : "düz zincir · kaynama noktası −0,5 °C"}</text>
    </svg>
  );
}

/* ---------- cis-trans: dikloroeten ---------- */

function CisTrans({ v }: SahneProps) {
  const cl = (v.m ?? 0) === 1, cevir = (v.y ?? 0) === 1;
  const A: Nokta = [136, 104], B: Nokta = [204, 104];
  const ust: Nokta = [242, 52], alt_: Nokta = [242, 156];
  // Sağ karbonun grupları: üst ve alt. Çevirince yer değiştirir.
  const sagUst = cl && !cevir ? "Cl" : "H", sagAlt = cl && cevir ? "Cl" : "H";
  const ad = !cl ? "CH₂=CHCl (vinil klorür)" : cevir ? "trans-1,2-dikloroeten" : "cis-1,2-dikloroeten";
  const not = !cl ? "Çevirsen de aynı molekül: sağ C'de iki H var" : cevir ? "Cl'ler zıt tarafta · apolar · kaynar 48 °C" : "Cl'ler aynı tarafta · polar · kaynar 60 °C";
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={ad}>
      <g>
        <Bag a={A} b={B} n={2} />
        <Bag a={A} b={[98, 52]} />
        <Bag a={A} b={[98, 156]} />
        <Bag a={B} b={ust} />
        <Bag a={B} b={alt_} />
      </g>
      <g>
        <Atom p={A} el="C" />
        <Atom p={B} el="C" />
        <Atom p={[98, 52]} el="Cl" />
        <Atom p={[98, 156]} el="H" />
        <Atom p={ust} el={sagUst} />
        <Atom p={alt_} el={sagAlt} />
      </g>
      <text x={170} y={140} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">C=C dönemez</text>
      <text x={170} y={194} fontSize={14} fontWeight={800} textAnchor="middle" fill={cl ? "var(--kimya)" : "var(--ink)"}>{ad}</text>
      <text x={170} y={214} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">{not}</text>
    </svg>
  );
}

/* ---------- alkan serisi ---------- */

const ALKAN = ["Metan", "Etan", "Propan", "Bütan", "Pentan", "Hekzan", "Heptan", "Oktan", "Nonan", "Dekan"];
const KN = [-162, -89, -42, -0.5, 36, 69, 98, 126, 151, 174];

function Alkan({ v }: SahneProps) {
  const n = Math.max(1, Math.min(10, v.n ?? 1)), kn = KN[n - 1], sivi = kn > 25;
  const x0 = 170 - (n - 1) * 14;
  const pt: Nokta[] = Array.from({ length: n }, (_, i) => [x0 + i * 28, i % 2 ? 84 : 70]);
  const Y0 = 176, K = 0.22, sx = (k: number) => 58 + k * 27;
  const yaz = (x: number) => (x < 0 ? `−${String(-x).replace(".", ",")}` : String(x));
  const ust = kn >= 0 ? Y0 - kn * K : Y0, boy = Math.max(1, Math.abs(kn) * K);
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`${ALKAN[n - 1]}, C${n}H${2 * n + 2}, kaynama noktası ${kn} °C`}>
      <g>
        <text x={170} y={26} fontSize={18} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ALKAN[n - 1]} · C{n > 1 ? alt(n) : ""}H{alt(2 * n + 2)}</text>
        <text x={170} y={46} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">CₙH₂ₙ₊₂ → H = 2 × {n} + 2 = {2 * n + 2}</text>
      </g>
      <g>
        {n > 1 && <polyline points={pt.map((q) => q.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={2.4} strokeLinejoin="round" />}
        {pt.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={7} fill="var(--ink)" />)}
      </g>
      <text x={170} y={114} fontSize={13} fontWeight={800} textAnchor="middle" fill={sivi ? "var(--c1)" : "var(--c4)"}>25 °C'de {sivi ? "sıvı" : "gaz"}</text>
      <g>
        <line x1={50} x2={330} y1={Y0} y2={Y0} stroke="var(--line-2)" strokeWidth={1.2} />
        <line x1={50} x2={330} y1={Y0 - 25 * K} y2={Y0 - 25 * K} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={10} y={Y0 - 25 * K - 2} fontSize={11} fontWeight={700} fill="var(--muted)">25 °C</text>
        {KN.map((k, i) => {
          const y = k >= 0 ? Y0 - k * K : Y0;
          return <rect key={i} x={sx(i)} y={y} width={18} height={Math.max(1, Math.abs(k) * K)} rx={2} fill={i === n - 1 ? "var(--kimya)" : "var(--line-2)"} />;
        })}
        <text x={sx(n - 1) + 9} y={kn >= 0 ? ust - 5 : ust + boy + 13} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{yaz(kn)} °C</text>
        <text x={10} y={134} fontSize={11} fontWeight={700} fill="var(--muted)">kaynama noktası</text>
      </g>
    </svg>
  );
}

/* ---------- dallanma ve kaynama: C₅H₁₂ ---------- */

const DAL = [
  { ad: "pentan", kn: 36, pt: [[-32, 64], [-16, 52], [0, 64], [16, 52], [32, 64]] as Nokta[], bag: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  { ad: "2-metilbütan", kn: 28, pt: [[-24, 64], [-8, 52], [8, 64], [24, 52], [-8, 34]] as Nokta[], bag: [[0, 1], [1, 2], [2, 3], [1, 4]] },
  { ad: "2,2-dimetilpropan", kn: 10, pt: [[0, 54], [-20, 54], [20, 54], [0, 34], [0, 74]] as Nokta[], bag: [[0, 1], [0, 2], [0, 3], [0, 4]] },
];

function Dallanma({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5)), T = Math.round(40 * u);
  const cx = [58, 170, 282];
  return (
    <svg viewBox="0 0 340 232" role="img" aria-label={`Üç C₅H₁₂ izomeri ısıtılıyor, sıcaklık ${T} °C`}>
      <text x={170} y={18} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">Sıcaklık: {T} °C</text>
      {DAL.map((d, i) => {
        const x = cx[i], kay = T >= d.kn, k = kay ? yumusak((T - d.kn) / 6) : 0;
        const kab = 120 - 14 * k;
        return (
          <g key={d.ad}>
            {d.bag.map(([a, b], j) => <line key={j} x1={x + d.pt[a][0]} y1={d.pt[a][1]} x2={x + d.pt[b][0]} y2={d.pt[b][1]} stroke="var(--ink)" strokeWidth={2.2} />)}
            {d.pt.map((q, j) => <circle key={j} cx={x + q[0]} cy={q[1]} r={4.5} fill="var(--ink)" />)}
            <rect x={x - 26} y={kab} width={52} height={Math.max(0, 164 - kab)} fill="var(--c1)" opacity={0.22} />
            {kay && [0, 1, 2, 3].map((j) => {
              const y = 158 - ((t * 40 + j * 11) % 44);
              return <circle key={j} cx={x - 14 + j * 9} cy={Math.max(kab + 4, y)} r={2.6} fill="none" stroke="var(--c1)" strokeWidth={1.3} />;
            })}
            <path d={`M${x - 28} 96 L${x - 28} 164 Q${x - 28} 170 ${x - 22} 170 L${x + 22} 170 Q${x + 28} 170 ${x + 28} 164 L${x + 28} 96`} fill="none" stroke="var(--ink)" strokeWidth={2} />
            <text x={x} y={190} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.ad}</text>
            <text x={x} y={208} fontSize={11.5} fontWeight={800} textAnchor="middle" fill={kay ? "var(--good)" : "var(--muted)"}>{kay ? `${d.kn} °C'de kaynadı` : "sıvı"}</text>
          </g>
        );
      })}
      <text x={170} y={228} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">Üçü de C₅H₁₂: mol kütleleri aynı.</text>
    </svg>
  );
}

/* ---------- en uzun zincir: 3-metilpentan ---------- */

function Adlandir({ v }: SahneProps) {
  const z = (v.z ?? 0) === 1;
  // a b c d yatay sıra; e ve f, b'den aşağı inen kol.
  const P: Record<string, Nokta> = { a: [60, 80], b: [130, 80], c: [200, 80], d: [270, 80], e: [130, 146], f: [60, 146] };
  const zincir = z ? ["f", "e", "b", "c", "d"] : ["a", "b", "c", "d"];
  const bag: [string, string][] = [["a", "b"], ["b", "c"], ["c", "d"], ["b", "e"], ["e", "f"]];
  const zinde = (x: string, y: string) => { const i = zincir.indexOf(x), j = zincir.indexOf(y); return i >= 0 && j >= 0 && Math.abs(i - j) === 1; };
  const no = (k: string) => {
    const i = zincir.indexOf(k);
    if (i < 0) return null;
    // Dala en yakın uçtan numarala.
    const dal = zincir.indexOf("b"), sol = dal + 1, sag = zincir.length - dal;
    return sol <= sag ? i + 1 : zincir.length - i;
  };
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={z ? "En uzun zincir 5 karbon: 3-metilpentan" : "4 karbonlu zincir: 2-etilbütan (yanlış ad)"}>
      <g>
        {bag.map(([x, y], i) => <line key={i} x1={P[x][0]} y1={P[x][1]} x2={P[y][0]} y2={P[y][1]} stroke={zinde(x, y) ? "var(--kimya)" : "var(--line-2)"} strokeWidth={zinde(x, y) ? 4 : 2.4} />)}
      </g>
      <g>
        {Object.entries(P).map(([k, p]) => {
          const ic = zincir.includes(k), n = no(k);
          return (
            <g key={k}>
              <circle cx={p[0]} cy={p[1]} r={15} fill={ic ? "var(--kimya)" : "var(--panel)"} stroke={ic ? "none" : "var(--line-2)"} />
              <text x={p[0]} y={p[1] + 4.5} fontSize={12.5} fontWeight={800} textAnchor="middle" fill={ic ? "#fff" : "var(--ink)"}>C</text>
              {n !== null && <text x={p[0]} y={p[1] < 100 ? p[1] - 22 : p[1] + 31} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--kimya)">{n}</text>}
            </g>
          );
        })}
      </g>
      <text x={z ? 60 : 95} y={z ? 58 : 176} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--muted)">{z ? "metil" : "etil"}</text>
      <text x={170} y={196} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">Zincir: {zincir.length} C</text>
      <text x={170} y={215} fontSize={12} fontWeight={700} textAnchor="middle" fill={z ? "var(--good)" : "var(--bad)"}>
        {z ? "En uzun zincir bu: daha uzunu yok" : "Kıvrılan daha uzun bir zincir var"}
      </text>
    </svg>
  );
}

/* ---------- alkini doyurma ---------- */

const DOYUR = [
  { ad: "etin (asetilen) · C₂H₂ · alkin", bag: "üçlü bağ: 1σ + 2π", not: "Doymamış: iki π bağı var" },
  { ad: "eten (etilen) · C₂H₄ · alken", bag: "ikili bağ: 1σ + 1π", not: "Hâlâ doymamış: bir π bağı kaldı" },
  { ad: "etan · C₂H₆ · alkan", bag: "tekli bağ: 1σ", not: "Doymuş: artık H₂ katılmaz" },
];

function Doyur({ v }: SahneProps) {
  const h = Math.max(0, Math.min(2, v.h ?? 0)), d = DOYUR[h];
  const A: Nokta = [140, 88], B: Nokta = [200, 88];
  const hs: Nokta[][] = [
    [[84, 88], [256, 88]],
    [[108, 40], [108, 136], [232, 40], [232, 136]],
    [[88, 88], [140, 34], [140, 142], [252, 88], [200, 34], [200, 142]],
  ];
  const yeni = (i: number) => h > 0 && (h === 1 ? i === 1 || i === 3 : i === 2 || i === 5);
  return (
    <svg viewBox="0 0 340 230" role="img" aria-label={`${h} mol H₂ eklendi: ${d.ad}`}>
      <g>
        <Bag a={A} b={B} n={3 - h} />
        {hs[h].map((p, i) => <Bag key={i} a={i < hs[h].length / 2 ? A : B} b={p} />)}
      </g>
      <g>
        <Atom p={A} el="C" />
        <Atom p={B} el="C" />
        {hs[h].map((p, i) => <Atom key={i} p={p} el="H" renk={yeni(i) ? "var(--c1)" : undefined} />)}
      </g>
      <g>
        <text x={170} y={178} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.ad}</text>
        <text x={170} y={198} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">eklenen H₂: {h} mol · {d.bag}</text>
        <text x={170} y={220} fontSize={12} fontWeight={800} textAnchor="middle" fill={h === 2 ? "var(--good)" : "var(--c2)"}>{d.not}</text>
      </g>
    </svg>
  );
}

/* ---------- bromlu su testi ---------- */

const TUP = [
  { ad: "hekzan", f: "C₆H₁₄ · alkan", siner: false },
  { ad: "hekzen", f: "C₆H₁₂ · alken", siner: true },
  { ad: "benzen", f: "C₆H₆ · aromatik", siner: false },
];

function Brom({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4)), bitti = u >= 1, k = yumusak(u);
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "Yalnız hekzen bromlu suyu renksizleştirdi" : "Üç tüpte turuncu bromlu su"}>
      {TUP.map((d, i) => {
        const x = 64 + i * 106, op = d.siner ? 0.75 * (1 - k) + 0.04 : 0.75;
        const damla = u > 0 && u < 0.35;
        return (
          <g key={d.ad}>
            <path d={`M${x - 17} 78 L${x - 17} 162 A17 17 0 0 0 ${x + 17} 162 L${x + 17} 78 Z`} fill={BROM} opacity={op} />
            {damla && <circle cx={x} cy={40 + u * 100} r={3.5} fill="var(--muted)" />}
            <path d={`M${x - 19} 44 L${x - 19} 162 A19 19 0 0 0 ${x + 19} 162 L${x + 19} 44`} fill="none" stroke="var(--ink)" strokeWidth={2} />
            <text x={x} y={204} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.ad}</text>
            <text x={x} y={221} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{d.f}</text>
            {bitti && <text x={x} y={30} fontSize={11.5} fontWeight={800} textAnchor="middle" fill={d.siner ? "var(--good)" : "var(--c2)"}>{d.siner ? "renksiz" : "renk kaldı"}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- benzen ---------- */

function Altigen({ cx, cy, cift }: { cx: number; cy: number; cift: number | null }) {
  const R = 40, k = Array.from({ length: 6 }, (_, i) => [cx + R * Math.cos(((-90 + 60 * i) * Math.PI) / 180), cy + R * Math.sin(((-90 + 60 * i) * Math.PI) / 180)] as Nokta);
  return (
    <g>
      <polygon points={k.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={2.4} strokeLinejoin="round" />
      {cift !== null &&
        [0, 2, 4].map((j) => {
          const a = k[(j + cift) % 6], b = k[(j + cift + 1) % 6];
          const ic = (p: Nokta): Nokta => [cx + (p[0] - cx) * 0.78, cy + (p[1] - cy) * 0.78];
          const p1 = ic(a), p2 = ic(b), m = 0.14;
          return <line key={j} x1={p1[0] + (p2[0] - p1[0]) * m} y1={p1[1] + (p2[1] - p1[1]) * m} x2={p2[0] - (p2[0] - p1[0]) * m} y2={p2[1] - (p2[1] - p1[1]) * m} stroke="var(--ink)" strokeWidth={2.4} strokeLinecap="round" />;
        })}
      {cift === null && <circle cx={cx} cy={cy} r={24} fill="none" stroke="var(--kimya)" strokeWidth={2.6} />}
      {k.map((p, i) => <text key={i} x={cx + (p[0] - cx) * 1.45} y={cy + (p[1] - cy) * 1.45 + 4} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">H</text>)}
    </g>
  );
}

function Benzen({ v }: SahneProps) {
  const r = (v.r ?? 0) === 1;
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={r ? "Benzen: π elektronları halkaya yayılmış" : "Benzenin iki rezonans yapısı"}>
      {r ? (
        <Altigen cx={170} cy={92} cift={null} />
      ) : (
        <g>
          <Altigen cx={86} cy={92} cift={0} />
          <text x={170} y={100} fontSize={22} fontWeight={800} textAnchor="middle" fill="var(--kimya)">↔</text>
          <Altigen cx={254} cy={92} cift={1} />
        </g>
      )}
      <text x={170} y={184} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        {r ? "6 π elektronu halkaya yayılır (delokalize)" : "C₆H₆: çift bağların yeri sabit değil"}
      </text>
      <text x={170} y={205} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        {r ? "C–C 154 pm, C=C 134 pm; benzende hepsi 139 pm" : "İki yapı arasında rezonans vardır"}
      </text>
    </svg>
  );
}

/* ---------- pentanın yanması ---------- */

function Yanma({ v }: SahneProps) {
  const o = Math.max(1, Math.min(12, v.o ?? 4)), sol = 2 * o, tamam = o === 8, az = o < 8;
  const satir = [
    { el: "C", s: 5, g: 5 },
    { el: "H", s: 12, g: 12 },
    { el: "O", s: sol, g: 16 },
  ];
  const alev = tamam ? "var(--c1)" : az ? "var(--c4)" : "var(--c1)";
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`C₅H₁₂ + ${o} O₂: sol tarafta ${sol}, sağ tarafta 16 O atomu`}>
      <text x={170} y={30} fontSize={17} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        C₅H₁₂ + <tspan fill="var(--kimya)">{o}</tspan> O₂ → 5 CO₂ + 6 H₂O
      </text>
      <g fontSize={13} fontWeight={800}>
        <text x={44} y={64} fontSize={11} fill="var(--muted)">atom</text>
        <text x={110} y={64} fontSize={11} textAnchor="middle" fill="var(--muted)">sol</text>
        <text x={170} y={64} fontSize={11} textAnchor="middle" fill="var(--muted)">sağ</text>
        {satir.map((r, i) => {
          const y = 88 + i * 26, ok = r.s === r.g;
          return (
            <g key={r.el}>
              <text x={50} y={y} textAnchor="middle" fill="var(--ink)">{r.el}</text>
              <text x={110} y={y} textAnchor="middle" fill={ok ? "var(--ink)" : "var(--bad)"}>{r.s}</text>
              <text x={170} y={y} textAnchor="middle" fill="var(--ink)">{r.g}</text>
              <text x={212} y={y} fill={ok ? "var(--good)" : "var(--bad)"}>{ok ? "✓" : r.s < r.g ? "eksik" : "fazla"}</text>
            </g>
          );
        })}
      </g>
      <g>
        <path d="M290 142 C270 128 274 104 290 82 C306 104 310 128 290 142 Z" fill={alev} opacity={0.75} />
        <path d="M290 140 C281 132 282 118 290 106 C298 118 299 132 290 140 Z" fill={az ? "#fde7a8" : "#cfe2ff"} />
        {az && <circle cx={300} cy={70} r={4} fill="var(--muted)" opacity={0.6} />}
        {az && <circle cx={284} cy={60} r={3} fill="var(--muted)" opacity={0.5} />}
      </g>
      <text x={170} y={180} fontSize={13} fontWeight={800} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--bad)"}>
        {tamam ? "Denk: 16 O = 16 O, tam yanma" : az ? "O₂ yetmez: zehirli CO ve is oluşur" : "Fazla O₂: denklem denk değil"}
      </text>
      <text x={170} y={202} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">Sağda O: 5 × 2 + 6 × 1 = 16</text>
    </svg>
  );
}

export const KIMYA11: Record<string, SahneKaydi> = {
  "kim11-dortbag": { C: DortBag },
  "kim11-hibrit": { C: Hibrit },
  "kim11-sigmapi": { C: SigmaPi },
  "kim11-formul": { C: Formul },
  "kim11-izomer": { C: Izomer },
  "kim11-cistrans": { C: CisTrans },
  "kim11-alkan": { C: Alkan },
  "kim11-dallanma": { C: Dallanma },
  "kim11-adlandir": { C: Adlandir },
  "kim11-doyur": { C: Doyur },
  "kim11-brom": { C: Brom },
  "kim11-benzen": { C: Benzen },
  "kim11-yanma": { C: Yanma },
};
