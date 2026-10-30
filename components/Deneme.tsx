"use client";
// Deneme sınavları sekmesi. Sınavlar henüz yok; şimdilik "yakında" der (Üçler, 2026-10-30).
import { Icon } from "./icons";
import { Govde, Simge, UstBar } from "./temel";

export default function Deneme() {
  const D = Icon.deneme;
  return (
    <div className="app">
      <UstBar baslik="Deneme sınavları" />
      <Govde>
        <section className="grid justify-items-center gap-3 pt-10 text-center">
          <Simge renk="#e08a00" className="size-16 rounded-2xl [&_svg]:size-8"><D /></Simge>
          <h2 className="text-[22px]">Yakında</h2>
          <p className="max-w-[340px] text-[15px] text-muted-foreground">
            Bütün derslerden karışık, süreli deneme sınavları hazırlıyoruz. Hazır olunca burada açılacak.
          </p>
        </section>
      </Govde>
    </div>
  );
}
