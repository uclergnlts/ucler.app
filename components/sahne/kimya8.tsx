"use client";
// Kimya sahneleri (çözeltiler, tepkime enerjisi): iyonik ve moleküler çözünme, kütlece yüzde, molarite,
// seyreltme, iyon derişimi, donma noktası alçalması, gazozda gaz çözünürlüğü; kabın ısınması/soğuması,
// potansiyel enerji diyagramı, oluşum entalpileriyle ΔH, Hess yasası, bağ enerjileri, kalorimetre.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const kes = (x: number) => Math.max(0, Math.min(1, x));
const virgul = (x: number, b = 1) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
const isaretli = (x: number, b = 1) => (x > 0 ? "+" : x < 0 ? "−" : "") + virgul(Math.abs(x), b);
const SU = "#d6e8fb";

/** Dikey termometre: (x, ust) tüpün tepesi, boy tüp uzunluğu; deger [min, max] aralığında. */
function Termometre({ x, ust, boy, deger, min, max }: { x: number; ust: number; boy: number; deger: number; min: number; max: number }) {
  const h = kes((deger - min) / (max - min)) * boy;
  return (
    <g>
      <rect x={x - 5} y={ust} width={10} height={boy + 6} rx={5} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
      <rect x={x - 2.5} y={ust + boy - h + 3} width={5} height={Math.max(0, h)} fill="var(--c2)" />
      <circle cx={x} cy={ust + boy + 12} r={9} fill="var(--c2)" stroke="var(--ink)" strokeWidth={1.5} />
    </g>
  );
}

/* ---------- iyonik ve moleküler çözünme ---------- */

function Cozunme({ v }: SahneProps) {
  const tuz = (v.tuz ?? 0) === 1;
  const r = rastgele(31);
  const yer = Array.from({ length: 12 }, () => ({ x: 74 + r() * 112, y: 104 + r() * 82 }));
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={tuz ? "Tuzlu su: iyonlar var, lamba yanıyor" : "Şekerli su: moleküller var, lamba yanmıyor"}>
      <rect x={62} y={90} width={136} height={110} fill={SU} />
      <g>
        {tuz
          ? yer.map((p, i) =>
              i % 2 ? (
                <g key={i}><circle cx={p.x} cy={p.y} r={6.5} fill="var(--c3)" /><text x={p.x} y={p.y + 3.5} fontSize={11} fontWeight={800} textAnchor="middle" fill="#fff">−</text></g>
              ) : (
                <g key={i}><circle cx={p.x} cy={p.y} r={4.6} fill="var(--c5)" /><text x={p.x} y={p.y + 3} fontSize={8.5} fontWeight={800} textAnchor="middle" fill="#fff">+</text></g>
              ),
            )
          : yer.slice(0, 7).map((p, i) => (
              <polygon key={i} points={Array.from({ length: 6 }, (_, k) => `${(p.x + 7 * Math.cos((k * Math.PI) / 3)).toFixed(1)},${(p.y + 7 * Math.sin((k * Math.PI) / 3)).toFixed(1)}`).join(" ")} fill="#fff" stroke="#9aa8ba" strokeWidth={1.5} />
            ))}
      </g>
      <path d="M62 64 L62 200 L198 200 L198 64" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g stroke="var(--ink)" strokeWidth={2} fill="none">
        <rect x={92} y={56} width={8} height={110} fill="#9aa8ba" />
        <rect x={160} y={56} width={8} height={110} fill="#9aa8ba" />
        <path d="M96 56 L96 26 L118 26 M164 56 L164 26 L142 26" />
      </g>
      <g>
        {tuz && [0, 1, 2, 3, 4, 5].map((k) => {
          const a = (-150 + k * 24) * (Math.PI / 180);
          return <line key={k} x1={130 + 16 * Math.cos(a)} y1={22 + 16 * Math.sin(a)} x2={130 + 24 * Math.cos(a)} y2={22 + 24 * Math.sin(a)} stroke="var(--c4)" strokeWidth={2} strokeLinecap="round" />;
        })}
        <circle cx={130} cy={24} r={12} fill={tuz ? "#ffd75a" : "#fff"} stroke="var(--ink)" strokeWidth={2} />
      </g>
      <g fontSize={12} fontWeight={700}>
        <text x={214} y={84} fill="var(--ink)" fontSize={13} fontWeight={800}>{tuz ? "Tuzlu su" : "Şekerli su"}</text>
        <text x={214} y={104} fill="var(--muted)">{tuz ? "NaCl(k) →" : "Şeker molekül"}</text>
        <text x={214} y={120} fill="var(--muted)">{tuz ? "Na⁺(suda) +" : "hâlinde dağılır"}</text>
        {tuz && <text x={214} y={136} fill="var(--muted)">Cl⁻(suda)</text>}
        <text x={214} y={158} fill={tuz ? "var(--good)" : "var(--muted)"}>{tuz ? "Lamba yanıyor" : "Lamba yanmıyor"}</text>
        {tuz && (
          <g fontSize={11}>
            <circle cx={218} cy={176} r={4.6} fill="var(--c5)" /><text x={226} y={180} fill="var(--muted)">Na⁺</text>
            <circle cx={262} cy={176} r={6.5} fill="var(--c3)" /><text x={272} y={180} fill="var(--muted)">Cl⁻</text>
          </g>
        )}
      </g>
    </svg>
  );
}

