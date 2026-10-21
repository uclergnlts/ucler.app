"use client";
// Seri hatırlatma ve yeni içerik e-postalarındaki "kapat" bağlantısı buraya gelir (?tur=yenilik: yeni içerik). Kapatma, e-posta programlarının
// bağlantıyı önceden açıp denetlemesiyle olmasın diye sayfanın içinden yapılır (supabase/functions/).
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sb } from "@/lib/bulut";
import { GeriTop, Govde, PageHead } from "./temel";
import { Button } from "./ui/button";

export default function HatirlatmaKapat() {
  const basladi = useRef(false);
  const [durum, setDurum] = useState<"bekle" | "tamam" | "hata">("bekle"), [yenilik, setYenilik] = useState(false);
  useEffect(() => {
    if (basladi.current) return;
    basladi.current = true;
    const q = new URLSearchParams(location.search), y = q.get("tur") === "yenilik";
    setYenilik(y);
    sb().functions.invoke(y ? "yenilik-bildir" : "seri-hatirlat", { body: { u: q.get("u"), t: q.get("t") } })
      .then(({ data, error }) => setDurum(!error && data?.tamam ? "tamam" : "hata"));
  }, []);
  const [baslik, metin] = durum === "bekle"
    ? ["Bir saniye...", ""]
    : durum === "tamam"
      ? yenilik
        ? ["Bildirimleri kapattık", "Artık yeni içerikler için e-posta göndermeyeceğiz. İstersen Profil > Ayarlar'dan yeniden açabilirsin."]
        : ["Hatırlatmaları kapattık", "Artık serin için e-posta göndermeyeceğiz. İstersen Profil > Ayarlar'dan yeniden açabilirsin."]
      : ["Bağlantı çalışmadı", "E-posta bildirimlerini Profil > Ayarlar'dan da kapatabilirsin."];
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" />
      <Govde>
        <PageHead title={baslik} text={metin} />
        {durum !== "bekle" && <Button asChild><Link href="/profil/ayarlar/">{"Ayarlar'a git"}</Link></Button>}
      </Govde>
    </div>
  );
}
