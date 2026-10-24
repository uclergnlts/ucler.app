"use client";
// Haftalık lig ekranı: renkli başlık ve geri sayım, ilk üç için kürsü, ilk 50 kişi, öğrencinin kendi satırı.
// Veri lib/lig.ts'den; liste sunucuda kurulur. Hesabı olmayan öğrenci listeyi görür, kendi yeri için hesap açmaya çağrılır.
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { useOturum } from "@/lib/bulut";
import { kalanSure, ligOku, type Lig as LigVeri, type LigSatir } from "@/lib/lig";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Govde, UstBar, UstEylem } from "./temel";
import { Button } from "./ui/button";

const RENKLER = ["var(--c1)", "var(--c2)", "var(--c3)", "var(--c4)", "var(--c5)", "#0ea5a4"];
/** Ada göre hep aynı renk. */
const renk = (ad: string) => RENKLER[[...ad].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % RENKLER.length];

/** Kürsü sırası (2, 1, 3) ve basamak görünümü. */
const KURSU = [
  { i: 1, h: "h-16", zemin: "bg-[#e4eaf2]", yazi: "text-[#5b6b80]" },
  { i: 0, h: "h-24", zemin: "bg-[var(--glow)]", yazi: "text-[#7a5200]" },
  { i: 2, h: "h-12", zemin: "bg-[#f3c6a4]", yazi: "text-[#8a4a1c]" },
];
const MADALYA = ["", "#e0a400", "#8a9ab0", "#c0743c"];

function Avatar({ ad, buyuk }: { ad: string; buyuk?: boolean }) {
  return (
    <span
      className={cn("grid flex-none place-items-center rounded-full font-display font-extrabold text-white", buyuk ? "size-14 text-[22px]" : "size-9 text-[15px]")}
      style={{ background: renk(ad) }}
      aria-hidden="true"
    >
      {[...ad.trim()][0]?.toLocaleUpperCase("tr") ?? "?"}
    </span>
  );
}

/** Geçen haftanın ilk üçünde olanın adının yanındaki küçük madalya. */
function Madalya({ n }: { n?: number | null }) {
  if (!n) return null;
  return (
    <span className="grid size-4 flex-none place-items-center rounded-full text-[10px] font-extrabold text-white" style={{ background: MADALYA[n] }} title={`Geçen hafta ${n}.`} aria-label={`Geçen hafta ${n}.`}>
      {n}
    </span>
  );
}

const Puan = ({ n, className }: { n: number; className?: string }) => {
  const Yildiz = Icon.yildiz;
  return (
    <span className={cn("flex flex-none items-center gap-1 font-display font-extrabold tabular-nums [&_svg]:size-4 [&_svg]:fill-[var(--glow)] [&_svg]:stroke-[var(--glow-deep)]", className)}>
      <Yildiz />{n}
    </span>
  );
};

