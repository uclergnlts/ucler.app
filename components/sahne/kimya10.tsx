"use client";
// Kimya sahneleri (redoks, elektrokimya): yükseltgenme basamağı hesabı, Cu²⁺ çözeltisinde çinko, aktiflik sırası,
// redoks olan ve olmayan tepkimeler; Daniell pili ve tuz köprüsü, standart potansiyeller, katsayı ve E°,
// suyun elektrolizi, Faraday hesabı, kalay ve çinko kaplamada korozyon.
import { rastgele, yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const oran = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? Math.min(1, t / sure) : 0);
const virgul = (x: number, b = 2) => x.toLocaleString("tr-TR", { maximumFractionDigits: b, minimumFractionDigits: 0 });
/** Sayıyı işaretiyle yazar: +6, −3, 0. */
const isaret = (n: number) => (n > 0 ? `+${virgul(n)}` : n < 0 ? `−${virgul(-n)}` : "0");
/** Binlikleri boşlukla ayırır: 19 300. */
const binlik = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const BAKIR = "#c46a2b", MAVI = "#2f7fd1", GRI = "#a7b1bd", DEMIR = "#7d8794";

/* ---------- yükseltgenme basamağı ---------- */

type Parca = { el: string; n: number; b: number | null };
const FORMUL: Record<string, { ad: string; yuk: number; parca: Parca[] }> = {
  h2so4: { ad: "H₂SO₄", yuk: 0, parca: [{ el: "H", n: 2, b: 1 }, { el: "S", n: 1, b: null }, { el: "O", n: 4, b: -2 }] },
  nh4: { ad: "NH₄⁺", yuk: 1, parca: [{ el: "N", n: 1, b: null }, { el: "H", n: 4, b: 1 }] },
};

function Basamak({ s, v }: SahneProps) {
  const f = FORMUL[String(s.formul ?? "h2so4")] ?? FORMUL.h2so4, x = v.x ?? 0;
  const W = 90, ara = 12, top = f.parca.length * W + (f.parca.length - 1) * ara, x0 = 170 - top / 2;
  const deger = (p: Parca) => p.b ?? x;
  const toplam = f.parca.reduce((a, p) => a + p.n * deger(p), 0), tamam = toplam === f.yuk;
  const ifade = f.parca.map((p) => (p.n > 1 ? `${p.n}(${isaret(deger(p))})` : `(${isaret(deger(p))})`)).join(" + ");
  return (
    <svg viewBox="0 0 340 214" role="img" aria-label={`${f.ad}: toplam ${isaret(toplam)}, olması gereken ${isaret(f.yuk)}`}>
      <text x={170} y={40} fontSize={28} fontWeight={800} textAnchor="middle" fill="var(--ink)">{f.ad}</text>
      {f.parca.map((p, i) => {
        const px = x0 + i * (W + ara), bil = p.b === null;
        return (
          <g key={i}>
            <rect x={px} y={60} width={W} height={80} rx={10} fill={bil ? "var(--kimya-soft)" : "var(--panel)"} stroke={bil ? "var(--kimya)" : "var(--line-2)"} strokeWidth={bil ? 2 : 1} />
            <text x={px + W / 2} y={86} fontSize={18} fontWeight={800} textAnchor="middle" fill="var(--ink)">{p.el}<tspan fontSize={12} fill="var(--muted)">{p.n > 1 ? ` ×${p.n}` : ""}</tspan></text>
            <text x={px + W / 2} y={111} fontSize={16} fontWeight={800} textAnchor="middle" fill={bil ? "var(--kimya)" : "var(--ink)"}>{isaret(deger(p))}</text>
            <text x={px + W / 2} y={130} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">katkı {isaret(p.n * deger(p))}</text>
          </g>
        );
      })}
      <text x={170} y={170} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">{ifade} = {isaret(toplam)}</text>
      <text x={170} y={198} fontSize={13} fontWeight={800} textAnchor="middle" fill={tamam ? "var(--good)" : "var(--muted)"}>
        {tamam ? `Toplam ${isaret(f.yuk)}: tanecik yüküne eşit` : `Toplam ${isaret(f.yuk)} olmalı (${f.yuk === 0 ? "nötr bileşik" : "iyon yükü"})`}
      </text>
    </svg>
  );
}

/* ---------- Cu²⁺ çözeltisinde çinko şerit ---------- */

