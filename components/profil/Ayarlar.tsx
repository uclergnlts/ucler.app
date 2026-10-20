"use client";
import { girisYap } from "@/lib/puan";
import { resetAll } from "@/lib/store";
import { Icon } from "../icons";
import { Bolum, INSTAGRAM, Liste, Ok, Satir } from "../temel";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import Kabuk from "./Kabuk";

export default function Ayarlar() {
  const Insta = Icon.instagram, Bulb = Icon.bulb, Kilit = Icon.kilit;
  return (
    <Kabuk title="Ayarlar">
      <Bolum title="Hesap">
        <p className="text-[14px] text-muted-foreground">Hesap yakında. Şimdilik ilerlemen, puanın ve serin yalnızca bu cihazda tutulur.</p>
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
              Bitirdiğin konular, puanın, serin, kaydettiğin konular, tekrar sıran ve işaretlediğin kartlar bu cihazdan silinir. Bu geri alınamaz.
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