/* ---------- kütlece yüzde: 20 g tuz + x g su ---------- */

function Yuzde({ v }: SahneProps) {
  const su = v.su ?? 40, tuz = 20, top = su + tuz, yuzde = (100 * tuz) / top;
  const h = (top / 140) * 120;
  const r = rastgele(5);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${tuz} g tuz ve ${su} g su: kütlece yüzde ${virgul(yuzde)}`}>
      <rect x={34} y={180 - h} width={110} height={h} fill={SU} />
      <g>
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={42 + r() * 94} cy={180 - h + 6 + r() * Math.max(4, h - 12)} r={2.6} fill="var(--kimya)" />)}
      </g>
      <path d="M34 44 L34 180 L144 180 L144 44" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g fontSize={12} fontWeight={700}>
        <text x={164} y={58} fill="var(--muted)">çözünen: <tspan fill="var(--kimya)">20 g tuz</tspan></text>
        <text x={164} y={78} fill="var(--muted)">çözücü: <tspan fill="var(--c1)">{su} g su</tspan></text>
        <text x={164} y={98} fill="var(--muted)">çözelti: <tspan fill="var(--ink)">{top} g</tspan></text>
        <text x={164} y={130} fill="var(--muted)">20 / {top} × 100</text>
        <text x={164} y={162} fontSize={26} fontWeight={800} fill="var(--ink)">%{virgul(yuzde)}</text>
      </g>
      <rect x={34} y={194} width={290} height={10} rx={5} fill={SU} />
      <rect x={34} y={194} width={290 * (tuz / top)} height={10} rx={5} fill="var(--kimya)" />
    </svg>
  );
}

/* ---------- molarite: 0,1 mol NaOH, hacmi tamamla ---------- */

function Molarite({ v }: SahneProps) {
  const V = v.V ?? 500, n = 0.1, M = n / (V / 1000);
  const ALT = 196, UST = 36, BOY = ALT - UST, h = (V / 1000) * BOY;
  const r = rastgele(13);
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`0,1 mol NaOH, ${V} mL çözelti: ${virgul(M, 2)} M`}>
      <rect x={70} y={ALT - h} width={70} height={h} fill="var(--c1)" opacity={0.1 + 0.5 * kes(M / 1)} />
      <g>
        {Array.from({ length: 10 }, (_, i) => <circle key={i} cx={78 + r() * 54} cy={ALT - h + 6 + r() * Math.max(2, h - 12)} r={3.4} fill="var(--kimya)" />)}
      </g>
      <g fontSize={10.5} fill="var(--muted)" textAnchor="end">
        {[200, 400, 600, 800, 1000].map((m) => (
          <g key={m}>
            <line x1={70} x2={80} y1={ALT - (m / 1000) * BOY} y2={ALT - (m / 1000) * BOY} stroke="var(--muted)" />
            <text x={64} y={ALT - (m / 1000) * BOY + 4}>{m}</text>
          </g>
        ))}
      </g>
      <path d={`M70 ${UST - 8} L70 ${ALT} L140 ${ALT} L140 ${UST - 8}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={64} y={UST - 12} fontSize={10.5} fill="var(--muted)" textAnchor="end">mL</text>
      <g fontSize={12} fontWeight={700}>
        <text x={164} y={60} fill="var(--muted)">n = <tspan fill="var(--kimya)">0,1 mol NaOH</tspan></text>
        <text x={164} y={82} fill="var(--muted)">V = {V} mL = <tspan fill="var(--ink)">{virgul(V / 1000, 2)} L</tspan></text>
        <text x={164} y={112} fill="var(--muted)">M = n / V = 0,1 / {virgul(V / 1000, 2)}</text>
        <text x={164} y={146} fontSize={26} fontWeight={800} fill="var(--ink)">{virgul(M, 2)} M</text>
      </g>
    </svg>
  );
}

