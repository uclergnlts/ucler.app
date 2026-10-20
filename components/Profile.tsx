"use client";
// Profil ana ekranı: ad, üç özet sayı (puan, seri, biten konu) ve alt ekranlara giden satırlar.
// Alt ekranlar components/profil/ altında: İstatistikler, Kaydedilenler, Anlamadıklarım, Ayarlar.
import type { DersId, Entry } from "@/lib/dersler";
import { seri } from "@/lib/puan";
import { gunAdi, setAd, useAd, useStorageOk, useTekrar } from "@/lib/store";
import { useOturum } from "@/lib/bulut";
import Link from "next/link";
import { Button } from "./ui/button";
import { Icon } from "./icons";
import { Bos, Govde, Liste, Ok, PageHead, Satir, Top } from "./temel";
import { Card } from "./ui/card";
import { useAnlamadiklarim, useKaydedilenler, useProfil } from "./profil/veri";

export default function Profile({ all, basliklar }: { all: Record<DersId, Entry[]>; basliklar: Record<string, string[]> }) {
  const { puan, done, yeni } = useProfil();
  const storageOk = useStorageOk(), ad = useAd(), oturum = useOturum();
  const kayitli = useKaydedilenler(all).length, anlamadim = useAnlamadiklarim(all, basliklar).length;
  const tekrar = useTekrar();
  const sira = Object.values(tekrar).map((x) => x.g).sort(), kalan = sira.length;
  const User = Icon.profil, TekrarI = Icon.tekrar, Kitap = Icon.kitap, Grafik = Icon.grafik, Kayit = Icon.kayit, Soru = Icon.soru, Ayar = Icon.ayar;

  return (
    <div className="app">
      <Top />
      <Govde>
        <PageHead title="Profil" />
        <section className="flex items-center gap-3.5">
          <span className="grid size-14 flex-none place-items-center rounded-full bg-secondary text-muted-foreground [&_svg]:size-7"><User /></span>
          <span className="min-w-0 flex-1">
            {/* Ad biliniyorsa yeniden sorulmaz; ada dokunup değiştirilebilir. */}
            <label htmlFor="ad" className={ad ? "sr-only" : "block text-[13px] font-semibold text-muted-foreground"}>{ad ? "Adın" : "Sana nasıl hitap edelim?"}</label>
            <input
              id="ad"
              className={`block w-full border-0 border-b bg-transparent ${ad ? "border-transparent" : "border-dashed border-border-strong"} py-0.5 font-display text-xl font-extrabold text-foreground outline-none placeholder:font-bold placeholder:text-muted-foreground focus:border-solid focus:border-foreground`}
              defaultValue={ad}
              key={ad}
              placeholder="Adın"
              maxLength={30}
              onBlur={(e) => setAd(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
            />
            <span className="text-sm text-muted-foreground">
              {oturum
                ? oturum.user.email
                : storageOk
                  ? "İlerlemen şimdilik yalnızca bu cihazda saklanıyor."
                  : "Tarayıcın kayıt tutmaya izin vermiyor. İlerlemen ve kaydettiklerin sayfayı yenilersen ya da sekmeyi kapatırsan silinir."}
            </span>
          </span>
        </section>
        {oturum === null && (
          // Hesabı olmayan öğrenciye: ilerlemesi yalnız bu cihazda, hesap açınca kaybolmaz.
          <section className="grid gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="grid gap-1">
              <b className="font-display text-[17px] font-extrabold">İlerlemen kaybolmasın</b>
              <p className="text-[14px] text-muted-foreground">Ücretsiz hesap aç; puanın, serin ve bitirdiğin konular hesabına kaydedilsin, telefon değiştirsen de devam et.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild><Link href="/giris/">Hesap aç</Link></Button>
              <Button asChild variant="outline"><Link href="/giris/?giris">Giriş yap</Link></Button>
            </div>
          </section>
        )}
        {yeni ? (
          <Bos>İlk konunu bitirdiğinde puanın, serin ve ilerlemen burada görünür.</Bos>
        ) : (
          <Card className="grid grid-cols-3 gap-0 py-0 [&>div:not(:first-child)]:border-l [&>div]:border-border">
            {([
              [puan.toplam ?? 0, "puan"], [`${seri(puan)} gün`, "seri"], [done.length, "konu bitti"],
            ] as const).map(([b, l]) => (
              <div key={l} className="px-2 py-3.5 text-center">
                <b className="block font-display text-2xl leading-tight font-extrabold">{b}</b>
                <span className="text-xs font-semibold text-muted-foreground">{l}</span>
              </div>
            ))}
          </Card>
        )}
        <Liste>
          <Satir
            href="/tekrar/"
            icon={<TekrarI />}
            title="Tekrar sırası"
            sub={kalan ? `${kalan} soru · ilki ${gunAdi(sira[0])}` : "Testte yanlış yaptığın sorular burada toplanır"}
            tag={<Ok />}
          />
          {done.length > 0 && (
            <Satir href="/tekrar/?karisik" icon={<Kitap />} title="Karışık test" sub="Bitirdiğin konulardan rastgele 10 soru" tag={<Ok />} />
          )}
          <Satir href="/profil/istatistikler/" icon={<Grafik />} title="İstatistikler" sub="Puan, seri, son 7 gün ve doğru oranı" tag={<Ok />} />
          <Satir href="/profil/kaydedilenler/" icon={<Kayit />} title="Kaydedilenler" sub={kayitli ? `${kayitli} konu` : "Kaydettiğin konular burada durur"} tag={<Ok />} />
          <Satir href="/profil/anlamadiklarim/" icon={<Soru />} title="Anlamadıklarım" sub={anlamadim ? `${anlamadim} kart` : "Anlamadım diye işaretlediğin kartlar"} tag={<Ok />} />
          <Satir href="/profil/ayarlar/" icon={<Ayar />} title="Ayarlar" sub="Hesap, hakkında, gizlilik, iletişim" tag={<Ok />} />
        </Liste>
      </Govde>
    </div>
  );
}
