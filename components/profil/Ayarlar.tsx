"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { bildirimOku, bildirimYaz, cikisYap, hesabiSil, useEsitleme, useOturum, type Bildirim } from "@/lib/bulut";
import { girisYap } from "@/lib/puan";
import { resetAll, setAd } from "@/lib/store";
import { ses, sesAyarla, useSesAcik } from "@/lib/ses";
import { oyunAyarla, useOyunAcik } from "@/lib/oyun";
import { Icon } from "../icons";
import { Bolum, INSTAGRAM, Liste, Ok, Satir, UstEylem } from "../temel";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import Kabuk from "./Kabuk";

export default function Ayarlar() {
  const oturum = useOturum();
  const esitleme = useEsitleme();
  const [cikiyor, setCikiyor] = useState(false), [silHata, setSilHata] = useState(false), [cikisHata, setCikisHata] = useState(false);
  /** Çıkışta ve hesap silinince bu cihazdaki ilerleme ve ad temizlenir. */
  const temizle = () => { resetAll(); setAd(""); girisYap(); };
  const Insta = Icon.instagram, Bulb = Icon.bulb, Kilit = Icon.kilit;
  return (
    <Kabuk title="Ayarlar" sag={<UstEylem href="/hakkinda/" label="Hakkında" icon={<Icon.soru />} />}>
      <Bolum title="Hesap">
        {oturum ? (
          <div className="grid gap-3">
            <p className="text-[14px] text-muted-foreground"><b className="text-foreground">{oturum.user.email}</b> ile giriş yaptın.{" "}
              {esitleme === "hata" ? "Şu an buluta kaydedilemedi; ilerlemen bu cihazda duruyor, bağlantı gelince yeniden denenecek." : "İlerlemen hesabına kaydediliyor."}</p>
            <Bildirimler kimlik={oturum.user.id} />
            <Button variant="outline" className="w-full" disabled={cikiyor} onClick={async () => { setCikiyor(true); setCikisHata(!(await cikisYap(temizle))); setCikiyor(false); }}>
              {cikiyor ? "Çıkış yapılıyor..." : "Çıkış yap"}
            </Button>
            {cikisHata && <p role="alert" className="text-[14px] font-medium text-bad">Son ilerlemen buluta kaydedilemedi, bu yüzden çıkış yapılmadı. İnternet bağlantını kontrol edip yeniden dene.</p>}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full text-bad hover:text-bad">Hesabımı sil</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Hesabın silinsin mi?</DialogTitle>
                <DialogDescription>
                  Hesabın, e-posta adresin ve buluttaki bütün ilerlemen kalıcı olarak silinir; bu cihazdaki ilerleme de temizlenir. Bu geri alınamaz.
                </DialogDescription>
                {silHata && <p role="alert" className="text-[14px] font-medium text-bad">Hesap silinemedi. İnternet bağlantını kontrol edip yeniden dene.</p>}
                <div className="mt-2 grid gap-2">
                  <Button className="bg-bad text-white hover:bg-bad/90" disabled={cikiyor} onClick={async () => { setCikiyor(true); setSilHata(!(await hesabiSil(temizle))); setCikiyor(false); }}>
                    {cikiyor ? "Siliniyor..." : "Evet, hesabımı sil"}
                  </Button>
                  <DialogClose asChild><Button variant="ghost">Vazgeç</Button></DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-[14px] text-muted-foreground">Hesabın yok. İlerlemen, puanın ve serin yalnızca bu cihazda tutuluyor.</p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="hesap"><Link href="/giris/">Hesap aç</Link></Button>
              <Button asChild variant="hesapCizgi"><Link href="/giris/?giris">Giriş yap</Link></Button>
            </div>
          </div>
        )}
      </Bolum>
      <Bolum title="Ders">
        <div className="grid gap-2">
          <SesAnahtari />
          <OyunAnahtari />
        </div>
      </Bolum>
      <Bolum title="ucler">
        <Liste>
          <Satir href="/hakkinda/" icon={<Bulb />} title="Hakkında" sub="ucler nedir, nasıl kullanılır" tag={<Ok />} />
          <Satir href="/gizlilik/" icon={<Kilit />} title="Gizlilik" sub="Verilerin nerede tutulur" tag={<Ok />} />
          <Satir external href={INSTAGRAM.url} icon={<Insta />} title="İletişim" sub={`Instagram'da ${INSTAGRAM.ad}`} tag={<Ok />} />
        </Liste>
      </Bolum>
      <Bolum title="İlerleme">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-bad hover:text-bad">İlerlemeyi sıfırla</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>İlerlemen silinsin mi?</DialogTitle>
            <DialogDescription>
              Bitirdiğin konular, puanın, serin, kaydettiğin konular, tekrar sıran ve işaretlediğin kartlar {oturum ? "bu cihazdan ve hesabından" : "bu cihazdan"} silinir. Bu geri alınamaz.
            </DialogDescription>
            <div className="mt-2 grid gap-2">
              <DialogClose asChild>
                <Button
                  className="bg-bad text-white hover:bg-bad/90"
                  onClick={() => {
                    resetAll();
                    // Sıfırlama yeni bir başlangıç: bugünün görevleri hemen yeniden kurulur, giriş puanı yeniden verilir.
                    girisYap();
                  }}
                >
                  Evet, sıfırla
                </Button>
              </DialogClose>
              <DialogClose asChild><Button variant="ghost">Vazgeç</Button></DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Bolum>
    </Kabuk>
  );
}