/* ---------- seyreltme: 100 mL 2 M, su ekle ---------- */

function Seyreltme({ v }: SahneProps) {
  const V = v.V ?? 100, mol = 0.2, M = mol / (V / 1000);
  const ALT = 196, UST = 40, BOY = ALT - UST, h = (V / 500) * BOY;
  const r = rastgele(17);
  const eklenen = V - 100;
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`100 mL 2 M çözeltiye ${eklenen} mL su eklendi: ${virgul(M, 2)} M`}>
      <rect x={70} y={ALT - h} width={74} height={h} fill="var(--kimya)" opacity={0.08 + 0.3 * kes(M / 2)} />
      <g>
        {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={78 + r() * 58} cy={ALT - h + 5 + r() * Math.max(2, h - 10)} r={3} fill="var(--kimya)" />)}
      </g>
      <g fontSize={10.5} fill="var(--muted)" textAnchor="end">
        {[100, 200, 300, 400, 500].map((m) => (
          <g key={m}>
            <line x1={70} x2={80} y1={ALT - (m / 500) * BOY} y2={ALT - (m / 500) * BOY} stroke="var(--muted)" />
            <text x={64} y={ALT - (m / 500) * BOY + 4}>{m}</text>
          </g>
        ))}
      </g>
      <path d={`M70 ${UST - 8} L70 ${ALT} L144 ${ALT} L144 ${UST - 8}`} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={64} y={UST - 12} fontSize={10.5} fill="var(--muted)" textAnchor="end">mL</text>
      <g fontSize={12} fontWeight={700}>
        <text x={166} y={58} fill="var(--muted)">eklenen su: <tspan fill="var(--c1)">{eklenen} mL</tspan></text>
        <text x={166} y={80} fill="var(--muted)">mol: <tspan fill="var(--kimya)">0,2 (değişmedi)</tspan></text>
        <text x={166} y={110} fill="var(--muted)">M₂ = 0,2 / {virgul(V / 1000, 2)} L</text>
        <text x={166} y={144} fontSize={26} fontWeight={800} fill="var(--ink)">{virgul(M, 2)} M</text>
      </g>
    </svg>
  );
}

/* ---------- iyon derişimi: CaCl₂ ---------- */