function ZnCu({ s, t, oynuyor }: SahneProps) {
  const son = s.son === true;
  const u = son ? 1 : oran(t, oynuyor, Number(s.sure ?? 5)), bitti = u >= 1;
  const r = rastgele(7);
  const birikim = Array.from({ length: 22 }, () => ({ yan: r() < 0.5 ? -1 : 1, y: 92 + r() * 72, r: 2.2 + r() * 2 }));
  const cuIyon = Array.from({ length: 7 }, () => ({ x: 104 + r() * 50 + (r() < 0.5 ? 0 : 80), y: 96 + r() * 66 }));
  const znIyon = Array.from({ length: 4 }, () => ({ x: 108 + r() * 40 + (r() < 0.5 ? 0 : 80), y: 100 + r() * 60 }));
  const nCu = Math.round(7 - u * 5), nZn = Math.round(u * 4), nBir = Math.round(u * birikim.length);
  const w = 18 * (1 - 0.18 * u);
  const ok = 0 < u && u < 1 && Math.floor(t * 3) % 2 === 0;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "Çinko şeritte bakır birikti, mavi renk soldu" : "Çinko şerit mavi CuSO₄ çözeltisinde"}>
      <rect x={92} y={80} width={156} height={96} fill={MAVI} opacity={0.08 + 0.36 * (1 - 0.7 * u)} />
      {cuIyon.slice(0, nCu).map((p, i) => <circle key={`c${i}`} cx={p.x} cy={p.y} r={4} fill={MAVI} />)}
      {znIyon.slice(0, nZn).map((p, i) => <circle key={`z${i}`} cx={p.x} cy={p.y} r={4} fill="#fff" stroke={DEMIR} strokeWidth={1.4} />)}
      <rect x={170 - w / 2} y={30} width={w} height={136} rx={2} fill={GRI} stroke="#8a95a3" />
      {birikim.slice(0, nBir).map((p, i) => <circle key={`b${i}`} cx={170 + p.yan * (w / 2 + 1)} cy={p.y} r={p.r} fill={BAKIR} />)}
      <path d="M92 50 L92 176 Q92 182 98 182 L242 182 Q248 182 248 176 L248 50" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={186} y={44} fontSize={12} fontWeight={800} fill="var(--ink)">Zn şerit</text>
      {ok && (
        <g>
          <line x1={182} x2={206} y1={124} y2={124} stroke="var(--c4)" strokeWidth={2.4} />
          <path d="M212 124 L204 119 L204 129 Z" fill="var(--c4)" />
          <text x={196} y={116} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="#b7800d">2e⁻</text>
        </g>
      )}
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <circle cx={262} cy={98} r={4} fill={MAVI} /><text x={270} y={102}>Cu²⁺</text>
        <circle cx={262} cy={118} r={4} fill="#fff" stroke={DEMIR} strokeWidth={1.4} /><text x={270} y={122}>Zn²⁺</text>
        <circle cx={262} cy={138} r={4} fill={BAKIR} /><text x={270} y={142}>Cu (katı)</text>
      </g>
      {bitti ? (
        <g fontSize={12} fontWeight={800}>
          <text x={20} y={206} fill="var(--ink)">Zn → Zn²⁺ + 2e⁻</text>
          <text x={320} y={206} textAnchor="end" fill="var(--c2)">yükseltgenme</text>
          <text x={20} y={226} fill="var(--ink)">Cu²⁺ + 2e⁻ → Cu</text>
          <text x={320} y={226} textAnchor="end" fill="var(--c1)">indirgenme</text>
        </g>
      ) : (
        <text x={170} y={210} fontSize={12} fontWeight={700} textAnchor="middle" fill="var(--muted)">mavi CuSO₄ çözeltisi</text>
      )}
    </svg>
  );
}

/* ---------- aktiflik sırası ---------- */

