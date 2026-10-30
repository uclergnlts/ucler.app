"use client";
// Kayıt daveti: hesabı olmayan öğrenci bir aşamayı bitirince alttan bir kez "İlerlemeni kaybetme" açılır.
// Konu kaydetmek ise hesap ister (useKaydet). Kayıt zorunlu değil; "Şimdi değil" ile kapanır ve bir daha sorulmaz. Hesap açılınca cihazdaki ilerleme
// hesaba taşınır (lib/bulut.ts, lib/esitle.ts) ve öğrenci kaldığı konuya döner.
import Link from "next/link";
import { useEffect, useState } from "react";
import { appleIleGir, donusYaz, googleIleGir, hataMetni, useGirisYollari, useOturum } from "@/lib/bulut";
import { olay } from "@/lib/olay";
import { bekleyenKayitYaz, ipucuGoruldu, toggleSaved, useIpucu, useSaved } from "@/lib/store";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";

export default function KayitDavet({ donus }: { donus: string }) {
  const oturum = useOturum(), ipucu = useIpucu();
  const [acik, setAcik] = useState(false);
  const sor = oturum === null && !ipucu.includes("kayit");
  // Aşama bitti ekranı önce görünsün (madalya, puan), davet biraz sonra gelsin.
  useEffect(() => {
    if (!sor) return;
    const z = setTimeout(() => { setAcik(true); ipucuGoruldu("kayit"); olay("kayit_davet"); }, 1200);
    return () => clearTimeout(z);
  }, [sor]);

  return (
    <KayitSayfasi
      acik={acik}
      setAcik={setAcik}
      donus={donus}
      baslik="İlerlemeni kaybetme"
      aciklama="Ücretsiz hesap aç; bitirdiğin aşamalar, puanın ve serin her cihazda seninle olsun."
    />
  );
}

/** Kaydet düğmesi: hesabı olmayan öğrenci kaydetmek isteyince konu hemen kaydedilmez, kayıt daveti açılır.
 *  Konu "bekleyen kayıt" olarak not edilir; hesap açılınca (components/Bulut.tsx) Kaydedilenler'e eklenir.
 *  Daha önce hesapsız kaydedilmiş bir konu yine çıkarılabilir. */
export function useKaydet(key: string, donus: string) {
  const oturum = useOturum(), saved = useSaved().includes(key);
  const [acik, setAcik] = useState(false);
  const misafir = !oturum;
  useEffect(() => { if (!misafir) setAcik(false); }, [misafir]);
  /** Kaydedildiyse ya da çıkarıldıysa true; davet açıldıysa false. */
  const kaydet = () => {
    if (misafir && !saved) { bekleyenKayitYaz(key); setAcik(true); olay("kayit_davet", { yol: "kaydet" }); return false; }
    toggleSaved(key);
    return true;
  };
  const davet = (
    <KayitSayfasi
      acik={acik}
      setAcik={setAcik}
      donus={donus}
      baslik="Kaydetmek için hesap aç"
      aciklama="Ücretsiz hesap aç; bu konu Kaydedilenler'e eklensin, ilerlemen her cihazda seninle olsun."
    />
  );
  return { saved, kaydet, davet };
}

export function KayitSayfasi({ acik, setAcik, donus, baslik, aciklama }: {
  acik: boolean; setAcik: (a: boolean) => void; donus: string; baslik: string; aciklama: string;
}) {
  const yol = useGirisYollari(), dis = yol.google || yol.apple;
  const [hata, setHata] = useState("");
  return (
    <Sheet open={acik} onOpenChange={(o) => { setAcik(o); if (!o) olay("kayit_kapat"); }}>
      <SheetContent>
        <div className="grid gap-3 pt-1 pb-1 text-center">
          <SheetTitle className="text-[22px]">{baslik}</SheetTitle>
          <SheetDescription className="text-muted-foreground">{aciklama}</SheetDescription>
          {hata && <p role="alert" className="rounded-xl bg-bad-soft px-3.5 py-2.5 text-[14px] font-medium text-bad">{hata}</p>}
          <div className="mt-1 grid gap-2">
            <DisGiris donus={donus} setHata={setHata} />
            <Button asChild variant={dis ? "outline" : "default"}>
              <Link href="/giris/" onClick={() => { olay("kayit_eposta"); donusYaz(donus); }}>E-postayla hesap aç</Link>
            </Button>
            <SheetClose asChild><Button variant="ghost">Şimdi değil</Button></SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Açık olan dış giriş düğmeleri: Apple (Apple'ın kuralı gereği siyah, en üstte) ve Google. */
export function DisGiris({ donus, disabled, setHata }: { donus?: string; disabled?: boolean; setHata: (h: string) => void }) {
  const yol = useGirisYollari();
  return (
    <>
      {yol.apple && <AppleDugme disabled={disabled} onClick={() => { setHata(""); olay("kayit_apple"); appleIleGir(donus).catch((e) => { if (!iptalMi(e)) setHata(hataMetni(e)); }); }} />}
      {yol.google && <GoogleDugme disabled={disabled} onClick={() => { setHata(""); olay("kayit_google"); googleIleGir(donus).catch((e) => setHata(hataMetni(e))); }} />}
    </>
  );
}

/** Öğrenci Apple ekranını kendisi kapattıysa hata gösterilmez. */
const iptalMi = (e: unknown) => /cancel|1001/i.test(String((e as { message?: string })?.message ?? e));

/** Apple'ın siyah "Apple ile devam et" düğmesi. */
export function AppleDugme({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button type="button" className="w-full gap-2.5 bg-black text-white hover:bg-black/85" onClick={onClick} disabled={disabled}>
      <svg viewBox="0 0 384 512" aria-hidden="true" className="size-[18px]" fill="currentColor">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      Apple ile devam et
    </Button>
  );
}

/** Google'ın renkli "G" işaretiyle giriş düğmesi. */
export function GoogleDugme({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <Button type="button" variant="outline" className="w-full gap-2.5" onClick={onClick} disabled={disabled}>
      <svg viewBox="0 0 48 48" aria-hidden="true" className="size-5">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      Google ile devam et
    </Button>
  );
}
