"use client";
// Biyoloji sahneleri (sınıflandırma, hayvanlar âlemi): sınıflandırma basamakları, at + eşek = katır,
// ikili adlandırma, âlem anahtarı; iskelet ve omurga, böcek-örümcek bacakları, kalp odacıkları,
// değişken ve sabit vücut sıcaklığı, yarasanın sınıfı.
import { yumusak, type SahneKaydi, type SahneProps } from "./ortak";

const sinir = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ilerleme = (t: number, oynuyor: boolean, sure: number) => (oynuyor || t > 0 ? t / sure : 0);

/* ---------- sınıflandırma basamakları ---------- */

const BASAMAK = [
  "Üst âlem: Ökaryotlar", "Âlem: Hayvanlar", "Şube: Kordalılar", "Sınıf: Memeliler",
  "Takım: Etçiller", "Familya: Kedigiller", "Cins: Felis", "Tür: Felis catus",
];
// d: ev kedisiyle kaç basamağı paylaştığı (0: üst âlem bile farklı).
const CANLILAR: [string, number][] = [
  ["bakteri", 0], ["meşe", 1], ["mantar", 1], ["arı", 2],
  ["salyangoz", 2], ["alabalık", 3], ["kartal", 3], ["kurbağa", 3],
  ["at", 4], ["yarasa", 4], ["köpek", 5], ["ayı", 5],
  ["aslan", 6], ["vaşak", 6], ["yaban kedisi", 7], ["ev kedisi", 8],
];

function Basamak({ v }: SahneProps) {
  const k = sinir((v.k ?? 1) - 1, 0, 7);
  const n = CANLILAR.filter(([, d]) => d > k).length;
  return (
    <svg viewBox="0 0 340 254" role="img" aria-label={`${BASAMAK[k]}: ${n} canlı`}>
      <text x={170} y={24} fontSize={16} fontWeight={800} fill="var(--biyoloji)" textAnchor="middle">{BASAMAK[k]}</text>
      <text x={170} y={44} fontSize={12} fontWeight={600} fill="var(--muted)" textAnchor="middle">Bu grupta 16 canlıdan {n} tanesi var</text>
      {CANLILAR.map(([ad, d], i) => {
        const ic = d > k, x = 10 + (i % 4) * 82, y = 62 + Math.floor(i / 4) * 42, ben = d === 8;
        return (
          <g key={ad} opacity={ic ? 1 : 0.35}>
            <rect x={x} y={y} width={76} height={32} rx={9} fill={ic ? "var(--biyoloji-soft)" : "none"} stroke={ic ? "var(--biyoloji)" : "var(--line-2)"} strokeWidth={ben ? 2.4 : 1.4} />
            <text x={x + 38} y={y + 20.5} fontSize={11.5} fontWeight={ben ? 800 : 600} fill={ic ? "var(--ink)" : "var(--muted)"} textAnchor="middle">{ad}</text>
          </g>
        );
      })}
      <text x={170} y={246} fontSize={11.5} fill="var(--muted)" textAnchor="middle">aşağı indikçe grup küçülür, akrabalık artar</text>
    </svg>
  );
}

/* ---------- at + eşek = katır ---------- */

