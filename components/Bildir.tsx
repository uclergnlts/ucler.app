"use client";
// "Anlamadım / Hata var" penceresi: öğrenci sorunu yaşadığı yerde (kart, adım, test sorusu, video) ekibe bildirir.
// Not isteğe bağlıdır. "Anlamadım" seçilince kart ayrıca Profil > Anlamadıklarım listesine eklenir (anlamadim verilirse).
// Açan düğme her ekranda aynıdır: üst çubuğun sağında küçük "Hata bildir" yazısı (BildirDugme; Üçler 2026-10-31).
import { cev } from "@/lib/dil";
import { useState } from "react";
import { bildirimGonder, type BildirimTur, type BildirimYer } from "@/lib/bildirim";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";

const SECENEK: { tur: BildirimTur; ad: string; ipucu: string }[] = [
  { tur: "anlamadim", ad: cev("Anlamadım"), ipucu: cev("Neresi kafanı karıştırdı? (isteğe bağlı)") },
  { tur: "hata", ad: cev("Hata var"), ipucu: cev("Hatayı kısaca yaz (isteğe bağlı)") },
];

export default function Bildir({ yer, anlamadim, children }: { yer: BildirimYer; anlamadim?: () => void; children: React.ReactNode }) {
  const [acik, setAcik] = useState(false);
  const [tur, setTur] = useState<BildirimTur | null>(null);
  const [not, setNot] = useState("");
  const [durum, setDurum] = useState<"bos" | "gidiyor" | "tamam" | "hata">("bos");

  function ac(a: boolean) {
    setAcik(a);
    if (a) { setTur(null); setNot(""); setDurum("bos"); }
  }

  async function gonder() {
    if (!tur) return;
    if (tur === "anlamadim") anlamadim?.();
    setDurum("gidiyor");
    try { await bildirimGonder(tur, yer, not); setDurum("tamam"); } catch { setDurum("hata"); }
  }

  return (
    <Sheet open={acik} onOpenChange={ac}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent data-ders={yer.ders} aria-describedby={undefined}>
        {durum === "tamam" ? (
          <>
            <SheetTitle>{cev("Teşekkürler!")}</SheetTitle>
            <p className="mb-1.5 text-base leading-relaxed text-muted-foreground">
              {cev("Bildirimin ekibimize ulaştı. İnceleyip düzelteceğiz.")}
              {tur === "anlamadim" && anlamadim ? cev(" Bu kartı Profil > Anlamadıklarım'da da bulabilirsin.") : ""}
            </p>
            <SheetClose asChild><Button variant="outline">{cev("Kapat")}</Button></SheetClose>
          </>
        ) : (
          <>
            <SheetTitle>{cev("Bir sorun mu var?")}</SheetTitle>
            <div className="mt-1 grid grid-cols-2 gap-2" role="radiogroup" aria-label={cev("Bildirim türü")}>
              {SECENEK.map((s) => (
                <button
                  key={s.tur}
                  type="button"
                  role="radio"
                  aria-checked={tur === s.tur}
                  onClick={() => setTur(s.tur)}
                  className={cn(
                    "h-12 rounded-xl border text-base font-semibold transition-colors",
                    tur === s.tur ? "border-acc bg-acc-soft text-acc" : "border-border-strong bg-card text-foreground hover:bg-secondary",
                  )}
                >
                  {s.ad}
                </button>
              ))}
            </div>
            {tur && (
              <textarea
                value={not}
                onChange={(e) => setNot(e.target.value)}
                maxLength={600}
                rows={3}
                placeholder={SECENEK.find((s) => s.tur === tur)!.ipucu}
                aria-label={cev("Açıklama")}
                className="w-full resize-none rounded-xl border border-border-strong bg-card px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground"
              />
            )}
            {durum === "hata" && <p className="text-[14px] text-bad">{cev("Gönderilemedi. Bağlantını kontrol edip yeniden dene.")}</p>}
            <Button className="mt-1" disabled={!tur || durum === "gidiyor"} onClick={gonder}>
              {durum === "gidiyor" ? cev("Gönderiliyor…") : cev("Gönder")}
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** Üst çubuğun sağındaki küçük "Hata bildir" yazısı. Bildir'in içine konur (SheetTrigger asChild). */
export function BildirDugme({ className, ...p }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn("h-8 flex-none rounded-full px-2.5 text-[13px] font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground", className)}
      {...p}
    >
      {cev("Hata bildir")}
    </button>
  );
}