function Iyon({ v }: SahneProps) {
  const c = (v.c ?? 2) * 0.5, nCa = Math.round(c * 4), nCl = 2 * nCa;
  const r = rastgele(41);
  const yer = (n: number) => Array.from({ length: n }, () => ({ x: 30 + r() * 128, y: 70 + r() * 110 }));
  const bar = (x: number, M: number, renk: string, ad: string) => {
    const h = (M / 4) * 120;
    return (
      <g>
        <rect x={x} y={190 - h} width={34} height={Math.max(0, h)} rx={3} fill={renk} />
        <text x={x + 17} y={184 - h} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">{virgul(M)} M</text>
        <text x={x + 17} y={206} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">{ad}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${virgul(c)} M CaCl₂: Ca²⁺ ${virgul(c)} M, Cl⁻ ${virgul(2 * c)} M`}>
      <text x={20} y={30} fontSize={13} fontWeight={800} fill="var(--ink)">CaCl₂(k) → Ca²⁺(suda) + 2 Cl⁻(suda)</text>
      <rect x={22} y={62} width={144} height={128} fill={SU} />
      <g>
        {yer(nCa).map((p, i) => <circle key={`a${i}`} cx={p.x} cy={p.y} r={5.5} fill="var(--c5)" />)}
        {yer(nCl).map((p, i) => <circle key={`b${i}`} cx={p.x} cy={p.y} r={4} fill="var(--c3)" />)}
      </g>
      <path d="M22 52 L22 190 L166 190 L166 52" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <line x1={196} x2={322} y1={190} y2={190} stroke="var(--ink)" strokeWidth={1.2} />
      {bar(208, c, "var(--c5)", "[Ca²⁺]")}
      {bar(272, 2 * c, "var(--c3)", "[Cl⁻]")}
    </svg>
  );
}

/* ---------- donma noktası alçalması: 1 molal çözeltiler ---------- */

const DONMA = [
  { ad: "saf su", i: 0 },
  { ad: "şeker", i: 1 },
  { ad: "NaCl", i: 2 },
  { ad: "CaCl₂", i: 3 },
];

function Donma({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const T = -7 * u;
  const bitti = u >= 1;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`Soğutma: ${virgul(T)} °C`}>
      <text x={20} y={26} fontSize={13} fontWeight={800} fill="var(--ink)">Soğutucu: {isaretli(Math.round(T * 10) / 10)} °C</text>
      <text x={320} y={26} fontSize={11.5} fontWeight={700} textAnchor="end" fill="var(--muted)">hepsi 1 molal</text>
      {DONMA.map((d, k) => {
        const x = 55 + k * 77, Tf = -1.86 * d.i, don = T <= Tf + 1e-9 && u > 0;
        return (
          <g key={k}>
            <rect x={x - 17} y={74} width={34} height={96} rx={6} fill={don ? "#eef3f8" : SU} />
            {don && (
              <g stroke="#9fb6cf" strokeWidth={1.3}>
                <path d={`M${x - 9} 92 L${x + 6} 104 M${x + 8} 118 L${x - 6} 132 M${x - 10} 146 L${x + 5} 158`} />
              </g>
            )}
            <path d={`M${x - 17} 60 L${x - 17} 164 Q${x - 17} 176 ${x - 5} 176 L${x + 5} 176 Q${x + 17} 176 ${x + 17} 164 L${x + 17} 60`} fill="none" stroke="var(--ink)" strokeWidth={1.8} />
            <text x={x} y={52} fontSize={11.5} fontWeight={800} textAnchor="middle" fill={don ? "var(--c1)" : "var(--muted)"}>{don ? "dondu" : "sıvı"}</text>
            <text x={x} y={196} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{d.ad}</text>
            {bitti && <text x={x} y={214} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{d.i ? `${isaretli(Tf, 2)} °C` : "0 °C"}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- gazoz: basınç ve sıcaklık ---------- */

function Gazoz({ v }: SahneProps) {
  const acik = (v.kapak ?? 0) === 1, T = v.T ?? 5;
  const coz = kes((acik ? 0.25 : 1) * (1 - (T - 5) / 70));
  const kab = acik ? Math.round(6 + (1 - coz) * 22) : 1;
  const r = rastgele(3);
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`Kapak ${acik ? "açık" : "kapalı"}, ${T} °C: çözünmüş CO₂ ${Math.round(coz * 100)}`}>
      <path d="M78 206 L78 104 Q78 84 96 74 L102 70 L102 44 L128 44 L128 70 L134 74 Q152 84 152 104 L152 206 Z" fill="#fff" stroke="none" />
      <rect x={80} y={96} width={70} height={108} fill="#efe3c8" />
      <g>
        {Array.from({ length: kab }, (_, i) => <circle key={i} cx={86 + r() * 58} cy={100 + r() * 100} r={2 + r() * 2.5} fill="#fff" stroke="#b8a77f" strokeWidth={1} />)}
      </g>
      <path d="M78 206 L78 104 Q78 84 96 74 L102 70 L102 44 L128 44 L128 70 L134 74 Q152 84 152 104 L152 206 Z" fill="none" stroke="var(--ink)" strokeWidth={2} strokeLinejoin="round" />
      {acik ? (
        <rect x={134} y={20} width={30} height={10} rx={3} fill="var(--kimya)" transform="rotate(25 149 25)" />
      ) : (
        <rect x={99} y={34} width={32} height={10} rx={3} fill="var(--kimya)" />
      )}
      {acik && <text x={115} y={34} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">CO₂↑</text>}
      <g fontSize={12} fontWeight={700}>
        <text x={182} y={58} fill="var(--muted)">Kapak: <tspan fill="var(--ink)">{acik ? "açık" : "kapalı"}</tspan></text>
        <text x={182} y={78} fill="var(--muted)">Sıcaklık: <tspan fill="var(--ink)">{T} °C</tspan></text>
        <text x={182} y={110} fill="var(--muted)">çözünmüş CO₂</text>
      </g>
      <rect x={182} y={118} width={136} height={14} rx={7} fill="var(--line)" />
      <rect x={182} y={118} width={136 * coz} height={14} rx={7} fill="var(--kimya)" />
      <text x={182} y={156} fontSize={12} fontWeight={800} fill={acik ? "var(--kimya)" : "var(--muted)"}>{acik ? "Gaz kabarcık olup kaçıyor" : "Gaz çözeltide kalıyor"}</text>
    </svg>
  );
}

/* ---------- kap ısınır mı, soğur mu? (NH₄NO₃ çözünmesi) ---------- */

function Kap({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 4));
  const T = 22 - 10 * yumusak(u);
  const r = rastgele(9);
  const ok = (x1: number, x2: number, y: number) => {
    const d = x2 > x1 ? 1 : -1;
    return (
      <g>
        <line x1={x1} x2={x2 - d * 8} y1={y} y2={y} stroke="var(--c1)" strokeWidth={2.4} strokeLinecap="round" />
        <path d={`M${x2} ${y} L${x2 - d * 9} ${y - 5} L${x2 - d * 9} ${y + 5} Z`} fill="var(--c1)" />
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 220" role="img" aria-label={`Amonyum nitrat suda çözünüyor, sıcaklık ${virgul(T)} °C`}>
      <rect x={100} y={96} width={120} height={104} fill={SU} />
      <g>
        {Array.from({ length: Math.round(12 * (1 - u)) }, (_, i) => <rect key={i} x={110 + r() * 96} y={186 - r() * 10} width={6} height={6} fill="#fff" stroke="#9aa8ba" />)}
      </g>
      <path d="M100 70 L100 200 L220 200 L220 70" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <Termometre x={190} ust={40} boy={120} deger={T} min={0} max={40} />
      {u > 0.15 && (
        <g opacity={kes((u - 0.15) / 0.3)}>
          {ok(36, 90, 120)}
          {ok(36, 90, 160)}
          {ok(304, 230, 120)}
          {ok(304, 230, 160)}
        </g>
      )}
      <g fontSize={12} fontWeight={700}>
        <text x={160} y={26} textAnchor="middle" fill="var(--muted)">NH₄NO₃ + su</text>
        <text x={20} y={60} fill="var(--ink)" fontSize={15} fontWeight={800}>{virgul(T)} °C</text>
        {u >= 1 && <text x={170} y={216} textAnchor="middle" fill="var(--c1)">Kap soğudu: ısı ortamdan sisteme geçti</text>}
      </g>
    </svg>
  );
}

/* ---------- potansiyel enerji diyagramı ---------- */

function PE({ v }: SahneProps) {
  const G = 200, U = v.u ?? 300, Ea = v.ea ?? 120;
  const tepe = Math.max(G, U) + Ea;
  const Y = (H: number) => 206 - (H / 600) * 176;
  const dH = U - G, ekzo = dH < 0;
  const yG = Y(G), yU = Y(U), yT = Y(tepe);
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`Girenler ${G}, ürünler ${U} kJ: ΔH ${isaretli(dH, 0)} kJ`}>
      <line x1={30} x2={30} y1={24} y2={206} stroke="var(--ink)" strokeWidth={1.4} />
      <line x1={30} x2={300} y1={206} y2={206} stroke="var(--ink)" strokeWidth={1.4} />
      <text x={36} y={22} fontSize={11} fontWeight={700} fill="var(--muted)">potansiyel enerji</text>
      <text x={300} y={220} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">tepkimenin ilerleyişi →</text>
      <path d={`M44 ${yG} L104 ${yG} C140 ${yG} 140 ${yT} 166 ${yT} C192 ${yT} 192 ${yU} 228 ${yU} L288 ${yU}`} fill="none" stroke="var(--kimya)" strokeWidth={3} strokeLinecap="round" />
      <g fontSize={11.5} fontWeight={700}>
        <text x={74} y={yG - 8} textAnchor="middle" fill="var(--ink)">girenler</text>
        <text x={258} y={yU - 8} textAnchor="middle" fill="var(--ink)">ürünler</text>
      </g>
      <g>
        <line x1={104} x2={166} y1={yG} y2={yG} stroke="var(--muted)" strokeDasharray="4 4" />
        <line x1={124} x2={124} y1={yG - 2} y2={yT + 6} stroke="var(--c4)" strokeWidth={1.8} />
        <path d={`M124 ${yT + 2} L119 ${yT + 11} L129 ${yT + 11} Z`} fill="var(--c4)" />
        <text x={119} y={Math.min((yG + yT) / 2 + 4, yG - 8)} fontSize={11.5} fontWeight={800} textAnchor="end" fill="#b7800d">Ea</text>
      </g>
      {Math.abs(dH) > 4 && (
        <g>
          <line x1={104} x2={318} y1={yG} y2={yG} stroke="var(--muted)" strokeDasharray="4 4" opacity={0.6} />
          <line x1={312} x2={312} y1={yG} y2={yU + (ekzo ? -8 : 8)} stroke={ekzo ? "var(--c1)" : "var(--c2)"} strokeWidth={2.2} />
          <path d={ekzo ? `M312 ${yU} L307 ${yU - 9} L317 ${yU - 9} Z` : `M312 ${yU} L307 ${yU + 9} L317 ${yU + 9} Z`} fill={ekzo ? "var(--c1)" : "var(--c2)"} />
        </g>
      )}
      <g fontSize={12.5} fontWeight={800}>
        <text x={196} y={36} fill="var(--ink)">ΔH = {isaretli(dH, 0)} kJ</text>
        <text x={196} y={54} fontSize={12} fill={dH === 0 ? "var(--muted)" : ekzo ? "var(--c1)" : "var(--c2)"}>{dH === 0 ? "ısı alışverişi yok" : ekzo ? "ekzotermik: ısı verir" : "endotermik: ısı alır"}</text>
      </g>
    </svg>
  );
}

/* ---------- oluşum entalpileriyle metanın yanması ---------- */

function Metan({ v }: SahneProps) {
  const k = v.k ?? 1;
  const hSol = 4, hSag = 2 * k, oSol = 4, oSag = 2 + k;
  const denk = hSol === hSag && oSol === oSag;
  const urun = -393.5 + k * -285.8, giren = -74.8, dH = urun - giren;
  const sat = (y: number, ad: string, sol: number, sag: number) => (
    <g fontSize={12} fontWeight={700}>
      <text x={40} y={y} fill="var(--muted)">{ad}</text>
      <text x={110} y={y} textAnchor="middle" fill="var(--ink)">{sol}</text>
      <text x={170} y={y} textAnchor="middle" fill={sol === sag ? "var(--ink)" : "var(--bad)"}>{sag}</text>
      <text x={210} y={y} fill={sol === sag ? "var(--good)" : "var(--bad)"}>{sol === sag ? "✓" : "✗"}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={`CH₄ + 2 O₂ → CO₂ + ${k} H₂O; ${denk ? `ΔH ${isaretli(dH)} kJ` : "denklem denk değil"}`}>
      <text x={170} y={28} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--ink)">
        CH₄ + 2 O₂ → CO₂ + <tspan fill="var(--kimya)">{k}</tspan> H₂O(s)
      </text>
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <text x={110} y={54} textAnchor="middle">sol</text>
        <text x={170} y={54} textAnchor="middle">sağ</text>
      </g>
      {sat(74, "H atomu", hSol, hSag)}
      {sat(94, "O atomu", oSol, oSag)}
      <g fontSize={11} fill="var(--muted)" fontWeight={600}>
        <text x={240} y={70}>ΔH°f (kJ/mol)</text>
        <text x={240} y={88}>CH₄: −74,8</text>
        <text x={240} y={104}>O₂: 0</text>
        <text x={240} y={120}>CO₂: −393,5</text>
        <text x={240} y={136}>H₂O(s): −285,8</text>
      </g>
      <line x1={20} x2={320} y1={150} y2={150} stroke="var(--line)" />
      {denk ? (
        <g fontWeight={700}>
          <text x={20} y={174} fontSize={12} fill="var(--muted)">ΔH = [−393,5 + {k}·(−285,8)] − [−74,8]</text>
          <text x={20} y={204} fontSize={22} fontWeight={800} fill="var(--c1)">ΔH = {isaretli(dH)} kJ</text>
        </g>
      ) : (
        <text x={20} y={182} fontSize={13} fontWeight={800} fill="var(--bad)">Denklem denk değil: önce denkleştir</text>
      )}
    </svg>
  );
}

/* ---------- Hess yasası: CO'nun oluşum ısısı ---------- */

function Hess({ v }: SahneProps) {
  const ters = (v.ters ?? 0) === 1;
  const Y = (H: number) => 120 - (H / 393.5) * 88;
  const satir = (y: number, denklem: string, dH: string, renk = "var(--ink)") => (
    <g fontSize={12.5} fontWeight={700}>
      <text x={16} y={y} fill={renk}>{denklem}</text>
      <text x={326} y={y} textAnchor="end" fill={renk}>{dH}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={ters ? "İkinci denklem ters çevrildi: C + ½O₂ → CO, ΔH −110,5 kJ" : "İki denklem: karbonun ve CO'nun yanması"}>
      {satir(22, "C(k) + O₂(g) → CO₂(g)", "−393,5")}
      {ters ? satir(42, "CO₂(g) → CO(g) + ½O₂(g)", "+283,0", "var(--kimya)") : satir(42, "CO(g) + ½O₂(g) → CO₂(g)", "−283,0")}
      <line x1={16} x2={326} y1={52} y2={52} stroke="var(--ink)" strokeWidth={1.2} />
      {ters
        ? satir(70, "C(k) + ½O₂(g) → CO(g)", "−110,5", "var(--c1)")
        : <text x={16} y={70} fontSize={12} fontWeight={700} fill="var(--muted)">CO₂ sadeleşmiyor; istenen denklem çıkmıyor.</text>}
      <g>
        <line x1={40} x2={130} y1={Y(0)} y2={Y(0)} stroke="var(--ink)" strokeWidth={2} />
        <line x1={150} x2={240} y1={Y(-110.5)} y2={Y(-110.5)} stroke="var(--ink)" strokeWidth={2} />
        <line x1={40} x2={240} y1={Y(-393.5)} y2={Y(-393.5)} stroke="var(--ink)" strokeWidth={2} />
        <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
          <text x={40} y={Y(0) - 6}>C + O₂</text>
          <text x={244} y={Y(-110.5) + 4}>CO + ½O₂</text>
          <text x={248} y={Y(-393.5) + 4}>CO₂</text>
        </g>
        <line x1={64} x2={64} y1={Y(0) + 2} y2={Y(-393.5) - 8} stroke="var(--c2)" strokeWidth={2} />
        <path d={`M64 ${Y(-393.5) - 1} L59 ${Y(-393.5) - 10} L69 ${Y(-393.5) - 10} Z`} fill="var(--c2)" />
        <text x={72} y={(Y(0) + Y(-393.5)) / 2 + 4} fontSize={11.5} fontWeight={800} fill="var(--c2)">−393,5</text>
        <line x1={214} x2={214} y1={Y(-110.5) + 2} y2={Y(-393.5) - 8} stroke="var(--kimya)" strokeWidth={2} />
        <path d={`M214 ${Y(-393.5) - 1} L209 ${Y(-393.5) - 10} L219 ${Y(-393.5) - 10} Z`} fill="var(--kimya)" />
        <text x={222} y={(Y(-110.5) + Y(-393.5)) / 2 + 4} fontSize={11.5} fontWeight={800} fill="var(--kimya)">−283,0</text>
        {ters && (
          <g>
            <path d={`M118 ${Y(0) + 2} L162 ${Y(-110.5) - 4}`} stroke="var(--c1)" strokeWidth={2.2} fill="none" />
            <path d={`M166 ${Y(-110.5) - 2} L154 ${Y(-110.5) - 4} L160 ${Y(-110.5) - 12} Z`} fill="var(--c1)" />
            <text x={152} y={Y(0) + 6} fontSize={11.5} fontWeight={800} fill="var(--c1)">−110,5</text>
          </g>
        )}
      </g>
    </svg>
  );
}

/* ---------- bağ enerjileri: H₂ + Cl₂ → 2 HCl ---------- */

function Bag({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5));
  const kir = kes(u / 0.45), olus = kes((u - 0.55) / 0.45);
  const E = 679 * yumusak(kir) - 864 * yumusak(olus);
  // Atom yerleri: başta H–H ve Cl–Cl, sonda iki H–Cl.
  const ar = (a: number, b: number, k: number) => a + (b - a) * k;
  const bas = { h1: [56, 70], h2: [80, 70], c1: [56, 150], c2: [94, 150] };
  const orta = { h1: [44, 60], h2: [140, 60], c1: [44, 160], c2: [140, 160] };
  const son = { h1: [60, 92], h2: [156, 92], c1: [60, 132], c2: [156, 132] };
  const yer = (k: keyof typeof bas) => {
    const a = bas[k], m = orta[k], z = son[k];
    return olus > 0 ? [ar(m[0], z[0], yumusak(olus)), ar(m[1], z[1], yumusak(olus))] : [ar(a[0], m[0], yumusak(kir)), ar(a[1], m[1], yumusak(kir))];
  };
  const [h1x, h1y] = yer("h1"), [h2x, h2y] = yer("h2"), [c1x, c1y] = yer("c1"), [c2x, c2y] = yer("c2");
  const eski = 1 - kir, yeni = olus;
  const by = (e: number) => 140 - e * 0.13;
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`Bağ enerjisi: ${isaretli(Math.round(E), 0)} kJ`}>
      <g strokeWidth={4} strokeLinecap="round">
        <line x1={h1x} y1={h1y} x2={h2x} y2={h2y} stroke="var(--ink)" opacity={eski} />
        <line x1={c1x} y1={c1y} x2={c2x} y2={c2y} stroke="var(--ink)" opacity={eski} />
        <line x1={h1x} y1={h1y} x2={c1x} y2={c1y} stroke="var(--ink)" opacity={yeni} />
        <line x1={h2x} y1={h2y} x2={c2x} y2={c2y} stroke="var(--ink)" opacity={yeni} />
      </g>
      <g>
        <circle cx={h1x} cy={h1y} r={10} fill="#e9eef5" stroke="#9aa8ba" strokeWidth={1.4} />
        <circle cx={h2x} cy={h2y} r={10} fill="#e9eef5" stroke="#9aa8ba" strokeWidth={1.4} />
        <circle cx={c1x} cy={c1y} r={15} fill="var(--c3)" />
        <circle cx={c2x} cy={c2y} r={15} fill="var(--c3)" />
        <g fontSize={10.5} fontWeight={800} textAnchor="middle">
          <text x={h1x} y={h1y + 4} fill="var(--ink)">H</text>
          <text x={h2x} y={h2y + 4} fill="var(--ink)">H</text>
          <text x={c1x} y={c1y + 4} fill="#fff">Cl</text>
          <text x={c2x} y={c2y + 4} fill="#fff">Cl</text>
        </g>
      </g>
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        {u === 0 && <text x={112} y={74}>H–H: 436 kJ</text>}
        {u === 0 && <text x={112} y={154}>Cl–Cl: 243 kJ</text>}
        {u >= 1 && <text x={108} y={114} textAnchor="middle">H–Cl: 432 kJ</text>}
      </g>
      <line x1={226} x2={318} y1={140} y2={140} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={318} y={154} fontSize={10.5} fontWeight={700} textAnchor="end" fill="var(--muted)">başlangıç</text>
      <rect x={234} y={Math.min(by(E), 140)} width={30} height={Math.abs(by(E) - 140)} rx={3} fill={E >= 0 ? "var(--c2)" : "var(--c1)"} />
      <text x={249} y={E >= 0 ? by(E) - 6 : by(E) + 14} fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">{isaretli(Math.round(E), 0)} kJ</text>
      <g fontSize={11.5} fontWeight={700}>
        <text x={20} y={22} fill="var(--muted)">{kir > 0 && olus === 0 ? "Bağlar kırılıyor: enerji alınıyor" : olus > 0 ? "Yeni bağlar oluşuyor: enerji veriliyor" : "H₂ + Cl₂ → 2 HCl"}</text>
        {u >= 1 && <text x={20} y={204} fill="var(--ink)">kırılan 436 + 243 = 679 kJ; oluşan 2 × 432 = 864 kJ</text>}
        {u >= 1 && <text x={20} y={220} fill="var(--c1)">ΔH ≈ 679 − 864 = −185 kJ</text>}
      </g>
    </svg>
  );
}

