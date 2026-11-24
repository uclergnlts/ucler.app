"use client";
import { cev, DIL, dilDegistir, type Dil } from "@/lib/dil";
import Link from "next/link";
import { useEffect, useState } from "react";
import { bildirimOku, bildirimYaz, cikisYap, hesabiSil, useEsitleme, useOturum, type Bildirim } from "@/lib/bulut";
import { girisYap } from "@/lib/puan";
import { resetAll, setAd } from "@/lib/store";
import { animSes, animSesAyarla, ses, sesAyarla, useAnimSesAcik, useSesAcik } from "@/lib/ses";
import { oyunAyarla, useOyunAcik } from "@/lib/oyun";
import { temaAyarla, useTema, type Tema } from "@/lib/tema";
import { ABONELIK } from "@/lib/abonelik";
import { bildirimGonder } from "@/lib/bildirim";
import { olay } from "@/lib/olay";
import { magazaAdresi, PLAY_URL, uygulamayiPaylas } from "@/lib/yerel";
import { Icon } from "../icons";
import { Bolum, INSTAGRAM, Liste, Ok, Satir, UstEylem } from "../temel";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "../ui/sheet";
import Kabuk from "./Kabuk";

export default function Ayarlar() {
  const oturum = useOturum();
  const esitleme = useEsitleme();
  const [cikiyor, setCikiyor] = useState(false), [silHata, setSilHata] = useState(false), [cikisHata, setCikisHata] = useState(false);
  /** Çıkışta ve hesap silinince bu cihazdaki ilerleme ve ad temizlenir. */
  const temizle = () => { resetAll(); setAd(""); girisYap(); };
  const Insta = Icon.instagram, Bulb = Icon.bulb, Kilit = Icon.kilit, Paylas = Icon.paylas, Yildiz = Icon.yildiz, Soru = Icon.soru;
  // Mağaza sayfası yalnızca uygulamada bilinir; sayfa önce sitedeki gibi çizilir, satır sonra eklenir.
  const [magaza, setMagaza] = useState<string | null>(null), [kopya, setKopya] = useState(false), [gorus, setGorus] = useState(false);
  useEffect(() => setMagaza(magazaAdresi()), []);
  return (
    <Kabuk title={cev("Ayarlar")} sag={<UstEylem href="/hakkinda/" label={cev("Hakkında")} icon={<Icon.soru />} />}>
      <Bolum title={cev("Hesap")}>
        {oturum ? (
          <div className="grid gap-3">
            <p className="text-[14px] text-muted-foreground"><b className="text-foreground">{oturum.user.email}</b> {cev("ile giriş yaptın.")}{" "}
              {esitleme === "hata" ? cev("Şu an buluta kaydedilemedi. İlerlemen bu cihazda duruyor, bağlantı gelince yeniden denenecek.") : cev("İlerlemen hesabına kaydediliyor.")}</p>
            <Bildirimler kimlik={oturum.user.id} />
            <Button variant="outline" className="w-full" disabled={cikiyor} onClick={async () => { setCikiyor(true); setCikisHata(!(await cikisYap(temizle))); setCikiyor(false); }}>
              {cikiyor ? cev("Çıkış yapılıyor...") : cev("Çıkış yap")}
            </Button>
            {cikisHata && <p role="alert" className="text-[14px] font-medium text-bad">{cev("Son ilerlemen buluta kaydedilemedi, bu yüzden çıkış yapılmadı. İnternet bağlantını kontrol edip yeniden dene.")}</p>}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full text-bad hover:text-bad">{cev("Hesabımı sil")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>{cev("Hesabın silinsin mi?")}</DialogTitle>
                <DialogDescription>
                  {cev("Hesabın, e-posta adresin ve buluttaki bütün ilerlemen kalıcı olarak silinir; bu cihazdaki ilerleme de temizlenir. Bu geri alınamaz.")}
                  {ABONELIK && cev(" Hesabını silmek ucler Plus aboneliğini iptal etmez. Aboneliğin varsa App Store ya da Google Play ayarlarından iptal et.")}
                </DialogDescription>
                {silHata && <p role="alert" className="text-[14px] font-medium text-bad">{cev("Hesap silinemedi. İnternet bağlantını kontrol edip yeniden dene.")}</p>}
                <div className="mt-2 grid gap-2">
                  <Button className="bg-bad text-white hover:bg-bad/90" disabled={cikiyor} onClick={async () => { setCikiyor(true); setSilHata(!(await hesabiSil(temizle))); setCikiyor(false); }}>
                    {cikiyor ? cev("Siliniyor...") : cev("Evet, hesabımı sil")}
                  </Button>
                  <DialogClose asChild><Button variant="ghost">{cev("Vazgeç")}</Button></DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid gap-3">
            <p className="text-[14px] text-muted-foreground">{cev("Hesabın yok. İlerlemen, puanın ve serin yalnızca bu cihazda tutuluyor.")}</p>
            <div className="grid grid-cols-2 gap-2">
              <Button asChild variant="hesap"><Link href="/giris/">{cev("Hesap aç")}</Link></Button>
              <Button asChild variant="hesapCizgi"><Link href="/giris/?giris">{cev("Giriş yap")}</Link></Button>
            </div>
          </div>
        )}
      </Bolum>
      <Bolum title={cev("Görünüm")}>
        <TemaSecici />
      </Bolum>
      <DilSecici />
      <Bolum title={cev("Ders")}>
        <div className="grid gap-2">
          <SesAnahtari />
          <OyunAnahtari />
        </div>
      </Bolum>
      <Bolum title="ucler">
        <Liste>
          <Satir href="/hakkinda/" icon={<Bulb />} title={cev("Hakkında")} sub={cev("ucler nedir, nasıl kullanılır")} tag={<Ok />} />
          <Satir href="/gizlilik/" icon={<Kilit />} title={cev("Gizlilik")} sub={cev("Verilerin nerede tutulur")} tag={<Ok />} />
          <Satir href="/kosullar/" icon={<Icon.kitap />} title={cev("Kullanım koşulları")} sub={cev("ucler'i ve Plus'ı kullanma koşulları")} tag={<Ok />} />
          <Satir external href={INSTAGRAM.url} icon={<Insta />} title={cev("İletişim")} sub={cev("Instagram'da {0}", INSTAGRAM.ad)} tag={<Ok />} />
        </Liste>
      </Bolum>
      <Bolum title={cev("Destek ol")}>
        <Liste>
          <Satir
            icon={<Paylas />}
            title={cev("Arkadaşına öner")}
            sub={kopya ? cev("Bağlantı kopyalandı") : cev("ucler'i arkadaşına gönder")}
            tag={<Ok />}
            onClick={async () => setKopya((await uygulamayiPaylas()) === "kopyalandi")}
          />
          {magaza && (
            <Satir external href={magaza} icon={<Yildiz />} title={cev("Uygulamayı puanla")} sub={magaza.startsWith(PLAY_URL) ? cev("Google Play'de puan ver, yorum yaz") : cev("App Store'da puan ver, yorum yaz")} tag={<Ok />} />
          )}
          <Satir icon={<Soru />} title={cev("Görüşünü yaz")} sub={cev("Eksik ya da istediğin şeyi bize ilet")} tag={<Ok />} onClick={() => setGorus(true)} />
        </Liste>
        <Gorus acik={gorus} ayarla={setGorus} />
      </Bolum>
      <Bolum title={cev("İlerleme")}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full text-bad hover:text-bad">{cev("İlerlemeyi sıfırla")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{cev("İlerlemen silinsin mi?")}</DialogTitle>
            <DialogDescription>
              {cev("Bitirdiğin konular, puanın, serin, kaydettiğin konular, tekrar sıran ve işaretlediğin kartlar")} {oturum ? cev("bu cihazdan ve hesabından") : cev("bu cihazdan")} {cev("silinir. Bu geri alınamaz.")}
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
                  {cev("Evet, sıfırla")}
                </Button>
              </DialogClose>
              <DialogClose asChild><Button variant="ghost">{cev("Vazgeç")}</Button></DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </Bolum>
    </Kabuk>
  );
}

