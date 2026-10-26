"use client";
// Kimya sahneleri (yeşil kimya ve nanoteknoloji): makro ve mikro ölçekli deney, küçüldükçe artan yüzey alanı,
// atık özütüyle gümüş nanoparçacık, besin zincirinde ağır metal birikimi, nişasta filmi ve gliserol,
// atıktan fermantasyonla hidrojen.
import type { SahneKaydi, SahneProps } from "./ortak";

/** Türkçe sayı: ondalık virgül, binlik ayırıcı yok. */
const say = (x: number, d = 1) =>
  x.toLocaleString("tr-TR", { maximumFractionDigits: d, useGrouping: false }).replace("-", "−");
const sinir = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
/** Oynatma ilerlemesi 0..1 (hiç oynatılmadıysa 0). */
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? sinir(t / sure, 0, 1) : 0);
const yumusak = (u: number) => { const k = sinir(u, 0, 1); return k * k * (3 - 2 * k); };

/* ================= 1. Makro ve mikro ölçekli deney ================= */

// Aynı tepkime (temsilî değerler): beherde 50 mL çözelti, 500 mL yıkama suyu; kuyucuklu plakada 0,5 mL ve 20 mL.
const OLCEK = {
  makro: { kimyasal: 50, su: 500, atik: 50 },
  mikro: { kimyasal: 0.5, su: 20, atik: 0.5 },
};
function Mikro({ v }: SahneProps) {
  const mikro = (v.mikro ?? 0) > 0.5, o = mikro ? OLCEK.mikro : OLCEK.makro;
  const satir: [string, number, number, string][] = [
    ["kimyasal", o.kimyasal, OLCEK.makro.kimyasal, "var(--c2)"],
    ["yıkama suyu", o.su, OLCEK.makro.su, "var(--c1)"],
    ["atık", o.atik, OLCEK.makro.atik, "var(--c4)"],
  ];
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={mikro ? "Mikro ölçek: kuyucuklu plakada birkaç damla" : "Makro ölçek: beherde 50 mL"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill="var(--ink)">{mikro ? "Mikro ölçek: kuyucuklu plaka" : "Makro ölçek: beher"}</text>
      {mikro ? (
        <g>
          <rect x={30} y={60} width={110} height={74} rx={8} fill="var(--panel)" stroke="var(--ink)" strokeWidth={1.4} />
          {Array.from({ length: 12 }, (_, k) => (
            <circle key={k} cx={48 + (k % 4) * 25} cy={78 + Math.floor(k / 4) * 20} r={7} fill={k === 5 ? "var(--acc, var(--c2))" : "var(--line)"} fillOpacity={k === 5 ? 0.6 : 1} stroke="var(--muted)" strokeWidth={0.8} />
          ))}
          <text x={85} y={152} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">birkaç damla</text>
        </g>
      ) : (
        <g>
          <path d="M50 52 V140 Q50 148 58 148 H112 Q120 148 120 140 V52" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
          <path d="M51 84 H119 V140 Q119 147 112 147 H58 Q51 147 51 140 Z" fill="var(--acc, var(--c2))" fillOpacity={0.35} />
          <text x={85} y={166} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">50 mL çözelti</text>
        </g>
      )}
      {satir.map(([ad, deger, enCok, renk], i) => {
        const y = 62 + i * 46, w = Math.max(2, (deger / enCok) * 140);
        return (
          <g key={ad}>
            <text x={170} y={y} fontSize={11.5} fontWeight={700} fill="var(--ink)">{ad}</text>
            <rect x={170} y={y + 6} width={140} height={14} rx={3} fill="var(--line)" />
            <rect x={170} y={y + 6} width={w} height={14} rx={3} fill={renk} fillOpacity={0.75} />
            <text x={326} y={y} fontSize={11.5} fontWeight={800} fill={renk} textAnchor="end">{say(deger)} mL</text>
          </g>
        );
      })}
      <text x={326} y={226} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="end">aynı tepkime; değerler temsilîdir</text>
    </svg>
  );
}

/* ================= 2. Küçüldükçe artan yüzey ================= */