function Kursu({ liste }: { liste: LigSatir[] }) {
  return (
    <div className="grid grid-cols-3 items-end gap-2 pt-2" aria-label="İlk üç">
      {KURSU.map(({ i, h, zemin, yazi }) => {
        const s = liste[i];
        return (
          <motion.div
            key={i}
            className="grid min-w-0 justify-items-center gap-1.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 + (i === 0 ? 0.25 : i * 0.1), ease: "easeOut" }}
          >
            {s ? (
              <>
                <div className="relative">
                  <Avatar ad={s.ad} buyuk />
                  {i === 0 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#e0a400] [&_svg]:size-5 [&_svg]:fill-[var(--glow)]"><Icon.kupa /></span>}
                </div>
                <span className={cn("flex max-w-full items-center gap-1 truncate text-[14px] font-bold", s.ben && "text-[var(--c5)]")}>
                  <span className="truncate">{s.ben ? "Sen" : s.ad}</span><Madalya n={s.madalya} />
                </span>
                <Puan n={s.puan} className="text-[14px]" />
              </>
            ) : (
              <span className="grid size-14 place-items-center rounded-full border-2 border-dashed border-border-strong text-muted-foreground">?</span>
            )}
            <div className={cn("grid w-full place-items-center rounded-t-2xl font-display text-[26px] font-extrabold", h, zemin, yazi)}>{s?.sira ?? i + 1}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Satir({ s, i }: { s: LigSatir; i: number }) {
  return (
    <motion.li
      className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5", s.ben ? "bg-[#f1eafd] ring-2 ring-[var(--c5)]" : "bg-card")}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.03 }}
    >
      <span className="w-7 flex-none text-center font-display text-[16px] font-extrabold tabular-nums text-muted-foreground">{s.sira}</span>
      <Avatar ad={s.ad} />
      <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[15px] font-semibold">
        <span className="truncate">{s.ad}</span>
        {s.ben && <span className="flex-none text-[13px] font-bold text-[var(--c5)]">(sen)</span>}
        <Madalya n={s.madalya} />
      </span>
      <Puan n={s.puan} className="text-[15px]" />
    </motion.li>
  );
}

export default function Lig() {
  const oturum = useOturum();
  const [veri, setVeri] = useState<LigVeri | null | undefined>(undefined);
  const [simdi, setSimdi] = useState(() => Date.now());
  const yukle = useCallback(() => {
    setVeri(undefined);
    void ligOku(!!oturum).then(setVeri);
  }, [oturum]);
  useEffect(() => { if (oturum !== undefined) yukle(); }, [oturum, yukle]);
  useEffect(() => { const t = setInterval(() => setSimdi(Date.now()), 30_000); return () => clearInterval(t); }, []);

  const Kupa = Icon.kupa;
  const liste = veri?.liste ?? [];
  const ben = veri?.ben;
  const listede = liste.some((s) => s.ben);

  return (
    <div className="app">
      <UstBar geri={{ to: "/", label: "Ana sayfa" }} baslik="Haftalık lig" sag={<UstEylem label="Yenile" icon={<Icon.tekrar />} onClick={yukle} />} />
      <Govde className="gap-4 pb-28">
        <section className="relative grid gap-1 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#8d55e0,#2f7cf6)] p-5 text-white">
          <span className="absolute -top-6 -right-6 grid size-32 place-items-center rounded-full bg-white/10 [&_svg]:size-16 [&_svg]:stroke-white/70" aria-hidden="true"><Kupa /></span>
          <h2 className="font-display text-[26px] leading-tight font-extrabold">Bu hafta</h2>
          <p className="text-[15px] font-semibold text-white/85">Bu hafta kazandığın puanlarla sıralan.</p>
          <div className="mt-2 flex flex-wrap gap-2 text-[13px] font-bold">
            <span className="rounded-full bg-white/20 px-3 py-1">{veri ? `Bitmesine ${kalanSure(veri.bitis, simdi)}` : "Hafta pazar gece biter"}</span>
            {veri && veri.kisi > 0 && <span className="rounded-full bg-white/20 px-3 py-1">{veri.kisi} kişi</span>}
          </div>
        </section>

        {veri === undefined ? (
          <div className="grid gap-2" aria-label="Yükleniyor">
            <div className="h-44 animate-pulse rounded-3xl bg-secondary" />
            {[0, 1, 2].map((k) => <div key={k} className="h-14 animate-pulse rounded-2xl bg-secondary" />)}
          </div>
        ) : veri === null ? (
          <div className="grid gap-3 rounded-2xl border border-border p-4 text-center">
            <p className="text-[15px] text-muted-foreground">Lig şu an yüklenemedi. İnternet bağlantını kontrol edip yeniden dene.</p>
            <Button variant="outline" onClick={yukle}>Yeniden dene</Button>
          </div>
        ) : liste.length === 0 ? (
          <div className="grid gap-1 rounded-2xl border border-dashed border-border-strong p-5 text-center">
            <b className="font-display text-[17px] font-extrabold">Bu hafta henüz kimse puan almadı</b>
            <p className="text-[14px] text-muted-foreground">Bir kart oku ya da bir görev çöz, listenin başına sen geç.</p>
          </div>
        ) : (
          <>
            <Kursu liste={liste} />
            {liste.length > 3 && (
              <ol className="grid gap-1.5 rounded-3xl bg-secondary p-1.5">
                {liste.slice(3).map((s, i) => <Satir key={`${s.sira}-${i}`} s={s} i={i} />)}
              </ol>
            )}
          </>
        )}

        {oturum === null && (
          <section className="grid gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="grid gap-1">
              <b className="font-display text-[17px] font-extrabold">Hesap aç, ligde yerini gör</b>
              <p className="text-[14px] text-muted-foreground">Ligde yalnızca hesabı olanlar yarışır. Bu cihazda kazandığın puanlar da hesabına taşınır.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild><Link href="/giris/">Hesap aç</Link></Button>
              <Button asChild variant="outline"><Link href="/giris/?giris">Giriş yap</Link></Button>
            </div>
          </section>
        )}

        {ben && !ben.ligde && (
          <p className="rounded-2xl bg-secondary p-3.5 text-[14px] text-muted-foreground">
            Listede görünmüyorsun; sıranı yalnızca sen görüyorsun. Görünmek için{" "}
            <Link href="/profil/ayarlar/" className="font-bold text-foreground underline">Ayarlar</Link>&apos;da &quot;Haftalık ligde görün&quot;ü aç.
          </p>
        )}

        <p className="px-1 text-[13px] text-muted-foreground">
          Lig her pazartesi 00:00&apos;da sıfırlanır. Bir günde en çok 600 puan sayılır. Adının yanındaki küçük madalya, geçen haftanın ilk üçünde olduğunu gösterir. Listede yalnızca adın ve puanın görünür.
        </p>
      </Govde>

      {ben && veri && !listede && (
        // Öğrenci ilk 50'de değilse ya da listede görünmüyorsa kendi satırı altta hep görünür.
        <div className="fixed inset-x-0 bottom-[calc(var(--nav)+12px+env(safe-area-inset-bottom,0px))] z-10 mx-auto w-full max-w-[552px] px-4">
          <div className="flex items-center gap-3 rounded-2xl bg-[#f1eafd] px-3 py-2.5 shadow-[0_6px_20px_rgba(29,53,87,.14)] ring-2 ring-[var(--c5)]">
            <span className="w-7 flex-none text-center font-display text-[16px] font-extrabold tabular-nums text-[var(--c5)]">{ben.puan > 0 ? ben.sira : "–"}</span>
            <Avatar ad={ben.ad} />
            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">
              {ben.puan > 0 ? "Senin sıran" : "Bu hafta puan al, listeye gir"}
            </span>
            <Puan n={ben.puan} className="text-[15px]" />
          </div>
        </div>
      )}
    </div>
  );
}
