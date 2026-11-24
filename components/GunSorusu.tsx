"use client";
// Günün sorusu ekranı ve ana sayfadaki kartı. Kurallar ve sunucu tarafı lib/gunsoru.ts'de.
// Akış: tanıtım (ders, kurallar, "Başla") → soru (süre işler, alttaki "Kontrol et" tek hak) → sonuç (puan, süre,
// bugün kaç kişinin çözdüğü, seri, "Bu konuyu öğren"). Süre "Başla"ya basınca başlar; ekrandan çıkıp dönen öğrencinin
// süresi kaldığı yerden sürer. Hesabı olmayan da çözer ama puanı kaydedilmez; sonuçta hesap açmaya çağrılır.
import { cev, SAYI_YEREL } from "@/lib/dil";
import { ANA } from "@/lib/site";
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
import { useOyunAcik } from "@/lib/oyun";
import { kaydet } from "@/lib/puan";
import { olay } from "@/lib/olay";
import { ses } from "@/lib/ses";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { KayitSayfasi } from "./KayitDavet";
import Bildir, { BildirDugme } from "./Bildir";
import { Alt } from "./Soru";
import { dogruMu, geriBaslik, geriMetin, hazir, ilkCevap, TestGovde, yonerge, type Cevap } from "./TestSoru";
import { Govde, Html, href, UstBar } from "./temel";
import { Button } from "./ui/button";

/** "12,4 sn", "1 dk 05 sn". */
export function sureYazi(ms: number) {
  const s = ms / 1000;
  if (s < 60) return `${s.toLocaleString(SAYI_YEREL, { maximumFractionDigits: 1, minimumFractionDigits: 1 })} sn`;
  const dk = Math.floor(s / 60);
  return dk >= 60 ? cev("{0} sa {1} dk", Math.floor(dk / 60), dk % 60) : cev("{0} dk {1} sn", dk, String(Math.floor(s % 60)).padStart(2, "0"));
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
    ? s.dogru ? (oyun ? cev("Çözdün: +{0} puan, {1}", s.puan, sureYazi(s.ms)) : cev("Doğru çözdün, {0}", sureYazi(s.ms))) : cev("Bu sefer olmadı. Yeni soru {0} sonra.", yeniSoruya())
    : kayit ? cev("Süren işliyor, hemen dön") : oyun ? cev("Hızlı çöz, 150 puana kadar al") : cev("Bugünkü soru seni bekliyor");
  return (
    <Link
      href="/gunun-sorusu/"
      data-ders={ders}
      className="grid gap-1.5 rounded-lg border border-border bg-card p-4 transition-transform active:scale-[.99]"
    >
      <span className="flex items-center gap-2 text-[11px] font-bold tracking-[.14em] text-mark uppercase">
        <span className="[&_svg]:size-4"><Soru /></span>{cev("Günün sorusu ·")} {DERSLER[ders].ad}
        {!s && <span aria-hidden="true" className="ml-auto size-2 rounded-full bg-mark" />}
      </span>
      <span className="flex items-center gap-3">
        <b className="min-w-0 flex-1 font-display text-[18px] leading-snug font-extrabold">{alt}</b>
        <Next />
      </span>
    </Link>
  );
}

type Durum = "yukleniyor" | "giris" | "soru" | "sonuc" | "hata";

