"use client";
// Kayıt ol / giriş yap / şifremi unuttum. E-posta ve şifreyle (Supabase Auth). Kayıttan sonra e-postadaki bağlantıyla
// hesap doğrulanır; bağlantı öğrenciyi yeniden bu sayfaya getirir ve oturum açılmış olur.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { donusAl, googleIleGir, hataMetni, sb, useGoogle, useOturum } from "@/lib/bulut";
import { olay } from "@/lib/olay";
import { setAd, useAd } from "@/lib/store";
import { adres } from "@/lib/site";
import { GeriTop, Govde, PageHead } from "./temel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GoogleDugme } from "./KayitDavet";

type Mod = "kayit" | "giris" | "unuttum";

export default function Giris() {
  const oturum = useOturum(), router = useRouter(), kayitliAd = useAd(), google = useGoogle();
  const [mod, setMod] = useState<Mod>("kayit");
  const [ad, setAdS] = useState(""), [eposta, setEposta] = useState(""), [sifre, setSifre] = useState("");
  const [hata, setHata] = useState(""), [bilgi, setBilgi] = useState(""), [bekle, setBekle] = useState(false);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.has("giris")) setMod("giris");
    // Google'dan hata ile dönüldüyse (ör. öğrenci vazgeçti).
    if (p.has("error") || new URLSearchParams(location.hash.slice(1)).has("error")) setHata("Google ile giriş tamamlanamadı. Yeniden dene ya da e-postayla devam et.");
  }, []);
  useEffect(() => { if (kayitliAd) setAdS((a) => a || kayitliAd); }, [kayitliAd]);
  // Giriş yapılmışsa (e-posta bağlantısıyla ya da Google'dan gelindiyse) kayıt davetinin açıldığı konuya, yoksa Profil'e geç.
  useEffect(() => { if (oturum) router.replace(donusAl() ?? "/profil/"); }, [oturum, router]);

  const geri = typeof window !== "undefined" ? adres("/giris/") : undefined;
  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata(""); setBilgi(""); setBekle(true);
    const a = sb().auth;
    try {
      if (mod === "kayit") {
        if (sifre.length < 8) { setHata("Şifre en az 8 karakter olmalı."); return; }
        if (ad.trim()) setAd(ad);
        const { data, error } = await a.signUp({ email: eposta.trim(), password: sifre, options: { emailRedirectTo: geri, data: { ad: ad.trim() } } });
        if (error) return setHata(hataMetni(error));
        // Aynı e-postayla doğrulanmış hesap varsa Supabase hata vermez ama kimlik listesi boş gelir.
        if (data.user && !data.user.identities?.length) return setHata(hataMetni({ code: "user_already_exists" }));
        olay("kayit_gonder");
        if (!data.session) setBilgi(`${eposta.trim()} adresine bir doğrulama bağlantısı gönderdik. Bağlantıya dokununca hesabın açılır ve ilerlemen hesabına taşınır.`);
      } else if (mod === "giris") {
        const { error } = await a.signInWithPassword({ email: eposta.trim(), password: sifre });
        if (error) return setHata(hataMetni(error));
      } else {
        const { error } = await a.resetPasswordForEmail(eposta.trim(), { redirectTo: geri?.replace("/giris/", "/sifre/") });
        if (error) return setHata(hataMetni(error));
        setBilgi("Şifreni yenilemen için e-postana bir bağlantı gönderdik.");
      }
    } catch (err) {
      setHata(hataMetni(err as Error));
    } finally {
      setBekle(false);
    }
  }

  const baslik = mod === "kayit" ? "Hesap aç" : mod === "giris" ? "Giriş yap" : "Şifreni yenile";
  const metin = mod === "kayit"
    ? "Hesabın olunca ilerlemen, puanın ve serin kaybolmaz; telefonunu değiştirsen de kaldığın yerden devam edersin."
    : mod === "giris" ? "Hesabına gir, ilerlemen bu cihaza gelsin." : "Hesabının e-posta adresini yaz, yenileme bağlantısı gönderelim.";
  return (
    <div className="app">
      <GeriTop to="/profil/" label="Profil'e dön" baslik={baslik} />
      <Govde>
        <PageHead text={metin} />
        {google && mod !== "unuttum" && (
          <div className="grid gap-3">
            <GoogleDugme disabled={bekle} onClick={() => { setHata(""); googleIleGir().catch((e) => setHata(hataMetni(e))); }} />
            <p className="flex items-center gap-3 text-[13px] text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">ya da e-postayla</p>
          </div>
        )}
        <form onSubmit={gonder} className="grid gap-3" noValidate>
          {mod === "kayit" && (
            <label className="grid gap-1.5">
              <span className="text-[14px] font-semibold">Adın</span>
              <Input autoComplete="given-name" maxLength={30} value={ad} onChange={(e) => setAdS(e.target.value)} placeholder="Sana nasıl hitap edelim?" />
            </label>
          )}
          <label className="grid gap-1.5">
            <span className="text-[14px] font-semibold">E-posta</span>
            <Input type="email" inputMode="email" autoComplete="email" required value={eposta} onChange={(e) => setEposta(e.target.value)} placeholder="ornek@eposta.com" />
          </label>
          {mod !== "unuttum" && (
            <label className="grid gap-1.5">
              <span className="text-[14px] font-semibold">Şifre</span>
              <Input type="password" autoComplete={mod === "kayit" ? "new-password" : "current-password"} required minLength={8} value={sifre} onChange={(e) => setSifre(e.target.value)} placeholder={mod === "kayit" ? "En az 8 karakter" : ""} />
            </label>
          )}
          {hata && <p role="alert" className="rounded-xl bg-bad-soft px-3.5 py-2.5 text-[14px] font-medium text-bad">{hata}</p>}
          {bilgi && <p role="status" className="rounded-xl bg-good-soft px-3.5 py-2.5 text-[14px] font-medium">{bilgi}</p>}
          <Button type="submit" className="mt-1 w-full" disabled={bekle || !eposta.trim() || (mod !== "unuttum" && !sifre)}>
            {bekle ? "Bekle..." : mod === "kayit" ? "Hesap aç" : mod === "giris" ? "Giriş yap" : "Bağlantı gönder"}
          </Button>
        </form>
        <div className="grid justify-items-center gap-1 text-[15px]">
          {mod === "kayit" && <Degis onClick={() => setMod("giris")}>Zaten hesabın var mı? <b>Giriş yap</b></Degis>}
          {mod === "giris" && (
            <>
              <Degis onClick={() => setMod("unuttum")}>Şifreni mi unuttun?</Degis>
              <Degis onClick={() => setMod("kayit")}>Hesabın yok mu? <b>Hesap aç</b></Degis>
            </>
          )}
          {mod === "unuttum" && <Degis onClick={() => setMod("giris")}>Giriş ekranına dön</Degis>}
        </div>
        <p className="text-center text-[13px] text-muted-foreground">
          Hesap açarak <Link href="/gizlilik/" className="-my-2.5 inline-block py-2.5 font-semibold underline underline-offset-2">gizlilik</Link> metnini kabul etmiş olursun.
        </p>
      </Govde>
    </div>
  );
}

const Degis = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={() => { onClick(); }} className="min-h-11 px-2 text-muted-foreground [&_b]:text-foreground">{children}</button>
);
