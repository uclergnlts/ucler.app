"use client";
// E-postadaki şifre yenileme bağlantısı buraya gelir: bağlantı oturumu açar, öğrenci yeni şifresini yazar.
import { cev } from "@/lib/dil";
import Link from "next/link";
import { useState } from "react";
import { hataMetni, sb, useOturum } from "@/lib/bulut";
import { GeriTop, Govde, PageHead } from "./temel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SifreYenile() {
  const oturum = useOturum();
  const [sifre, setSifre] = useState(""), [hata, setHata] = useState(""), [tamam, setTamam] = useState(false), [bekle, setBekle] = useState(false);
  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    if (sifre.length < 8) return setHata(cev("Şifre en az 8 karakter olmalı."));
    setBekle(true); setHata("");
    const { error } = await sb().auth.updateUser({ password: sifre });
    setBekle(false);
    if (error) setHata(hataMetni(error)); else setTamam(true);
  }
  return (
    <div className="app">
      <GeriTop to="/profil/" label={cev("Profil'e dön")} baslik={cev("Yeni şifre")} />
      <Govde>
        <PageHead text={oturum === null ? cev("Bu bağlantının süresi dolmuş ya da kullanılmış. Yeni bir bağlantı iste.") : cev("Hesabın için yeni bir şifre belirle.")} />
        {tamam ? (
          <>
            <p role="status" className="rounded-xl bg-good-soft px-3.5 py-2.5 text-[14px] font-medium">{cev("Şifren değişti.")}</p>
            <Button asChild><Link href="/profil/">{cev("Profil'e git")}</Link></Button>
          </>
        ) : oturum === null ? (
          <Button asChild><Link href="/giris/?giris">{cev("Giriş ekranına git")}</Link></Button>
        ) : (
          <form onSubmit={kaydet} className="grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-[14px] font-semibold">{cev("Yeni şifre")}</span>
              <Input type="password" autoComplete="new-password" minLength={8} value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder={cev("En az 8 karakter")} />
            </label>
            {hata && <p role="alert" className="rounded-xl bg-bad-soft px-3.5 py-2.5 text-[14px] font-medium text-bad">{hata}</p>}
            <Button type="submit" disabled={bekle || !oturum}>{bekle ? cev("Bekle...") : cev("Şifreyi kaydet")}</Button>
          </form>
        )}
      </Govde>
    </div>
  );
}