/* ---------- kalorimetre: q = m·c·ΔT ---------- */

function Kalorimetre({ v }: SahneProps) {
  const m = v.m ?? 100, q = 8360, dT = q / (m * 4.18), T = 20 + dT;
  const h = (m / 500) * 100;
  return (
    <svg viewBox="0 0 340 216" role="img" aria-label={`${m} g su, 8,36 kJ ısı: ${virgul(T)} °C`}>
      <rect x={40} y={70} width={140} height={130} rx={10} fill="none" stroke="#c8ced6" strokeWidth={8} />
      <rect x={54} y={194 - h} width={112} height={h} fill={SU} />
      <path d="M54 72 L54 194 L166 194 L166 72" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <rect x={34} y={58} width={152} height={12} rx={4} fill="var(--ink)" />
      <rect x={82} y={150} width={50} height={30} rx={4} fill="var(--kimya)" opacity={0.8} />
      <text x={107} y={169} fontSize={10} fontWeight={800} textAnchor="middle" fill="#fff">tepkime</text>
      <Termometre x={146} ust={24} boy={130} deger={T} min={10} max={50} />
      <g fontSize={12} fontWeight={700}>
        <text x={200} y={56} fill="var(--muted)">q = <tspan fill="var(--kimya)">8,36 kJ</tspan></text>
        <text x={200} y={76} fill="var(--muted)">su: <tspan fill="var(--c1)">{m} g</tspan></text>
        <text x={200} y={96} fill="var(--muted)">c = 4,18 J/g·°C</text>
        <text x={200} y={126} fill="var(--muted)">ΔT = q / (m·c)</text>
        <text x={200} y={146} fill="var(--ink)">= {virgul(dT)} °C</text>
        <text x={200} y={182} fontSize={22} fontWeight={800} fill="var(--ink)">{virgul(T)} °C</text>
        <text x={200} y={200} fontSize={11} fill="var(--muted)">başlangıç 20 °C</text>
      </g>
    </svg>
  );
}

export const KIMYA8: Record<string, SahneKaydi> = {
  "kim8-cozunme": { C: Cozunme },
  "kim8-yuzde": { C: Yuzde },
  "kim8-molarite": { C: Molarite },
  "kim8-seyreltme": { C: Seyreltme },
  "kim8-iyon": { C: Iyon },
  "kim8-donma": { C: Donma },
  "kim8-gazoz": { C: Gazoz },
  "kim8-kap": { C: Kap },
  "kim8-pe": { C: PE },
  "kim8-metan": { C: Metan },
  "kim8-hess": { C: Hess },
  "kim8-bag": { C: Bag },
  "kim8-kalorimetre": { C: Kalorimetre },
};
