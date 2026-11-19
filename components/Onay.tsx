"use client";
// E-postadaki bağlantılar buraya gelir (Supabase e-posta şablonları: docs/eposta/). Bağlantıdaki token_hash bu sayfada
// doğrulanır; böylece bağlantı başka tarayıcıda ya da telefonda açılsa da çalışır ve e-posta programlarının bağlantıyı
// önceden açıp denetlemesi (Outlook, Hotmail) tek kullanımlık kodu harcamaz.
import { cev } from "@/lib/dil";
import { ANA } from "@/lib/site";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { EmailOtpType } from "@supabase/supabase-js";
import { sb } from "@/lib/bulut";
import { GeriTop, Govde, PageHead } from "./temel";
import { Button } from "./ui/button";

type Durum = "bekle" | "tamam" | "hata";

export default function Onay() {
  const router = useRouter(), basladi = useRef(false);
  const [durum, setDurum] = useState<Durum>("bekle");
  useEffect(() => {
    if (basladi.current) return;
    basladi.current = true;
    const q = new URLSearchParams(location.search);
    const token_hash = q.get("token_hash"), type = (q.get("type") ?? "signup") as EmailOtpType;
    if (!token_hash) return setDurum("hata");
    sb().auth.verifyOtp({ token_hash, type }).then(({ error }) => {
      if (error) return setDurum("hata");
      if (type === "recovery") return router.replace("/sifre/");
      setDurum("tamam");
    });
  }, [router]);

  const [baslik, metin] = durum === "bekle"
    ? [cev("Hesabın onaylanıyor"), cev("Bir saniye...")]
    : durum === "tamam"
      ? [cev("Hesabın hazır"), cev("E-postanı doğruladın. İlerlemen artık hesabına kaydediliyor. Başka bir cihazda aynı e-postayla giriş yaparsan kaldığın yerden devam edersin.")]
      : [cev("Bağlantı çalışmadı"), cev("Bu bağlantının süresi dolmuş ya da daha önce kullanılmış. Hesabını zaten onayladıysan giriş yapabilirsin.")];
  return (
    <div className="app">
      <GeriTop to="/profil/" label={cev("Profil'e dön")} baslik={baslik} />
      <Govde>
        <PageHead text={metin} />
        {durum === "tamam" && <Button asChild><Link href={ANA}>{cev("Derslere başla")}</Link></Button>}
        {durum === "hata" && <Button asChild variant="hesap"><Link href="/giris/?giris">{cev("Giriş yap")}</Link></Button>}
      </Govde>
    </div>
  );
}