export default function GunSorusu({ havuz }: { havuz: Record<string, TekrarSoru & { iz: string }> }) {
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
      try { sonuc = sunucuSonuc(await sunucuBitir(cevap, Q.iz, ok)) ?? sonuc; } catch { /* bağlantı yok: sonuç bu cihazda kalır, kaydedilmedi */ }
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
    govde = <p className="pt-10 text-center text-muted-foreground">{cev("Yükleniyor…")}</p>;
  } else if (durum === "hata") {
    govde = (
      <section className="grid gap-3 pt-6 text-center">
        <h2 className="text-[22px]">{cev("Bağlantı kurulamadı")}</h2>
        <p className="text-muted-foreground">{cev("Günün sorusu puanın sunucuda tutulduğu için internet gerekiyor. Süren başladıysa işlemeye devam ediyor.")}</p>
        <Button className="mt-2" onClick={() => location.reload()}>{cev("Yeniden dene")}</Button>
        {!kayit && (
          <Button variant="ghost" onClick={() => { gunKayitYaz({ g: trGun(), soru: key!, basla: Date.now(), misafir: true }); setSimdi(Date.now()); setDurum("soru"); }}>
            {cev("Puansız çöz")}
          </Button>
        )}
      </section>
    );
  } else if (durum === "giris") {
    govde = (
      <section className="grid gap-5 pt-2" data-ders={ders}>
        <div className="grid gap-1.5">
          <span className="text-[13px] font-bold text-acc">{DERSLER[ders].ad}</span>
          <h2 className="text-[26px]">{cev("Bugünün sorusu hazır")}</h2>
          <p className="text-[15px] text-muted-foreground">{cev("Herkes bugün aynı soruyu çözüyor. Gece yarısı yeni soru gelir.")}</p>
        </div>
        <ul className="grid gap-2.5 rounded-2xl bg-secondary p-4 text-[15px]">
          <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">1</b>{cev("Tek hakkın var, cevabını kontrol etmeden önce iyi düşün.")}</li>
          <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">2</b>{cev("Süre “Başla”ya basınca başlar. Çıkıp dönsen de işlemeye devam eder.")}</li>
          {oyun && <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">3</b>{cev("Doğru cevap 100 puan. İlk 10 saniyede 50 puan hız bonusu, sonra 60. saniyeye kadar azalır.")}</li>}
          {oyun && <li className="flex gap-2.5"><b className="w-5 flex-none text-acc">4</b>{girisli ? cev("Puanın haftalık lige eklenir.") : cev("Puanının haftalık lige eklenmesi için hesabın olmalı.")}</li>}
        </ul>
      </section>
    );
    alt = <Alt><Button className="w-full" data-ders={ders} disabled={bekle} onClick={basla}>{cev("Başla")}</Button></Alt>;
  } else if (durum === "soru" && kayit) {
    const c = cevap ?? ilkCevap(Q), ms = Math.max(0, simdi - kayit.basla), b = bonus(ms), not = yonerge(Q);
    govde = (
      <article className="flex flex-col gap-4" data-ders={ders}>
        <div className="flex items-center justify-between gap-3 text-[13px] font-bold">
          <span className="truncate text-acc">{cev("Günün sorusu ·")} {DERSLER[ders].ad}</span>
          <span className="flex flex-none items-center gap-2 tabular-nums">
            {oyun && b > 0 && <span className="rounded-full bg-acc-soft px-2 py-0.5 text-acc">+{b} {cev("hız§bonus")}</span>}
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
        <Button className="w-full" data-ders={ders} disabled={bekle || !hazir(Q, c)} onClick={() => { setCevap(c); void kontrol(c); }}>{cev("Kontrol et")}</Button>
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
          <h2 className={cn("text-[22px]", ok ? "text-good" : "text-bad")}>{ok ? cev("Doğru!") : cev("Bu sefer olmadı")}</h2>
          {oyun && ok && s.puan > 0 && <div className="font-display text-[52px] leading-none font-extrabold tabular-nums">+{s.puan}</div>}
          {oyun && ok && s.puan > 0 && <p className="text-[14px] font-semibold text-muted-foreground">{cev("100 doğru cevap")}{s.puan > 100 ? cev(" + {0} hız bonusu", s.puan - 100) : ""}</p>}
          <p className="text-[15px] font-semibold">{cev("Süre:")} {sureYazi(s.ms)}</p>
        </motion.div>

        {s.kayitli ? (
          <div className="grid gap-2 rounded-2xl border border-border bg-card p-4 text-[15px]">
            {oyun && ok && s.puan > 0 && <p className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-acc"><Kupa />{cev("Puanın haftalık lige eklendi.")}</p>}
            {ok && s.puan === 0 && <p>{cev("Uygulaman eski bir sürümde olduğu için bu sorunun puanı sayılmadı. Uygulamayı güncelleyince puanların yine lige eklenir.")}</p>}
            {s.ist && s.ist.kisi > 0 && (
              <p>
                {cev("Bugün {0} kişi çözdü, {1} kişi doğru yaptı.", s.ist.kisi, s.ist.dogru)}
                {ok && digerleri > 0 && cev(" Çözen {0} kişiden {1} kişiyi geçtin.", digerleri, s.ist.gectigin)}
              </p>
            )}
            {oyun && !!s.seri && <p className="flex items-center gap-2 [&_svg]:size-4 [&_svg]:text-acc"><Seri />{cev("Günün sorusu serin:")} {s.seri} {cev("gün")}</p>}
          </div>
        ) : girisli && !kayit.misafir ? (
          <p className="rounded-2xl bg-secondary px-4 py-3 text-[14px]">{cev("Bağlantı kurulamadığı için sonucun sunucuya kaydedilemedi.")}</p>
        ) : girisli ? (
          <p className="rounded-2xl bg-secondary px-4 py-3 text-[14px]">{cev("Bu soruyu hesabına girmeden başlattığın için puanı kaydedilmedi. Yarından itibaren puanların lige eklenecek.")}</p>
        ) : (
          <div className="grid gap-2.5 rounded-2xl border-[1.5px] border-acc bg-card p-4">
            <b className="text-[16px]">{ok ? cev("Puanın kaydedilmedi") : cev("Hesabınla çöz, puanın sayılsın")}</b>
            <p className="text-[14px] text-muted-foreground">{cev("Ücretsiz hesap açarsan günün sorusu puanların haftalık lige eklenir, serin tutulur ve kaç kişiyi geçtiğini görürsün.")}</p>
            <Button onClick={() => { setDavet(true); olay("kayit_davet", { yol: "gunun_sorusu" }); }}>{cev("Hesap aç")}</Button>
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
        <p className="text-center text-[14px] font-semibold text-muted-foreground">{cev("Yeni soru {0} sonra.", yeniSoruya())}</p>
      </section>
    );
    alt = (
      <Alt>
        <div className="grid gap-2" data-ders={ders}>
          <Button asChild className="min-w-0"><Link href={href(ders, Q.konu)}><span className="truncate">{cev("Bu konuyu öğren:")} {Q.baslik}</span></Link></Button>
          <Button asChild variant="ghost"><Link href={ANA}>{cev("Ana sayfaya dön")}</Link></Button>
        </div>
      </Alt>
    );
  }

  return (
    <div className="app">
      <UstBar
        geri={{ to: ANA, label: cev("Ana sayfaya dön") }}
        baslik={cev("Günün sorusu")}
        sag={Q && (durum === "soru" || durum === "sonuc") ? (
          <Bildir yer={{ ders: Q.ders, konu: Q.konu, yer: cev("günün sorusu ({0})", key), ozet: Q.q }}><BildirDugme /></Bildir>
        ) : undefined}
      />
      <Govde className="pb-0">
        <AnimatePresence mode="wait">
          <motion.div key={durum} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="pb-6">
            {govde}
          </motion.div>
        </AnimatePresence>
        {alt}
      </Govde>
      <KayitSayfasi acik={davet} setAcik={setDavet} donus="/gunun-sorusu/" baslik={cev("Puanını kaydet")} aciklama={cev("Ücretsiz hesap aç. Yarından itibaren günün sorusu puanların haftalık lige eklensin.")} />
    </div>
  );
}