const SIRA = ["K", "Ca", "Na", "Mg", "Al", "Zn", "Fe", "Ni", "Sn", "Pb", "H", "Cu", "Ag", "Au"];
const METAL = SIRA.filter((m) => m !== "H"); // sayaç bu dizinin sırasını kullanır (0-12)
const DENKLEM: Record<string, string> = {
  K: "2K + 2H₂O → 2KOH + H₂", Ca: "Ca + 2H₂O → Ca(OH)₂ + H₂", Na: "2Na + 2H₂O → 2NaOH + H₂",
  Mg: "Mg + Cu²⁺ → Mg²⁺ + Cu", Al: "2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu", Zn: "Zn + Cu²⁺ → Zn²⁺ + Cu",
  Fe: "Fe + Cu²⁺ → Fe²⁺ + Cu", Ni: "Ni + Cu²⁺ → Ni²⁺ + Cu", Sn: "Sn + Cu²⁺ → Sn²⁺ + Cu", Pb: "Pb + Cu²⁺ → Pb²⁺ + Cu",
  Cu: "Cu + Cu²⁺: değişim yok", Ag: "Ag + Cu²⁺: tepkime yok", Au: "Au + Cu²⁺: tepkime yok",
};

function Aktiflik({ v, set }: SahneProps) {
  const m = Math.max(0, Math.min(12, v.m ?? 5)), ad = METAL[m];
  const durum = m <= 2 ? "su" : m <= 9 ? "var" : m === 10 ? "ayni" : "yok";
  const W = 320 / SIRA.length;
  const r = rastgele(3);
  const birikim = Array.from({ length: 14 }, () => ({ yan: r() < 0.5 ? -1 : 1, y: 120 + r() * 52 }));
  return (
    <svg viewBox="0 0 340 226" role="img" aria-label={`${ad} metali Cu²⁺ çözeltisinde: ${DENKLEM[ad]}`}>
      <text x={10} y={16} fontSize={11} fontWeight={700} fill="var(--muted)">daha aktif</text>
      <text x={330} y={16} fontSize={11} fontWeight={700} textAnchor="end" fill="var(--muted)">daha az aktif</text>
      <line x1={80} x2={252} y1={12} y2={12} stroke="var(--muted)" strokeWidth={1.4} />
      <path d="M258 12 L250 8 L250 16 Z" fill="var(--muted)" />
      {SIRA.map((e, i) => {
        const x = 10 + i * W, mi = METAL.indexOf(e), sec = mi === m, h = e === "H";
        return (
          <g key={e} onClick={h ? undefined : () => set("m", mi)} style={{ cursor: h ? "default" : "pointer" }}>
            <rect x={x + 1} y={26} width={W - 2} height={28} rx={6} fill={sec ? "var(--kimya)" : h ? "none" : "var(--panel)"} stroke={e === "Cu" ? MAVI : "var(--line-2)"} strokeWidth={e === "Cu" ? 2 : 1} strokeDasharray={h ? "3 3" : undefined} />
            <text x={x + W / 2} y={44} fontSize={11} fontWeight={800} textAnchor="middle" fill={sec ? "#fff" : h ? "var(--muted)" : "var(--ink)"}>{e}</text>
          </g>
        );
      })}
      <rect x={42} y={110} width={106} height={70} fill={MAVI} opacity={durum === "var" ? 0.2 : 0.4} />
      <rect x={88} y={76} width={14} height={98} rx={2} fill={ad === "Au" ? "#e3b53b" : ad === "Ag" ? "#d5dbe3" : ad === "Cu" ? BAKIR : GRI} stroke="#8a95a3" />
      {durum === "var" && birikim.map((p, i) => <circle key={i} cx={95 + p.yan * 8} cy={p.y} r={3} fill={BAKIR} />)}
      {durum === "su" && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={112 + (i % 2) * 12} cy={160 - i * 10} r={3} fill="none" stroke="var(--c1)" strokeWidth={1.3} />)}
      <path d="M40 92 L40 180 Q40 186 46 186 L144 186 Q150 186 150 180 L150 92" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <text x={95} y={202} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">Cu²⁺ çözeltisi</text>
      <g fontWeight={800}>
        <text x={168} y={96} fontSize={14} fill="var(--ink)">Metal: {ad}</text>
        <text x={168} y={120} fontSize={12.5} fill={durum === "var" ? "var(--good)" : durum === "su" ? "var(--c4)" : "var(--bad)"}>
          {durum === "var" ? "Tepkime var" : durum === "su" ? "Suyla tepkimeye girer" : durum === "ayni" ? "Aynı metal" : "Tepkime yok"}
        </text>
        <g fontSize={11.5} fontWeight={700} fill="var(--muted)">
          {durum === "var" && <><text x={168} y={142}>{ad}, Cu'dan aktif: Cu²⁺</text><text x={168} y={158}>iyonunu indirger.</text></>}
          {durum === "su" && <><text x={168} y={142}>Çok aktif: sudan H₂</text><text x={168} y={158}>açığa çıkarır.</text></>}
          {durum === "ayni" && <text x={168} y={142}>Değişim olmaz.</text>}
          {durum === "yok" && <><text x={168} y={142}>Cu daha aktif; {ad}, Cu²⁺</text><text x={168} y={158}>iyonunu indirgeyemez.</text></>}
        </g>
      </g>
      <text x={170} y={220} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">{DENKLEM[ad]}</text>
    </svg>
  );
}

