"use client";
// Kayıt daveti: hesabı olmayan öğrenci bir aşamayı bitirince alttan bir kez "İlerlemeni kaybetme" açılır.
// Kayıt zorunlu değil; "Şimdi değil" ile kapanır ve bir daha sorulmaz. Hesap açılınca cihazdaki ilerleme
// hesaba taşınır (lib/bulut.ts, lib/esitle.ts) ve öğrenci kaldığı konuya döner.
import Link from "next/link";
import { useEffect, useState } from "react";
import { donusYaz, googleIleGir, hataMetni, useGoogle, useOturum } from "@/lib/bulut";
import { olay } from "@/lib/olay";
import { ipucuGoruldu, useIpucu } from "@/lib/store";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";

export default function KayitDavet({ donus }: { donus: string }) {
  const oturum = useOturum(), ipucu = useIpucu(), google = useGoogle();
  const [acik, setAcik] = useState(false), [hata, setHata] = useState("");
  const sor = oturum === null && !ipucu.includes("kayit");
  // Aşama bitti ekranı önce görünsün (madalya, puan), davet biraz sonra gelsin.
  useEffect(() => {
    if (!sor) return;
    const z = setTimeout(() => { setAcik(true); ipucuGoruldu("kayit"); olay("kayit_davet"); }, 1200);
    return () => clearTimeout(z);
  }, [sor]);

  return (
    <Sheet open={acik} onOpenChange={(o) => { setAcik(o); if (!o) olay("kayit_kapat"); }}>
      <SheetContent>
        <div className="grid gap-3 pt-1 pb-1 text-center">
          <SheetTitle className="text-[22px]">İlerlemeni kaybetme</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Ücretsiz hesap aç; bitirdiğin aşamalar, puanın ve serin her cihazda seninle olsun.
          </SheetDescription>
          {hata && <p role="alert" className="rounded-xl bg-bad-soft px-3.5 py-2.5 text-[14px] font-medium text-bad">{hata}</p>}
          <div className="mt-1 grid gap-2">
            {google && <GoogleDugme onClick={() => { olay("kayit_google"); googleIleGir(donus).catch((e) => setHata(hataMetni(e))); }} />}
            <Button asChild variant={google ? "outline" : "default"}>
              <Link href="/giris/" onClick={() => { olay("kayit_eposta"); donusYaz(donus); }}>E-postayla hesap aç</Link>
            </Button>
            <SheetClose asChild><Button variant="ghost">Şimdi değil</Button></SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
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