// 1 cm³ küp, kenarı 10^-k cm olan küplere bölünür. Toplam yüzey = 6 × 10^k cm².
const KENAR = ["1 cm", "1 mm", "100 µm", "10 µm", "1 µm", "100 nm", "10 nm"];
const yuzeyYazi = (k: number) => {
  const cm2 = 6 * 10 ** k;
  return cm2 < 10000 ? `${say(cm2, 0)} cm²` : `${say(cm2 / 10000, 2)} m²`;
};
function Nano({ v }: SahneProps) {
  const k = Math.round(sinir(v.k ?? 0, 0, 6)), n = [1, 2, 3, 5, 7, 10, 14][k];
  const X = 40, Y = 60, A = 120, c = A / n;
  const nano = k >= 5;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Kenar ${KENAR[k]}, toplam yüzey ${yuzeyYazi(k)}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={nano ? "var(--c3)" : "var(--ink)"}>Kenar {KENAR[k]}{nano ? ": nano ölçek" : ""}</text>
      {/* küpün ön yüzü ızgara, üst ve yan yüz eğik */}
      <path d={`M${X} ${Y} L${X + 30} ${Y - 26} L${X + A + 30} ${Y - 26} L${X + A} ${Y} Z`} fill="var(--acc, var(--c2))" fillOpacity={0.12} stroke="var(--ink)" strokeWidth={1.2} />
      <path d={`M${X + A} ${Y} L${X + A + 30} ${Y - 26} L${X + A + 30} ${Y + A - 26} L${X + A} ${Y + A} Z`} fill="var(--acc, var(--c2))" fillOpacity={0.2} stroke="var(--ink)" strokeWidth={1.2} />
      <rect x={X} y={Y} width={A} height={A} fill="var(--acc, var(--c2))" fillOpacity={0.08} stroke="var(--ink)" strokeWidth={1.2} />
      {k > 0 && Array.from({ length: n - 1 }, (_, i) => (
        <g key={i} stroke="var(--ink)" strokeOpacity={0.35} strokeWidth={0.8}>
          <line x1={X + (i + 1) * c} x2={X + (i + 1) * c} y1={Y} y2={Y + A} />
          <line x1={X} x2={X + A} y1={Y + (i + 1) * c} y2={Y + (i + 1) * c} />
        </g>
      ))}
      <text x={X + A / 2} y={Y + A + 22} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">hep aynı 1 cm³ madde</text>
      <text x={210} y={86} fontSize={11.5} fontWeight={700} fill="var(--muted)">toplam yüzey</text>
      <text x={210} y={112} fontSize={20} fontWeight={800} fill={nano ? "var(--c3)" : "var(--ink)"}>{yuzeyYazi(k)}</text>
      <text x={210} y={140} fontSize={11} fontWeight={700} fill="var(--muted)">{k === 0 ? "tek küp" : `küp sayısı 10${["", "³", "⁶", "⁹", "¹²", "¹⁵", "¹⁸"][k]}`}</text>
      <text x={326} y={226} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="end">ızgara temsilîdir; kenar her adımda 10'a bölünür</text>
    </svg>
  );
}

/* ================= 3. Atık özütüyle gümüş nanoparçacık ================= */

