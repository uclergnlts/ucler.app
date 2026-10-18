"use client";
import { DERSLER, DERS_IDS, type DersId, type Entry, isDers } from "@/lib/dersler";
import { doneKeys, resetAll, setAd, useAd, useProg, useSaved, useStorageOk } from "@/lib/store";
import { Icon } from "./icons";
import { Bolum, Bos, Govde, InstaLink, Liste, PageHead, Row, Top } from "./temel";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

export default function Profile({ all }: { all: Record<DersId, Entry[]> }) {
  const prog = useProg(), saved = useSaved(), storageOk = useStorageOk(), ad = useAd();
  const done = doneKeys(prog).filter((k) => /\//.test(prog[k]));
  let right = 0, total = 0;
  for (const k of done) {
    const m = String(prog[k]).match(/(\d+)\/(\d+)/);
    if (m) { right += +m[1]; total += +m[2]; }
  }
  const User = Icon.profil;
  const savedList = saved.flatMap((k) => {
    const [d, id] = k.split(".");
    const e = isDers(d) ? all[d].find((x) => x.id === id) : undefined;
    return e ? [e] : [];
  });

  return (
    <div className="app">
      <Top />
      <Govde>
        <PageHead title="Profil" />
        <section className="flex items-center gap-3.5">
          <span className="grid size-14 flex-none place-items-center rounded-full bg-secondary text-muted-foreground [&_svg]:size-7"><User /></span>
          <span className="min-w-0 flex-1">
            <input
              className="block w-full border-0 border-b border-dashed border-border-strong bg-transparent py-0.5 font-display text-xl font-extrabold text-foreground outline-none placeholder:font-bold placeholder:text-muted-foreground focus:border-solid focus:border-foreground"
              defaultValue={ad}
              key={ad}
              placeholder="Adın"
              aria-label="Adın"
              maxLength={30}
              onBlur={(e) => setAd(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }}
            />
            <span className="text-sm text-muted-foreground">
              {storageOk
                ? "İlerlemen şimdilik yalnızca bu cihazda saklanıyor."
                : "Tarayıcın kayıt tutmaya izin vermiyor. İlerlemen ve kaydettiklerin sayfayı yenilersen ya da sekmeyi kapatırsan silinir."}
            </span>
          </span>
        </section>
        <Card className="grid grid-cols-3 divide-x divide-border">
          {([[done.length, "konu bitti"], [total ? `${Math.round((100 * right) / total)}%` : "–", "doğru cevap"], [saved.length, "kayıtlı"]] as const).map(([b, l]) => (
            <div key={l} className="px-2 py-3.5 text-center">
              <b className="block font-display text-2xl leading-tight font-extrabold">{b}</b>
              <span className="text-xs font-semibold text-muted-foreground">{l}</span>
            </div>
          ))}
        </Card>
        <Bolum title="Kaydedilenler" id="kaydedilenler">
          {savedList.length ? (
            <Liste>
              {savedList.map((e) => <Row key={`${e.ders}.${e.id}`} e={e} done={!!prog[`${e.ders}.${e.id}`]} />)}
            </Liste>
          ) : (
            <Bos>Henüz kaydettiğin bir konu yok. Ders ekranındaki ya da videodaki işaret simgesine dokunarak konuyu buraya ekleyebilirsin.</Bos>
          )}
        </Bolum>
        <Bolum title="Derslerdeki ilerleme">
          <Card className="grid gap-3.5 px-4 py-3.5">
            {DERS_IDS.map((d) => {
              const r = all[d].filter((e) => e.id), n = r.filter((e) => prog[`${d}.${e.id}`]).length;
              return (
                <div key={d} className="grid gap-1.5" data-ders={d}>
                  <div className="flex justify-between text-[15px] font-semibold">
                    {DERSLER[d].ad}<span className="text-[13px] font-medium text-muted-foreground">{n} / {r.length} hazır konu</span>
                  </div>
                  <Progress value={r.length ? (100 * n) / r.length : 0} />
                </div>
              );
            })}
          </Card>
        </Bolum>
        <Bolum title="Bizi takip et">
          <InstaLink />
        </Bolum>
        <Bolum title="Hesap">
          <Button variant="outline" disabled>Hesap oluştur · yakında</Button>
          <Button
            variant="outline"
            onClick={() => { if (confirm("Tüm ilerlemen ve kaydettiğin konular silinsin mi?")) resetAll(); }}
          >
            İlerlemeyi sıfırla
          </Button>
        </Bolum>
      </Govde>
    </div>
  );
}
