"use client";
// Günün sorusu ekranı ve ana sayfadaki kartı. Kurallar ve sunucu tarafı lib/gunsoru.ts'de.
// Akış: tanıtım (ders, kurallar, "Başla") → soru (süre işler, alttaki "Kontrol et" tek hak) → sonuç (puan, süre,
// bugün kaç kişinin çözdüğü, seri, "Bu konuyu öğren"). Süre "Başla"ya basınca başlar; ekrandan çıkıp dönen öğrencinin
// süresi kaldığı yerden sürer. Hesabı olmayan da çözer ama puanı kaydedilmez; sonuçta hesap açmaya çağrılır.
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { TekrarSoru } from "@/lib/content";
import { DERSLER, isDers } from "@/lib/dersler";
import { useOturum } from "@/lib/bulut";
import {
  bonus, gunKayitOku, gunKayitYaz, gunPuan, gununSorusu, sunucuBasla, sunucuBitir, sunucuDurum, sunucuSonuc, trGun,
  useGunKayit, yeniSoruya, type GunKayit, type GunSonuc, type SunucuDurum,
} from "@/lib/gunsoru";
import { soruIzi } from "@/lib/iz";
import { useOyunAcik } from "@/lib/oyun";
import { kaydet } from "@/lib/puan";
import { olay } from "@/lib/olay";
import { ses } from "@/lib/ses";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { KayitSayfasi } from "./KayitDavet";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, geriMetin, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import { Govde, Html, href, UstBar } from "./temel";
import { Button } from "./ui/button";

/** "12,4 sn", "1 dk 05 sn". */
export function sureYazi(ms: number) {
  const s = ms / 1000;
  if (s < 60) return `${s.toLocaleString("tr-TR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })} sn`;
  const dk = Math.floor(s / 60);
  return dk >= 60 ? `${Math.floor(dk / 60)} sa ${dk % 60} dk` : `${dk} dk ${String(Math.floor(s % 60)).padStart(2, "0")} sn`;
}

/** Bugünün tarihi; yalnız tarayıcıda bilinir (sayfa derlenirken değil). */
function useBugun() {
  const [g, setG] = useState("");
  useEffect(() => {
    setG(trGun());
    const z = setInterval(() => setG(trGun()), 60_000);
    return () => clearInterval(z);
  }, []);
  return g;
}

/** Ana sayfadaki kart: bugünün dersi ve durum (bekliyor, sürüyor, çözüldü). */
export function GunSorusuKart({ havuz }: { havuz: string[] }) {
  const g = useBugun(), kayit = useGunKayit(), oyun = useOyunAcik();
  const key = g ? kayit?.soru ?? gununSorusu(havuz, g) : undefined;
  const ders = key?.split(".")[0];
  if (!key || !ders || !isDers(ders)) return null;
  const s = kayit?.sonuc, Soru = Icon.soru, Next = Icon.ileri;
  const alt = s
    ? s.dogru ? (oyun ? `Çözdün: +${s.puan} puan, ${sureYazi(s.ms)}` : `Doğru çözdün, ${sureYazi(s.ms)}`) : `Bu sefer olmadı. Yeni soru ${yeniSoruya()} sonra.`
    : kayit ? "Süren işliyor, hemen dön" : oyun ? "Hızlı çöz, 150 puana kadar al" : "Bugünkü soru seni bekliyor";
  return (
    <Link
      href="/gunun-sorusu/"
      data-ders={ders}
      className={cn("flex items-center gap-3.5 rounded-2xl border-[1.5px] bg-card p-4 transition-transform active:scale-[.99]", s ? "border-border" : "border-acc")}
    >
      <span className={cn("grid size-11 flex-none place-items-center rounded-xl [&_svg]:size-5", s ? "bg-acc-soft text-acc" : "bg-acc text-white")}><Soru /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-semibold text-muted-foreground">Günün sorusu · {DERSLER[ders].ad}</span>
        <b className="block truncate font-bold">{alt}</b>
      </span>
      <Next />
    </Link>
  );
}

type Durum = "yukleniyor" | "giris" | "soru" | "sonuc" | "hata";