/** Basit dört ayaklı; (x, y) gövdenin ortası. kulak: kulak uzunluğu. */
function DortAyakli({ x, y, renk, kulak = 8, olcek = 1 }: { x: number; y: number; renk: string; kulak?: number; olcek?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${olcek})`}>
      <path d="M-26 -2 L-26 26 M-16 4 L-16 28 M16 4 L16 28 M26 -2 L26 26" stroke={renk} strokeWidth={4.5} strokeLinecap="round" />
      <ellipse cx={0} cy={0} rx={32} ry={13} fill={renk} />
      <path d="M-30 -4 Q-40 0 -38 14" stroke={renk} strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M22 -8 L34 -28 L42 -26 L32 -4 Z" fill={renk} />
      <path d={`M34 -28 L48 -22 Q52 -18 46 -15 L38 -17 Z`} fill={renk} />
      <path d={`M34 -26 L${30 - kulak * 0.25} ${-27 - kulak} L40 -27 Z`} fill={renk} strokeLinejoin="round" />
      <circle cx={41} cy={-22} r={1.6} fill="#fff" />
    </g>
  );
}

function Melez({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const yavru = yumusak((u - 0.15) / 0.3);
  const kisir = u > 0.6;
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label="Dişi at ile erkek eşekten katır doğar; katır kısırdır">
      <DortAyakli x={74} y={56} renk="#9a6b43" kulak={8} />
      <text x={74} y={106} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">dişi at</text>
      <DortAyakli x={250} y={60} renk="#8c8f99" kulak={17} olcek={0.85} />
      <text x={250} y={106} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">erkek eşek</text>
      <text x={162} y={64} fontSize={22} fontWeight={800} fill="var(--muted)" textAnchor="middle">+</text>
      <path d="M90 112 Q120 128 122 146 M232 112 Q140 124 122 146" stroke="var(--line-2)" strokeWidth={2} fill="none" />
      <g opacity={yavru}>
        <DortAyakli x={112} y={176} renk="#7d6a58" kulak={13} olcek={0.9} />
        <text x={112} y={226} fontSize={12} fontWeight={700} fill="var(--ink)" textAnchor="middle">katır</text>
      </g>
      {u === 0 && <text x={122} y={186} fontSize={28} fontWeight={800} fill="var(--line-2)" textAnchor="middle">?</text>}
      {kisir && (
        <g className="ad-belir">
          <path d="M196 158 L216 178 M216 158 L196 178" stroke="var(--bad)" strokeWidth={4} strokeLinecap="round" />
          <text x={226} y={166} fontSize={12.5} fontWeight={800} fill="var(--bad)">kısır</text>
          <text x={226} y={183} fontSize={11} fontWeight={600} fill="var(--muted)">yavru veremez</text>
          <text x={196} y={206} fontSize={11} fontWeight={600} fill="var(--muted)">kromozomları eşlenemez</text>
        </g>
      )}
    </svg>
  );
}

/* ---------- ikili adlandırma ---------- */

function Ad({ v }: SahneProps) {
  const cins = v.cb ? "Canis" : "canis", tan = v.tb ? "Lupus" : "lupus", it = v.it === 1;
  return (
    <svg viewBox="0 0 340 170" role="img" aria-label={`Kurdun bilimsel adı: ${cins} ${tan}${it ? ", italik" : ""}`}>
      <text x={170} y={30} fontSize={13} fontWeight={700} fill="var(--muted)" textAnchor="middle">kurt</text>
      <text x={170} y={92} fontSize={40} fontWeight={700} fill="var(--ink)" textAnchor="middle" fontStyle={it ? "italic" : "normal"} fontFamily="Georgia, 'Times New Roman', serif">
        <tspan fill="var(--c1)">{cins}</tspan> <tspan fill="var(--c5)">{tan}</tspan>
      </text>
      <line x1={64} y1={110} x2={168} y2={110} stroke="var(--c1)" strokeWidth={2} />
      <line x1={184} y1={110} x2={278} y2={110} stroke="var(--c5)" strokeWidth={2} />
      <text x={116} y={130} fontSize={12} fontWeight={700} fill="var(--c1)" textAnchor="middle">cins adı</text>
      <text x={231} y={130} fontSize={12} fontWeight={700} fill="var(--c5)" textAnchor="middle">tanımlayıcı ad</text>
      <text x={170} y={160} fontSize={11.5} fill="var(--muted)" textAnchor="middle">Latince, iki kelime; dünyanın her yerinde aynı</text>
    </svg>
  );
}

/* ---------- âlem anahtarı ---------- */

type Dugum = { x: number; y: number; yazi: string };
const KOK: Dugum = { x: 170, y: 30, yazi: "Çekirdek var mı?" };
const SOL: Dugum = { x: 76, y: 100, yazi: "Duvarda peptidoglikan?" };
const SAG: Dugum = { x: 246, y: 100, yazi: "Hücre duvarı?" };
const YAPRAK: Record<string, { x: number; ust: Dugum; dal: string }> = {
  Bakteriler: { x: 38, ust: SOL, dal: "var" },
  Arkeler: { x: 112, ust: SOL, dal: "yok" },
  Hayvanlar: { x: 184, ust: SAG, dal: "yok" },
  Bitkiler: { x: 248, ust: SAG, dal: "selüloz" },
  Mantarlar: { x: 308, ust: SAG, dal: "kitin" },
};
const YY = 176;

function Kutu({ d, renk = "var(--ink)", w }: { d: Dugum; renk?: string; w: number }) {
  return (
    <g>
      <rect x={d.x - w / 2} y={d.y - 13} width={w} height={26} rx={13} fill="#fff" stroke={renk} strokeWidth={1.6} />
      <text x={d.x} y={d.y + 4} fontSize={11.5} fontWeight={700} fill={renk} textAnchor="middle">{d.yazi}</text>
    </g>
  );
}

function Anahtar({ s, t, oynuyor }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 3;
  const u = ilerleme(t, oynuyor, sure);
  const hedef = (s.hedef as string) ?? "";
  const yap = YAPRAK[hedef];
  // Hedefe giden yol: kök -> ara düğüm -> yaprak.
  const yol = yap ? [[KOK.x, KOK.y + 13], [yap.ust.x, yap.ust.y - 13], [yap.ust.x, yap.ust.y + 13], [yap.x, YY - 12]] : [];
  const boy = yol.slice(1).map((p, i) => Math.hypot(p[0] - yol[i][0], p[1] - yol[i][1]));
  const top = boy.reduce((a, b) => a + b, 0);
  let kalan = top * yumusak(u / 0.85), nokta = yol[0];
  for (let i = 0; i < boy.length && kalan > 0; i++) {
    const w = Math.min(1, kalan / boy[i]);
    nokta = [yol[i][0] + (yol[i + 1][0] - yol[i][0]) * w, yol[i][1] + (yol[i + 1][1] - yol[i][1]) * w];
    kalan -= boy[i];
  }
  const bitti = u > 0.95 && yap;
  // Kökten çıkan dalların etiketi dalın ortasında, yapraklarınki yaprağın hemen üstünde (dallar sık olduğu için).
  const kenar = (x1: number, y1: number, x2: number, y2: number, yazi: string, yolda: boolean, yaprak = false) => (
    <g key={`${x2}-${y2}`}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={yolda && u > 0 ? "var(--biyoloji)" : "var(--line-2)"} strokeWidth={yolda && u > 0 ? 2.6 : 1.6} />
      {yaprak ? (
        <text x={x2} y={y2 - 8} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle" stroke="#fff" strokeWidth={4} paintOrder="stroke">{yazi}</text>
      ) : (
        <text x={(x1 + x2) / 2 + (x2 < x1 ? -6 : 6)} y={(y1 + y2) / 2 + 2} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor={x2 < x1 ? "end" : "start"}>{yazi}</text>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label="Üst âlem ve âlem anahtarı">
      {kenar(KOK.x, KOK.y + 13, SOL.x, SOL.y - 13, "hayır", !!yap && yap.ust === SOL)}
      {kenar(KOK.x, KOK.y + 13, SAG.x, SAG.y - 13, "evet", !!yap && yap.ust === SAG)}
      {Object.entries(YAPRAK).map(([ad, y]) => kenar(y.ust.x, y.ust.y + 13, y.x, YY - 12, y.dal, ad === hedef, true))}
      <Kutu d={KOK} w={124} />
      <Kutu d={SOL} w={146} />
      <Kutu d={SAG} w={104} />
      {Object.entries(YAPRAK).map(([ad, y]) => {
        const ok = bitti && ad === hedef;
        return (
          <g key={ad}>
            <rect x={y.x - 31} y={YY - 12} width={62} height={24} rx={7} fill={ok ? "var(--biyoloji)" : "var(--biyoloji-soft)"} />
            <text x={y.x} y={YY + 4} fontSize={11} fontWeight={800} fill={ok ? "#fff" : "var(--ink)"} textAnchor="middle">{ad}</text>
          </g>
        );
      })}
      <g fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        <text x={75} y={206}>prokaryotlar</text>
        <text x={246} y={206}>ökaryotlar (çok hücreli)</text>
      </g>
      <text x={170} y={228} fontSize={11} fill="var(--muted)" textAnchor="middle">Protistler bu basit anahtara uymaz.</text>
      {yap && u > 0 && !bitti && <circle cx={nokta[0]} cy={nokta[1]} r={6} fill="var(--biyoloji)" stroke="#fff" strokeWidth={2} />}
    </svg>
  );
}

/* ---------- iskelet ve omurga ---------- */

function Iskelet() {
  return (
    <svg viewBox="0 0 340 200" role="img" aria-label="Böcek, deniz yıldızı ve balığın iskeleti">
      <g>
        <ellipse cx={56} cy={92} rx={22} ry={34} fill="var(--c4)" fillOpacity={0.18} stroke="#b7800d" strokeWidth={4} />
        <line x1={34} y1={86} x2={78} y2={86} stroke="#b7800d" strokeWidth={2} />
        <circle cx={56} cy={52} r={10} fill="var(--c4)" fillOpacity={0.18} stroke="#b7800d" strokeWidth={3} />
        <path d="M50 44 L42 30 M62 44 L70 30" stroke="#b7800d" strokeWidth={2} strokeLinecap="round" />
        <path d="M34 76 L18 68 M34 92 L16 94 M36 108 L20 120 M78 76 L94 68 M78 92 L96 94 M76 108 L92 120" stroke="#b7800d" strokeWidth={2.4} strokeLinecap="round" />
      </g>
      <g>
        <path d="M170 52 L180 80 L208 82 L186 100 L194 128 L170 112 L146 128 L154 100 L132 82 L160 80 Z" fill="var(--c2)" fillOpacity={0.15} stroke="var(--c2)" strokeWidth={2} strokeLinejoin="round" />
        {[[170, 68], [170, 84], [186, 88], [154, 88], [164, 102], [176, 102], [182, 116], [158, 116], [196, 84], [144, 84]].map(([x, y], i) => (
          <rect key={i} x={x - 3} y={y - 3} width={6} height={6} rx={1.5} fill="var(--c2)" />
        ))}
      </g>
      <g>
        <path d="M244 92 Q268 64 300 80 L322 66 L318 92 L322 118 L300 104 Q268 120 244 92 Z" fill="var(--c1)" fillOpacity={0.15} stroke="var(--c1)" strokeWidth={2} strokeLinejoin="round" />
        <circle cx={256} cy={88} r={2.4} fill="var(--c1)" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x={264 + i * 6} y={89} width={4.5} height={7} rx={1.2} fill="var(--c1)" />
        ))}
        <path d="M266 92 L262 98 M300 92 L310 92" stroke="var(--c1)" strokeWidth={1.4} />
      </g>
      <g fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">
        <text x={56} y={150}>böcek</text>
        <text x={170} y={150}>deniz yıldızı</text>
        <text x={284} y={150}>balık</text>
      </g>
      <g fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">
        <text x={56} y={168}>dış iskelet</text>
        <text x={56} y={182}>(kitin kabuk)</text>
        <text x={170} y={168}>deri altında</text>
        <text x={170} y={182}>kireçli plakalar</text>
        <text x={284} y={168}>sırtta omurlar</text>
        <text x={284} y={182}>(omurga)</text>
      </g>
    </svg>
  );
}

/* ---------- böcek ve örümcek bacakları ---------- */

function Bocek({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-4 -8 L-14 -2 L-18 4 M-4 0 L-16 4 L-20 10 M-4 6 L-12 14 L-14 20 M4 -8 L14 -2 L18 4 M4 0 L16 4 L20 10 M4 6 L12 14 L14 20" stroke="var(--ink)" strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <path d="M-2 -20 L-8 -30 M2 -20 L8 -30" stroke="var(--ink)" strokeWidth={1.3} strokeLinecap="round" />
      <circle cx={0} cy={-16} r={4.5} fill="var(--c4)" />
      <ellipse cx={0} cy={-2} rx={5.5} ry={7} fill="var(--c4)" />
      <ellipse cx={0} cy={15} rx={7} ry={10} fill="var(--c4)" />
    </g>
  );
}

function Orumcek({ x, y }: { x: number; y: number }) {
  const bacak = [-1, 1].flatMap((d) => [-9, -3, 3, 9].map((o, i) => `M${d * 4} ${o * 0.6} L${d * (16 + i % 2 * 2)} ${o - 6} L${d * 24} ${o + 4}`));
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={bacak.join(" ")} stroke="var(--ink)" strokeWidth={1.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={0} cy={-5} rx={6.5} ry={7} fill="var(--c5)" />
      <ellipse cx={0} cy={13} rx={9} ry={11} fill="var(--c5)" />
    </g>
  );
}

function Bacak({ s, v }: SahneProps) {
  const b = v.b ?? 0, o = typeof s.orumcek === "number" ? s.orumcek : 2;
  const top = b * 6 + o * 8;
  return (
    <svg viewBox="0 0 340 236" role="img" aria-label={`${b} böcek, ${o} örümcek, toplam ${top} bacak`}>
      <text x={14} y={22} fontSize={12} fontWeight={700} fill="#b7800d">böcekler: 3 vücut bölümü, anten var</text>
      {Array.from({ length: b }, (_, i) => <Bocek key={i} x={34 + i * 54} y={66} />)}
      {b === 0 && <text x={170} y={72} fontSize={12} fill="var(--muted)" textAnchor="middle">henüz böcek yok</text>}
      <line x1={14} y1={110} x2={326} y2={110} stroke="var(--line)" />
      <text x={14} y={134} fontSize={12} fontWeight={700} fill="var(--c5)">örümcekler: 2 vücut bölümü, anten yok</text>
      {Array.from({ length: o }, (_, i) => <Orumcek key={i} x={60 + i * 70} y={170} />)}
      <text x={326} y={226} fontSize={15} fontWeight={800} fill="var(--ink)" textAnchor="end">Toplam bacak: {top}</text>
    </svg>
  );
}

/* ---------- kalp odacıkları ---------- */

const KAN = { o2siz: "var(--c1)", o2li: "var(--c2)", karisik: "var(--c5)" };

function Kalp({ v }: SahneProps) {
  const o = sinir(v.o ?? 2, 2, 4);
  const odalar: { x: number; y: number; w: number; h: number; renk: string; ad: string }[] =
    o === 2
      ? [{ x: 70, y: 40, w: 120, h: 56, renk: KAN.o2siz, ad: "kulakçık" }, { x: 70, y: 104, w: 120, h: 76, renk: KAN.o2siz, ad: "karıncık" }]
      : o === 3
        ? [{ x: 70, y: 40, w: 56, h: 56, renk: KAN.o2siz, ad: "kulakçık" }, { x: 134, y: 40, w: 56, h: 56, renk: KAN.o2li, ad: "kulakçık" }, { x: 70, y: 104, w: 120, h: 76, renk: KAN.karisik, ad: "karıncık" }]
        : [{ x: 70, y: 40, w: 56, h: 56, renk: KAN.o2siz, ad: "kulakçık" }, { x: 134, y: 40, w: 56, h: 56, renk: KAN.o2li, ad: "kulakçık" }, { x: 70, y: 104, w: 56, h: 76, renk: KAN.o2siz, ad: "karıncık" }, { x: 134, y: 104, w: 56, h: 76, renk: KAN.o2li, ad: "karıncık" }];
  const kimler = o === 2 ? ["balıklar"] : o === 3 ? ["iki yaşamlılar", "çoğu sürüngen"] : ["kuşlar", "memeliler", "timsah"];
  const not = o === 2 ? "yalnızca oksijensiz kan geçer" : o === 3 ? "karıncıkta kan kısmen karışır" : "oksijenli ve oksijensiz kan karışmaz";
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`${o} odacıklı kalp: ${kimler.join(", ")}`}>
      <text x={130} y={26} fontSize={14} fontWeight={800} fill="var(--ink)" textAnchor="middle">{o} odacıklı kalp</text>
      <g key={o} className="ad-belir">
        {odalar.map((d, i) => (
          <g key={i}>
            <rect x={d.x} y={d.y} width={d.w} height={d.h} rx={12} fill={d.renk} fillOpacity={0.85} />
            <text x={d.x + d.w / 2} y={d.y + d.h / 2 + 4} fontSize={11} fontWeight={700} fill="#fff" textAnchor="middle">{d.ad}</text>
          </g>
        ))}
      </g>
      <text x={130} y={202} fontSize={11.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">{not}</text>
      <g fontSize={12.5} fontWeight={700} fill="var(--ink)">
        <text x={212} y={52} fontSize={11} fill="var(--muted)" fontWeight={600}>kimlerde?</text>
        {kimler.map((k, i) => <text key={k} x={212} y={74 + i * 20}>{k}</text>)}
      </g>
      <g fontSize={11} fill="var(--muted)">
        <rect x={30} y={220} width={10} height={10} rx={2} fill={KAN.o2siz} /><text x={45} y={229}>oksijensiz</text>
        <rect x={122} y={220} width={10} height={10} rx={2} fill={KAN.o2li} /><text x={137} y={229}>oksijenli</text>
        <rect x={204} y={220} width={10} height={10} rx={2} fill={KAN.karisik} /><text x={219} y={229}>karışık</text>
      </g>
    </svg>
  );
}

/* ---------- vücut sıcaklığı ---------- */

function Termometre({ x, deger, renk, ad, alt }: { x: number; deger: number; renk: string; ad: string; alt: string }) {
  const Y0 = 186, H = 140, y = Y0 - (sinir(deger, 0, 45) / 45) * H;
  return (
    <g>
      <rect x={x - 9} y={Y0 - H} width={18} height={H} rx={9} fill="none" stroke="var(--line-2)" strokeWidth={1.6} />
      <rect x={x - 5} y={y} width={10} height={Y0 - y} rx={5} fill={renk} />
      <circle cx={x} cy={Y0 + 6} r={11} fill={renk} />
      <text x={x + 16} y={y + 4} fontSize={13} fontWeight={800} fill={renk}>{Math.round(deger)} °C</text>
      <text x={x} y={Y0 + 34} fontSize={12} fontWeight={800} fill="var(--ink)" textAnchor="middle">{ad}</text>
      <text x={x} y={Y0 + 49} fontSize={11} fontWeight={600} fill="var(--muted)" textAnchor="middle">{alt}</text>
    </g>
  );
}

function Sicaklik({ v }: SahneProps) {
  const T = v.T ?? 25;
  const hal = T < 12 ? "çok yavaş, kış uykusuna yakın" : T < 22 ? "yavaşladı" : "hareketli";
  return (
    <svg viewBox="0 0 340 240" role="img" aria-label={`Ortam ${T} °C: kertenkele ${T} °C, fare 37 °C`}>
      <text x={170} y={22} fontSize={12.5} fontWeight={700} fill="var(--muted)" textAnchor="middle">ortam: {T} °C</text>
      <Termometre x={90} deger={T} renk="var(--c4)" ad="kertenkele" alt={hal} />
      <Termometre x={240} deger={37} renk="var(--c2)" ad="fare" alt="ısıyı besinden üretir" />
    </svg>
  );
}

/* ---------- yarasanın sınıfı ---------- */

const OZELLIK = ["uçar (kuşta da var)", "vücudu kıllı", "yavrusunu sütle besler", "diyaframı var"];

function Yarasa({ t, oynuyor, s }: SahneProps) {
  const sure = typeof s.sure === "number" ? s.sure : 4;
  const u = ilerleme(t, oynuyor, sure);
  const kac = u === 0 ? 1 : Math.min(4, 1 + Math.floor(u * 4.2));
  return (
    <svg viewBox="0 0 340 252" role="img" aria-label="Yarasanın özellikleri">
      <g>
        <path d="M170 64 Q140 40 112 44 Q104 30 84 34 Q92 52 78 70 Q100 68 112 80 Q124 72 140 82 Q150 70 166 74 Z" fill="var(--ink)" fillOpacity={0.85} />
        <path d="M170 64 Q200 40 228 44 Q236 30 256 34 Q248 52 262 70 Q240 68 228 80 Q216 72 200 82 Q190 70 174 74 Z" fill="var(--ink)" fillOpacity={0.85} />
        <ellipse cx={170} cy={72} rx={9} ry={15} fill="var(--ink)" />
        <path d="M164 58 L162 48 L168 56 M176 58 L178 48 L172 56" fill="var(--ink)" stroke="var(--ink)" strokeWidth={1.5} strokeLinejoin="round" />
      </g>
      {OZELLIK.slice(0, kac).map((o, i) => (
        <g key={o} className="ad-belir">
          <rect x={70} y={108 + i * 28} width={200} height={22} rx={11} fill={i === 0 ? "var(--panel)" : "var(--biyoloji-soft)"} />
          <text x={170} y={123 + i * 28} fontSize={12} fontWeight={700} fill={i === 0 ? "var(--muted)" : "var(--biyoloji)"} textAnchor="middle">{o}</text>
        </g>
      ))}
      {u > 0.95 && <text x={170} y={246} fontSize={13} fontWeight={800} fill="var(--biyoloji)" textAnchor="middle" className="ad-belir">kıl + süt bezi → memeli</text>}
    </svg>
  );
}

export const BIYOLOJI3: Record<string, SahneKaydi> = {
  "biy3-basamak": { C: Basamak },
  "biy3-melez": { C: Melez },
  "biy3-ad": { C: Ad },
  "biy3-anahtar": { C: Anahtar },
  "biy3-iskelet": { C: Iskelet },
  "biy3-bacak": { C: Bacak },
  "biy3-kalp": { C: Kalp },
  "biy3-sicaklik": { C: Sicaklik },
  "biy3-yarasa": { C: Yarasa },
};
