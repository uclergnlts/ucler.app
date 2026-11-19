"use client";
// Bir dersin konuları: ünite ünite, konu içindeki aşama yolu gibi kıvrılan yollar. Her ünitenin sonunda ünite testi.
// Konular sırayla açılır (lib/kilit.ts). Bir konuya dokununca alttan kısa özet ve "Başla" penceresi açılır;
// kilitli konuda pencere neden kilitli olduğunu söyler ve seviye testiyle doğrudan o konuya geçmeyi önerir.
import { cev } from "@/lib/dil";
import { ANA } from "@/lib/site";
import Link from "next/link";
import { useRef, useState } from "react";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { acik, bekledigi, GECME, seviyeHref, siradaki, uniteAcik, uniteAnahtar, uniteGecti, uniteHref, uniteler, type Unitem } from "@/lib/kilit";
import { useDurumlar } from "@/lib/store";
import { asamaSayisi } from "@/lib/asama";
import { Icon } from "./icons";
import { Govde, Html, href, UstBar, UstEylem } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import AsamaYolu, { type YolDugum } from "./AsamaYolu";
import { useOdemeli } from "@/lib/abonelik";

type Secim = { tur: "konu"; e: Entry } | { tur: "test"; u: Unitem } | null;

export default function Road({ ders, list }: { ders: DersId; list: Entry[] }) {
  const d = useDurumlar();
  const s = DERSLER[ders];
  const sira = siradaki(list, d);
  const uler = uniteler(list);
  const ready = list.filter((e) => e.id), done = ready.filter((e) => d.prog[`${ders}.${e.id}`]).length;
  const [secim, setSecimHam] = useState<Secim>(null);
  const [yardim, setYardim] = useState(false);
  // Pencere bir SheetTrigger'dan açılmıyor; kapanınca odak açan düğmeye dönsün diye o düğme saklanır.
  const acan = useRef<HTMLElement | null>(null);
  const setSecim = (x: Secim) => {
    if (x) acan.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSecimHam(x);
  };
  return (
    <div className="app" data-ders={ders}>
      <UstBar
        geri={{ to: ANA, label: cev("Ana sayfa") }}
        baslik={s.ad}
        sag={<UstEylem label={cev("Bu ders nasıl ilerler?")} icon={<Icon.soru />} onClick={() => setYardim(true)} />}
      />
      <Govde>
        <section className="grid gap-1.5">
          <p className="text-[15px] text-muted-foreground">{s.yol}.</p>
          <Progress className="mt-1.5" value={ready.length ? (100 * done) / ready.length : 0} label={cev("{0} konudan {1} tanesi bitti", ready.length, done)} />
          <span className="text-[13px] font-semibold text-muted-foreground">{done} / {ready.length} {cev("konu bitti")}</span>
        </section>
        {uler.map((u) => {
          const biten = u.konular.filter((e) => d.prog[`${ders}.${e.id}`]).length;
          const gecti = uniteGecti(ders, u.kod, d), testAcik = uniteAcik(list, u, d), puan = d.unite[uniteAnahtar(ders, u.kod)];
          return (
            <section key={u.no} className="grid gap-2" aria-label={cev("{0}. ünite: {1}", u.no, u.ad)}>
              <div className="flex items-end justify-between gap-3 border-b border-border pb-2.5">
                <div className="grid min-w-0">
                  <span className="text-[13px] font-bold text-acc">{cev("{0}. ünite", u.no)}</span>
                  <h2 className="text-[20px] leading-tight">{u.ad}</h2>
                </div>
                <span className="flex-none text-[13px] font-semibold tabular-nums text-muted-foreground">{gecti && biten < u.konular.length ? cev("Geçildi") : `${biten}/${u.konular.length}`}</span>
              </div>
              <div className="pt-10">
                <AsamaYolu
                  ad={cev("{0}. ünitenin konuları", u.no)}
                  kaydir
                  balon={done ? cev("Devam") : cev("Başla")}
                  dugumler={[
                    ...u.konular.map((e): YolDugum => {
                      const k = `${ders}.${e.id}`, res = d.prog[k], ac = acik(list, e.id!, d);
                      const durum: YolDugum["durum"] = res ? "bitti" : e.id === sira?.id ? "sirada" : "kilitli";
                      const ilerleme = !res && d.asama[k] ? cev("{0}/{1} aşama", d.asama[k], asamaSayisi(e.cardCount ?? 0)) : "";
                      return {
                        baslik: e.title ?? e.ad,
                        alt: res ?? ilerleme,
                        durum,
                        serbest: ac,
                        dokun: true,
                        etiket: `${e.no}. ${e.title}, ${res ? "bitti" : durum === "sirada" ? cev("sıradaki konu") : ac ? cev("açık") : "kilitli"}`,
                        ac: () => setSecim({ tur: "konu", e }),
                      };
                    }),
                    {
                      baslik: cev("Ünite testi"),
                      alt: puan !== undefined ? cev("En iyi puanın: {0}", puan) : cev("{0} alan üniteyi geçer", GECME),
                      durum: gecti ? "bitti" : "kilitli",
                      test: true,
                      serbest: testAcik,
                      dokun: true,
                      etiket: cev("{0}. ünite testi, {1}", u.no, gecti ? "geçildi" : testAcik ? "çözebilirsin" : "kilitli"),
                      ac: () => setSecim({ tur: "test", u }),
                    },
                  ]}
                />
              </div>
            </section>
          );
        })}
      </Govde>
      <Sheet open={yardim} onOpenChange={setYardim}>
        <SheetContent data-ders={ders}>
          <div className="grid gap-2 pb-2">
            <SheetTitle className="text-[22px]">{cev("Bu ders nasıl ilerler?")}</SheetTitle>
            <SheetDescription className="text-[15px] text-muted-foreground">
              {cev("Konular sırayla açılır; her konu bir öncekinin üzerine kurulu. Bir üniteyi zaten biliyorsan ünite testinden en az")} {GECME} {cev("alarak o üniteyi atlayabilirsin. Kilitli bir konuya dokunursan seviye testi çıkar: o konudan önceki konulardan karışık sorularda en az")} {GECME} {cev("alırsan doğrudan o konuya geçersin. Başladığın konular hep açık kalır.")}
            </SheetDescription>
            <Button className="mt-2" onClick={() => setYardim(false)}>{cev("Anladım")}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <Sheet open={!!secim} onOpenChange={(o) => { if (!o) setSecim(null); }}>
        <SheetContent data-ders={ders} onCloseAutoFocus={(e) => { if (acan.current?.isConnected) { e.preventDefault(); acan.current.focus(); } }}>
          {secim?.tur === "konu" && <KonuPencere ders={ders} list={list} e={secim.e} sira={sira} />}
          {secim?.tur === "test" && <TestPencere ders={ders} list={list} u={secim.u} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function KonuPencere({ ders, list, e, sira }: { ders: DersId; list: Entry[]; e: Entry; sira?: Entry }) {
  const d = useDurumlar();
  const k = `${ders}.${e.id}`, res = d.prog[k], ac = acik(list, e.id!, d);
  const nA = asamaSayisi(e.cardCount ?? 0), bitenA = res ? nA : Math.min(d.asama[k] ?? 0, nA);
  const once = bekledigi(list, e.id!);
  const odemeli = useOdemeli(list, e.id!);
  const Kilit = Icon.kilit, Yildiz = Icon.yildiz;
  return (
    <div className="grid gap-3 pb-1">
      <span className="text-[13px] font-bold text-acc">{cev("{0}. ünite · {1}. konu", e.unite, e.no)}</span>
      <SheetTitle className="text-[22px]">{e.title}</SheetTitle>
      <SheetDescription className="text-[15px] text-muted-foreground"><Html html={e.summary ?? ""} /></SheetDescription>
      <p className="flex flex-wrap gap-x-3 text-[14px] font-semibold text-muted-foreground">
        <span>{nA} {cev("aşama + mini test")}</span>
        {e.dk && <span>{cev("yaklaşık")} {e.dk} {cev("dk")}</span>}
      </p>
      {ac && odemeli ? (
        <>
          <p className="flex items-start gap-2.5 rounded-xl bg-secondary p-3 text-[15px] [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:flex-none [&_svg]:text-[var(--c1)]">
            <Yildiz /><span>{cev("Bu konu")} <b>{cev("ucler Plus")}</b>{cev("'ta. Her dersin ilk konusu ücretsiz. Plus ile bütün konular açılır.")}</span>
          </p>
          <Button asChild variant="hesap" className="mt-1 w-full"><Link href={href(ders, e.id)}>{cev("Plus ile aç")}</Link></Button>
        </>
      ) : ac ? (
        <>
          {!res && bitenA > 0 && <Progress value={(100 * bitenA) / nA} label={cev("{0} aşamadan {1} tanesi bitti", nA, bitenA)} />}
          {res && <p className="text-[14px] font-semibold">{cev("Bitirdin:")} {res}</p>}
          <Button asChild className="mt-1 w-full"><Link href={href(ders, e.id)}>{res ? cev("Yeniden çalış") : bitenA > 0 ? cev("Devam et") : cev("Başla")}</Link></Button>
        </>
      ) : (
        <>
          <p className="flex items-start gap-2.5 rounded-xl bg-secondary p-3 text-[15px] [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:flex-none">
            <Kilit />
            <span>{cev("Bu konu,")} {once ? <b>“{once.title}”</b> : cev("önceki konu")} {cev("bitince açılır. Öncesini zaten biliyorsan")} <b>{cev("seviye testinden")}</b> {cev("en az")} {GECME} {cev("alarak doğrudan bu konuya geçebilirsin.")}</span>
          </p>
          <Button asChild className="mt-1 w-full"><Link href={seviyeHref(ders, e.id!)}>{cev("Seviye testini çöz")}</Link></Button>
          {sira && <Button asChild variant="outline" className="w-full"><Link href={href(ders, sira.id)}>{cev("Sıradaki konuya git")}</Link></Button>}
        </>
      )}
    </div>
  );
}

function TestPencere({ ders, list, u }: { ders: DersId; list: Entry[]; u: Unitem }) {
  const d = useDurumlar();
  const puan = d.unite[uniteAnahtar(ders, u.kod)], ac = uniteAcik(list, u, d), gecti = uniteGecti(ders, u.kod, d);
  const Kilit = Icon.kilit;
  return (
    <div className="grid gap-3 pb-1">
      <span className="text-[13px] font-bold text-acc">{cev("{0}. ünite", u.no)}</span>
      <SheetTitle className="text-[22px]">{u.ad}{cev(": ünite testi")}</SheetTitle>
      <SheetDescription className="text-[15px] text-muted-foreground">
        {cev("Ünitedeki")} {u.konular.length} {cev("konudan karışık sorular. En az")} {GECME} {cev("puan alırsan bu ünitenin bütün konuları açılır ve sıradaki üniteye geçersin.")}
      </SheetDescription>
      {puan !== undefined && <p className="text-[14px] font-semibold">{cev("En iyi puanın:")} {puan}{gecti ? cev(" · geçtin") : ""}</p>}
      {ac ? (
        <Button asChild className="mt-1 w-full"><Link href={uniteHref(ders, u.no)}>{puan !== undefined ? cev("Yeniden çöz") : cev("Teste başla")}</Link></Button>
      ) : (
        <p className="flex items-start gap-2.5 rounded-xl bg-secondary p-3 text-[15px] [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:flex-none">
          <Kilit /><span>{cev("Bu testi çözmek için önce önceki üniteleri bitir ya da onların testlerini geç.")}</span>
        </p>
      )}
    </div>
  );
}