const BILDIRIMLER: [Bildirim, string, string][] = [
  ["seri_hatirlat", "Seri hatırlatması", "Serin bitmek üzereyken akşam bir e-posta gönderelim."],
  ["yenilik_bildir", "Yeni içerikler", "Yeni ders, konu ya da video eklenince e-posta gönderelim."],
  ["ligde", "Haftalık ligde görün", "Adın ve bu haftaki puanın lider tablosunda görünsün."],
];

/** E-posta bildirimleri ve ligde görünmek. Hesap satırı eşitleme kurulunca okunur. */
function Bildirimler({ kimlik }: { kimlik: string }) {
  const [acik, setAcik] = useState<Record<Bildirim, boolean> | null>(null);
  useEffect(() => {
    let iptal = false;
    // Eşitleme girişten hemen sonra kurulur; ilk okuma boş dönerse kısa bir süre sonra yeniden dene.
    const oku = (n: number) => bildirimOku().then((v) => { if (iptal) return; if (v === null && n) setTimeout(() => oku(n - 1), 1500); else setAcik(v); });
    oku(3);
    return () => { iptal = true; };
  }, [kimlik]);
  if (!acik) return null;
  return (
    <div className="grid divide-y divide-border rounded-xl border border-border">
      {BILDIRIMLER.map(([tur, baslik, metin]) => (
        <label key={tur} className="flex items-center gap-3 p-3.5">
          <span className="min-w-0 flex-1">
            <b className="block text-[15px]">{baslik}</b>
            <span className="text-[13px] text-muted-foreground">{metin}</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            className="size-5 flex-none accent-[var(--ink)]"
            checked={acik[tur]}
            onChange={async (e) => {
              const v = e.target.checked;
              setAcik((a) => a && { ...a, [tur]: v });
              if (!(await bildirimYaz(tur, v))) setAcik((a) => a && { ...a, [tur]: !v });
            }}
          />
        </label>
      ))}
    </div>
  );
}

/** Derslerde doğru/yanlış sesi ve titreşimi. */
function SesAnahtari() {
  const acik = useSesAcik();
  return (
    <button
      role="switch"
      aria-checked={acik}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left"
      onClick={() => { sesAyarla(!acik); if (!acik) ses("dogru"); }}
    >
      <span>
        <b className="block font-semibold leading-snug">Ses ve titreşim</b>
        <span className="block text-[13px] text-muted-foreground">Doğru ve yanlış cevapta kısa bir ses</span>
      </span>
      <i aria-hidden="true" className={`relative h-7 w-[46px] flex-none rounded-full transition-colors ${acik ? "bg-acc" : "bg-secondary"}`}>
        <i className={`absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow transition-transform ${acik ? "translate-x-[18px]" : ""}`} />
      </i>
    </button>
  );
}

/** Puan, seri, lig ve konfeti: isteyen kapatır, yalnızca konular ve testler kalır. */
function OyunAnahtari() {
  const acik = useOyunAcik();
  return (
    <button
      role="switch"
      aria-checked={acik}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left"
      onClick={() => oyunAyarla(!acik)}
    >
      <span>
        <b className="block font-semibold leading-snug">Puan, seri ve kutlamalar</b>
        <span className="block text-[13px] text-muted-foreground">Kapatırsan puan, seri, lig ve konfeti görünmez</span>
      </span>
      <i aria-hidden="true" className={`relative h-7 w-[46px] flex-none rounded-full transition-colors ${acik ? "bg-acc" : "bg-secondary"}`}>
        <i className={`absolute top-[3px] left-[3px] size-[22px] rounded-full bg-white shadow transition-transform ${acik ? "translate-x-[18px]" : ""}`} />
      </i>
    </button>
  );
}
