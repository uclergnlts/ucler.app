"use client";
// ucler Plus ekranı (lib/abonelik.ts). Plus isteyen konuya girilince konunun yerinde, Profil'den ise /plus/ sayfasında açılır.
// Uygulamada: fiyat mağazadan okunur, "Abone ol" mağazanın ödeme penceresini açar, "Satın alımlarımı geri yükle" eski
// aboneliği geri getirir. Mağazaların istediği yenileme bilgisi ve koşul bağlantıları düğmenin altında durur.
// Sitede satın alma yok: öğrenciye uygulamadan abone olabileceği ve aynı hesapla girerse burada da açılacağı söylenir.
import Link from "next/link";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { APPLE_EULA, geriYukle, MAGAZA, satinAl, satinAlinabilir, teklifAl, usePlus, type Teklif } from "@/lib/abonelik";
import { useOturum } from "@/lib/bulut";
import { olay } from "@/lib/olay";
import { Icon } from "./icons";
import { Button } from "./ui/button";

const tarih = (ms: number) => new Date(ms).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function PlusEkran({ konu, donus }: { konu?: string; donus?: string }) {
  const plus = usePlus(), oturum = useOturum();
  const [teklif, setTeklif] = useState<Teklif | null | undefined>(undefined);
  const [is, setIs] = useState<"" | "aliniyor" | "yukleniyor">("");
  const [ileti, setIleti] = useState<{ iyi: boolean; m: string } | null>(null);
  const uygulama = satinAlinabilir();
  const ios = Capacitor.getPlatform() === "ios";
  const magazaAdi = ios ? "App Store" : "Google Play";
  const Check = Icon.check, Yildiz = Icon.yildiz;

  useEffect(() => {
    if (!uygulama) return;
    let canli = true;
    void teklifAl().then((t) => { if (canli) setTeklif(t); });
    return () => { canli = false; };
  }, [uygulama]);
  useEffect(() => { olay("plus_gor", { konu: konu ? "konu" : "profil" }); }, [konu]);

  async function al() {
    if (!teklif) return;
    setIs("aliniyor"); setIleti(null);
    const r = await satinAl(teklif);
    setIs("");
    if (r === "tamam") olay("plus_al", {});
    if (r === "hata") setIleti({ iyi: false, m: "Satın alma tamamlanamadı. Ücret alınmadı; biraz sonra yeniden dene." });
  }
  async function yukle() {
    setIs("yukleniyor"); setIleti(null);
    const ok = await geriYukle();
    setIs("");
    setIleti(ok ? { iyi: true, m: "Aboneliğin geri yüklendi." } : { iyi: false, m: `Bu ${magazaAdi} hesabında süren bir ucler Plus aboneliği bulunamadı.` });
  }

  if (plus) {
    return (
      <article className="grid gap-3 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--c1)_12%,white)] text-[var(--c1)] [&_svg]:size-8"><Yildiz /></span>
        <h1 className="text-[24px]">ucler Plus açık</h1>
        <p className="text-[15px] text-muted-foreground">
          Bütün konular açık.{" "}
          {plus.bitis !== null && (plus.yenilenir ? <>Aboneliğin {tarih(plus.bitis)} tarihinde kendiliğinden yenilenir.</> : <>Aboneliğin {tarih(plus.bitis)} tarihinde biter, yenilenmeyecek.</>)}
        </p>
        <div className="mt-2 grid gap-2">
          {donus && <Button asChild><Link href={donus}>Konuya devam et</Link></Button>}
          {plus.kaynak === "magaza" && plus.yonet && (
            <Button asChild variant="outline"><a href={plus.yonet} target="_blank" rel="noopener noreferrer">Aboneliği yönet</a></Button>
          )}
          {plus.kaynak === "hesap" && <p className="text-[13px] text-muted-foreground">Aboneliğini, satın aldığın telefonda App Store ya da Google Play ayarlarından yönetebilir veya iptal edebilirsin.</p>}
        </div>
      </article>
    );
  }

  return (
    <article className="grid gap-4">
      <div className="grid gap-2 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[color-mix(in_srgb,var(--c1)_12%,white)] text-[var(--c1)] [&_svg]:size-8"><Yildiz /></span>
        <h1 className="text-[24px]">{konu ? <>“{konu}” ucler Plus&apos;ta</> : "ucler Plus"}</h1>
        <p className="text-[15px] text-muted-foreground">Her dersin ilk konusu ücretsiz. Plus ile bütün konular açılır.</p>
      </div>
      <ul className="grid gap-2.5 rounded-2xl border border-border bg-card p-4 text-[15px]">
        {["Fizik, kimya ve biyolojinin bütün konuları", "Her konuda etkileşimli adımlar ve konu sonu testi", "Yeni eklenen her ders ve konu", "Videolar, oyunlar, ünite ve seviye testleri herkese açık"].map((m) => (
          <li key={m} className="flex items-start gap-2.5 [&_svg]:mt-0.5 [&_svg]:size-5 [&_svg]:flex-none [&_svg]:text-[var(--c1)]"><Check /><span>{m}</span></li>
        ))}
      </ul>

      {uygulama ? (
        <div className="grid gap-2">
          {teklif === undefined && <Button disabled>Fiyat yükleniyor...</Button>}
          {teklif === null && <p role="alert" className="text-center text-[14px] text-muted-foreground">Abonelik şu an {magazaAdi}&apos;dan alınamıyor. İnternet bağlantını kontrol edip yeniden dene.</p>}
          {teklif && (
            <>
              {teklif.deneme && <p className="text-center text-[15px] font-semibold">{teklif.deneme} gün ücretsiz, sonra {teklif.fiyat} / ay</p>}
              <Button variant="hesap" disabled={!!is} onClick={al}>
                {is === "aliniyor" ? "Bekleniyor..." : teklif.deneme ? `${teklif.deneme} gün ücretsiz dene` : `Abone ol · ${teklif.fiyat} / ay`}
              </Button>
            </>
          )}
          <Button variant="ghost" disabled={!!is} onClick={yukle}>{is === "yukleniyor" ? "Aranıyor..." : "Satın alımlarımı geri yükle"}</Button>
          {ileti && <p role={ileti.iyi ? "status" : "alert"} className={`text-center text-[14px] font-medium ${ileti.iyi ? "text-good" : "text-bad"}`}>{ileti.m}</p>}
          {oturum === null && (
            <p className="text-center text-[13px] text-muted-foreground">
              Abone olmadan önce <Link href="/giris/" className="font-semibold text-[var(--c1)]">hesap açarsan</Link> Plus, aynı hesapla girdiğin web sitesinde de açılır.
            </p>
          )}
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            {teklif?.deneme ? <>İlk {teklif.deneme} gün ücretsiz. Deneme bitmeden en az 24 saat önce iptal etmezsen deneme bitince {teklif.fiyat} ücret alınır ve abonelik aylık devam eder. </> : null}
            Abonelik aylıktır ve her ay kendiliğinden yenilenir. Ücret, satın almayı onaylayınca {magazaAdi} hesabından alınır. Dönem bitmeden en az 24 saat önce iptal etmezsen
            yenilenir ve ücret yeniden alınır. Aboneliğini {ios ? "iPhone'da Ayarlar > adın > Abonelikler" : "Google Play > Ödemeler ve abonelikler"} bölümünden istediğin zaman yönetebilir ya da iptal edebilirsin.
          </p>
          <p className="flex flex-wrap justify-center gap-x-4 text-[12px] font-semibold">
            <a href={ios ? APPLE_EULA : "/kosullar/"} target={ios ? "_blank" : undefined} rel="noopener noreferrer" className="text-muted-foreground underline">Kullanım koşulları</a>
            <Link href="/gizlilik/" className="text-muted-foreground underline">Gizlilik politikası</Link>
          </p>
        </div>
      ) : (
        <div className="grid gap-2 rounded-2xl bg-secondary p-4 text-[15px]">
          <b className="font-display text-[17px] font-extrabold">Plus&apos;a telefon uygulamasından abone olabilirsin</b>
          <p className="text-muted-foreground">
            Abonelik App Store ya da Google Play üzerinden alınır. Uygulamada hesabınla abone olduysan, burada da aynı hesapla giriş yapınca bütün konular açılır.
          </p>
          {(MAGAZA.ios || MAGAZA.android) && (
            <div className="grid grid-cols-2 gap-2">
              {MAGAZA.ios && <Button asChild variant="outline"><a href={MAGAZA.ios} target="_blank" rel="noopener noreferrer">App Store</a></Button>}
              {MAGAZA.android && <Button asChild variant="outline"><a href={MAGAZA.android} target="_blank" rel="noopener noreferrer">Google Play</a></Button>}
            </div>
          )}
          {oturum === null && <Button asChild variant="hesap"><Link href="/giris/?giris">Giriş yap</Link></Button>}
          {oturum && <p className="text-[13px] text-muted-foreground">{oturum.user.email} ile girdin. Uygulamada abone olduysan ve burada açılmadıysa, uygulamada Profil &gt; ucler Plus &gt; Satın alımlarımı geri yükle&apos;ye dokun.</p>}
        </div>
      )}
    </article>
  );
}