export default function GunSorusu({ havuz }: { havuz: Record<string, TekrarSoru> }) {
  const oturum = useOturum(), oyun = useOyunAcik(), g = useBugun();
  const kayit = useGunKayit();
  const [durum, setDurum] = useState<Durum>("yukleniyor");
  const [cevap, setCevap] = useState<Cevap | undefined>(undefined);
  const [simdi, setSimdi] = useState(() => Date.now());
  const [bekle, setBekle] = useState(false);
  const [davet, setDavet] = useState(false);
  const girisli = !!oturum;
  // Misafirken başlanan soru misafir kalır: girince sunucuya taşınmaz (süre sunucuda ölçülmedi).
  const sunucuyla = girisli && !kayit?.misafir;

  const key = kayit?.soru && havuz[kayit.soru] ? kayit.soru : g ? gununSorusu(Object.keys(havuz), g) : undefined;
  const Q = key ? havuz[key] : undefined;

  /** Sunucudaki kaydı cihaza yazar ve ekranı ona göre açar. */
  const uygula = (d: SunucuDurum, soru: string) => {
    if (!d.kayit) { setDurum("giris"); return; }
    const k: GunKayit = { g: d.gun, soru: havuz[d.kayit.soru] ? d.kayit.soru : soru, basla: Date.now() - d.kayit.gecen_ms, sonuc: sunucuSonuc(d) };
    gunKayitYaz(k);
    setDurum(k.sonuc ? "sonuc" : "soru");
  };

  // Açılış: önce bu cihazdaki kayıt; giriş yapılmışsa sunucudaki kayıt esas alınır.
  useEffect(() => {
    if (!g || oturum === undefined || !key) return;
    const yerel = gunKayitOku();
    if (!girisli || yerel?.misafir) { setDurum(yerel?.sonuc ? "sonuc" : yerel ? "soru" : "giris"); return; }
    let iptal = false;
    sunucuDurum().then((d) => { if (!iptal) uygula(d, key); }).catch(() => { if (!iptal) setDurum(yerel?.sonuc ? "sonuc" : "hata"); });
    return () => { iptal = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g, oturum === undefined, girisli]);

  // Süre göstergesi.
  useEffect(() => {
    if (durum !== "soru") return;
    const z = setInterval(() => setSimdi(Date.now()), 200);
    return () => clearInterval(z);
  }, [durum]);
  useEffect(() => { window.scrollTo(0, 0); }, [durum]);

  const basla = async () => {
    if (!key || bekle) return;
    olay("gunun_sorusu_basla", { soru: key });
    if (!sunucuyla) {
      gunKayitYaz({ g: trGun(), soru: key, basla: Date.now(), ...(girisli ? {} : { misafir: true }) });
      setSimdi(Date.now()); setDurum("soru");
      return;
    }
    setBekle(true);
    try { uygula(await sunucuBasla(key), key); setSimdi(Date.now()); } catch { setDurum("hata"); }
    setBekle(false);
  };

  const kontrol = async (cevap: Cevap) => {
    if (!kayit || !Q || bekle) return;
    const ok = dogruMu(Q, cevap), ms = Date.now() - kayit.basla;
    ses(ok ? "dogru" : "yanlis");
    let sonuc: GunSonuc = { dogru: ok, ms, puan: ok ? gunPuan(ms) : 0, kayitli: false };
    if (sunucuyla) {
      setBekle(true);
      try { sonuc = sunucuSonuc(await sunucuBitir(cevap, soruIzi(Q.q), ok)) ?? sonuc; } catch { /* bağlantı yok: sonuç bu cihazda kalır, kaydedilmedi */ }
      setBekle(false);
    }
    gunKayitYaz({ ...kayit, sonuc });
    kaydet("soru");
    olay("gunun_sorusu_bitti", { dogru: ok ? 1 : 0, sn: Math.round(ms / 1000) });
    setDurum("sonuc");
  };

  const ders = Q?.ders;
  let govde: React.ReactNode = null, alt: React.ReactNode = null;

  if (durum === "yukleniyor" || !Q || !ders) {
    govde = <p className="pt-10 text-center text-muted-foreground">Yükleniyor…</p>;
  } else if (durum === "hata") {
    govde = (
      <section className="grid gap-3 pt-6 text-center">
        <h2 className="text-[22px]">Bağlantı kurulamadı</h2>
        <p className="text-muted-foreground">Günün sorusu puanın sunucuda tutulduğu için internet gerekiyor. Süren başladıysa işlemeye devam ediyor.</p>
        <Button className="mt-2" onClick={() => location.reload()}>Yeniden dene</Button>
        {!kayit && (
          <Button variant="ghost" onClick={() => { gunKayitYaz({ g: trGun(), soru: key!, basla: Date.now(), misafir: true }); setSimdi(Date.now()); setDurum("soru"); }}>
            Puansız çöz
          </Button>
        )}
      </section>
    );
  } else if (durum === "giris") {
    govde = (
      <section className="grid gap-5 pt-2" data-ders={ders}>
        <div className="grid gap-1.5">
          <span className="text-[13px] font-bold text-acc">{DERSLER[ders].ad}</span>
          <h2 className="text-[26px]">Bugünün sorusu hazır</h2>
          <p className="text-[15px] text-muted-foreground">Herkes bugün aynı soruyu çözüyor. Gece yarısı yeni soru gelir.</p>
        </div>
        <ul className="grid gap-2.5 rounded-2xl bg-secondary p-4 text-[15px]">
          <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">1</b>Tek hakkın var, cevabını kontrol etmeden önce iyi düşün.</li>
          <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">2</b>Süre “Başla”ya basınca başlar. Çıkıp dönsen de işlemeye devam eder.</li>
          {oyun && <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">3</b>Doğru cevap 100 puan. İlk 10 saniyede 50 puan hız bonusu, sonra 60. saniyeye kadar azalır.</li>}
          {oyun && <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">4</b>{girisli ? "Puanın haftalık lige eklenir." : "Puanının haftalık lige eklenmesi için hesabın olmalı."}</li>}
        </ul>
      </section>
    );
    alt = <Alt><Button className="w-full" data-ders={ders} disabled={bekle} onClick={basla}>Başla</Button></Alt>;
  } else if (durum === "soru" && kayit) {
    const c = cevap ?? ilkCevap(Q), ms = Math.max(0, simdi - kayit.basla), b = bonus(ms), not = yonerge(Q);
    govde = (
      <article className="flex flex-col gap-4" data-ders={ders}>
        <div className="flex items-center justify-between gap-3 text-[13px] font-bold">
          <span className="truncate text-acc">Günün sorusu · {DERSLER[ders].ad}</span>
          <span className="flex flex-none items-center gap-2 tabular-nums">
            {oyun && b > 0 && <span className="rounded-full bg-acc-soft px-2 py-0.5 text-acc">+{b} hız</span>}
            <span className="rounded-full bg-secondary px-2.5 py-0.5">{sureYazi(ms).replace(/,\d sn$/, " sn")}</span>
          </span>
        </div>
        {oyun && <div className="h-1 overflow-hidden rounded-full bg-secondary" aria-hidden="true"><div className="h-full bg-acc transition-[width] duration-200" style={{ width: `${(100 * b) / 50}%` }} /></div>}
        <Html as="h2" className="text-[22px]" html={Q.q} />
        {not && <p className="-mt-2 text-[14px] font-medium text-muted-foreground">{not}</p>}
        <TestGovde q={Q} cevap={c} setCevap={setCevap} sonuc={null} sec={() => {}} tohum={key!} />
      </article>
    );
    alt = (
      <Alt>
        <Button className="w-full" data-ders={ders} disabled={bekle || !hazir(Q, c)} onClick={() => { setCevap(c); void kontrol(c); }}>Kontrol et</Button>
      </Alt>
    );
  } else if (durum === "sonuc" && kayit?.sonuc) {
    const s = kayit.sonuc, ok = s.dogru, Kupa = Icon.kupa, Seri = Icon.seri;
    const digerleri = (s.ist?.kisi ?? 0) - 1;
    govde = (
      <section className="grid gap-4" data-ders={ders}>
        <motion.div
          className={cn("grid justify-items-center gap-1 rounded-3xl p-5 text-center", ok ? "bg-good-soft" : "bg-bad-soft")}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <h2 className={cn("text-[22px]", ok ? "text-good" : "text-bad")}>{ok ? "Doğru!" : "Bu sefer olmadı"}</h2>
          {oyun && ok && s.puan > 0 && <div className="font-display text-[52px] leading-none font-extrabold tabular-nums">+{s.puan}</div>}
          {oyun && ok && s.puan > 0 && <p className="text-[14px] font-semibold text-muted-foreground">100 doğru cevap{s.puan > 100 ? ` + ${s.puan - 100} hız bonusu` : ""}</p>}
          <p className="text-[15px] font-semibold">Süre: {sureYazi(s.ms)}</p>
        </motion.div>

        {s.kayitli ? (
          <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 text-[15px]">
            {oyun && ok && s.puan > 0 && <p className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-acc"><Kupa />Puanın haftalık lige eklendi.</p>}
            {ok && s.puan === 0 && <p>Uygulaman eski bir sürümde olduğu için bu sorunun puanı sayılmadı. Uygulamayı güncelleyince puanların yine lige eklenir.</p>}
            {s.ist && s.ist.kisi > 0 && (
              <p>
                Bugün {s.ist.kisi} kişi çözdü, {s.ist.dogru} kişi doğru yaptı.
                {ok && digerleri > 0 && ` Çözen ${digerleri} kişiden ${s.ist.gectigin} kişiyi geçtin.`}
              </p>
            )}
            {oyun && !!s.seri && <p className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-acc"><Seri />Günün sorusu serin: {s.seri} gün</p>}
          </div>
        ) : girisli && !kayit.misafir ? (
          <p className="rounded-2xl bg-secondary px-4 py-3 text-[14px]">Bağlantı kurulamadığı için sonucun sunucuya kaydedilemedi.</p>
        ) : girisli ? (
          <p className="rounded-2xl bg-secondary px-4 py-3 text-[14px]">Bu soruyu hesabına girmeden başlattığın için puanı kaydedilmedi. Yarından itibaren puanların lige eklenecek.</p>
        ) : (
          <div className="grid gap-2.5 rounded-2xl border-[1.5px] border-acc bg-card p-4">
            <b className="text-[16px]">{ok ? "Puanın kaydedilmedi" : "Hesabınla çöz, puanın sayılsın"}</b>
            <p className="text-[14px] text-muted-foreground">Ücretsiz hesap açarsan günün sorusu puanların haftalık lige eklenir, serin tutulur ve kaç kişiyi geçtiğini görürsün.</p>
            <Button onClick={() => { setDavet(true); olay("kayit_davet", { yol: "gunun_sorusu" }); }}>Hesap aç</Button>
          </div>
        )}

        <article className="grid gap-3 rounded-2xl border border-border bg-card p-4">
          <Html as="div" className="font-display text-[17px] font-bold" html={Q.q} />
          {cevap !== undefined && <TestGovde q={Q} cevap={cevap} setCevap={() => {}} sonuc={ok} sec={() => {}} tohum={key!} />}
          <div>
            <b className={cn("block text-[15px]", ok ? "text-good" : "text-bad")}>{geriBaslik(Q, ok)}</b>
            <Html as="p" className="text-[15px] leading-normal" html={geriMetin(Q, cevap ?? ilkCevap(Q), ok)} />
          </div>
        </article>
        <p className="text-center text-[14px] font-semibold text-muted-foreground">Yeni soru {yeniSoruya()} sonra.</p>
      </section>
    );
    alt = (
      <Alt>
        <div className="grid gap-2" data-ders={ders}>
          <Button asChild className="min-w-0"><Link href={href(ders, Q.konu)}><span className="truncate">Bu konuyu öğren: {Q.baslik}</span></Link></Button>
          <Button asChild variant="ghost"><Link href="/">Ana sayfaya dön</Link></Button>
        </div>
      </Alt>
    );
  }

  return (
    <div className="app">
      <UstBar geri={{ to: "/", label: "Ana sayfaya dön" }} baslik="Günün sorusu" />
      <Govde className="pb-0">
        <AnimatePresence mode="wait">
          <motion.div key={durum} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="pb-6">
            {govde}
          </motion.div>
        </AnimatePresence>
        {alt}
      </Govde>
      <KayitSayfasi acik={davet} setAcik={setDavet} donus="/gunun-sorusu/" baslik="Puanını kaydet" aciklama="Ücretsiz hesap aç; yarından itibaren günün sorusu puanların haftalık lige eklensin." />
    </div>
  );
}