/** "Görüşünü yaz" penceresi. Öğrenci bildirimi tablosuna düşer (ders "gorus"), günlük özet e-postasında görünür. */
function Gorus({ acik, ayarla }: { acik: boolean; ayarla: (a: boolean) => void }) {
  const [not, setNot] = useState("");
  const [durum, setDurum] = useState<"bos" | "gidiyor" | "tamam" | "hata">("bos");
  useEffect(() => { if (acik) { setNot(""); setDurum("bos"); } }, [acik]);
  async function gonder() {
    setDurum("gidiyor");
    try {
      await bildirimGonder("hata", { ders: "gorus", yer: cev("Ayarlar > Görüşünü yaz") }, not);
      olay("gorus");
      setDurum("tamam");
    } catch { setDurum("hata"); }
  }
  return (
    <Sheet open={acik} onOpenChange={ayarla}>
      <SheetContent aria-describedby={undefined}>
        {durum === "tamam" ? (
          <>
            <SheetTitle>{cev("Teşekkürler!")}</SheetTitle>
            <p className="mb-1.5 text-base leading-relaxed text-muted-foreground">{cev("Görüşün ekibimize ulaştı. Hepsini okuyoruz.")}</p>
            <SheetClose asChild><Button variant="outline">{cev("Kapat")}</Button></SheetClose>
          </>
        ) : (
          <>
            <SheetTitle>{cev("Görüşünü yaz")}</SheetTitle>
            <textarea
              value={not}
              onChange={(e) => setNot(e.target.value)}
              maxLength={600}
              rows={4}
              placeholder={cev("Neyi beğendin, neyi eksik buldun, ne olsun isterdin?")}
              aria-label={cev("Görüşün")}
              className="w-full resize-none rounded-xl border border-border-strong bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
            />
            {durum === "hata" && <p role="alert" className="text-[14px] text-bad">{cev("Gönderilemedi. Bağlantını kontrol edip yeniden dene.")}</p>}
            <Button className="mt-1" disabled={not.trim().length < 3 || durum === "gidiyor"} onClick={gonder}>
              {durum === "gidiyor" ? cev("Gönderiliyor…") : cev("Gönder")}
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

const BILDIRIMLER: [Bildirim, string, string][] = [
  ["seri_hatirlat", cev("Seri hatırlatması"), cev("Serin bitmek üzereyken akşam bir e-posta gönderelim.")],
  ["yenilik_bildir", cev("Yeni içerikler"), cev("Yeni ders, konu ya da video eklenince e-posta gönderelim.")],
  ["ligde", cev("Haftalık ligde görün"), cev("Adın ve bu haftaki puanın lider tablosunda görünsün.")],
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

/** Ayarlar'daki aç/kapa satırı. */
function Anahtar({ acik, ayarla, baslik, metin }: { acik: boolean; ayarla: (v: boolean) => void; baslik: string; metin: string }) {
  return (
    <button
      role="switch"
      aria-checked={acik}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left"
      onClick={() => ayarla(!acik)}
    >
      <span>
        <b className="block font-semibold leading-snug">{baslik}</b>
        <span className="block text-[13px] text-muted-foreground">{metin}</span>
      </span>
      <i aria-hidden="true" className={`relative h-7 w-[46px] flex-none rounded-full transition-colors ${acik ? "bg-primary" : "bg-border-strong"}`}>
        <i className={`absolute top-[3px] left-[3px] size-[22px] rounded-full bg-card shadow transition-transform ${acik ? "translate-x-[18px]" : ""}`} />
      </i>
    </button>
  );
}

/** Ses ve titreşim; açıksa altında animasyon sesleri ayrıca kapatılabilir. */
function SesAnahtari() {
  const acik = useSesAcik(), anim = useAnimSesAcik();
  return (
    <>
      <Anahtar acik={acik} baslik={cev("Ses ve titreşim")} metin={cev("Doğru ve yanlış cevapta, aşama ve konu bitince kısa bir ses")}
        ayarla={(v) => { sesAyarla(v); if (v) ses("dogru"); }} />
      {acik && (
        <Anahtar acik={anim} baslik={cev("Animasyon sesleri")} metin={cev("Görseller çizilirken, madalya, konfeti ve puan gelirken hafif sesler")}
          ayarla={(v) => { animSesAyarla(v); if (v) animSes("madalya"); }} />
      )}
    </>
  );
}

/** Puan, seri, lig ve konfeti: isteyen kapatır, yalnızca konular ve testler kalır. */
function OyunAnahtari() {
  const acik = useOyunAcik();
  return <Anahtar acik={acik} ayarla={oyunAyarla} baslik={cev("Puan, seri ve kutlamalar")} metin={cev("Kapatırsan puan, seri, lig ve konfeti görünmez")} />;
}

/** Uygulama dili: Türkçe ya da İngilizce (lib/dil.ts). */
const DILLER: [Dil, string][] = [["tr", "Türkçe"], ["en", "English"]];
function DilSecici() {
  return (
    <Bolum title={cev("Dil")}>
      <div role="radiogroup" aria-label={cev("Dil")} className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1">
        {DILLER.map(([k, ad]) => (
          <button
            key={k}
            role="radio"
            aria-checked={DIL === k}
            onClick={() => dilDegistir(k)}
            className={`h-10 rounded-lg text-[14px] font-semibold transition-colors ${DIL === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
          >
            {ad}
          </button>
        ))}
      </div>
    </Bolum>
  );
}

const TEMALAR: [Tema, string][] = [["sistem", cev("Telefona göre")], ["acik", cev("Açık")], ["koyu", cev("Koyu")]];

/** Açık "deney defteri", koyu "karanlık oda" ya da telefonun ayarı. */
function TemaSecici() {
  const t = useTema();
  return (
    <div role="radiogroup" aria-label={cev("Görünüm")} className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-card p-1">
      {TEMALAR.map(([k, ad]) => (
        <button
          key={k}
          role="radio"
          aria-checked={t === k}
          onClick={() => temaAyarla(k)}
          className={`h-10 rounded-lg text-[14px] font-semibold transition-colors ${t === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          {ad}
        </button>
      ))}
    </div>
  );
}