/* ---------- redoks mu? ---------- */

const TEPKIME = [
  { harf: "A", d: "Zn + 2HCl → ZnCl₂ + H₂", b: "Zn 0 → +2, H +1 → 0", redoks: true },
  { harf: "B", d: "HCl + NaOH → NaCl + H₂O", b: "H +1, Cl −1, Na +1, O −2", redoks: false },
  { harf: "C", d: "CH₄ + 2O₂ → CO₂ + 2H₂O", b: "C −4 → +4, O 0 → −2", redoks: true },
];

function RedoksMu({ v }: SahneProps) {
  const goster = (v.g ?? 0) === 1;
  return (
    <svg viewBox="0 0 340 204" role="img" aria-label={goster ? "A ve C redoks, B redoks değil" : "Üç tepkime, basamaklar gizli"}>
      {TEPKIME.map((k, i) => {
        const y = 14 + i * 64;
        return (
          <g key={k.harf}>
            <rect x={8} y={y} width={324} height={56} rx={10} fill="var(--panel)" />
            <circle cx={28} cy={y + 20} r={11} fill="var(--kimya)" />
            <text x={28} y={y + 24} fontSize={12} fontWeight={800} textAnchor="middle" fill="#fff">{k.harf}</text>
            <text x={48} y={y + 25} fontSize={14} fontWeight={800} fill="var(--ink)">{k.d}</text>
            {goster ? (
              <>
                <text x={48} y={y + 45} fontSize={11.5} fontWeight={700} fill="var(--muted)">{k.b}</text>
                <text x={322} y={y + 45} fontSize={11.5} fontWeight={800} textAnchor="end" fill={k.redoks ? "var(--good)" : "var(--c2)"}>{k.redoks ? "redoks" : "değişmez"}</text>
              </>
            ) : (
              <text x={48} y={y + 45} fontSize={11.5} fontWeight={700} fill="var(--muted)">basamaklar gizli</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Daniell pili ---------- */

function Daniell({ s, v, t, oynuyor }: SahneProps) {
  const oynar = s.sure !== undefined, kopru = (v.k ?? 1) === 1;
  const u = oynar ? oran(t, oynuyor, Number(s.sure)) : 1, bitti = u >= 1;
  const akim = kopru && (oynar ? u > 0 : true);
  const wZn = 16 * (1 - 0.25 * (oynar ? u : 0)), wCu = 16 * (1 + 0.3 * (oynar ? u : 0));
  // Tel yolu: Zn ucu → yukarı → sağa → Cu ucu
  const yol = [[80, 70], [80, 36], [260, 36], [260, 70]];
  const uzun = 34 + 180 + 34;
  const nokta = (f: number) => {
    let d = f * uzun;
    for (let i = 0; i < 3; i++) {
      const [ax, ay] = yol[i], [bx, by] = yol[i + 1], l = Math.hypot(bx - ax, by - ay);
      if (d <= l) return { x: ax + ((bx - ax) * d) / l, y: ay + ((by - ay) * d) / l };
      d -= l;
    }
    return { x: 260, y: 70 };
  };
  const hareket = kopru && oynar && u > 0 && u < 1;
  const etiket = !oynar || bitti;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={kopru ? (akim ? "Elektronlar telde Zn'den Cu'ya akıyor, 1,10 V" : "Daniell pili") : "Tuz köprüsü yok: 0 V, akım yok"}>
      <polyline points={yol.map((p) => p.join(",")).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={2} />
      <circle cx={170} cy={36} r={18} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
      <text x={170} y={41} fontSize={14} fontWeight={800} textAnchor="middle" fill="var(--ink)">V</text>
      <text x={170} y={72} fontSize={13} fontWeight={800} textAnchor="middle" fill={kopru ? "var(--ink)" : "var(--bad)"}>{kopru ? "1,10 V" : "0,00 V"}</text>
      {hareket && [0, 1, 2, 3, 4].map((j) => { const p = nokta((t * 0.5 + j / 5) % 1); return <circle key={j} cx={p.x} cy={p.y} r={4} fill="var(--c4)" />; })}
      {akim && !hareket && (
        <g>
          <line x1={110} x2={142} y1={24} y2={24} stroke="var(--c4)" strokeWidth={2.4} />
          <path d="M148 24 L140 19 L140 29 Z" fill="var(--c4)" />
          <text x={104} y={28} fontSize={12} fontWeight={800} textAnchor="end" fill="#b7800d">e⁻</text>
        </g>
      )}
      {/* tuz köprüsü */}
      {kopru ? (
        <path d="M108 128 L108 90 L232 90 L232 128" fill="none" stroke="#d8dee6" strokeWidth={12} strokeLinejoin="round" />
      ) : (
        <path d="M108 128 L108 90 L232 90 L232 128" fill="none" stroke="var(--line-2)" strokeWidth={1.5} strokeDasharray="4 4" />
      )}
      <text x={170} y={110} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{kopru ? "tuz köprüsü" : "köprü yok"}</text>
      {kopru && <text x={170} y={124} fontSize={10.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">(KNO₃)</text>}
      {/* kaplar */}
      <rect x={32} y={116} width={92} height={70} fill="#e8edf3" />
      <rect x={216} y={116} width={92} height={70} fill={MAVI} opacity={0.35 - 0.12 * (oynar ? u : 0)} />
      <rect x={80 - wZn / 2} y={70} width={wZn} height={108} rx={2} fill={GRI} stroke="#8a95a3" />
      <rect x={260 - wCu / 2} y={70} width={wCu} height={108} rx={2} fill={BAKIR} />
      <path d="M30 100 L30 186 Q30 192 36 192 L120 192 Q126 192 126 186 L126 100 M214 100 L214 186 Q214 192 220 192 L304 192 Q310 192 310 186 L310 100" fill="none" stroke="var(--ink)" strokeWidth={2} />
      {etiket ? (
        <g fontWeight={800}>
          <text x={80} y={210} fontSize={12.5} textAnchor="middle" fill="var(--c2)">anot (−)</text>
          <text x={260} y={210} fontSize={12.5} textAnchor="middle" fill="var(--c1)">katot (+)</text>
          <text x={80} y={228} fontSize={11} textAnchor="middle" fill="var(--muted)">Zn → Zn²⁺ + 2e⁻</text>
          <text x={260} y={228} fontSize={11} textAnchor="middle" fill="var(--muted)">Cu²⁺ + 2e⁻ → Cu</text>
        </g>
      ) : (
        <g fontSize={12} fontWeight={800} textAnchor="middle" fill="var(--ink)">
          <text x={80} y={210}>Zn | ZnSO₄</text>
          <text x={260} y={210}>Cu | CuSO₄</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- standart potansiyeller ---------- */

const YARI = [
  { ad: "Mg²⁺/Mg", e: -2.37 }, { ad: "Zn²⁺/Zn", e: -0.76 }, { ad: "Fe²⁺/Fe", e: -0.44 },
  { ad: "Ni²⁺/Ni", e: -0.25 }, { ad: "Cu²⁺/Cu", e: 0.34 }, { ad: "Ag⁺/Ag", e: 0.8 },
];

function Potansiyel({ v }: SahneProps) {
  const a = Math.max(1, Math.min(6, v.a ?? 2)) - 1, k = Math.max(1, Math.min(6, v.k ?? 5)) - 1;
  const E = YARI[k].e - YARI[a].e, ayni = a === k;
  const iki = (x: number) => Math.abs(x).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const isr = (x: number) => (x < 0 ? `−${iki(x)}` : `+${iki(x)}`);
  const sayi = (x: number) => (x < 0 ? `(−${iki(x)})` : iki(x));
  return (
    <svg viewBox="0 0 340 228" role="img" aria-label={ayni ? "Anot ve katot aynı" : `Anot ${YARI[a].ad}, katot ${YARI[k].ad}: E° pil ${isaret(E)} V`}>
      <g fontSize={11} fontWeight={700} fill="var(--muted)">
        <text x={40} y={16}>yarı hücre</text>
        <text x={172} y={16} textAnchor="end">E° (V)</text>
      </g>
      {YARI.map((h, i) => {
        const y = 26 + i * 24, an = i === a, ka = i === k;
        return (
          <g key={h.ad}>
            <rect x={8} y={y} width={324} height={21} rx={6} fill={an || ka ? "var(--panel)" : "none"} />
            <text x={22} y={y + 15} fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">{i + 1}</text>
            <text x={40} y={y + 15} fontSize={12.5} fontWeight={800} fill="var(--ink)">{h.ad}</text>
            <text x={172} y={y + 15} fontSize={12.5} fontWeight={800} textAnchor="end" fill="var(--ink)">{isr(h.e)}</text>
            {an && <><rect x={192} y={y + 3} width={56} height={15} rx={7} fill="var(--c2)" /><text x={220} y={y + 14} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="#fff">anot</text></>}
            {ka && <><rect x={256} y={y + 3} width={56} height={15} rx={7} fill="var(--c1)" /><text x={284} y={y + 14} fontSize={10.5} fontWeight={800} textAnchor="middle" fill="#fff">katot</text></>}
          </g>
        );
      })}
      <text x={170} y={190} fontSize={12.5} fontWeight={700} textAnchor="middle" fill="var(--muted)">E°pil = E°katot − E°anot</text>
      <text x={170} y={214} fontSize={14} fontWeight={800} textAnchor="middle" fill={ayni ? "var(--bad)" : E > 0 ? "var(--ink)" : "var(--bad)"}>
        {ayni ? "Anot ve katot aynı olamaz" : `= ${sayi(YARI[k].e)} − ${sayi(YARI[a].e)} = ${isr(E)} V${E < 0 ? ": istemsiz" : ""}`}
      </text>
    </svg>
  );
}

/* ---------- katsayı ve E° ---------- */

function Katsayi() {
  return (
    <svg viewBox="0 0 340 196" role="img" aria-label="Cu + 2Ag⁺ → Cu²⁺ + 2Ag: yarı tepkimeler ve E° değerleri">
      <text x={170} y={30} fontSize={16} fontWeight={800} textAnchor="middle" fill="var(--ink)">Cu + 2Ag⁺ → Cu²⁺ + 2Ag</text>
      <g>
        <rect x={8} y={50} width={324} height={50} rx={10} fill="var(--panel)" />
        <text x={20} y={70} fontSize={11.5} fontWeight={800} fill="var(--c2)">anot</text>
        <text x={20} y={90} fontSize={13.5} fontWeight={800} fill="var(--ink)">Cu → Cu²⁺ + 2e⁻</text>
        <text x={320} y={90} fontSize={12} fontWeight={700} textAnchor="end" fill="var(--muted)">Cu²⁺/Cu: +0,34 V</text>
      </g>
      <g>
        <rect x={8} y={108} width={324} height={50} rx={10} fill="var(--panel)" />
        <text x={20} y={128} fontSize={11.5} fontWeight={800} fill="var(--c1)">katot</text>
        <text x={64} y={128} fontSize={11} fontWeight={700} fill="var(--muted)">(×2 ile çarpıldı)</text>
        <text x={20} y={148} fontSize={13.5} fontWeight={800} fill="var(--ink)">2Ag⁺ + 2e⁻ → 2Ag</text>
        <text x={320} y={148} fontSize={12} fontWeight={700} textAnchor="end" fill="var(--muted)">Ag⁺/Ag: +0,80 V</text>
      </g>
      <text x={170} y={184} fontSize={15} fontWeight={800} textAnchor="middle" fill="var(--kimya)">E°pil = ?</text>
    </svg>
  );
}

/* ---------- suyun elektrolizi ---------- */

function Su({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5)), bitti = u >= 1;
  const H = 100 * u, O = 50 * u;
  const tup = [{ x: 120, gaz: H, ad: "H₂", hacim: 20 * u, kab: 5 }, { x: 220, gaz: O, ad: "O₂", hacim: 10 * u, kab: 2 }];
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={bitti ? "Katotta 20 mL H₂, anotta 10 mL O₂" : "Suyun elektrolizi"}>
      <text x={170} y={16} fontSize={13} fontWeight={800} textAnchor="middle" fill="var(--ink)">2H₂O → 2H₂ + O₂</text>
      <rect x={62} y={150} width={216} height={50} fill="#d7e8f7" />
      {tup.map((k, i) => (
        <g key={i}>
          <rect x={k.x - 15} y={30} width={30} height={162} rx={13} fill="#d7e8f7" />
          {k.gaz > 0.5 && <rect x={k.x - 12} y={33} width={24} height={k.gaz} rx={10} fill="#ffffff" />}
          {u > 0 && u < 1 && Array.from({ length: k.kab }, (_, j) => {
            const f = (t * 0.9 + j / k.kab) % 1, alt = 176, ust = 36 + k.gaz;
            return <circle key={j} cx={k.x - 6 + (j % 3) * 6} cy={alt - f * Math.max(0, alt - ust)} r={2.4} fill="none" stroke="var(--c1)" strokeWidth={1.2} />;
          })}
          <rect x={k.x - 15} y={30} width={30} height={162} rx={13} fill="none" stroke="var(--ink)" strokeWidth={2} />
          <rect x={k.x - 7} y={178} width={14} height={16} fill="var(--ink)" />
        </g>
      ))}
      <path d="M60 136 L60 200 Q60 206 66 206 L274 206 Q280 206 280 200 L280 136" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <path d="M120 194 L120 224 L162 224 M178 224 L220 224 L220 194" fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      {/* Pil: kısa kalın çizgi − uç (katoda), uzun ince çizgi + uç (anoda) */}
      <line x1={164} x2={164} y1={218} y2={230} stroke="var(--ink)" strokeWidth={3} />
      <line x1={176} x2={176} y1={214} y2={234} stroke="var(--ink)" strokeWidth={1.6} />
      <g fontSize={12} fontWeight={800}>
        <text x={156} y={220} textAnchor="end" fill="var(--c1)">−</text>
        <text x={186} y={220} fill="var(--c2)">+</text>
      </g>
      <g fontSize={12} fontWeight={800}>
        <text x={98} y={50} textAnchor="end" fill="var(--c1)">katot (−)</text>
        <text x={242} y={50} fill="var(--c2)">anot (+)</text>
        {t > 0 && <text x={98} y={70} textAnchor="end" fill="var(--ink)">{tup[0].ad}: {Math.round(tup[0].hacim)} mL</text>}
        {t > 0 && <text x={242} y={70} fill="var(--ink)">{tup[1].ad}: {Math.round(tup[1].hacim)} mL</text>}
      </g>
      {bitti && <text x={170} y={120} fontSize={12.5} fontWeight={800} textAnchor="middle" fill="var(--good)">2 : 1</text>}
    </svg>
  );
}

/* ---------- Faraday ---------- */

const F = 96500;
function Faraday({ v }: SahneProps) {
  const I = 4, t = v.t ?? 1930, Q = I * t, ne = Q / F, nCu = ne / 2, m = nCu * 63.5;
  const kalin = 2 + Math.min(10, (m / 6.35) * 6);
  return (
    <svg viewBox="0 0 340 216" role="img" aria-label={`${t} saniyede ${virgul(m)} g bakır`}>
      <path d="M44 66 L44 30 L84 30 M106 30 L136 30 L136 66" fill="none" stroke="var(--ink)" strokeWidth={1.6} />
      <circle cx={95} cy={30} r={11} fill="var(--surface)" stroke="var(--ink)" strokeWidth={1.6} />
      <text x={95} y={34} fontSize={11} fontWeight={800} textAnchor="middle" fill="var(--ink)">A</text>
      <text x={95} y={56} fontSize={11.5} fontWeight={800} textAnchor="middle" fill="var(--ink)">4 A</text>
      <rect x={22} y={84} width={136} height={58} fill={MAVI} opacity={0.32} />
      <rect x={38} y={66} width={12} height={70} fill={BAKIR} />
      <rect x={136 - 4 - kalin / 2} y={84} width={8 + kalin} height={52} rx={2} fill={BAKIR} />
      <rect x={132} y={66} width={8} height={70} fill="#9aa8ba" />
      <path d="M20 74 L20 142 Q20 148 26 148 L154 148 Q160 148 160 142 L160 74" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <g fontSize={11} fontWeight={700} textAnchor="middle" fill="var(--muted)">
        <text x={44} y={164}>anot (+)</text>
        <text x={136} y={164}>katot (−)</text>
      </g>
      <g fontWeight={800}>
        <text x={180} y={78} fontSize={12.5} fill="var(--ink)">Cu²⁺ + 2e⁻ → Cu</text>
        <text x={180} y={104} fontSize={12} fill="var(--muted)">t = {t} s</text>
        <text x={180} y={124} fontSize={12} fill="var(--muted)">≈ {virgul(t / 60, 0)} dk</text>
        <text x={180} y={152} fontSize={15} fill="var(--kimya)">m(Cu) = {virgul(m)} g</text>
      </g>
      <g fontSize={12} fontWeight={700} fill="var(--ink)">
        <text x={20} y={188}>Q = I·t = {binlik(Q)} C → n(e⁻) = {virgul(ne, 3)} mol</text>
        <text x={20} y={208}>n(Cu) = n(e⁻) / 2 = {virgul(nCu, 3)} mol</text>
      </g>
    </svg>
  );
}

/* ---------- korozyon: kalay ve çinko kaplama ---------- */

function Korozyon({ s, t, oynuyor }: SahneProps) {
  const u = oran(t, oynuyor, Number(s.sure ?? 5)), bitti = u >= 1, k = yumusak(u);
  const civi = (y: number, kaplama: string, renk: string, cinko: boolean) => {
    const bosluk = cinko ? 10 + k * 34 : 10; // çinko çizik çevresinde çözülür
    return (
      <g>
        <ellipse cx={170} cy={y - 4} rx={58} ry={18} fill="#d7e8f7" opacity={0.8} />
        <rect x={34} y={y - 10} width={260} height={20} rx={3} fill={renk} />
        <rect x={40} y={y - 6} width={248} height={12} fill={DEMIR} />
        <path d={`M294 ${y - 10} L316 ${y} L294 ${y + 10} Z`} fill={DEMIR} />
        <rect x={20} y={y - 16} width={16} height={32} rx={3} fill={DEMIR} />
        <rect x={170 - bosluk} y={y - 11} width={bosluk * 2} height={6} fill="#d7e8f7" />
        {!cinko && k > 0 && <ellipse cx={170} cy={y - 2} rx={6 + k * 34} ry={3 + k * 4} fill={BAKIR} opacity={0.9} />}
        {cinko && k > 0 && [0, 1, 2, 3].map((j) => <circle key={j} cx={140 + j * 20} cy={y - 16} r={3.5} fill="#fff" stroke={DEMIR} strokeWidth={1.2} opacity={k} />)}
        <text x={20} y={y - 26} fontSize={12.5} fontWeight={800} fill="var(--ink)">{kaplama}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 340 222" role="img" aria-label={bitti ? "Kalay kaplı çivi paslandı, çinko kaplı çivide çinko çözüldü, demir korundu" : "Çizilmiş kalay ve çinko kaplı çiviler tuzlu suda"}>
      {civi(54, "kalay (Sn) kaplı, çizik", "#c9ced6", false)}
      {civi(150, "çinko (Zn) kaplı, çizik", "#9fb3c8", true)}
      <g fontSize={11.5} fontWeight={800}>
        {bitti && <text x={20} y={88} fill="var(--bad)">Demir paslandı: Fe, Sn'den aktif, anot olur.</text>}
        {bitti && <text x={20} y={184} fill="var(--good)">Zn yükseltgendi, demir korundu.</text>}
      </g>
      <text x={20} y={212} fontSize={11} fontWeight={600} fill="var(--muted)">Mavi damla: tuzlu su. Hızlandırılmış gösterim.</text>
    </svg>
  );
}

export const KIMYA10: Record<string, SahneKaydi> = {
  "kim10-basamak": { C: Basamak },
  "kim10-zncu": { C: ZnCu },
  "kim10-aktiflik": { C: Aktiflik },
  "kim10-redoksmu": { C: RedoksMu },
  "kim10-daniell": { C: Daniell },
  "kim10-potansiyel": {
    C: Potansiyel,
    geri: (v) => (v.a === v.k ? { baslik: "Aynı yarı hücre", metin: "Anot ve katot farklı yarı hücreler olmalı." } : null),
  },
  "kim10-katsayi": { C: Katsayi },
  "kim10-su": { C: Su },
  "kim10-faraday": { C: Faraday },
  "kim10-korozyon": { C: Korozyon },
};
