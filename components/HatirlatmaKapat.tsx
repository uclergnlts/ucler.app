"use client";
// Seri hatırlatma e-postasındaki "hatırlatmaları kapat" bağlantısı buraya gelir. Kapatma, e-posta programlarının
// bağlantıyı önceden açıp denetlemesiyle olmasın diye sayfanın içinden yapılır (supabase/functions/seri-hatirlat).
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sb } from "@/lib/bulut";
import { GeriTop, Govde, PageHead } from "./temel";
import { Button } from "./ui/button";

export default function HatirlatmaKapat() {
  const basladi = useRef(false);
  const [durum, setDurum] = useState<"bekle" | "tamam" | "hata">("bekle");
  useEffect(() => {
    if (basladi.current) return;
    basladi.current = true;
    const q = new URLSearchParams(location.search);
    sb().functions.invoke("seri-hatirlat", { body: { u: q.get("u"), t: q.get("t") } })
      .then(({ data, error }) => setDurum(!error && data?.tamam ? "tamam" : "hata"));
  }, []);
  const [baslik, metin] = durum === "bekle"
    ? ["Bir saniye...", ""]
    : durum === "tamam"
      ? ["Hatırlatmaları kapattık", "Artık serin için e-posta göndermeyeceğiz. İstersen Profil > Ayarlar'dan yeniden açabilirsin."]
      : ["Bağlantı çalışmadı", "Hatırlatmaları Profil > Ayarlar'dan da kapatabilirsin."];
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
