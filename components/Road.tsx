"use client";
// Bir dersin konuları: ünite ünite, konu içindeki aşama yolu gibi kıvrılan yollar. Her ünitenin sonunda ünite testi.
// Konular sırayla açılır (lib/kilit.ts). Bir konuya dokununca alttan kısa özet ve "Başla" penceresi açılır;
// kilitli konuda pencere neden kilitli olduğunu ve ünite testiyle nasıl atlanacağını söyler.
import Link from "next/link";
import { useRef, useState } from "react";
import { DERSLER, type DersId, type Entry } from "@/lib/dersler";
import { acik, atlamaUnitesi, bekledigi, GECME, siradaki, uniteAcik, uniteGecti, uniteHref, uniteler, type Unitem } from "@/lib/kilit";
import { useDurumlar } from "@/lib/store";
import { asamaSayisi } from "@/lib/asama";
import { cn } from "@/lib/utils";
import { Icon } from "./icons";
import { Govde, Html, href, UstBar, UstEylem } from "./temel";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import AsamaYolu, { type YolDugum } from "./AsamaYolu";

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
        geri={{ to: "/", label: "Ana sayfa" }}
        baslik={s.ad}
        sag={<UstEylem label="Bu ders nasıl ilerler?" icon={<Icon.soru />} onClick={() => setYardim(true)} />}
      />
      <Govde>
        <section className="grid gap-1.5">
          <p className="text-[15px] text-muted-foreground">{s.yol}.</p>
          <Progress className="mt-1.5" value={ready.length ? (100 * done) / ready.length : 0} label={`${ready.length} konudan ${done} tanesi bitti`} />
          <span className="text-[13px] font-semibold text-muted-foreground">{done} / {ready.length} konu bitti</span>
        </section>
        {uler.map((u) => {
          const biten = u.konular.filter((e) => d.prog[`${ders}.${e.id}`]).length;
          const gecti = uniteGecti(ders, u.no, d), testAcik = uniteAcik(list, u, d), puan = d.unite[`${ders}.${u.no}`];
          return (
            <section key={u.no} className="grid gap-2" aria-label={`${u.no}. ünite: ${u.ad}`}>
              <div className="flex items-end justify-between gap-3 border-b border-border pb-2.5">
                <div className="grid min-w-0">
                  <span className="text-[13px] font-bold text-acc">{u.no}. ünite</span>
                  <h2 className="text-[20px] leading-tight">{u.ad}</h2>
                </div>
                <span className="flex-none text-[13px] font-semibold tabular-nums text-muted-foreground">{gecti && biten < u.konular.length ? "Geçildi" : `${biten}/${u.konular.length}`}</span>
              </div>
              <div className="pt-10">
                <AsamaYolu
                  ad={`${u.no}. ünitenin konuları`}
                  kaydir
                  balon={done ? "Devam" : "Başla"}
                  dugumler={[
                    ...u.konular.map((e): YolDugum => {
                      const k = `${ders}.${e.id}`, res = d.prog[k], ac = acik(list, e.id!, d);
                      const durum: YolDugum["durum"] = res ? "bitti" : e.id === sira?.id ? "sirada" : "kilitli";
                      const ilerleme = !res && d.asama[k] ? `${d.asama[k]}/${asamaSayisi(e.cardCount ?? 0)} aşama` : "";
                      return {
                        baslik: e.title ?? e.ad,
                        alt: res ?? ilerleme,
                        durum,
                        serbest: ac,
                        dokun: true,
                        etiket: `${e.no}. ${e.title}, ${res ? "bitti" : durum === "sirada" ? "sıradaki konu" : ac ? "açık" : "kilitli"}`,
                        ac: () => setSecim({ tur: "konu", e }),
                      };
                    }),
                    {
                      baslik: "Ünite testi",
                      alt: puan !== undefined ? `En iyi puanın: ${puan}` : `${GECME} alan üniteyi geçer`,
                      durum: gecti ? "bitti" : "kilitli",
                      test: true,
                      serbest: testAcik,
                      dokun: true,
                      etiket: `${u.no}. ünite testi, ${gecti ? "geçildi" : testAcik ? "çözebilirsin" : "kilitli"}`,
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
            <SheetTitle className="text-[22px]">Bu ders nasıl ilerler?</SheetTitle>
            <SheetDescription className="text-[15px] text-muted-foreground">
              Konular sırayla açılır; her konu bir öncekinin üzerine kurulu. Bir üniteyi zaten biliyorsan ünite testinden en az {GECME} alarak o üniteyi atlayabilirsin. Başladığın konular hep açık kalır.
            </SheetDescription>
            <Button className="mt-2" onClick={() => setYardim(false)}>Anladım</Button>
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
  const testU = atlamaUnitesi(list, e, d);
  const Kilit = Icon.kilit;
  return (
    <div className="grid gap-3 pb-1">
      <span className="text-[13px] font-bold text-acc">{e.unite}. ünite · {e.no}. konu</span>
      <SheetTitle className="text-[22px]">{e.title}</SheetTitle>
      <SheetDescription className="text-[15px] text-muted-foreground"><Html html={e.summary ?? ""} /></SheetDescription>
      <p className="flex flex-wrap gap-x-3 text-[14px] font-semibold text-muted-foreground">
        <span>{nA} aşama + mini test</span>
        {e.dk && <span>yaklaşık {e.dk} dk</span>}
      </p>
      {ac ? (
        <>
          {!res && bitenA > 0 && <Progress value={(100 * bitenA) / nA} label={`${nA} aşamadan ${bitenA} tanesi bitti`} />}
          {res && <p className="text-[14px] font-semibold">Bitirdin: {res}</p>}
          <Button asChild className="mt-1 w-full"><Link href={href(ders, e.id)}>{res ? "Yeniden çalış" : bitenA > 0 ? "Devam et" : "Başla"}</Link></Button>
        </>
      ) : (
        <>
          <p className="flex items-start gap-2.5 rounded-xl bg-secondary p-3 text-[15px] [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:flex-none">
            <Kilit />
            <span>Bu konu, {once ? <b>“{once.title}”</b> : "önceki konu"} bitince açılır.{testU && <> Bu bölümü zaten biliyorsan <b>{testU.no}. ünite testinden</b> en az {GECME} alarak ilerleyebilirsin.</>}</span>
          </p>
          {sira && <Button asChild className="mt-1 w-full"><Link href={href(ders, sira.id)}>Sıradaki konuya git</Link></Button>}
          {testU && <Button asChild variant="outline" className={cn("w-full", !sira && "mt-1")}><Link href={uniteHref(ders, testU.no)}>{testU.no}. ünite testini çöz</Link></Button>}
        </>
      )}
    </div>
  );
}

function TestPencere({ ders, list, u }: { ders: DersId; list: Entry[]; u: Unitem }) {
  const d = useDurumlar();
  const puan = d.unite[`${ders}.${u.no}`], ac = uniteAcik(list, u, d), gecti = uniteGecti(ders, u.no, d);
  const Kilit = Icon.kilit;
  return (
    <div className="grid gap-3 pb-1">
      <span className="text-[13px] font-bold text-acc">{u.no}. ünite</span>
      <SheetTitle className="text-[22px]">{u.ad}: ünite testi</SheetTitle>
      <SheetDescription className="text-[15px] text-muted-foreground">
        Ünitedeki {u.konular.length} konudan karışık sorular. En az {GECME} puan alırsan bu ünitenin bütün konuları açılır ve sıradaki üniteye geçersin.
      </SheetDescription>
      {puan !== undefined && <p className="text-[14px] font-semibold">En iyi puanın: {puan}{gecti ? " · geçtin" : ""}</p>}
      {ac ? (
        <Button asChild className="mt-1 w-full"><Link href={uniteHref(ders, u.no)}>{puan !== undefined ? "Yeniden çöz" : "Teste başla"}</Link></Button>
      ) : (
        <p className="flex items-start gap-2.5 rounded-xl bg-secondary p-3 text-[15px] [&_svg]:mt-0.5 [&_svg]:size-4 [&_svg]:flex-none">
          <Kilit /><span>Bu testi çözmek için önce önceki üniteleri bitir ya da onların testlerini geç.</span>
        </p>
      )}
    </div>
  );
}
