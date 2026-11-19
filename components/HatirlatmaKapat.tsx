"use client";
// Seri hatırlatma ve yeni içerik e-postalarındaki "kapat" bağlantısı buraya gelir (?tur=yenilik: yeni içerik, ?tur=hepsi: tüm e-postalar). Kapatma, e-posta programlarının
// bağlantıyı önceden açıp denetlemesiyle olmasın diye sayfanın içinden yapılır (supabase/functions/).
import { cev } from "@/lib/dil";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sb } from "@/lib/bulut";
import { GeriTop, Govde, PageHead } from "./temel";
import { Button } from "./ui/button";

export default function HatirlatmaKapat() {
  const basladi = useRef(false);
  const [durum, setDurum] = useState<"bekle" | "tamam" | "hata">("bekle"), [tur, setTur] = useState<"seri" | "yenilik" | "hepsi">("seri");
  useEffect(() => {
    if (basladi.current) return;
    basladi.current = true;
    const q = new URLSearchParams(location.search), t = q.get("tur") === "yenilik" ? "yenilik" : q.get("tur") === "hepsi" ? "hepsi" : "seri";
    setTur(t);
    sb().functions.invoke(t === "yenilik" ? "yenilik-bildir" : "seri-hatirlat", { body: { u: q.get("u"), t: q.get("t"), hepsi: t === "hepsi" } })
      .then(({ data, error }) => setDurum(!error && data?.tamam ? "tamam" : "hata"));
  }, []);
  const [baslik, metin] = durum === "bekle"
    ? [cev("Bir saniye..."), ""]
    : durum === "tamam"
      ? tur === "hepsi"
        ? [cev("Tüm e-postalardan çıktın"), cev("Artık sana seri hatırlatması ya da yeni içerik e-postası göndermeyeceğiz. İstersen Profil > Ayarlar'dan yeniden açabilirsin.")]
        : tur === "yenilik"
        ? [cev("Bildirimleri kapattık"), cev("Artık yeni içerikler için e-posta göndermeyeceğiz. İstersen Profil > Ayarlar'dan yeniden açabilirsin.")]
        : [cev("Hatırlatmaları kapattık"), cev("Artık serin için e-posta göndermeyeceğiz. İstersen Profil > Ayarlar'dan yeniden açabilirsin.")]
      : [cev("Bağlantı çalışmadı"), cev("E-posta bildirimlerini Profil > Ayarlar'dan da kapatabilirsin.")];
  return (
    <div className="app">
      <GeriTop to="/profil/" label={cev("Profil'e dön")} baslik={baslik} />
      <Govde>
        <PageHead text={metin} />
        {durum !== "bekle" && <Button asChild><Link href="/profil/ayarlar/">{cev("Ayarlar'a git")}</Link></Button>}
      </Govde>
    </div>
  );
}
