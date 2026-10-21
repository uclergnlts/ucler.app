"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cikisYap, hatirlatmaOku, hatirlatmaYaz, hesabiSil, useOturum } from "@/lib/bulut";
import { girisYap } from "@/lib/puan";
import { resetAll, setAd } from "@/lib/store";
import { Icon } from "../icons";
import { Bolum, INSTAGRAM, Liste, Ok, Satir } from "../temel";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import Kabuk from "./Kabuk";

export default function Ayarlar() {
  const oturum = useOturum();
  const [cikiyor, setCikiyor] = useState(false), [silHata, setSilHata] = useState(false);
  /** Çıkışta ve hesap silinince bu cihazdaki ilerleme ve ad temizlenir. */
  const temizle = () => { resetAll(); setAd(""); girisYap(); };
  const Insta = Icon.instagram, Bulb = Icon.bulb, Kilit = Icon.kilit;
  return (
    <Kabuk title="Ayarlar">
      <Bolum title="Hesap">
        {oturum ? (
          <div className="grid gap-3">
            <p className="text-[14px] text-muted-foreground"><b className="text-foreground">{oturum.user.email}</b> ile giriş yaptın. İlerlemen hesabına kaydediliyor.</p>
            <Hatirlatma kimlik={oturum.user.id} />
            <Button variant="outline" className="w-full" disabled={cikiyor} onClick={async () => { setCikiyor(true); await cikisYap(temizle); setCikiyor(false); }}>
              {cikiyor ? "Çıkış yapılıyor..." : "Çıkış yap"}
            </Button>
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
              <Button asChild><Link href="/giris/">Hesap aç</Link></Button>
              <Button asChild variant="outline"><Link href="/giris/?giris">Giriş yap</Link></Button>
            </div>
          </div>
        )}
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

/** Seri bitmek üzereyken akşam 19:00'da gelen e-posta. Hesap satırı eşitleme kurulunca okunur. */
function Hatirlatma({ kimlik }: { kimlik: string }) {
  const [acik, setAcik] = useState<boolean | null>(null);
  useEffect(() => {
    let iptal = false;
    // Eşitleme girişten hemen sonra kurulur; ilk okuma boş dönerse kısa bir süre sonra yeniden dene.
    const oku = (n: number) => hatirlatmaOku().then((v) => { if (iptal) return; if (v === null && n) setTimeout(() => oku(n - 1), 1500); else setAcik(v); });
    oku(3);
    return () => { iptal = true; };
  }, [kimlik]);
  if (acik === null) return null;
  return (
    <label className="flex items-center gap-3 rounded-xl border border-border p-3.5">
      <span className="min-w-0 flex-1">
        <b className="block text-[15px]">Seri hatırlatması</b>
        <span className="text-[13px] text-muted-foreground">Serin bitmek üzereyken akşam bir e-posta gönderelim.</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        className="size-5 flex-none accent-[var(--ink)]"
        checked={acik}
        onChange={async (e) => { const v = e.target.checked; setAcik(v); if (!(await hatirlatmaYaz(v))) setAcik(!v); }}
      />
    </label>
  );
}