// Gümüş nitrat çözeltisine çay posası özütü damlatılır; polifenoller Ag⁺ iyonunu Ag'ye indirger.
// Renk zamanla sarıdan kahverengiye koyulaşır; yakın plan dairesinde iyonlar nanoparçacığa dönüşür.
function Gumus({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6), zt = ilerleme(t, oynuyor, sure) * sure;
  const damla = zt > 0 && zt < 1.6, oran = yumusak((zt - 1.2) / (sure - 1.6));
  const renk = `rgb(${Math.round(250 - 110 * oran)}, ${Math.round(250 - 150 * oran)}, ${Math.round(245 - 205 * oran)})`;
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  const iyon = Array.from({ length: 14 }, (_, k) => [236 + 46 * Math.cos(k * 2.4) * ((k % 3) + 1) / 3.2, 116 + 46 * Math.sin(k * 2.4) * ((k % 3) + 1) / 3.2] as [number, number]);
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={bitti ? "Çözelti kahverengiye döndü: gümüş nanoparçacıklar oluştu" : "Gümüş nitrat çözeltisi ve çay posası özütü"}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c3)" : "var(--ink)"}>
        {bitti ? "Renk koyulaştı: nanoparçacıklar oluştu" : zt > 0 ? "Özüt ekleniyor…" : "Gümüş nitrat çözeltisi + çay posası özütü"}
      </text>
      {/* damlalık */}
      <rect x={72} y={36} width={16} height={34} rx={4} fill="var(--c4)" fillOpacity={0.5} stroke="var(--ink)" strokeWidth={1.2} />
      <path d="M76 70 L80 82 L84 70 Z" fill="var(--ink)" fillOpacity={0.6} />
      {damla && <circle cx={80} cy={88 + ((zt * 90) % 40)} r={3.5} fill="var(--c4)" />}
      {/* beher */}
      <path d="M40 96 V196 Q40 204 48 204 H112 Q120 204 120 196 V96" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
      <path d="M41 120 H119 V196 Q119 203 112 203 H48 Q41 203 41 196 Z" fill={renk} stroke="none" />
      <text x={80} y={224} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">AgNO₃ çözeltisi</text>
      {/* yakın plan */}
      <line x1={120} y1={150} x2={186} y2={128} stroke="var(--muted)" strokeDasharray="3 3" />
      <circle cx={236} cy={116} r={70} fill="var(--panel)" stroke="var(--muted)" strokeWidth={1.2} />
      {iyon.map(([x, y], k) => {
        const donus = sinir((zt - 1.4 - (k % 7) * 0.45) / 0.4, 0, 1);
        return donus < 1 ? (
          <g key={k} opacity={1 - donus}>
            <circle cx={x} cy={y} r={7} fill="none" stroke="var(--muted)" strokeWidth={1.2} />
            <text x={x} y={y + 3} fontSize={7.5} fontWeight={800} fill="var(--muted)" textAnchor="middle">Ag⁺</text>
          </g>
        ) : null;
      })}
      {[[214, 98], [256, 134], [230, 146]].map(([x, y], k) => {
        const boy = sinir((zt - 1.6 - k * 0.8) / 2, 0, 1);
        return boy > 0 ? <circle key={k} cx={x} cy={y} r={4 + 9 * boy} fill="#9a7b4f" fillOpacity={0.85} stroke="#6f5530" strokeWidth={1} /> : null;
      })}
      <text x={236} y={204} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">{zt > 2 ? "Ag⁺ + e⁻ → Ag (nanoparçacık)" : "çözeltide Ag⁺ iyonları"}</text>
    </svg>
  );
}

/* ================= 4. Besin zincirinde ağır metal ================= */

// Suda çok az cıva var. Her basamak bir alttakinden çok sayıda yer ve cıvayı yavaş atar: derişim katlanır.
// Temsilî: her basamakta yaklaşık 10 kat.
const ZINCIR = ["su", "plankton", "küçük balık", "büyük balık", "insan"];
function Birikim({ t, oynuyor, s }: SahneProps) {
  const sure = Number(s.sure ?? 6), zt = ilerleme(t, oynuyor, sure) * sure;
  const ulasti = zt === 0 ? 0 : Math.min(ZINCIR.length - 1, Math.floor((zt / sure) * ZINCIR.length));
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label="Besin zincirinde cıva derişimi her basamakta artıyor">
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? "var(--c2)" : "var(--ink)"}>
        {bitti ? "En yüksek derişim zincirin tepesinde" : "Suda çok az cıva var"}
      </text>
      {ZINCIR.map((ad, i) => {
        const x = 18 + i * 64, acik = i <= ulasti, h = acik ? 10 + i * 30 : 10;
        const nokta = acik ? [1, 3, 8, 20, 40][i] : 1;
        return (
          <g key={ad}>
            <rect x={x} y={196 - h} width={50} height={h} rx={4} fill="var(--c2)" fillOpacity={0.12 + (acik ? i * 0.12 : 0)} stroke="var(--c2)" strokeWidth={acik ? 1.4 : 0.6} />
            {Array.from({ length: nokta }, (_, k) => (
              <circle key={k} cx={x + 7 + (k % 6) * 7.2} cy={190 - Math.floor(k / 6) * 7} r={2.2} fill="var(--c2)" />
            ))}
            <text x={x + 25} y={214} fontSize={10} fontWeight={700} fill="var(--ink)" textAnchor="middle">{ad}</text>
            {acik && i > 0 && <text x={x + 25} y={190 - h} fontSize={10.5} fontWeight={800} fill="var(--c2)" textAnchor="middle">×{say(10 ** i, 0)}</text>}
          </g>
        );
      })}
      {zt > 0 && <text x={326} y={234} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="end">her basamakta ≈ 10 kat (temsilî)</text>}
    </svg>
  );
}

/* ================= 5. Nişasta filmi ve gliserol ================= */

// Gliserol oranı (nişastanın kütlesine göre %): az olursa film kırılgan, çok olursa yapışkan ve dayanıksız.
// Esnek ve sağlam film yaklaşık %20-40 arası.
const filmDurum = (g: number) => (g < 20 ? "kırılgan" : g <= 40 ? "esnek" : "yapışkan");
function Film({ v }: SahneProps) {
  const g = sinir(v.g ?? 0, 0, 60), d = filmDurum(g);
  const renk = d === "esnek" ? "var(--c3)" : "var(--c2)";
  const bukum = d === "kırılgan" ? 0 : d === "esnek" ? 26 : 42;
  // Zincirler: gliserol molekülleri araya girdikçe zincirler açılır.
  const aralik = 12 + g * 0.3;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Gliserol yüzde ${Math.round(g)}: film ${d}`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={renk}>%{Math.round(g)} gliserol: film {d}</text>
      {/* film şeridi */}
      {d === "kırılgan" ? (
        <g>
          <path d="M30 120 L100 116 L106 128 L30 132 Z" fill="var(--c4)" fillOpacity={0.35} stroke="var(--ink)" strokeWidth={1.2} />
          <path d="M112 112 L170 118 L168 130 L110 126 Z" fill="var(--c4)" fillOpacity={0.35} stroke="var(--ink)" strokeWidth={1.2} />
          <path d="M104 108 l4 8 l-5 4 l6 10" fill="none" stroke="var(--c2)" strokeWidth={1.6} />
        </g>
      ) : (
        <path d={`M30 120 Q100 ${120 + bukum} 170 120 L170 132 Q100 ${132 + bukum} 30 132 Z`} fill="var(--c4)" fillOpacity={d === "yapışkan" ? 0.55 : 0.35} stroke="var(--ink)" strokeWidth={1.2} />
      )}
      {d === "yapışkan" && [50, 90, 130].map((x) => <path key={x} d={`M${x} ${136 + bukum * 0.7} q3 12 0 22`} fill="none" stroke="var(--c4)" strokeWidth={2} />)}
      {/* yakın plan: nişasta zincirleri ve gliserol */}
      <rect x={196} y={46} width={130} height={150} rx={8} fill="var(--panel)" />
      {[0, 1, 2, 3].map((i) => {
        const y = 66 + i * Math.min(aralik, 34);
        return <path key={i} d={`M206 ${y} q14 -8 28 0 t28 0 t28 0 t28 0`} fill="none" stroke="var(--c5)" strokeWidth={2.2} />;
      })}
      {Array.from({ length: Math.round(g / 6) }, (_, k) => (
        <circle key={k} cx={214 + (k * 23) % 104} cy={74 + Math.floor((k * 23) / 104) * Math.min(aralik, 34) + 6} r={3.4} fill="var(--c1)" />
      ))}
      <text x={261} y={214} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">mor: nişasta · mavi: gliserol</text>
      <text x={100} y={226} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">10 g nişasta + su + sirke</text>
    </svg>
  );
}

/* ================= 6. Atıktan fermantasyonla hidrojen ================= */

// Karanlık fermantasyon: hidrojen hızı pH ≈ 5,5 ve ≈ 35 °C civarında en yüksektir (temsilî çan eğrileri).
const hHiz = (pH: number, T: number) => Math.exp(-(((pH - 5.5) / 0.9) ** 2)) * Math.exp(-(((T - 35) / 9) ** 2));
function Hidrojen({ v, t, oynuyor, s }: SahneProps) {
  const pH = sinir(v.pH ?? 7, 4, 8), T = sinir(v.T ?? 25, 20, 60), sure = Number(s.sure ?? 5);
  const zt = ilerleme(t, oynuyor, sure) * sure, hiz = hHiz(pH, T);
  const hacim = hiz * 200 * (zt / sure); // mL (temsilî)
  const bitti = zt >= sure - 1e-6 && !oynuyor;
  const r = 8 + 36 * Math.sqrt(hacim / 200);
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`pH ${say(pH)}, ${Math.round(T)} derece, hidrojen ${Math.round(hacim)} mililitre`}>
      <text x={14} y={22} fontSize={13} fontWeight={800} fill={bitti ? (hiz > 0.85 ? "var(--c3)" : "var(--ink)") : "var(--ink)"}>
        {bitti ? `Toplanan H₂: ${Math.round(hacim)} mL` : `pH ${say(pH)} · ${Math.round(T)} °C`}
      </text>
      {/* kapalı şişe, içinde meyve-sebze artığı */}
      <path d="M60 80 V200 Q60 208 68 208 H152 Q160 208 160 200 V80 Q160 70 140 64 V48 H80 V64 Q60 70 60 80 Z" fill="none" stroke="var(--ink)" strokeWidth={1.8} />
      <path d="M61 130 H159 V200 Q159 207 152 207 H68 Q61 207 61 200 Z" fill="var(--c4)" fillOpacity={0.3} />
      {[[78, 160], [104, 176], [132, 158], [90, 192], [140, 190]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={7} fill="var(--c3)" fillOpacity={0.5} />)}
      {zt > 0 && Array.from({ length: Math.round(8 * hiz) }, (_, k) => (
        <circle key={k} cx={74 + k * 11} cy={128 - ((zt * 30 + k * 13) % 40)} r={2.6} fill="none" stroke="var(--c1)" strokeWidth={1.2} />
      ))}
      <text x={110} y={226} fontSize={11} fontWeight={700} fill="var(--muted)" textAnchor="middle">meyve-sebze artığı, oksijensiz</text>
      {/* borudan balona */}
      <path d="M110 48 V36 H240 V70" fill="none" stroke="var(--ink)" strokeWidth={2} />
      <circle cx={240} cy={70 + r} r={r} fill="var(--c1)" fillOpacity={0.18} stroke="var(--c1)" strokeWidth={1.6} />
      <text x={240} y={74 + r} fontSize={12} fontWeight={800} fill="var(--c1)" textAnchor="middle">H₂</text>
      <text x={326} y={226} fontSize={10.5} fontWeight={700} fill="var(--muted)" textAnchor="end">değerler temsilîdir</text>
    </svg>
  );
}

const nanoGeri = (v: Record<string, number>) => {
  const k = Math.round(sinir(v.k ?? 0, 0, 6));
  return { baslik: `Toplam yüzey ${yuzeyYazi(k)}`, metin: "Kenar her 10'a bölündüğünde toplam yüzey 10 kat artar. 60 m² = 600 000 cm² = 6 × 10⁵ cm²." };
};
const filmGeri = (v: Record<string, number>) => ({ baslik: `Film ${filmDurum(sinir(v.g ?? 0, 0, 60))}`, metin: "Gliserol az olursa zincirler sıkı kalır, film kırılır; çok olursa film yumuşar ve yapışır." });
const hidrojenGeri = (v: Record<string, number>) => {
  const pH = sinir(v.pH ?? 7, 4, 8), T = sinir(v.T ?? 25, 20, 60);
  return { baslik: "Bakteriler daha iyi çalışabilir", metin: pH > 6 ? "Ortam fazla bazik ya da nötr; biraz asitleştir." : pH < 5 ? "Ortam fazla asidik; bakteriler yavaşlar." : T > 38 ? "Sıcaklık fazla; bu bakteriler vücut sıcaklığına yakın sever." : "Sıcaklık düşük; biraz ısıt." };
};

export const KIMYA14: Record<string, SahneKaydi> = {
  "kim14-mikro": { C: Mikro },
  "kim14-nano": { C: Nano, geri: nanoGeri },
  "kim14-gumus": { C: Gumus },
  "kim14-birikim": { C: Birikim },
  "kim14-film": { C: Film, geri: filmGeri },
  "kim14-hidrojen": { C: Hidrojen, geri: hidrojenGeri },
};
